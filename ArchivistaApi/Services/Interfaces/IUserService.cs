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
    }
} 