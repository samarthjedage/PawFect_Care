namespace PawFect_Care.Models
{
    public class PetsDto
    {

        public int PetId { get; set; }

        public int CustomerId { get; set; }

        public string Name { get; set; } = null!;

        public string Breed { get; set; } = null!;

        public int Age { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
