using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Models;
using ArchivistaApi.Services.Interfaces;

namespace ArchivistaApi.Services
{
    public class UserService : IUserService
    {
        private readonly ArchivistaContext _context;

        public UserService(ArchivistaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<int>> GetUserRoleIdsByEmailAsync(string email)
        {
            var roleIds = await _context.Users
                .Where(u => u.Email == email)
                .SelectMany(u => u.UserRoles)
                .Select(ur => ur.RoleId)
                .ToListAsync();

            return roleIds;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task UpdateProfileAsync(UpdateProfileRequest request)
        {
            // Parse the string userId to Guid
            if (!Guid.TryParse(request.UserId, out Guid userId))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            // Check if email is being updated and is not already taken
            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Email == request.Email && u.Id != userId);

                if (emailExists)
                {
                    throw new InvalidOperationException("Email is already taken");
                }

                user.Email = request.Email;
            }

            // Update username if provided
            if (!string.IsNullOrEmpty(request.Username))
            {
                // Check if username is already taken
                var usernameExists = await _context.Users
                    .AnyAsync(u => u.Username == request.Username && u.Id != userId);

                if (usernameExists)
                {
                    throw new InvalidOperationException("Username is already taken");
                }

                user.Username = request.Username;
            }

            await _context.SaveChangesAsync();
        }
    }
} 