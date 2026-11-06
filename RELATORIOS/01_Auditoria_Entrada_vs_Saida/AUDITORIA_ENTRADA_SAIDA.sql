-- ============================================================================
-- View: AUDITORIA_ENTRADA_SAIDA (Auditoria Acumulada Fiscal)
-- Banco: D:\Administracao\DB\ZEGRANDE\MIAUTOMEC.FDB (Firebird 5.0)
-- Objetivo: Identificar produtos onde o TOTAL ACUMULADO de saídas fiscais superou
--           o TOTAL ACUMULADO de entradas fiscais (eliminando distorções de virada de mês).
--
-- Regras de Negócio e Status:
--   1. ENTRADAS FISCAIS (ENTRPRODUTO + ENTRESTOQUE):
--      - Considera todas as notas de entrada ativas de compras (E.STATUS = 1).
--      - Ignora canceladas (E.STATUS = 2).
--      - Agrupa por Empresa, Estoque Físico (Depósito) e Produto.
--   2. SAÍDAS FISCAIS (SAIDAPRODUTO + SAIDAESTOQUE):
--      - Considera estritamente documentos fiscais emitidos:
--        * SE.STATUS = 3  (NotaFiscal Emitida / NFC-e / NF-e)
--        * SE.STATUS = 43 (Troca com NFE)
--      - Ignora vendas sem documento fiscal (STATUS = 1, 40) e cancelados (2, 42).
--   3. FILTRO DE EXCESSO FISCAL REAL:
--      - WHERE V.QTD_VENDIDA > COALESCE(E.QTD_ENTRADA, 0)
--      - Garante que só aparecem produtos onde as vendas fiscais reais ultrapassaram
--        todo o volume de notas de compra já recebidas naquele estoque.
-- ============================================================================

CREATE OR ALTER VIEW AUDITORIA_ENTRADA_SAIDA (
    IDEMPRESA,
    NOMEEMPRESA,
    CDDEPOSITO,
    DEPOSITO,
    CDPRODUTO,
    DESCRICAO,
    UNID,
    QTD_ENTRADA,
    QTD_VENDIDA,
    EXCESSO_VENDIDO,
    ESTOQUE_ATUAL,
    DT_PRIMEIRA_ENTRADA,
    DT_ULTIMA_ENTRADA,
    DT_PRIMEIRA_VENDA,
    DT_ULTIMA_VENDA
) AS
WITH ENTRADAS AS (
    SELECT 
        E.IDEMPRESA,
        EP.CDDEPOSITO,
        EP.CDPRODUTO,
        MAX(EP.DESCRICAO) AS DESCRICAO,
        MAX(EP.UNID) AS UNID,
        SUM(EP.QTDE) AS QTD_ENTRADA,
        MIN(E.DTENTRADA) AS DT_PRIMEIRA_ENTRADA,
        MAX(E.DTENTRADA) AS DT_ULTIMA_ENTRADA
    FROM ENTRPRODUTO EP
    JOIN ENTRESTOQUE E ON E.IDENTRADA = EP.IDENTRADA AND E.IDEMPRESA = EP.IDEMPRESA
    WHERE E.STATUS = 1 -- Entrada de compra confirmada
    GROUP BY E.IDEMPRESA, EP.CDDEPOSITO, EP.CDPRODUTO
),
VENDAS AS (
    SELECT 
        SE.IDEMPRESA,
        SP.CDDEPOSITO,
        SP.CDPRODUTO,
        MAX(SP.DESCRICAO) AS DESCRICAO,
        MAX(SP.UNID) AS UNID,
        SUM(SP.QTDPRODUTO) AS QTD_VENDIDA,
        MIN(SE.DTSAIDA) AS DT_PRIMEIRA_VENDA,
        MAX(SE.DTSAIDA) AS DT_ULTIMA_VENDA
    FROM SAIDAPRODUTO SP
    JOIN SAIDAESTOQUE SE ON SE.NRPEDIDO = SP.NRPEDIDO AND SE.IDEMPRESA = SP.IDEMPRESA
    WHERE SE.STATUS IN (3, 43) -- Estritamente Documento Fiscal (3 = NotaFiscal Emitida, 43 = Troca com NFE)
      AND (SP.STATUSSE IS NULL OR SP.STATUSSE <> 9) -- Regra Crítica: Ignora itens excluídos/reeditados
    GROUP BY SE.IDEMPRESA, SP.CDDEPOSITO, SP.CDPRODUTO
)
SELECT 
    V.IDEMPRESA,
    CF.NOMEEMPRESA,
    V.CDDEPOSITO,
    DEP.DEPOSITO,
    V.CDPRODUTO,
    V.DESCRICAO,
    V.UNID,
    COALESCE(E.QTD_ENTRADA, 0) AS QTD_ENTRADA,
    V.QTD_VENDIDA,
    (V.QTD_VENDIDA - COALESCE(E.QTD_ENTRADA, 0)) AS EXCESSO_VENDIDO,
    COALESCE(M.QTDEATUAL, 0) AS ESTOQUE_ATUAL,
    E.DT_PRIMEIRA_ENTRADA,
    E.DT_ULTIMA_ENTRADA,
    V.DT_PRIMEIRA_VENDA,
    V.DT_ULTIMA_VENDA
FROM VENDAS V
LEFT JOIN ENTRADAS E ON E.IDEMPRESA = V.IDEMPRESA 
                    AND E.CDDEPOSITO = V.CDDEPOSITO 
                    AND E.CDPRODUTO = V.CDPRODUTO
JOIN CONFIGURACAO CF ON CF.IDEMPRESA = V.IDEMPRESA
JOIN DEPOSITO DEP ON DEP.CDDEPOSITO = V.CDDEPOSITO
LEFT JOIN MOVIMENTO M ON M.CDDEPOSITO = V.CDDEPOSITO AND M.CDPRODUTO = V.CDPRODUTO
WHERE V.QTD_VENDIDA > COALESCE(E.QTD_ENTRADA, 0);
