using System.ComponentModel.DataAnnotations;

namespace ArchivistaApi.Models
{
    public class UpdateProfileRequest
    {
        [Required]
        public string UserId { get; set; }

        [StringLength(50, MinimumLength = 3)]
        public string? Username { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }
    }
} 