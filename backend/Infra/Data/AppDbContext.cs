using Entities.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Infra.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Carne> Carnes => Set<Carne>();
    public DbSet<Comprador> Compradores => Set<Comprador>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Carne>(entity =>
        {
            entity.Property(c => c.Nome).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Tipo).HasMaxLength(50).IsRequired();
            entity.Property(c => c.PrecoKg).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Comprador>(entity =>
        {
            entity.Property(c => c.Nome).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Email).HasMaxLength(150).IsRequired();
            entity.Property(c => c.Telefone).HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.Property(p => p.Status).HasMaxLength(30).IsRequired();

            entity.HasOne(p => p.Comprador)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(p => p.CompradorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PedidoItem>(entity =>
        {
            entity.Property(pi => pi.QuantidadeKg).HasPrecision(10, 3);
            entity.Property(pi => pi.PrecoUnitario).HasPrecision(10, 2);

            entity.HasOne(pi => pi.Pedido)
                .WithMany(p => p.Itens)
                .HasForeignKey(pi => pi.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pi => pi.Carne)
                .WithMany(c => c.PedidoItens)
                .HasForeignKey(pi => pi.CarneId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(pi => new { pi.PedidoId, pi.CarneId }).IsUnique();
        });
    }
}
