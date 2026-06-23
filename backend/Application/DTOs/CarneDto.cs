namespace Application.DTOs;

public class CarneDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public decimal PrecoKg { get; set; }
    public bool Ativo { get; set; }
}
