using Application.DTOs;
using Entities.Entidades;
using Domain.Interfaces;

namespace Application.Services;

public class PedidoService : IPedidoService
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly ICompradorRepository _compradorRepository;
    private readonly ICarneRepository _carneRepository;

    public PedidoService(
        IPedidoRepository pedidoRepository,
        ICompradorRepository compradorRepository,
        ICarneRepository carneRepository)
    {
        _pedidoRepository = pedidoRepository;
        _compradorRepository = compradorRepository;
        _carneRepository = carneRepository;
    }

    public async Task<IEnumerable<PedidoDto>> GetAllAsync()
    {
        var pedidos = await _pedidoRepository.GetAllAsync();
        return pedidos.Select(MapToDto);
    }

    public async Task<PedidoDto?> GetByIdAsync(Guid id)
    {
        var pedido = await _pedidoRepository.GetByIdAsync(id);
        return pedido is null ? null : MapToDto(pedido);
    }

    public async Task<PedidoDto> CreateAsync(CreatePedidoDto dto)
    {
        var comprador = await _compradorRepository.GetByIdAsync(dto.CompradorId);
        if (comprador is null)
            throw new KeyNotFoundException($"Comprador com id '{dto.CompradorId}' não encontrado.");

        var pedido = new Pedido(dto.CompradorId, dto.DataPedido);

        foreach (var item in dto.Items)
        {
            var carne = await _carneRepository.GetByIdAsync(item.CarneId);
            if (carne is null)
                throw new KeyNotFoundException($"Carne com id '{item.CarneId}' não encontrada.");

            pedido.AdicionarItem(item.CarneId, item.Quantidade, item.PrecoUnitario, item.Moeda);
        }

        await _pedidoRepository.AddAsync(pedido);
        await _pedidoRepository.SaveChangesAsync();

        var pedidoCriado = await _pedidoRepository.GetByIdAsync(pedido.Id);
        return MapToDto(pedidoCriado!);
    }

    public async Task<PedidoDto> UpdateAsync(Guid id, UpdatePedidoDto dto)
    {
        var pedido = await _pedidoRepository.GetByIdAsync(id);
        if (pedido is null)
            throw new KeyNotFoundException($"Pedido com id '{id}' não encontrado.");

        if (dto.Items.Count > 0)
        {
            await _pedidoRepository.RemoveItemsAsync(id);
            pedido.LimparItens();

            foreach (var item in dto.Items)
            {
                var carne = await _carneRepository.GetByIdAsync(item.CarneId);
                if (carne is null)
                    throw new KeyNotFoundException($"Carne com id '{item.CarneId}' não encontrada.");

                pedido.AdicionarItem(item.CarneId, item.Quantidade, item.PrecoUnitario, item.Moeda);
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.Status))
        {
            if (!Enum.TryParse<PedidoStatus>(dto.Status, true, out var status))
                throw new ArgumentException("Status inválido.", nameof(dto.Status));

            pedido.AtualizarStatus(status);
        }

        await _pedidoRepository.UpdateAsync(pedido);
        await _pedidoRepository.SaveChangesAsync();

        var pedidoAtualizado = await _pedidoRepository.GetByIdAsync(id);
        return MapToDto(pedidoAtualizado!);
    }

    public async Task DeleteAsync(Guid id)
    {
        var pedido = await _pedidoRepository.GetByIdAsync(id);
        if (pedido is null)
            throw new KeyNotFoundException($"Pedido com id '{id}' não encontrado.");

        await _pedidoRepository.DeleteAsync(id);
        await _pedidoRepository.SaveChangesAsync();
    }

    private static PedidoDto MapToDto(Pedido pedido)
    {
        return new PedidoDto
        {
            Id = pedido.Id,
            DataPedido = pedido.DataPedido,
            Status = pedido.Status.ToString(),
            Comprador = pedido.Comprador is null
                ? new CompradorDto()
                : new CompradorDto
                {
                    Id = pedido.Comprador.Id,
                    Nome = pedido.Comprador.Nome,
                    Documento = pedido.Comprador.Documento,
                    Cidade = pedido.Comprador.Cidade,
                    Estado = pedido.Comprador.Estado
                },
            Items = pedido.Items.Select(item => new PedidoItemDto
            {
                CarneId = item.CarneId,
                NomeCarne = item.Carne?.Nome ?? string.Empty,
                Quantidade = (int)item.Quantidade,
                PrecoUnitario = item.PrecoUnitario,
                Moeda = item.Moeda,
                Subtotal = item.Subtotal
            }).ToList()
        };
    }
}
