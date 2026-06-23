using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

/// <summary>
/// Endpoints para criação, consulta, edição e exclusão de pedidos de carnes.
/// </summary>
[ApiController]
[Route("api/pedidos")]
[Produces("application/json")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _service;

    public PedidosController(IPedidoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todos os pedidos com comprador, itens e carnes relacionadas.
    /// </summary>
    /// <returns>Lista de pedidos com status, data, comprador, itens e total calculado.</returns>
    /// <response code="200">Lista de pedidos retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PedidoDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetAll()
    {
        var pedidos = await _service.GetAllAsync();
        return Ok(pedidos);
    }

    /// <summary>
    /// Busca um pedido pelo identificador.
    /// </summary>
    /// <param name="id">Id do pedido (Guid).</param>
    /// <returns>Pedido com comprador, itens, carnes e total.</returns>
    /// <response code="200">Pedido encontrado.</response>
    /// <response code="404">Pedido não encontrado.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PedidoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PedidoDto>> GetById(Guid id)
    {
        var pedido = await _service.GetByIdAsync(id);
        if (pedido is null)
            return NotFound();

        return Ok(pedido);
    }

    /// <summary>
    /// Cria um novo pedido com um ou mais itens de carne.
    /// </summary>
    /// <param name="dto">Id do comprador e lista de itens (carne e quantidade). O preço unitário é obtido da carne.</param>
    /// <returns>Pedido criado com dados completos.</returns>
    /// <response code="201">Pedido criado com sucesso.</response>
    /// <response code="400">Dados inválidos (validação do modelo).</response>
    /// <response code="404">Comprador ou carne informada não encontrada.</response>
    [HttpPost]
    [ProducesResponseType(typeof(PedidoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PedidoDto>> Create([FromBody] CreatePedidoDto dto)
    {
        try
        {
            var pedido = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = pedido.Id }, pedido);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza o status e/ou os itens de um pedido existente.
    /// </summary>
    /// <param name="id">Id do pedido a ser editado.</param>
    /// <param name="dto">Novo status (Pendente, Confirmado ou Cancelado) e/ou nova lista de itens.</param>
    /// <returns>Pedido atualizado com dados completos.</returns>
    /// <response code="200">Pedido atualizado com sucesso.</response>
    /// <response code="400">Status inválido ou regra de negócio violada.</response>
    /// <response code="404">Pedido ou carne informada não encontrada.</response>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PedidoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PedidoDto>> Update(Guid id, [FromBody] UpdatePedidoDto dto)
    {
        try
        {
            var pedido = await _service.UpdateAsync(id, dto);
            return Ok(pedido);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Remove um pedido e todos os seus itens.
    /// </summary>
    /// <param name="id">Id do pedido a ser excluído.</param>
    /// <returns>Sem conteúdo em caso de sucesso.</returns>
    /// <response code="204">Pedido excluído com sucesso.</response>
    /// <response code="404">Pedido não encontrado.</response>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
