using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

/// <summary>
/// Endpoints para cadastro, consulta, edição e exclusão de carnes.
/// </summary>
[ApiController]
[Route("api/carnes")]
[Produces("application/json")]
public class CarnesController : ControllerBase
{
    private readonly ICarneService _service;

    public CarnesController(ICarneService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todas as carnes cadastradas.
    /// </summary>
    /// <returns>Lista com id, nome, tipo, preço por kg e status ativo.</returns>
    /// <response code="200">Lista de carnes retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CarneDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CarneDto>>> GetAll()
    {
        var carnes = await _service.GetAllAsync();
        return Ok(carnes);
    }

    /// <summary>
    /// Busca uma carne pelo identificador.
    /// </summary>
    /// <param name="id">Id da carne (Guid).</param>
    /// <returns>Dados completos da carne.</returns>
    /// <response code="200">Carne encontrada.</response>
    /// <response code="404">Carne não encontrada.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CarneDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CarneDto>> GetById(Guid id)
    {
        var carne = await _service.GetByIdAsync(id);
        if (carne is null)
            return NotFound();

        return Ok(carne);
    }

    /// <summary>
    /// Cadastra uma nova carne.
    /// </summary>
    /// <param name="dto">Nome, tipo e preço por kg da carne.</param>
    /// <returns>Carne criada com o id gerado.</returns>
    /// <response code="201">Carne criada com sucesso.</response>
    /// <response code="400">Dados inválidos (validação do modelo).</response>
    [HttpPost]
    [ProducesResponseType(typeof(CarneDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CarneDto>> Create([FromBody] CreateCarneDto dto)
    {
        var carne = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = carne.Id }, carne);
    }

    /// <summary>
    /// Atualiza os dados de uma carne existente.
    /// </summary>
    /// <param name="id">Id da carne a ser editada.</param>
    /// <param name="dto">Novos nome, tipo e preço por kg.</param>
    /// <returns>Carne atualizada.</returns>
    /// <response code="200">Carne atualizada com sucesso.</response>
    /// <response code="400">Dados inválidos (validação do modelo).</response>
    /// <response code="404">Carne não encontrada.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(CarneDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Remove uma carne do cadastro.
    /// </summary>
    /// <param name="id">Id da carne a ser excluída.</param>
    /// <returns>Sem conteúdo em caso de sucesso.</returns>
    /// <response code="204">Carne excluída com sucesso.</response>
    /// <response code="400">Carne possui pedidos vinculados e não pode ser excluída.</response>
    /// <response code="404">Carne não encontrada.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
