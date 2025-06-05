using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArchivistaApi.Models;

public class Collection
{
    public Collection()
    {
        Artifacts = new List<Artifact>();
    }
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string Period { get; set; } = null!;  

    public string? CuratorInfo { get; set; }

    public ICollection<Artifact> Artifacts { get; set; }
} 