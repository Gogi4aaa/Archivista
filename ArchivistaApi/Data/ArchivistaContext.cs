using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Models;

namespace ArchivistaApi.Data;

public class ArchivistaContext : DbContext
{
    public ArchivistaContext(DbContextOptions<ArchivistaContext> options)
        : base(options)
    {
    }

    public DbSet<Artifact> Artifacts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the Artifact entity
        modelBuilder.Entity<Artifact>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.DiscoveryDate).IsRequired();
            entity.Property(e => e.DiscoveryLocation).IsRequired();
        });
    }
} 