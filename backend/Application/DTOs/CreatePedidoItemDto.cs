using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CreatePedidoItemDto
{
    public Guid CarneId { get; set; }

    public int Quantidade { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Preço unitário deve ser maior que zero.")]
    public decimal PrecoUnitario { get; set; }

    [Required]
    public string Moeda { get; set; } = "BRL";
}
