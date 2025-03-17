using System;
using System.Collections.Generic;

namespace PawFect_Care.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public int CustomerId { get; set; }

    public int PetId { get; set; }

    public DateTime CreatedAt { get; set; }

    public string AppointmentTime { get; set; } = null!;

    public int ServiceId { get; set; }

    public virtual ICollection<Bill> Bills { get; set; } = new List<Bill>();

    public virtual Customer Customer { get; set; } = null!;

    public virtual Pet Pet { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
