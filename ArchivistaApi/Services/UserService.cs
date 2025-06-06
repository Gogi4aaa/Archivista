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
    }
} 