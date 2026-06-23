using Application.DTOs;

namespace Application.Services;

public interface IPedidoService
{
    Task<IEnumerable<PedidoDto>> GetAllAsync();
    Task<PedidoDto?> GetByIdAsync(Guid id);
    Task<PedidoDto> CreateAsync(CreatePedidoDto dto);
    Task<PedidoDto> UpdateAsync(Guid id, UpdatePedidoDto dto);
    Task DeleteAsync(Guid id);
}
