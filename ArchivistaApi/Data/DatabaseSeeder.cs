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
        private static readonly DateTime DefaultCreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

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

            // Get Admin and User roles
            var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (adminRole == null || userRole == null)
            {
                throw new InvalidOperationException("Required roles not found");
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
                    CreatedAt = DefaultCreatedAt
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

            // Check if Georgi's user account exists
            if (!await _context.Users.AnyAsync(u => u.Email == "georgi.dimitrov@archivista.local"))
            {
                // Create Georgi's user account
                var georgiUser = new User
                {
                    Username = "georgi",
                    Email = "georgi.dimitrov@archivista.local",
                    FirstName = "Georgi",
                    LastName = "Dimitrov",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"), // You should change this password
                    IsActive = true,
                    CreatedAt = DefaultCreatedAt
                };

                _context.Users.Add(georgiUser);
                await _context.SaveChangesAsync();

                // Assign regular user role to Georgi
                _context.UserRoles.Add(new UserRole
                {
                    UserId = georgiUser.Id,
                    RoleId = userRole.Id
                });

                await _context.SaveChangesAsync();
            }
        }
    }
} 