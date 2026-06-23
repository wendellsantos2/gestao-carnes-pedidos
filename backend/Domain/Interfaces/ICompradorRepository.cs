using Entities.Entidades;

namespace Domain.Interfaces;

public interface ICompradorRepository
{
    Task<IEnumerable<Comprador>> GetAllAsync();
    Task<Comprador?> GetByIdAsync(Guid id);
    Task AddAsync(Comprador comprador);
    Task UpdateAsync(Comprador comprador);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}
