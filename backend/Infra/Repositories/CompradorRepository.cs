using Entities.Entidades;
using Domain.Interfaces;
using Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace Infra.Repositories;

public class CompradorRepository : ICompradorRepository
{
    private readonly AppDbContext _context;

    public CompradorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Comprador>> GetAllAsync()
    {
        return await _context.Compradores.ToListAsync();
    }

    public async Task<Comprador?> GetByIdAsync(Guid id)
    {
        return await _context.Compradores.FindAsync(id);
    }

    public async Task AddAsync(Comprador comprador)
    {
        await _context.Compradores.AddAsync(comprador);
    }

    public Task UpdateAsync(Comprador comprador)
    {
        _context.Compradores.Update(comprador);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var comprador = await _context.Compradores.FindAsync(id);
        if (comprador is null)
            throw new KeyNotFoundException($"Comprador com id '{id}' não encontrado.");

        _context.Compradores.Remove(comprador);
    }

    public async Task<bool> HasPedidosAsync(Guid compradorId)
    {
        return await _context.Pedidos.AnyAsync(p => p.CompradorId == compradorId);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
