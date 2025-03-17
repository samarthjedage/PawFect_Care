using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PawFect_Care.Models;

namespace PawFect_Care.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {

        private readonly PawfectCareContext _context;
        public ServicesController(PawfectCareContext context)
        {
            _context = context;
        }

        //Get : api /service/5

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }
            return service;
        }

        [HttpPost]
        public async Task<ActionResult<Service>> PostService(ServiceDto serviceDto)
        {


            var service = new Service
            {
                Name = serviceDto.Name,
                Description = serviceDto.Description,
                Price = serviceDto.Price,
                UpdatedAt = DateTime.Now
            };
            
            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetService", new { id = serviceDto.ServiceId }, serviceDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, [FromBody] ServiceDto serviceDto)
        {
           

            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            // Update only necessary fields (avoids modifying relationships)
            service.Name = serviceDto.Name;
            service.Description = serviceDto.Description;
            service.Price = serviceDto.Price;
            service.UpdatedAt = serviceDto.UpdatedAt;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }


        private bool ServiceExists(int id) { 

            return _context.Services.Any(e => e.ServiceId == id);  
        }
        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}