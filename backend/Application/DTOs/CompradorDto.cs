namespace Application.DTOs;

public class CompradorDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Documento { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
}
