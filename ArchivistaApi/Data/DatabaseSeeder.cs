using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Models;
using BCrypt.Net;

namespace ArchivistaApi.Data
{
    public class DatabaseSeeder
    {
        private readonly ArchivistaContext _context;

        public DatabaseSeeder(ArchivistaContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Ensure database is created and migrations are applied
            await _context.Database.MigrateAsync();

            // Seed roles if they don't exist
            if (!await _context.Roles.AnyAsync())
            {
                _context.Roles.AddRange(
                    new Role { Name = "Admin", Description = "Administrator role with full access" },
                    new Role { Name = "User", Description = "Standard user role" }
                );
                await _context.SaveChangesAsync();
            }

            // Get Admin role
            var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole == null)
            {
                throw new InvalidOperationException("Admin role not found");
            }

            // Check if admin user exists
            if (!await _context.Users.AnyAsync(u => u.Email == "admin@archivista.com"))
            {
                // Create admin user
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@archivista.com",
                    FirstName = "System",
                    LastName = "Administrator",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"), // You should change this password in production
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                // Assign admin role to user
                _context.UserRoles.Add(new UserRole
                {
                    UserId = adminUser.Id,
                    RoleId = adminRole.Id
                });

                await _context.SaveChangesAsync();
            }
        }
    }
} 