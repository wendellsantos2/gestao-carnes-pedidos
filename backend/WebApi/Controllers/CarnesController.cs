using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/carnes")]
public class CarnesController : ControllerBase
{
    private readonly ICarneService _service;

    public CarnesController(ICarneService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CarneDto>>> GetAll()
    {
        var carnes = await _service.GetAllAsync();
        return Ok(carnes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CarneDto>> GetById(Guid id)
    {
        var carne = await _service.GetByIdAsync(id);
        if (carne is null)
            return NotFound();

        return Ok(carne);
    }

    [HttpPost]
    public async Task<ActionResult<CarneDto>> Create([FromBody] CreateCarneDto dto)
    {
        var carne = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = carne.Id }, carne);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CarneDto>> Update(Guid id, [FromBody] UpdateCarneDto dto)
    {
        try
        {
            var carne = await _service.UpdateAsync(id, dto);
            return Ok(carne);
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
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
