using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class UpdateCarneDto
{
    [Required]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public string Origem { get; set; } = string.Empty;
}
