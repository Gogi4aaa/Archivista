using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Text.Json.Serialization;

namespace ArchivistaApi.Models
{
    public class LocationDto
    {
        [Required]
        public string Site { get; set; } = null!;

        public CoordinatesDto? Coordinates { get; set; }
    }

    public class CoordinatesDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class CreateArtifactDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Period { get; set; }

        [Required]
        public LocationDto Location { get; set; } = null!;

        [Required]
        public string Condition { get; set; } = null!;

        [Required]
        public string[] Category { get; set; } = Array.Empty<string>();

        public IFormFile? Image { get; set; }
    }
} 