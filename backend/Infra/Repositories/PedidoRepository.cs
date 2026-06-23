using Domain.Entities;
using Domain.Interfaces;
using Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace Infra.Repositories;

public class PedidoRepository : IPedidoRepository
{
    private readonly AppDbContext _context;

    public PedidoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Pedido>> GetAllAsync()
    {
        return await _context.Pedidos
            .Include(p => p.Comprador)
            .Include(p => p.Items)
                .ThenInclude(i => i.Carne)
            .ToListAsync();
    }

    public async Task<Pedido?> GetByIdAsync(Guid id)
    {
        return await _context.Pedidos
            .Include(p => p.Comprador)
            .Include(p => p.Items)
                .ThenInclude(i => i.Carne)
            .SingleOrDefaultAsync(p => p.Id == id);
    }

    public async Task AddAsync(Pedido pedido)
    {
        await _context.Pedidos.AddAsync(pedido);
    }

    public Task UpdateAsync(Pedido pedido)
    {
        _context.Pedidos.Update(pedido);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var pedido = await _context.Pedidos.FindAsync(id);
        if (pedido is not null)
            _context.Pedidos.Remove(pedido);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
