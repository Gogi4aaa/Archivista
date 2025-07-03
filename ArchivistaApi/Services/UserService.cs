using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Models;
using ArchivistaApi.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace ArchivistaApi.Services
{
    public class UserService : IUserService
    {
        private readonly ArchivistaContext _context;

        public UserService(ArchivistaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> CreateUserAsync(User user, string password)
        {
            // Validate email uniqueness
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                throw new InvalidOperationException("Email is already taken");
            }

            // Validate username uniqueness
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            {
                throw new InvalidOperationException("Username is already taken");
            }

            // Hash password
            user.PasswordHash = BC.HashPassword(password);
            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(Guid id, User updatedUser)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            // Check email uniqueness if it's being changed
            if (updatedUser.Email != user.Email && 
                await _context.Users.AnyAsync(u => u.Email == updatedUser.Email && u.Id != id))
            {
                throw new InvalidOperationException("Email is already taken");
            }

            // Check username uniqueness if it's being changed
            if (updatedUser.Username != user.Username && 
                await _context.Users.AnyAsync(u => u.Username == updatedUser.Username && u.Id != id))
            {
                throw new InvalidOperationException("Username is already taken");
            }

            // Update properties
            user.Username = updatedUser.Username;
            user.Email = updatedUser.Email;
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.IsActive = updatedUser.IsActive;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateUserStatusAsync(Guid id, bool isActive)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            user.IsActive = isActive;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUserRolesAsync(Guid id, IEnumerable<int> roleIds)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            // Remove existing roles
            user.UserRoles.Clear();

            // Add new roles
            foreach (var roleId in roleIds)
            {
                user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = roleId });
            }

            await _context.SaveChangesAsync();
            return true;
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