/*
================================================================================
  Sistema de Gestão de Carnes e Pedidos
  Banco de Dados: SQL Server
  Script: Criação do banco, tabelas, relacionamentos e dados iniciais
================================================================================
  Tabelas:
    - Carnes       : cadastro de tipos de carne
    - Compradores  : clientes (endereço com cidade e estado)
    - Pedidos      : pedidos realizados
    - PedidoItem   : itens do pedido (relacionamento Pedido x Carne)
================================================================================
*/

-- ----------------------------------------------------------------------------
-- 1. Criação do banco de dados
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'SistemaPedidosCarnes')
BEGIN
    CREATE DATABASE [SistemaPedidosCarnes];
END
GO

USE [SistemaPedidosCarnes];
GO

-- ----------------------------------------------------------------------------
-- 2. Remoção de tabelas (ordem respeitando dependências de FK)
--    Execute apenas se precisar recriar o banco do zero.
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'[dbo].[PedidoItem]', N'U') IS NOT NULL DROP TABLE [dbo].[PedidoItem];
IF OBJECT_ID(N'[dbo].[Pedidos]', N'U') IS NOT NULL DROP TABLE [dbo].[Pedidos];
IF OBJECT_ID(N'[dbo].[Compradores]', N'U') IS NOT NULL DROP TABLE [dbo].[Compradores];
IF OBJECT_ID(N'[dbo].[Carnes]', N'U') IS NOT NULL DROP TABLE [dbo].[Carnes];
GO

-- ----------------------------------------------------------------------------
-- 3. Criação das tabelas
-- ----------------------------------------------------------------------------

CREATE TABLE [dbo].[Carnes]
(
    [Id]       UNIQUEIDENTIFIER NOT NULL,
    [Nome]     NVARCHAR(100)    NOT NULL,
    [Tipo]     NVARCHAR(50)     NOT NULL,
    [PrecoKg]  DECIMAL(10, 2)   NOT NULL,
    [Ativo]    BIT              NOT NULL,
    CONSTRAINT [PK_Carnes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [dbo].[Compradores]
(
    [Id]        UNIQUEIDENTIFIER NOT NULL,
    [Nome]      NVARCHAR(100)    NOT NULL,
    [Email]     NVARCHAR(150)    NOT NULL,
    [Telefone]  NVARCHAR(20)     NOT NULL,
    [Endereco]  NVARCHAR(200)    NOT NULL,
    CONSTRAINT [PK_Compradores] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [dbo].[Pedidos]
(
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [DataPedido]   DATETIME2        NOT NULL,
    [Status]       NVARCHAR(30)     NOT NULL,
    [CompradorId]  UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [PK_Pedidos] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [dbo].[PedidoItem]
(
    [Id]            UNIQUEIDENTIFIER NOT NULL,
    [PedidoId]      UNIQUEIDENTIFIER NOT NULL,
    [CarneId]       UNIQUEIDENTIFIER NOT NULL,
    [Quantidade]    DECIMAL(10, 3)   NOT NULL,
    [PrecoUnitario] DECIMAL(10, 2)   NOT NULL,
    CONSTRAINT [PK_PedidoItem] PRIMARY KEY ([Id])
);
GO

-- ----------------------------------------------------------------------------
-- 4. Chaves estrangeiras e índices
-- ----------------------------------------------------------------------------

ALTER TABLE [dbo].[Pedidos]
    ADD CONSTRAINT [FK_Pedidos_Compradores_CompradorId]
        FOREIGN KEY ([CompradorId]) REFERENCES [dbo].[Compradores] ([Id])
        ON DELETE NO ACTION;
GO

CREATE INDEX [IX_Pedidos_CompradorId] ON [dbo].[Pedidos] ([CompradorId]);
GO

ALTER TABLE [dbo].[PedidoItem]
    ADD CONSTRAINT [FK_PedidoItem_Pedidos_PedidoId]
        FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos] ([Id])
        ON DELETE CASCADE;
GO

ALTER TABLE [dbo].[PedidoItem]
    ADD CONSTRAINT [FK_PedidoItem_Carnes_CarneId]
        FOREIGN KEY ([CarneId]) REFERENCES [dbo].[Carnes] ([Id])
        ON DELETE NO ACTION;
GO

CREATE INDEX [IX_PedidoItem_CarneId] ON [dbo].[PedidoItem] ([CarneId]);
GO

CREATE UNIQUE INDEX [IX_PedidoItem_PedidoId_CarneId]
    ON [dbo].[PedidoItem] ([PedidoId], [CarneId]);
GO

-- ----------------------------------------------------------------------------
-- 5. Dados iniciais (seeds)
-- ----------------------------------------------------------------------------

-- Carnes
INSERT INTO [dbo].[Carnes] ([Id], [Nome], [Tipo], [PrecoKg], [Ativo])
VALUES
    ('11111111-1111-1111-1111-111111111101', N'Picanha',        N'Bovina', 89.90, 1),
    ('11111111-1111-1111-1111-111111111102', N'Alcatra',        N'Bovina', 54.50, 1),
    ('11111111-1111-1111-1111-111111111103', N'Fraldinha',      N'Bovina', 48.90, 1),
    ('11111111-1111-1111-1111-111111111104', N'Costela Suína',  N'Suína',  32.90, 1),
    ('11111111-1111-1111-1111-111111111105', N'Cupim',          N'Bovina', 42.00, 1);
GO

-- Compradores (endereços com cidade e estado)
INSERT INTO [dbo].[Compradores] ([Id], [Nome], [Email], [Telefone], [Endereco])
VALUES
    ('22222222-2222-2222-2222-222222222201', N'João Silva',
     N'joao.silva@email.com', N'(11) 98765-4321',
     N'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'),

    ('22222222-2222-2222-2222-222222222202', N'Maria Oliveira',
     N'maria.oliveira@email.com', N'(21) 99876-5432',
     N'Rua das Laranjeiras, 250 - Laranjeiras, Rio de Janeiro - RJ'),

    ('22222222-2222-2222-2222-222222222203', N'Carlos Souza',
     N'carlos.souza@email.com', N'(31) 97654-3210',
     N'Av. Afonso Pena, 1500 - Centro, Belo Horizonte - MG'),

    ('22222222-2222-2222-2222-222222222204', N'Ana Pereira',
     N'ana.pereira@email.com', N'(41) 96543-2109',
     N'Rua XV de Novembro, 300 - Centro, Curitiba - PR'),

    ('22222222-2222-2222-2222-222222222205', N'Pedro Santos',
     N'pedro.santos@email.com', N'(51) 95432-1098',
     N'Av. Borges de Medeiros, 500 - Centro Histórico, Porto Alegre - RS');
GO

-- Pedidos
INSERT INTO [dbo].[Pedidos] ([Id], [DataPedido], [Status], [CompradorId])
VALUES
    ('33333333-3333-3333-3333-333333333301', '2026-06-20 10:30:00', N'Confirmado', '22222222-2222-2222-2222-222222222201'),
    ('33333333-3333-3333-3333-333333333302', '2026-06-21 14:15:00', N'Pendente',   '22222222-2222-2222-2222-222222222202'),
    ('33333333-3333-3333-3333-333333333303', '2026-06-22 09:00:00', N'Confirmado', '22222222-2222-2222-2222-222222222203'),
    ('33333333-3333-3333-3333-333333333304', '2026-06-22 16:45:00', N'Cancelado',  '22222222-2222-2222-2222-222222222204');
GO

-- Itens dos pedidos
INSERT INTO [dbo].[PedidoItem] ([Id], [PedidoId], [CarneId], [Quantidade], [PrecoUnitario])
VALUES
    -- Pedido 1: João (São Paulo - SP)
    ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301',
     '11111111-1111-1111-1111-111111111101', 2.500, 89.90),
    ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301',
     '11111111-1111-1111-1111-111111111102', 1.000, 54.50),

    -- Pedido 2: Maria (Rio de Janeiro - RJ)
    ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333302',
     '11111111-1111-1111-1111-111111111103', 3.000, 48.90),

    -- Pedido 3: Carlos (Belo Horizonte - MG)
    ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333303',
     '11111111-1111-1111-1111-111111111105', 2.000, 42.00),
    ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333303',
     '11111111-1111-1111-1111-111111111104', 1.500, 32.90),

    -- Pedido 4: Ana (Curitiba - PR) - cancelado
    ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333304',
     '11111111-1111-1111-1111-111111111101', 1.000, 89.90);
GO

-- ----------------------------------------------------------------------------
-- 6. Consultas de verificação (opcional)
-- ----------------------------------------------------------------------------
/*
SELECT * FROM [dbo].[Carnes];
SELECT * FROM [dbo].[Compradores];
SELECT * FROM [dbo].[Pedidos];
SELECT * FROM [dbo].[PedidoItem];

SELECT
    p.Id AS PedidoId,
    p.Status,
    c.Nome AS Comprador,
    c.Endereco,
    ca.Nome AS Carne,
    pi.Quantidade,
    pi.PrecoUnitario,
    (pi.Quantidade * pi.PrecoUnitario) AS Subtotal
FROM [dbo].[Pedidos] p
INNER JOIN [dbo].[Compradores] c ON c.Id = p.CompradorId
INNER JOIN [dbo].[PedidoItem] pi ON pi.PedidoId = p.Id
INNER JOIN [dbo].[Carnes] ca ON ca.Id = pi.CarneId
ORDER BY p.DataPedido, c.Nome;
*/

PRINT N'Banco SistemaPedidosCarnes criado e populado com sucesso.';
GO
