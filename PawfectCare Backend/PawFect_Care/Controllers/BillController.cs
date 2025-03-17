using iTextSharp.text.pdf;
using iTextSharp.text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawFect_Care.Models;
using System;
using System.Net.Mail;
using System.Net;

namespace PawFect_Care.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly PawfectCareContext _context;
        private readonly IConfiguration _configuration;

        public BillController(PawfectCareContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private byte[] GenerateReceipt(Appointment appointment)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                Document document = new Document();
                PdfWriter.GetInstance(document, memoryStream);
                document.Open();

                Font titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
                Paragraph title = new Paragraph("PawFect Care - Appointment Receipt", titleFont);
                title.Alignment = Element.ALIGN_CENTER;
                document.Add(title);
                document.Add(new Paragraph("\n"));

                document.Add(new Paragraph($"Receipt ID: {appointment.AppointmentId}"));
                document.Add(new Paragraph($"Customer Name: {appointment.Customer?.Name}"));
                document.Add(new Paragraph($"Email: {appointment.Customer?.Email}"));
                document.Add(new Paragraph($"Appointment Date: {appointment.AppointmentDate:yyyy-MM-dd}"));
                document.Add(new Paragraph($"Appointment Time: {appointment.AppointmentTime}"));
                document.Add(new Paragraph($"Service: {appointment.Service?.Name}"));
                document.Add(new Paragraph($"Total Amount: ${appointment.Service?.Price}"));

                document.Close();
                return memoryStream.ToArray();
            }
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
        [HttpPost("processpayment")]
        public async Task<IActionResult> ProcessPayment([FromBody] BillDto paymentDto)
        {
            if (paymentDto == null)
            {
                return BadRequest("Invalid payment data.");
            }

            var appointment = await _context.Appointments
                .Include(a => a.Service) // Ensure service details are fetched
                .Include(a => a.Customer) // Ensure customer details are fetched
                .FirstOrDefaultAsync(a => a.AppointmentId == paymentDto.AppointmentId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            if (appointment.Customer == null || string.IsNullOrEmpty(appointment.Customer.Email))
            {
                return BadRequest("Customer email is missing. Cannot send receipt.");
            }

            //  Validate Payment Amount
            if (appointment.Service.Price != paymentDto.BillAmount)
            {
                return BadRequest("Invalid payment amount. Please verify the service price.");
            }

            //  Mask Card Details (Only store last 4 digits)
            string maskedCardNo = paymentDto?.Cardno?.Length >= 4
                ? "**** **** **** " + paymentDto?.Cardno[^4..]
                : "Invalid Card";

            try
            {
                // Simulate payment processing (Use real payment gateway here)
                var bill = new Bill
                {
                    AppointmentId = paymentDto.AppointmentId,
                    BillAmount = paymentDto.BillAmount,
                    Cardno = maskedCardNo, // Store only last 4 digits
                    Status = "completed",
                    PaymentDate = DateTime.Now
                };

                _context.Bills.Add(bill);
                await _context.SaveChangesAsync();

                byte[] receiptPdf = GenerateReceipt(appointment);
                string subject = "Payment Confirmation & Receipt";
                string body = $"Dear {appointment.Customer?.Name},\n\nYour payment was successful. Please find your receipt attached.";

                await SendEmailWithAttachment(appointment.Customer.Email, subject, body, receiptPdf, "Receipt.pdf");

                return Ok(new { message = "Payment successful", paymentId = bill.BillId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] Payment processing failed: {ex.Message}");
                return StatusCode(500, $"Payment processing failed: {ex.Message}");
            }
        }
    }
}
