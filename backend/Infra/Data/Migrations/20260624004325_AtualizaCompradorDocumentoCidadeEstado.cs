using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaCompradorDocumentoCidadeEstado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Documento",
                table: "Compradores",
                type: "nvarchar(14)",
                maxLength: 14,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cidade",
                table: "Compradores",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Compradores",
                type: "nvarchar(2)",
                maxLength: 2,
                nullable: true);

            migrationBuilder.Sql(@"
UPDATE [Compradores] SET
    [Estado] = LTRIM(RTRIM(RIGHT([Endereco], 2))),
    [Cidade] = CASE
        WHEN [Endereco] LIKE N'%São Paulo%' THEN N'São Paulo'
        WHEN [Endereco] LIKE N'%Rio de Janeiro%' THEN N'Rio de Janeiro'
        WHEN [Endereco] LIKE N'%Belo Horizonte%' THEN N'Belo Horizonte'
        WHEN [Endereco] LIKE N'%Curitiba%' THEN N'Curitiba'
        WHEN [Endereco] LIKE N'%Porto Alegre%' THEN N'Porto Alegre'
        ELSE N'São Paulo'
    END,
    [Documento] = CASE [Nome]
        WHEN N'João Silva' THEN '52998224725'
        WHEN N'Maria Oliveira' THEN '39053344705'
        WHEN N'Carlos Souza' THEN '15350946056'
        WHEN N'Ana Pereira' THEN '23100299900'
        WHEN N'Pedro Santos' THEN '86734799073'
        ELSE RIGHT('00000000000' + CAST(ABS(CHECKSUM([Id])) % 100000000000 AS VARCHAR(11)), 11)
    END
WHERE [Documento] IS NULL;
");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Compradores");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Compradores");

            migrationBuilder.DropColumn(
                name: "Endereco",
                table: "Compradores");

            migrationBuilder.AlterColumn<string>(
                name: "Documento",
                table: "Compradores",
                type: "nvarchar(14)",
                maxLength: 14,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(14)",
                oldMaxLength: 14,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Cidade",
                table: "Compradores",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "Compradores",
                type: "nvarchar(2)",
                maxLength: 2,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(2)",
                oldMaxLength: 2,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Compradores_Documento",
                table: "Compradores",
                column: "Documento",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Compradores_Documento",
                table: "Compradores");

            migrationBuilder.DropColumn(
                name: "Documento",
                table: "Compradores");

            migrationBuilder.DropColumn(
                name: "Cidade",
                table: "Compradores");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Compradores");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Compradores",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Endereco",
                table: "Compradores",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Compradores",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }
    }
}
