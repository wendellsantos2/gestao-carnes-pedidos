using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CreatePedidoItemDto
{
    public Guid CarneId { get; set; }

    public int Quantidade { get; set; }
}
