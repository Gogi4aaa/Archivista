using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ArchivistaApi.Models;
using ArchivistaApi.Services.Interfaces;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ArchivistaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ArtifactController : ControllerBase
    {
        private readonly IArtifactService _artifactService;
        private readonly ILogger<ArtifactController> _logger;

        public ArtifactController(IArtifactService artifactService, ILogger<ArtifactController> logger)
        {
            _artifactService = artifactService;
            _logger = logger;
        }

        // GET: api/Artifact/image/{id}
        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage(Guid id)
        {
            var artifact = await _artifactService.GetByIdAsync(id);
            if (artifact == null || artifact.ImageData == null)
                return NotFound();

            return File(artifact.ImageData, artifact.ImageContentType ?? "application/octet-stream");
        }

        // GET: api/Artifact
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artifact>>> GetAll()
        {
            var artifacts = await _artifactService.GetAllAsync();
            
            // Transform the response to include image URLs
            var artifactsWithImageUrls = artifacts.Select(a => new
            {
                a.Id,
                a.Name,
                a.Description,
                a.DiscoveryDate,
                a.DiscoveryLocation,
                a.Period,
                a.Type,
                a.Material,
                a.Weight,
                a.Height,
                a.Width,
                a.Length,
                a.StorageLocation,
                a.CreatorId,
                a.CreatedAt,
                a.UpdatedAt,
                ImageUrl = a.ImageData != null ? $"/api/artifact/image/{a.Id}" : null
            });

            return Ok(artifactsWithImageUrls);
        }

        // GET: api/Artifact/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artifact>> GetById(Guid id)
        {
            var artifact = await _artifactService.GetByIdAsync(id);
            if (artifact == null)
                return NotFound();

            // Transform the response to include image URL
            var artifactWithImageUrl = new
            {
                artifact.Id,
                artifact.Name,
                artifact.Description,
                artifact.DiscoveryDate,
                artifact.DiscoveryLocation,
                artifact.Period,
                artifact.Type,
                artifact.Material,
                artifact.Weight,
                artifact.Height,
                artifact.Width,
                artifact.Length,
                artifact.StorageLocation,
                artifact.CreatorId,
                artifact.CreatedAt,
                artifact.UpdatedAt,
                ImageUrl = artifact.ImageData != null ? $"/api/artifact/image/{artifact.Id}" : null
            };

            return Ok(artifactWithImageUrl);
        }

        // POST: api/Artifact
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Artifact>> Create([FromForm] CreateArtifactDto createArtifactDto)
        {
            try
            {
                _logger.LogInformation("Received artifact creation request: {@CreateArtifactDto}", new 
                {
                    createArtifactDto.Title,
                    createArtifactDto.Description,
                    createArtifactDto.Period,
                    Location = createArtifactDto.Location?.Site,
                    createArtifactDto.Condition,
                    Categories = createArtifactDto.Category,
                    HasImage = createArtifactDto.Image != null
                });

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Model validation failed: {@ModelState}", ModelState);
                    return BadRequest(new { Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get the current user's ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    _logger.LogError("User ID claim not found or invalid");
                    return BadRequest(new { Message = "Invalid user authentication" });
                }

                var artifact = new Artifact
                {
                    Name = createArtifactDto.Title,
                    Description = createArtifactDto.Description,
                    DiscoveryDate = DateTime.UtcNow, // You might want to add this to the DTO later
                    DiscoveryLocation = createArtifactDto.Location.Site,
                    Period = createArtifactDto.Period,
                    Type = createArtifactDto.Category.FirstOrDefault(),
                    CreatorId = userId, // Use the current user's ID
                    CreatedAt = DateTime.UtcNow
                };

                var created = await _artifactService.CreateAsync(artifact, createArtifactDto.Image);
                
                // Transform the response to include image URL
                var response = new
                {
                    created.Id,
                    created.Name,
                    created.Description,
                    created.DiscoveryDate,
                    created.DiscoveryLocation,
                    created.Period,
                    created.Type,
                    created.Material,
                    created.CreatorId,
                    created.CreatedAt,
                    created.UpdatedAt,
                    ImageUrl = created.ImageData != null ? $"/api/artifact/image/{created.Id}" : null
                };

                return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating artifact");
                return BadRequest(new { Message = "Error creating artifact", Details = ex.Message });
            }
        }

        // PUT: api/Artifact/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Artifact>> Update(Guid id, [FromBody] Artifact artifact)
        {
            if (id != artifact.Id)
                return BadRequest("ID mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _artifactService.UpdateAsync(artifact);
                return Ok(updated);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: api/Artifact/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _artifactService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // GET: api/Artifact/search?term=example
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Artifact>>> Search([FromQuery] string term)
        {
            var artifacts = await _artifactService.SearchByNameAsync(term);
            return Ok(artifacts);
        }

        // GET: api/Artifact/location?location=example
        [HttpGet("location")]
        public async Task<ActionResult<IEnumerable<Artifact>>> GetByLocation([FromQuery] string location)
        {
            if (string.IsNullOrWhiteSpace(location))
                return BadRequest("Location parameter is required");

            var artifacts = await _artifactService.GetByLocationAsync(location);
            return Ok(artifacts);
        }

        // GET: api/Artifact/daterange?startDate=2024-03-21T00:00:00Z&endDate=2024-03-22T23:59:59Z
        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<Artifact>>> GetByDateRange(
            [FromQuery] string startDate,
            [FromQuery] string endDate)
        {
            if (!DateTime.TryParse(startDate, out DateTime parsedStartDate))
            {
                return BadRequest("Invalid start date format. Use ISO 8601 format (e.g., 2024-03-21T00:00:00Z)");
            }

            if (!DateTime.TryParse(endDate, out DateTime parsedEndDate))
            {
                return BadRequest("Invalid end date format. Use ISO 8601 format (e.g., 2024-03-21T23:59:59Z)");
            }

            // Convert to UTC
            parsedStartDate = DateTime.SpecifyKind(parsedStartDate, DateTimeKind.Utc);
            parsedEndDate = DateTime.SpecifyKind(parsedEndDate, DateTimeKind.Utc);

            if (parsedStartDate > parsedEndDate)
            {
                return BadRequest("Start date must be before or equal to end date");
            }

            try
            {
                var artifacts = await _artifactService.GetByDateRangeAsync(parsedStartDate, parsedEndDate);
                return Ok(artifacts);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error processing date range: {ex.Message}");
            }
        }
    }
} 