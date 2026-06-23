using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaCarneDomainModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PedidoItem_Carnes_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropColumn(
                name: "CarneId",
                table: "PedidoItem");

            migrationBuilder.DropTable(
                name: "Carnes");

            migrationBuilder.CreateTable(
                name: "Carnes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PrecoKg = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carnes", x => x.Id);
                });

            migrationBuilder.AddColumn<Guid>(
                name: "CarneId",
                table: "PedidoItem",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.Empty);

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem",
                column: "CarneId");

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem",
                columns: new[] { "PedidoId", "CarneId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PedidoItem_Carnes_CarneId",
                table: "PedidoItem",
                column: "CarneId",
                principalTable: "Carnes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PedidoItem_Carnes_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem");

            migrationBuilder.DropColumn(
                name: "CarneId",
                table: "PedidoItem");

            migrationBuilder.DropTable(
                name: "Carnes");

            migrationBuilder.CreateTable(
                name: "Carnes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PrecoKg = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carnes", x => x.Id);
                });

            migrationBuilder.AddColumn<int>(
                name: "CarneId",
                table: "PedidoItem",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_CarneId",
                table: "PedidoItem",
                column: "CarneId");

            migrationBuilder.CreateIndex(
                name: "IX_PedidoItem_PedidoId_CarneId",
                table: "PedidoItem",
                columns: new[] { "PedidoId", "CarneId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PedidoItem_Carnes_CarneId",
                table: "PedidoItem",
                column: "CarneId",
                principalTable: "Carnes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
