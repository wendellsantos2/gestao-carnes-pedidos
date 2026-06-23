namespace Domain.Entities;

public class Carne
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string Tipo { get; private set; } = string.Empty;
    public decimal PrecoKg { get; private set; }
    public bool Ativo { get; private set; }

    private Carne()
    {
    }

    public Carne(string nome, string tipo, decimal precoKg, bool ativo = true)
    {
        Id = Guid.NewGuid();
        Ativo = ativo;
        ValidateAndSet(nome, tipo, precoKg);
    }

    public void Update(string nome, string tipo, decimal precoKg, bool ativo)
    {
        ValidateAndSet(nome, tipo, precoKg);
        Ativo = ativo;
    }

    private void ValidateAndSet(string nome, string tipo, decimal precoKg)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.", nameof(nome));

        if (string.IsNullOrWhiteSpace(tipo))
            throw new ArgumentException("Tipo é obrigatório.", nameof(tipo));

        if (precoKg <= 0)
            throw new ArgumentException("Preço por kg deve ser maior que zero.", nameof(precoKg));

        Nome = nome.Trim();
        Tipo = tipo.Trim();
        PrecoKg = precoKg;
    }
}
