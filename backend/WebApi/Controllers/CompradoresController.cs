using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

/// <summary>
/// Endpoints para cadastro, consulta, edição e exclusão de compradores.
/// </summary>
[ApiController]
[Route("api/compradores")]
[Produces("application/json")]
public class CompradoresController : ControllerBase
{
    private readonly ICompradorService _service;

    public CompradoresController(ICompradorService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todos os compradores cadastrados.
    /// </summary>
    /// <returns>Lista com id, nome, documento, cidade e estado.</returns>
    /// <response code="200">Lista de compradores retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CompradorDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CompradorDto>>> GetAll()
    {
        var compradores = await _service.GetAllAsync();
        return Ok(compradores);
    }

    /// <summary>
    /// Busca um comprador pelo identificador.
    /// </summary>
    /// <param name="id">Id do comprador (Guid).</param>
    /// <returns>Dados completos do comprador.</returns>
    /// <response code="200">Comprador encontrado.</response>
    /// <response code="404">Comprador não encontrado.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CompradorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CompradorDto>> GetById(Guid id)
    {
        var comprador = await _service.GetByIdAsync(id);
        if (comprador is null)
            return NotFound();

        return Ok(comprador);
    }

    /// <summary>
    /// Cadastra um novo comprador.
    /// </summary>
    /// <param name="dto">Nome, documento, cidade e estado do comprador.</param>
    /// <returns>Comprador criado com o id gerado.</returns>
    /// <response code="201">Comprador criado com sucesso.</response>
    /// <response code="400">Dados inválidos (validação do modelo).</response>
    [HttpPost]
    [ProducesResponseType(typeof(CompradorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CompradorDto>> Create([FromBody] CreateCompradorDto dto)
    {
        var comprador = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = comprador.Id }, comprador);
    }

    /// <summary>
    /// Atualiza os dados de um comprador existente.
    /// </summary>
    /// <param name="id">Id do comprador a ser editado.</param>
    /// <param name="dto">Novos nome, documento, cidade e estado.</param>
    /// <returns>Comprador atualizado.</returns>
    /// <response code="200">Comprador atualizado com sucesso.</response>
    /// <response code="400">Dados inválidos (validação do modelo).</response>
    /// <response code="404">Comprador não encontrado.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(CompradorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Remove um comprador do cadastro.
    /// </summary>
    /// <param name="id">Id do comprador a ser excluído.</param>
    /// <returns>Sem conteúdo em caso de sucesso.</returns>
    /// <response code="204">Comprador excluído com sucesso.</response>
    /// <response code="400">Comprador possui pedidos vinculados e não pode ser excluído.</response>
    /// <response code="404">Comprador não encontrado.</response>
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
