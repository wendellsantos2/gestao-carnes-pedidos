namespace Entities.Entidades;

public class Pedido
{
    public int Id { get; set; }
    public Guid CompradorId { get; set; }
    public DateTime DataPedido { get; set; }
    public string Status { get; set; } = "Pendente";
    public ICollection<PedidoItem> Itens { get; set; } = new List<PedidoItem>();
}
