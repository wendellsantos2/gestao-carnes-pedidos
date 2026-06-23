namespace Entities.Entidades;

public class PedidoItem
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public Pedido Pedido { get; set; } = null!;
    public Guid CarneId { get; set; }
    public decimal QuantidadeKg { get; set; }
    public decimal PrecoUnitario { get; set; }
}
