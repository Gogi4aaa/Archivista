using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArchivistaApi.Models;

namespace ArchivistaApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<int>> GetUserRoleIdsByEmailAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
        Task UpdateProfileAsync(UpdateProfileRequest request);

        // New CRUD operations
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(Guid id);
        Task<User> CreateUserAsync(User user, string password);
        Task<User> UpdateUserAsync(Guid id, User user);
        Task DeleteUserAsync(Guid id);
        Task<bool> UpdateUserStatusAsync(Guid id, bool isActive);
        Task<bool> UpdateUserRolesAsync(Guid id, IEnumerable<int> roleIds);
    }
} 