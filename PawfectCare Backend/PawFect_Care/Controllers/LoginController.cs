using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PawFect_Care.Models;
using BCrypt.Net;

namespace PawFect_Care.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly PawfectCareContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(PawfectCareContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

       
        [HttpPost]
        public IActionResult Login([FromBody] Login login)
        {
            // Retrieve user by email
            var user = _context.Customers.FirstOrDefault(u => u.Email == login.Email);

            // Check if user exists
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password!" });
            }

            // Verify the password using BCrypt
            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid username or password!" });
            }

            // Generate JWT token and refresh token
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            return Ok(new
            {
                message = user.Role == "admin" ? "Welcome admin" : "Welcome Customer",
                refreshToken = refreshToken,
                token = token,
                user = new
                {
                    id = user.CustomerId,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        
        private string GenerateJwtToken(Customer user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("CustomerId", user.CustomerId.ToString()),
                new Claim("FullName", user.Name)
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );
            Console.WriteLine(token);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
