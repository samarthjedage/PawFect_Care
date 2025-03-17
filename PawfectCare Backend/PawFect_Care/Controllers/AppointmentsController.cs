using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawFect_Care.Models;
using iTextSharp.text.pdf;
using iTextSharp.text;

namespace PawfectCate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly PawfectCareContext _context;

        public AppointmentController(PawfectCareContext context)
        {
            _context = context;
        }
        private async Task SendEmailWithAttachment(string toEmail, string subject, string body, byte[] attachmentData, string attachmentName)
        {
            using (var client = new SmtpClient("smtp.gmail.com", 587))
            {
                client.Credentials = new NetworkCredential("jedagesamarth@gmail.com", "syhm cflq gzgn dlan");
                client.EnableSsl = true;

                var message = new MailMessage("jedagesamarth@gmail.com", toEmail, subject, body)
                {
                    IsBodyHtml = false
                };

                using (MemoryStream ms = new MemoryStream(attachmentData))
                {
                    message.Attachments.Add(new Attachment(ms, attachmentName, "application/pdf"));
                    await client.SendMailAsync(message);
                }
            }
        }
       

        private byte[] GenerateCancellationReceipt(Appointment appointment)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                Document document = new Document();
                PdfWriter.GetInstance(document, memoryStream);
                document.Open();

                Font titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
                Paragraph title = new Paragraph("PawFect Care - Appointment Cancellation Receipt", titleFont);
                title.Alignment = Element.ALIGN_CENTER;
                document.Add(title);
                document.Add(new Paragraph("\n"));

                document.Add(new Paragraph($"Receipt ID: {appointment.AppointmentId}"));
                document.Add(new Paragraph($"Customer Name: {appointment.Customer?.Name}"));
                document.Add(new Paragraph($"Email: {appointment.Customer?.Email}"));
                document.Add(new Paragraph($"Canceled Appointment Date: {appointment.AppointmentDate:yyyy-MM-dd}"));
                document.Add(new Paragraph($"Canceled Appointment Time: {appointment.AppointmentTime}"));
                document.Add(new Paragraph($"Service: {appointment.Service?.Name}"));
                document.Add(new Paragraph("Status: Canceled"));

                document.Close();
                return memoryStream.ToArray();
            }
        }

        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (appointmentDto == null)
            {
                return BadRequest("Invalid appointment data.");
            }

            var customer = await _context.Customers.FindAsync(appointmentDto.CustomerId);
            if (customer == null)
            {
                return BadRequest("Customer not found.");
            }

            var service = await _context.Services.FindAsync(appointmentDto.ServiceId);
            if (service == null)
            {
                return BadRequest("Service not found.");
            }

            var appointment = new Appointment
            {
                CustomerId = appointmentDto.CustomerId,
                PetId = appointmentDto.PetId,
                AppointmentDate = appointmentDto.AppointmentDate,
                AppointmentTime = appointmentDto.AppointmentTime,
                ServiceId = appointmentDto.ServiceId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { appointmentId = appointment.AppointmentId });
        }



        [HttpGet("Viewslots")]
   public IActionResult CheckSlots([FromQuery] DateOnly appointmentDate, [FromQuery] string appointmentTime)
        {
            // Count the number of appointments for the given date and time
            int appointmentCount = _context.Appointments
                .Where(a => a.AppointmentDate.Equals(appointmentDate) && a.AppointmentTime.Equals( appointmentTime))
                .Count();

            int availableSlots = 3 - appointmentCount;

            if (availableSlots > 0)
            {
                return Ok(new { message = "Slots available", availableSlots = availableSlots });
            }
            else
            {
                return Ok(new { message = "No slots available" });
            }
        }

        [HttpGet("upcoming")]

        public async Task<IActionResult> GetUpcomingAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Pet)
                .Include(a => a.Service)
                .Select(static a => new
                {
                    a.AppointmentId,
                    Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    Time = a.AppointmentTime,
                    CustomerName = a.Customer.Name,
                    PetName = a.Pet.Name,
                    ServiceName = a.Service.Name,


                })
                .ToListAsync();
            return Ok(appointments);


        }
        [HttpGet("Customer/{customerId}")]
        public async Task<IActionResult> GetAppointmentByCustomerId(int customerId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.CustomerId == customerId)
                .Include(a => a.Customer)
                .Include(a => a.Pet)
                .Include(a => a.Service)
                 .Select(a => new
                 {


                     a.AppointmentId,
                     Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                     Time = a.AppointmentTime,
                     CustomerName = a.Customer.Name,
                     PetName = a.Pet.Name,
                     ServiceName = a.Service.Name



                 })
                   .ToListAsync();


                 if (appointments == null || !appointments.Any())
            {
                return Ok("Customer Has No Appointments Yet");
            }
            
                return Ok(appointments);
            
                
        }
        [HttpDelete("Delete/{appointmentId}")]

        public async Task<IActionResult> DeleteAppointmentById(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Customer)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            if (appointment == null)
            {
                return NotFound("Appointment not found");
            }

            var customerEmail = appointment.Customer?.Email;
            var customerName = appointment.Customer?.Name;

            string subject = "Appointment Canceled";
            string body = $"Dear {customerName}, your appointment on {appointment.AppointmentDate:yyyy-MM-dd} at {appointment.AppointmentTime} has been canceled.";

            byte[] cancellationPdf = GenerateCancellationReceipt(appointment);

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(customerEmail))
            {
                try
                {
                    await SendEmailWithAttachment(customerEmail, subject, body, cancellationPdf, "CancellationReceipt.pdf");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Error sending email: {ex.Message}");
                }
            }

            return Ok("Appointment deleted successfully");
        }

    }
}