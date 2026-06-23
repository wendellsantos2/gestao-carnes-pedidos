using Domain.Entities;
using Domain.Interfaces;
using Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace Infra.Repositories;

public class CarneRepository : ICarneRepository
{
    private readonly AppDbContext _context;

    public CarneRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Carne>> GetAllAsync()
    {
        return await _context.Carnes.ToListAsync();
    }

    public async Task<Carne?> GetByIdAsync(Guid id)
    {
        return await _context.Carnes.FindAsync(id);
    }

    public async Task AddAsync(Carne carne)
    {
        await _context.Carnes.AddAsync(carne);
    }

    public Task UpdateAsync(Carne carne)
    {
        _context.Carnes.Update(carne);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var carne = await _context.Carnes.FindAsync(id);
        if (carne is not null)
            _context.Carnes.Remove(carne);
    }

    public async Task<bool> HasPedidosAsync(Guid carneId)
    {
        return await _context.Set<PedidoItem>()
            .AnyAsync(pi => pi.CarneId == carneId);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
