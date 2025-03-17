namespace PawFect_Care.Models
{
    public  class CustomerDto
    {


        public int CustomerId { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Role { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
      
        public string? Phone { get; set; }





        public Customer ToCustomer()
        {
            return new Customer { Name = Name, Email = Email, Phone = Phone, Password = Password, Role = "customer", CreatedAt = DateTime.Now };

        }
    }
}
