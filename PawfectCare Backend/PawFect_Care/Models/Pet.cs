using System;
using System.Collections.Generic;

namespace PawFect_Care.Models;

public partial class Pet
{
    public int PetId { get; set; }

    public int CustomerId { get; set; }

    public string Name { get; set; } = null!;

    public string Breed { get; set; } = null!;

    public int Age { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual Customer Customer { get; set; } = null!;
}
