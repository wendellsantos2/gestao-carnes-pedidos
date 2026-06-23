namespace Entities.Entidades;

public class PedidoItem
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public Pedido Pedido { get; set; } = null!;
    public int CarneId { get; set; }
    public Carne Carne { get; set; } = null!;
    public decimal QuantidadeKg { get; set; }
    public decimal PrecoUnitario { get; set; }
}
