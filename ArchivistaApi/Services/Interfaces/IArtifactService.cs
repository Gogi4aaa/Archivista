using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArchivistaApi.Models;
using Microsoft.AspNetCore.Http;

namespace ArchivistaApi.Services.Interfaces
{
    public interface IArtifactService
    {
        Task<IEnumerable<Artifact>> GetAllAsync();
        Task<Artifact?> GetByIdAsync(Guid id);
        Task<Artifact> CreateAsync(Artifact artifact, IFormFile? photo = null);
        Task<Artifact> UpdateAsync(Artifact artifact);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<Artifact>> SearchByNameAsync(string searchTerm);
        Task<IEnumerable<Artifact>> GetByLocationAsync(string location);
        Task<IEnumerable<Artifact>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
} 