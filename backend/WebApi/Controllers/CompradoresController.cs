using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/compradores")]
public class CompradoresController : ControllerBase
{
    private readonly ICompradorService _service;

    public CompradoresController(ICompradorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompradorDto>>> GetAll()
    {
        var compradores = await _service.GetAllAsync();
        return Ok(compradores);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompradorDto>> GetById(Guid id)
    {
        var comprador = await _service.GetByIdAsync(id);
        if (comprador is null)
            return NotFound();

        return Ok(comprador);
    }

    [HttpPost]
    public async Task<ActionResult<CompradorDto>> Create([FromBody] CreateCompradorDto dto)
    {
        var comprador = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = comprador.Id }, comprador);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CompradorDto>> Update(Guid id, [FromBody] UpdateCompradorDto dto)
    {
        try
        {
            var comprador = await _service.UpdateAsync(id, dto);
            return Ok(comprador);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
