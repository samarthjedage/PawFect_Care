using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawFect_Care.Models;
using System.Security.Cryptography;
using BCrypt;

namespace PawFect_Care.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly PawfectCareContext _context;
        private readonly IConfiguration _configuration;

        public CustomersController(PawfectCareContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        //  Register a new customer
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerDto customerdto)
        {
            if (customerdto == null)
            {
                return BadRequest(new { message = "Invalid data received." });
            }

            try
            {
                var customer = customerdto.ToCustomer();
                customer.Password = HashPassword(customerdto.Password);

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Customer registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed.", error = ex.Message });
            }
        }

        //  Fetch a specific customer by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return NotFound(new { message = "Customer not found." });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving customer.", error = ex.Message });
            }
        }

        //  Fetch all customers
        [HttpGet("all")]
        public IActionResult GetAllCustomers()
        {
            try
            {
                var customers = _context.Customers.ToList();

                if (customers == null || customers.Count == 0)
                {
                    return NotFound(new { message = "No customers found." });
                }

                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching customers.", error = ex.Message });
            }
        }

        // Update customer profile
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] CustomerDto updatecustomerDto)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return NotFound(new { message = "Customer not found." });
                }

                customer.Name = updatecustomerDto.Name;
                customer.Email = updatecustomerDto.Email;
                customer.Phone = updatecustomerDto.Phone;

                if (!string.IsNullOrWhiteSpace(updatecustomerDto.Password))
                {
                    customer.Password = HashPassword(updatecustomerDto.Password);
                }

                _context.Entry(customer).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Customer updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating customer.", error = ex.Message });
            }
        }

        //Hash password using BCrypt
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
