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
            entity.Property(c => c.Ativo).IsRequired();
        });

        modelBuilder.Entity<Comprador>(entity =>
        {
            entity.Property(c => c.Nome).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Email).HasMaxLength(150).IsRequired();
            entity.Property(c => c.Telefone).HasMaxLength(20).IsRequired();
            entity.Property(c => c.Endereco).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.Property(p => p.Status)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            entity.HasOne(p => p.Comprador)
                .WithMany()
                .HasForeignKey(p => p.CompradorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Navigation(p => p.Items)
                .HasField("_itens")
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        modelBuilder.Entity<PedidoItem>(entity =>
        {
            entity.Property(pi => pi.Quantidade).HasPrecision(10, 3);
            entity.Property(pi => pi.PrecoUnitario).HasPrecision(10, 2);
            entity.Ignore(pi => pi.Subtotal);

            entity.HasOne<Pedido>()
                .WithMany(p => p.Items)
                .HasForeignKey(pi => pi.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pi => pi.Carne)
                .WithMany()
                .HasForeignKey(pi => pi.CarneId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(pi => new { pi.PedidoId, pi.CarneId }).IsUnique();
        });
    }
}
