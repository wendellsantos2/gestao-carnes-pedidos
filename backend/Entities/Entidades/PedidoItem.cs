namespace Entities.Entidades;

public class PedidoItem
{
    public Guid Id { get; private set; }
    public Guid PedidoId { get; private set; }
    public Guid CarneId { get; private set; }
    public Carne? Carne { get; private set; }
    public decimal Quantidade { get; private set; }
    public decimal PrecoUnitario { get; private set; }
    public string Moeda { get; private set; } = "BRL";

    public decimal Subtotal => Quantidade * PrecoUnitario;

    private PedidoItem()
    {
    }

    internal PedidoItem(Guid pedidoId, Guid carneId, decimal quantidade, decimal precoUnitario, string moeda)
    {
        Id = Guid.NewGuid();
        PedidoId = pedidoId;
        CarneId = carneId;
        ValidateAndSet(quantidade, precoUnitario, moeda);
    }

    private void ValidateAndSet(decimal quantidade, decimal precoUnitario, string moeda)
    {
        if (quantidade <= 0)
            throw new ArgumentException("Quantidade deve ser maior que zero.", nameof(quantidade));

        if (precoUnitario <= 0)
            throw new ArgumentException("Preço unitário deve ser maior que zero.", nameof(precoUnitario));

        if (string.IsNullOrWhiteSpace(moeda))
            throw new ArgumentException("Moeda é obrigatória.", nameof(moeda));

        var moedaNormalizada = moeda.Trim().ToUpperInvariant();
        if (moedaNormalizada is not ("BRL" or "USD" or "EUR"))
            throw new ArgumentException("Moeda inválida. Use BRL, USD ou EUR.", nameof(moeda));

        Quantidade = quantidade;
        PrecoUnitario = precoUnitario;
        Moeda = moedaNormalizada;
    }
}
