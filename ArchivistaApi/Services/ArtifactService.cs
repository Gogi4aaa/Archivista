using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Models;
using ArchivistaApi.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace ArchivistaApi.Services
{
    public class ArtifactService : IArtifactService
    {
        private readonly ArchivistaContext _context;

        public ArtifactService(ArchivistaContext context, IConfiguration configuration)
        {
            _context = context;
        }

        public async Task<IEnumerable<Artifact>> GetAllAsync()
        {
            return await _context.Artifacts
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<Artifact?> GetByIdAsync(Guid id)
        {
            return await _context.Artifacts.FindAsync(id);
        }

        public async Task<Artifact> CreateAsync(Artifact artifact, IFormFile? photo = null)
        {
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    artifact.ImageData = memoryStream.ToArray();
                    artifact.ImageContentType = photo.ContentType;
                }
            }

            _context.Artifacts.Add(artifact);
            await _context.SaveChangesAsync();
            return artifact;
        }

        public async Task<Artifact> UpdateAsync(Artifact artifact)
        {
            var existingArtifact = await _context.Artifacts.FindAsync(artifact.Id);
            if (existingArtifact == null)
                throw new KeyNotFoundException($"Artifact with ID {artifact.Id} not found.");

            // Preserve the image data if not being updated
            if (artifact.ImageData == null)
            {
                artifact.ImageData = existingArtifact.ImageData;
                artifact.ImageContentType = existingArtifact.ImageContentType;
            }

            _context.Entry(existingArtifact).CurrentValues.SetValues(artifact);
            artifact.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return artifact;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var artifact = await _context.Artifacts.FindAsync(id);
            if (artifact == null)
                return false;

            _context.Artifacts.Remove(artifact);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Artifact>> SearchByNameAsync(string searchTerm)
        {
            return await _context.Artifacts
                .Where(a => a.Name.Contains(searchTerm))
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Artifact>> GetByLocationAsync(string location)
        {
            return await _context.Artifacts
                .Where(a => a.DiscoveryLocation.Contains(location))
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Artifact>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Artifacts
                .Where(a => a.DiscoveryDate >= startDate && a.DiscoveryDate <= endDate)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
} 