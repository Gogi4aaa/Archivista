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
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

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

            // Configure the relationship with User (Creator)
            entity.HasOne(a => a.Creator)
                .WithMany(u => u.Artifacts)
                .HasForeignKey(a => a.CreatorId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // Configure CreatorId as UUID
            entity.Property(e => e.CreatorId)
                .HasColumnType("uuid");
        });

        // Configure the User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            // Configure Id as UUID with default value from PostgreSQL
            entity.Property(e => e.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure the Role entity
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Configure the UserRole entity (many-to-many relationship)
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });

            // Configure UserId as UUID
            entity.Property(e => e.UserId)
                .HasColumnType("uuid");

            entity.HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed initial roles
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", Description = "Administrator role with full access" },
            new Role { Id = 2, Name = "User", Description = "Standard user role" }
        );
    }
} 