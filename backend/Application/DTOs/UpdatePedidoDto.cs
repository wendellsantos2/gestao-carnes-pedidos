namespace Application.DTOs;

public class UpdatePedidoDto
{
    public string Status { get; set; } = string.Empty;
    public List<CreatePedidoItemDto> Items { get; set; } = new();
}
