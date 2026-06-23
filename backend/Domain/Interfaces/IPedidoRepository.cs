using Entities.Entidades;

namespace Domain.Interfaces;

public interface IPedidoRepository
{
    /// <summary>
    /// Retorna todos os pedidos incluindo Comprador e Items.Carne.
    /// </summary>
    Task<IEnumerable<Pedido>> GetAllAsync();

    Task<Pedido?> GetByIdAsync(Guid id);
    Task AddAsync(Pedido pedido);
    Task UpdateAsync(Pedido pedido);
    Task RemoveItemsAsync(Guid pedidoId);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}
