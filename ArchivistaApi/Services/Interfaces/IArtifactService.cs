using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArchivistaApi.Models;

namespace ArchivistaApi.Services.Interfaces
{
    public interface IArtifactService : IBaseService<Artifact, Guid>
    {
        // Add any artifact-specific methods beyond basic CRUD here
        Task<IEnumerable<Artifact>> GetByLocationAsync(string location);
        Task<IEnumerable<Artifact>> SearchByNameAsync(string searchTerm);
        Task<IEnumerable<Artifact>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Artifact>> GetByCreatorIdAsync(Guid creatorId);
    }
} 