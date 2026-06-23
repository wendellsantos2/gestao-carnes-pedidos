using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CreateCompradorDto
{
    [Required]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string Telefone { get; set; } = string.Empty;

    public string Endereco { get; set; } = string.Empty;
}
