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
    public class ArtifactService : BaseService<Artifact, int>, IArtifactService
    {
        public ArtifactService(ArchivistaContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Artifact>> GetByLocationAsync(string location)
        {
            return await _dbSet
                .Where(a => a.DiscoveryLocation.Contains(location))
                .OrderByDescending(a => a.DiscoveryDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Artifact>> SearchByNameAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            return await _dbSet
                .Where(a => a.Name.Contains(searchTerm))
                .OrderBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Artifact>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            // Ensure dates are in UTC
            startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

            return await _dbSet
                .Where(a => a.DiscoveryDate >= startDate && a.DiscoveryDate <= endDate)
                .OrderByDescending(a => a.DiscoveryDate)
                .ToListAsync();
        }

        // Override base methods if you need custom behavior
        public override async Task<IEnumerable<Artifact>> GetAllAsync()
        {
            return await _dbSet
                .OrderByDescending(a => a.DiscoveryDate)
                .ToListAsync();
        }

        public override async Task<Artifact> CreateAsync(Artifact artifact)
        {
            // Ensure DiscoveryDate is in UTC
            if (artifact.DiscoveryDate == default)
            {
                artifact.DiscoveryDate = DateTime.UtcNow;
            }
            else
            {
                artifact.DiscoveryDate = DateTime.SpecifyKind(artifact.DiscoveryDate, DateTimeKind.Utc);
            }

            return await base.CreateAsync(artifact);
        }

        public override async Task<Artifact> UpdateAsync(Artifact artifact)
        {
            var existingArtifact = await GetByIdAsync(artifact.Id);
            if (existingArtifact == null)
                throw new KeyNotFoundException($"Artifact with ID {artifact.Id} not found.");

            // Ensure DiscoveryDate is in UTC
            artifact.DiscoveryDate = DateTime.SpecifyKind(artifact.DiscoveryDate, DateTimeKind.Utc);

            return await base.UpdateAsync(artifact);
        }
    }
} 