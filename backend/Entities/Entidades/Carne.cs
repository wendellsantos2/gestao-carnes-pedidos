namespace Entities.Entidades;

public class Carne
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public decimal PrecoKg { get; set; }
    public ICollection<PedidoItem> PedidoItens { get; set; } = new List<PedidoItem>();
}
