namespace Application.DTOs;

public class PedidoItemDto
{
    public Guid CarneId { get; set; }
    public string NomeCarne { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal { get; set; }
}
