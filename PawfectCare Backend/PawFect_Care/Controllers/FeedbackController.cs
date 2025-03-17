using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PawFect_Care.Models;


namespace PawfectCate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {

        private readonly PawfectCareContext _context;

        public FeedbackController(PawfectCareContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddFeedback([FromBody] FeedbackInputDTO feedbackDto)
        {
            if (feedbackDto == null || string.IsNullOrWhiteSpace(feedbackDto.Description))
            {
                return BadRequest(new { message = "Invalid feedback data." });
            }

            Feedback feedback = new Feedback
            {
                Description = feedbackDto.Description,
                CustomerId = feedbackDto.CustomerId
            };

            _context.Feedbacks.Add(feedback);
            _context.SaveChanges(); // Save to DB

            return Ok(new { message = "Feedback added successfully!" });
        }


        [HttpGet("all")]
        public IActionResult GetAllFeedbacks()
        {
            var feedbacks = _context.Feedbacks
                .Join(_context.Customers,
                    feedback => feedback.CustomerId,
                    customer => customer.CustomerId,
                    (feedback, customer) => new FeedbackDTO
                    {
                        FeedbackId = feedback.FeedbackId,
                        Description = feedback.Description,
                        CustomerName = customer.Name // Replace CustomerId with Name
                    })
                .ToList();

            if (feedbacks.Count == 0)
            {
                return NotFound(new { message = "No feedbacks found." });
            }

            return Ok(feedbacks);
        }


        public class FeedbackDTO
        {
            public int FeedbackId { get; set; }
            public string Description { get; set; } = null!;
            public string CustomerName { get; set; }
        }

        public class FeedbackInputDTO
        {
            public string Description { get; set; }
            public int CustomerId { get; set; }
        }

    }
}