namespace Entities.Entidades;

public class Carne
{
    private static readonly HashSet<string> OrigensValidas = new(StringComparer.OrdinalIgnoreCase)
    {
        "Bovina", "Suína", "Aves", "Peixes"
    };

    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string Origem { get; private set; } = string.Empty;
    public decimal PrecoKg { get; private set; }
    public bool Ativo { get; private set; }

    private Carne()
    {
    }

    public Carne(string nome, string origem, decimal precoKg = 1m, bool ativo = true)
    {
        Id = Guid.NewGuid();
        Ativo = ativo;
        ValidateAndSet(nome, origem, precoKg);
    }

    public void Update(string nome, string origem)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Descrição é obrigatória.", nameof(nome));

        var origemNormalizada = NormalizarOrigem(origem);

        Nome = nome.Trim();
        Origem = origemNormalizada;
    }

    private void ValidateAndSet(string nome, string origem, decimal precoKg)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Descrição é obrigatória.", nameof(nome));

        if (precoKg <= 0)
            throw new ArgumentException("Preço por kg deve ser maior que zero.", nameof(precoKg));

        Nome = nome.Trim();
        Origem = NormalizarOrigem(origem);
        PrecoKg = precoKg;
    }

    private static string NormalizarOrigem(string origem)
    {
        if (string.IsNullOrWhiteSpace(origem))
            throw new ArgumentException("Origem é obrigatória.", nameof(origem));

        var origemNormalizada = origem.Trim();
        if (!OrigensValidas.Contains(origemNormalizada))
            throw new ArgumentException("Origem inválida. Use Bovina, Suína, Aves ou Peixes.", nameof(origem));

        return OrigensValidas.First(o => o.Equals(origemNormalizada, StringComparison.OrdinalIgnoreCase));
    }
}
