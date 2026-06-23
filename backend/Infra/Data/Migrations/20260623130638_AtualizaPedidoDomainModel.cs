using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaPedidoDomainModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PedidoItem_Carnes_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropForeignKey(
                name: "FK_PedidoItem_Pedidos_PedidoId",
                table: "PedidoItem");

            migrationBuilder.DropIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropTable(
                name: "PedidoItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_Compradores_CompradorId",
                table: "Pedidos");

            migrationBuilder.DropIndex(
                name: "IX_Pedidos_CompradorId",
                table: "Pedidos");

            migrationBuilder.DropTable(
                name: "Pedidos");

            migrationBuilder.CreateTable(
                name: "Pedidos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataPedido = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CompradorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pedidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pedidos_Compradores_CompradorId",
                        column: x => x.CompradorId,
                        principalTable: "Compradores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PedidoItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PedidoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CarneId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantidade = table.Column<decimal>(type: "decimal(10,3)", precision: 10, scale: 3, nullable: false),
                    PrecoUnitario = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PedidoItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PedidoItem_Carnes_CarneId",
                        column: x => x.CarneId,
                        principalTable: "Carnes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PedidoItem_Pedidos_PedidoId",
                        column: x => x.PedidoId,
                        principalTable: "Pedidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_CompradorId",
                table: "Pedidos",
                column: "CompradorId");

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem",
                column: "CarneId");

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem",
                columns: new[] { "PedidoId", "CarneId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PedidoItem");

            migrationBuilder.DropTable(
                name: "Pedidos");

            migrationBuilder.CreateTable(
                name: "Pedidos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompradorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataPedido = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pedidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pedidos_Compradores_CompradorId",
                        column: x => x.CompradorId,
                        principalTable: "Compradores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PedidoItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CarneId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PedidoId = table.Column<int>(type: "int", nullable: false),
                    PrecoUnitario = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    QuantidadeKg = table.Column<decimal>(type: "decimal(10,3)", precision: 10, scale: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PedidoItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PedidoItem_Carnes_CarneId",
                        column: x => x.CarneId,
                        principalTable: "Carnes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PedidoItem_Pedidos_PedidoId",
                        column: x => x.PedidoId,
                        principalTable: "Pedidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_CompradorId",
                table: "Pedidos",
                column: "CompradorId");

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem",
                column: "CarneId");

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem",
                columns: new[] { "PedidoId", "CarneId" },
                unique: true);
        }
    }
}
