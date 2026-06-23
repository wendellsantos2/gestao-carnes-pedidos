namespace Application.DTOs;

public class PedidoDto
{
    public Guid Id { get; set; }
    public DateTime DataPedido { get; set; }
    public string Status { get; set; } = string.Empty;
    public CompradorDto Comprador { get; set; } = new();
    public List<PedidoItemDto> Items { get; set; } = new();
    public decimal Total => Items.Sum(i => i.Subtotal);
}
