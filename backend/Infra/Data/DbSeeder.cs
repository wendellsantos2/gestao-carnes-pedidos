using Entities.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Infra.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Carnes.AnyAsync())
            return;

        var carnes = new[]
        {
            new Carne("Picanha", "Bovina", 89.90m),
            new Carne("Alcatra", "Bovina", 54.50m),
            new Carne("Fraldinha", "Bovina", 48.90m),
            new Carne("Costela Suína", "Suína", 32.90m),
            new Carne("Cupim", "Bovina", 42.00m)
        };

        await context.Carnes.AddRangeAsync(carnes);

        var compradores = new[]
        {
            new Comprador(
                "João Silva",
                "joao.silva@email.com",
                "(11) 98765-4321",
                "Av. Paulista, 1000 - Bela Vista, São Paulo - SP"),
            new Comprador(
                "Maria Oliveira",
                "maria.oliveira@email.com",
                "(21) 99876-5432",
                "Rua das Laranjeiras, 250 - Laranjeiras, Rio de Janeiro - RJ"),
            new Comprador(
                "Carlos Souza",
                "carlos.souza@email.com",
                "(31) 97654-3210",
                "Av. Afonso Pena, 1500 - Centro, Belo Horizonte - MG"),
            new Comprador(
                "Ana Pereira",
                "ana.pereira@email.com",
                "(41) 96543-2109",
                "Rua XV de Novembro, 300 - Centro, Curitiba - PR"),
            new Comprador(
                "Pedro Santos",
                "pedro.santos@email.com",
                "(51) 95432-1098",
                "Av. Borges de Medeiros, 500 - Centro Histórico, Porto Alegre - RS")
        };

        await context.Compradores.AddRangeAsync(compradores);
        await context.SaveChangesAsync();

        var picanha = carnes[0];
        var alcatra = carnes[1];
        var fraldinha = carnes[2];
        var costela = carnes[3];
        var cupim = carnes[4];

        var joao = compradores[0];
        var maria = compradores[1];
        var carlos = compradores[2];
        var ana = compradores[3];

        var pedido1 = new Pedido(joao.Id, new DateTime(2026, 6, 20, 10, 30, 0, DateTimeKind.Utc));
        pedido1.AdicionarItem(picanha.Id, 2.5m, picanha.PrecoKg);
        pedido1.AdicionarItem(alcatra.Id, 1.0m, alcatra.PrecoKg);
        pedido1.AtualizarStatus(PedidoStatus.Confirmado);

        var pedido2 = new Pedido(maria.Id, new DateTime(2026, 6, 21, 14, 15, 0, DateTimeKind.Utc));
        pedido2.AdicionarItem(fraldinha.Id, 3.0m, fraldinha.PrecoKg);

        var pedido3 = new Pedido(carlos.Id, new DateTime(2026, 6, 22, 9, 0, 0, DateTimeKind.Utc));
        pedido3.AdicionarItem(cupim.Id, 2.0m, cupim.PrecoKg);
        pedido3.AdicionarItem(costela.Id, 1.5m, costela.PrecoKg);
        pedido3.AtualizarStatus(PedidoStatus.Confirmado);

        var pedido4 = new Pedido(ana.Id, new DateTime(2026, 6, 22, 16, 45, 0, DateTimeKind.Utc));
        pedido4.AdicionarItem(picanha.Id, 1.0m, picanha.PrecoKg);
        pedido4.AtualizarStatus(PedidoStatus.Cancelado);

        await context.Pedidos.AddRangeAsync(pedido1, pedido2, pedido3, pedido4);
        await context.SaveChangesAsync();
    }
}
