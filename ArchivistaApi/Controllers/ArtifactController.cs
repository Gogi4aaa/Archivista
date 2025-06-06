using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ArchivistaApi.Models;
using ArchivistaApi.Services.Interfaces;

namespace ArchivistaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtifactController : ControllerBase
    {
        private readonly IArtifactService _artifactService;

        public ArtifactController(IArtifactService artifactService)
        {
            _artifactService = artifactService;
        }

        // GET: api/Artifact
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artifact>>> GetAll()
        {
            var artifacts = await _artifactService.GetAllAsync();
            return Ok(artifacts);
        }

        // GET: api/Artifact/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artifact>> GetById(Guid id)
        {
            var artifact = await _artifactService.GetByIdAsync(id);
            if (artifact == null)
                return NotFound();

            return Ok(artifact);
        }

        // POST: api/Artifact
        [HttpPost]
        public async Task<ActionResult<Artifact>> Create([FromBody] Artifact artifact)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _artifactService.CreateAsync(artifact);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
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