using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawFect_Care.Models;

namespace PawFect_Care.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly PawfectCareContext _context;

        public PetsController(PawfectCareContext context)
        {
            _context = context;
        }

        [HttpPost("Create pet")]
        public async Task<IActionResult> CreatePet([FromBody] PetsDto petdto)
        {

            if (petdto == null)
            {
                return BadRequest(new { Message = "Data Not Found" });
            }

            var pet = new Pet
            {
                CustomerId = petdto.CustomerId,
                Name = petdto.Name,
                Breed = petdto.Breed,
                Age = petdto.Age,
                CreatedAt = DateTime.UtcNow
            };
            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();
            return Ok(petdto);



        }


        [HttpGet("pets/{customerid}")]

        public async Task<IActionResult> GetPetbyCustomerId(int customerid)
        {


            var pets = await _context.Pets
                .Where(p => p.CustomerId == customerid)
                .Select(u => new PetsDto
                {
                    PetId = u.PetId,
                    Name = u.Name,
                    Breed = u.Breed,
                    Age = u.Age,
                    CreatedAt = u.CreatedAt
                })
                 .ToListAsync();



            if (pets == null || pets.Count == 0)
            {
                return BadRequest(new { Message = "No Pets for this customer" });
            }


            return Ok(pets);

        }


        [HttpPut("{petId}")]
        public async Task<IActionResult> PetUpdate(int petId, [FromBody] PetsDto petdto)
        {
            var pet = await _context.Pets.FindAsync(petId);
            if (pet == null)
            {
                return NotFound();
            }


            if (petdto.CustomerId != pet.CustomerId) { 
                 
                return BadRequest("You Cannot Change pet owwwner");
             }



            pet.Name = petdto.Name;
            pet.Breed = petdto.Breed;
            pet.Age = petdto.Age;


            await _context.SaveChangesAsync();

            return Ok(new { message = " Pet Updated Succefully" });

        }

        [HttpDelete("{petid}")]

        public async Task<IActionResult> DeletePet(int petid)
        {
            var pet = await _context.Pets.FindAsync(petid);

            if (pet == null)
            {
                return NotFound();

            }
            _context.Pets.Remove(pet);

            await _context.SaveChangesAsync();


            return Ok(new { message = "Pet Deleted Succefully" });
        }
    }
}