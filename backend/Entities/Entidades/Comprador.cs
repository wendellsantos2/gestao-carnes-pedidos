namespace Entities.Entidades;

public class Comprador
{
    private static readonly HashSet<string> UfsValidas = new(StringComparer.OrdinalIgnoreCase)
    {
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
        "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    };

    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string Documento { get; private set; } = string.Empty;
    public string Cidade { get; private set; } = string.Empty;
    public string Estado { get; private set; } = string.Empty;

    private Comprador()
    {
    }

    public Comprador(string nome, string documento, string cidade, string estado)
    {
        Id = Guid.NewGuid();
        ValidateAndSet(nome, documento, cidade, estado);
    }

    public void Update(string nome, string documento, string cidade, string estado)
    {
        ValidateAndSet(nome, documento, cidade, estado);
    }

    private void ValidateAndSet(string nome, string documento, string cidade, string estado)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.", nameof(nome));

        var documentoNormalizado = NormalizarDocumento(documento);
        ValidateDocumento(documentoNormalizado);

        if (string.IsNullOrWhiteSpace(cidade))
            throw new ArgumentException("Cidade é obrigatória.", nameof(cidade));

        var estadoNormalizado = estado.Trim().ToUpperInvariant();
        if (!UfsValidas.Contains(estadoNormalizado))
            throw new ArgumentException("Estado inválido.", nameof(estado));

        Nome = nome.Trim();
        Documento = documentoNormalizado;
        Cidade = cidade.Trim();
        Estado = estadoNormalizado;
    }

    private static string NormalizarDocumento(string documento)
    {
        if (string.IsNullOrWhiteSpace(documento))
            throw new ArgumentException("Documento é obrigatório.", nameof(documento));

        return new string(documento.Where(char.IsDigit).ToArray());
    }

    private static void ValidateDocumento(string documento)
    {
        if (documento.Length is not (11 or 14))
            throw new ArgumentException("Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos).", nameof(documento));
    }
}
