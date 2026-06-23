namespace Entities.Entidades;

public class Comprador
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Telefone { get; private set; } = string.Empty;
    public string Endereco { get; private set; } = string.Empty;

    private Comprador()
    {
    }

    public Comprador(string nome, string email, string telefone, string endereco)
    {
        Id = Guid.NewGuid();
        ValidateAndSet(nome, email, telefone, endereco);
    }

    public void Update(string nome, string email, string telefone, string endereco)
    {
        ValidateAndSet(nome, email, telefone, endereco);
    }

    private void ValidateAndSet(string nome, string email, string telefone, string endereco)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.", nameof(nome));

        ValidateEmail(email);

        if (string.IsNullOrWhiteSpace(telefone))
            throw new ArgumentException("Telefone é obrigatório.", nameof(telefone));

        if (string.IsNullOrWhiteSpace(endereco))
            throw new ArgumentException("Endereço é obrigatório.", nameof(endereco));

        Nome = nome.Trim();
        Email = email.Trim();
        Telefone = telefone.Trim();
        Endereco = endereco.Trim();
    }

    private static void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email é obrigatório.", nameof(email));

        var trimmed = email.Trim();
        var atIndex = trimmed.IndexOf('@');

        if (atIndex <= 0 || atIndex == trimmed.Length - 1 || trimmed.IndexOf('.', atIndex + 1) <= atIndex)
            throw new ArgumentException("Email inválido.", nameof(email));
    }
}
