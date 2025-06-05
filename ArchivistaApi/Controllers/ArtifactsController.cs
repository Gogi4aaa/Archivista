using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArchivistaApi.Data;
using ArchivistaApi.Models;

namespace ArchivistaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtifactsController : ControllerBase
{
    private readonly ArchivistaContext _context;

    public ArtifactsController(ArchivistaContext context)
    {
        _context = context;
    }

    // GET: api/Artifacts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Artifact>>> GetArtifacts()
    {
        return await _context.Artifacts.ToListAsync();
    }

    // GET: api/Artifacts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Artifact>> GetArtifact(int id)
    {
        var artifact = await _context.Artifacts.FindAsync(id);

        if (artifact == null)
        {
            return NotFound();
        }

        return artifact;
    }

    // POST: api/Artifacts
    [HttpPost]
    public async Task<ActionResult<Artifact>> PostArtifact(Artifact artifact)
    {
        _context.Artifacts.Add(artifact);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetArtifact), new { id = artifact.Id }, artifact);
    }

    // PUT: api/Artifacts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutArtifact(int id, Artifact artifact)
    {
        if (id != artifact.Id)
        {
            return BadRequest();
        }

        artifact.UpdatedAt = DateTime.UtcNow;
        _context.Entry(artifact).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ArtifactExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Artifacts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArtifact(int id)
    {
        var artifact = await _context.Artifacts.FindAsync(id);
        if (artifact == null)
        {
            return NotFound();
        }

        _context.Artifacts.Remove(artifact);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ArtifactExists(int id)
    {
        return _context.Artifacts.Any(e => e.Id == id);
    }
} 