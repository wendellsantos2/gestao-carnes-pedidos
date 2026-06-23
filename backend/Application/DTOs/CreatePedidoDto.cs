using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CreatePedidoDto
{
    [Required]
    public Guid CompradorId { get; set; }

    [MinLength(1)]
    public List<CreatePedidoItemDto> Items { get; set; } = new();
}
