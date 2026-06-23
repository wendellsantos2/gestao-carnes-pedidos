using Entities.Entidades;

namespace Domain.Interfaces;

public interface ICarneRepository
{
    Task<IEnumerable<Carne>> GetAllAsync();
    Task<Carne?> GetByIdAsync(Guid id);
    Task AddAsync(Carne carne);
    Task UpdateAsync(Carne carne);
    Task DeleteAsync(Guid id);
    Task<bool> HasPedidosAsync(Guid carneId);
    Task SaveChangesAsync();
}
