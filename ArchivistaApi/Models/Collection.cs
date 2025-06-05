using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArchivistaApi.Models;

public class Collection
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Period { get; set; } = string.Empty;

    public string? CuratorInfo { get; set; }

    public ICollection<Artifact> Artifacts { get; set; } = new List<Artifact>();
} 