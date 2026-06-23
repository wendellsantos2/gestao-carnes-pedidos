namespace Entities.Entidades;

public class Pedido
{
    public Guid Id { get; private set; }
    public DateTime DataPedido { get; private set; }
    public PedidoStatus Status { get; private set; }
    public Guid CompradorId { get; private set; }
    public Comprador? Comprador { get; private set; }

    private readonly List<PedidoItem> _itens = new();
    public IReadOnlyCollection<PedidoItem> Items => _itens.AsReadOnly();

    private Pedido()
    {
    }

    public Pedido(Guid compradorId, DateTime? dataPedido = null)
    {
        if (compradorId == Guid.Empty)
            throw new ArgumentException("Comprador é obrigatório.", nameof(compradorId));

        Id = Guid.NewGuid();
        CompradorId = compradorId;
        DataPedido = dataPedido ?? DateTime.UtcNow;
        Status = PedidoStatus.Pendente;
    }

    public void AdicionarItem(Guid carneId, decimal quantidade, decimal precoUnitario)
    {
        if (carneId == Guid.Empty)
            throw new ArgumentException("Carne é obrigatória.", nameof(carneId));

        if (Status != PedidoStatus.Pendente)
            throw new InvalidOperationException("Só é possível adicionar itens em pedidos pendentes.");

        if (_itens.Any(i => i.CarneId == carneId))
            throw new InvalidOperationException("Carne já adicionada ao pedido.");

        _itens.Add(new PedidoItem(Id, carneId, quantidade, precoUnitario));
    }

    public decimal CalcularTotal() => _itens.Sum(i => i.Subtotal);

    public void AtualizarStatus(PedidoStatus status)
    {
        Status = status;
    }

    public void LimparItens()
    {
        if (Status != PedidoStatus.Pendente)
            throw new InvalidOperationException("Só é possível alterar itens em pedidos pendentes.");

        _itens.Clear();
    }
}
