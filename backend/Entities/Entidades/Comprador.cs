namespace Entities.Entidades;

public class Comprador
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
