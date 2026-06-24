using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class CreateCompradorDto
{
    [Required]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public string Documento { get; set; } = string.Empty;

    [Required]
    public string Cidade { get; set; } = string.Empty;

    [Required]
    [StringLength(2, MinimumLength = 2)]
    public string Estado { get; set; } = string.Empty;
}
