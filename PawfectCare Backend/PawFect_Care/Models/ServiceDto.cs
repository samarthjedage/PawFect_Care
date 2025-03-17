

using System.ComponentModel.DataAnnotations;

namespace PawFect_Care.Models




{
    
        public class ServiceDto
        {
            public int ServiceId { get; set; }

            [Required(ErrorMessage = "Service name is required.")]
            public string Name { get; set; } = string.Empty;

            [Required(ErrorMessage = "Service description is required.")]
            public string Description { get; set; } = string.Empty;

            public decimal Price { get; set; }

            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        }

    
}
