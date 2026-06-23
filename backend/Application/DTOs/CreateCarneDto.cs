using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CreateCarneDto
{
    [Required]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public string Tipo { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal PrecoKg { get; set; }
}
