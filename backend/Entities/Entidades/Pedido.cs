namespace Entities.Entidades;

public class Pedido
{
    public int Id { get; set; }
    public int CompradorId { get; set; }
    public Comprador Comprador { get; set; } = null!;
    public DateTime DataPedido { get; set; }
    public string Status { get; set; } = "Pendente";
    public ICollection<PedidoItem> Itens { get; set; } = new List<PedidoItem>();
}
