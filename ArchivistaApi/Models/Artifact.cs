using System;
using System.ComponentModel.DataAnnotations;

namespace ArchivistaApi.Models;

public class Artifact
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } =  null!;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    public DateTime DiscoveryDate { get; set; }

    [Required]
    [MaxLength(200)]
    public string DiscoveryLocation { get; set; } = null!;

    [MaxLength(100)]
    public string? Period { get; set; }

    [MaxLength(100)]
    public string? Culture { get; set; }

    [MaxLength(100)]
    public string? Material { get; set; }

    public decimal? Weight { get; set; }

    public decimal? Height { get; set; }

    public decimal? Width { get; set; }

    public decimal? Length { get; set; }

    [MaxLength(500)]
    public string? StorageLocation { get; set; }

    public string? PhotoUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
} 