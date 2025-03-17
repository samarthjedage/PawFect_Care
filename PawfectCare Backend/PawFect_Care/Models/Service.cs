using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PawFect_Care.Models;

public partial class Service
{
    [Key]
    public int ServiceId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public decimal Price { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
