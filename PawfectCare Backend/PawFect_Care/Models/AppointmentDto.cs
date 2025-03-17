namespace PawFect_Care.Models
{
    public class AppointmentDto
    {


        public int AppointmentId { get; set; }

        public DateOnly AppointmentDate { get; set; }

        public int CustomerId { get; set; }

        public int PetId { get; set; }

        public DateTime CreatedAt { get; set; }

        public string AppointmentTime { get; set; } = null!;

        public int ServiceId { get; set; }


    }
}
