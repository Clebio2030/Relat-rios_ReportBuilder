# 🔍 View: NAO_EMITIDO_PEDIDOS

A view `NAO_EMITIDO_PEDIDOS` consolida pedidos de venda e trocas que **não possuem documento fiscal emitido E NÃO foram pagos em dinheiro** (ex: PIX, Cartão, Vale, A Receber).

* **View SQL:** [`NAO_EMITIDO_PEDIDOS.sql`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/02_Vendas_Sem_Documento_Fiscal/NAO_EMITIDO_PEDIDOS.sql)
* **Template Visual ReportBuilder:** [`SemFiscal.rtm`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/02_Vendas_Sem_Documento_Fiscal/SemFiscal.rtm)

---

## 🎯 Regras de Negócio e Agrupamento:
1. **1 Linha por Pedido:** Agrupa por `SE.NRPEDIDO` via `GROUP BY`. Pedidos parcelados em várias vezes no cartão (ex: Pedido 2715 em 6x, Pedido 3118 em 4x, Pedido 2701 em 3x) **não repetem linhas** no relatório!
   * `PARCELA` = Total de parcelas (`COUNT(CP.CONTROLE)`).
   * `VALOR_PARCELA` = Soma do valor das parcelas (`SUM(CP.VALOR)`).
   * `FORMA_PAGTO` = Concatenação com `LIST(DISTINCT TRIM(R.RECEBTO), ', ')`.
2. **Exclusão de Cancelados:** `SE.STATUS NOT IN (2, 42)`.
3. **Ausência de Documento Fiscal Ativo:** `NF.NRDOC IS NULL` (as opções de `NUMCUPOM` e `CHAVE_NFCE` foram removidas do WHERE para capturar pedidos com notas canceladas).
4. **Exclusão de Dinheiro:** `UPPER(R.RECEBTO) NOT LIKE '%DINHEIRO%' AND CP.CODPAGTO NOT IN (1, 10)`.

---

## 🏛️ DDL da View Agrupada (Firebird 5.0)

```sql
CREATE OR ALTER VIEW NAO_EMITIDO_PEDIDOS (
    IDEMPRESA,
    NOMEEMPRESA,
    NRPEDIDO,
    DTSAIDA,
    HORAPED,
    CDCLIENTE,
    CLIENTE,
    CPFCNPJ,
    VLTOTAL_PEDIDO,
    SUBTOTAL_PEDIDO,
    DESCONTO_PEDIDO,
    STATUS_PEDIDO,
    TIPO_OPERACAO,
    CDVENDEDOR,
    NUMCUPOM,
    CHAVE_NFCE,
    OBS_PEDIDO,
    CONTROLE_CP,
    NRDOC_CP,
    PARCELA,
    VALOR_PARCELA,
    DTVENC,
    DTMOV,
    CODPAGTO,
    TPPAGTO,
    CAIXA,
    ORIGEM,
    FORMA_PAGTO,
    MEIO_PAGTO
) AS
SELECT 
    SE.IDEMPRESA,
    CF.NOMEEMPRESA,
    SE.NRPEDIDO,
    SE.DTSAIDA,
    SE.HORAPED,
    SE.CDCLIENTE,
    SE.CLIENTE,
    SE.CPFCNPJ,
    SE.VLTOTAL,
    SE.SUBTOTAL,
    SE.DESCONTO,
    SE.STATUS,
    CASE 
        WHEN SE.STATUS = 40 THEN 'TROCA'
        WHEN SE.STATUS = 0 THEN 'PEDIDO EM ABERTO'
        WHEN SE.STATUS IN (1, 3) THEN 'PEDIDO'
        ELSE 'OUTROS'
    END,
    SE.CDVENDEDOR,
    SE.NUMCUPOM,
    SE.CHAVE_NFCE,
    CAST(SE.OBS AS VARCHAR(255)),
    MAX(CP.CONTROLE),
    MAX(CP.NRDOC),
    COUNT(CP.CONTROLE),
    SUM(CP.VALOR),
    MAX(CP.DTVENC),
    MAX(CP.DTMOV),
    MIN(CP.CODPAGTO),
    MAX(CP.TPPAGTO),
    MAX(CP.CAIXA),
    MAX(CP.ORIGEM),
    CAST(LIST(DISTINCT TRIM(COALESCE(R.RECEBTO, '')), ', ') AS VARCHAR(255)),
    CAST(LIST(DISTINCT TRIM(COALESCE(R.MEIO_PAGTO, '')), ', ') AS VARCHAR(100))
FROM SAIDAESTOQUE SE
JOIN CONFIGURACAO CF 
    ON (CF.IDEMPRESA = SE.IDEMPRESA)
JOIN CTARECEBER_PROV CP 
    ON (CP.NRPEDIDO = SE.NRPEDIDO) 
   AND (CP.IDEMPRESA = SE.IDEMPRESA)
LEFT JOIN RECEBTO R 
    ON (R.CDRECEBTO = CP.CODPAGTO)
LEFT JOIN NOTAFISCAL NF 
    ON (NF.NRPEDIDO = SE.NRPEDIDO) 
   AND (NF.IDEMPRESA = SE.IDEMPRESA)
   AND (COALESCE(NF.NFE_CANCELADA, 0) = 0)
   AND (COALESCE(NF.STATUS, 0) <> 9)
WHERE SE.STATUS NOT IN (2, 42)
  AND (NF.NRDOC IS NULL)
  AND (UPPER(COALESCE(R.RECEBTO, '')) NOT LIKE '%DINHEIRO%')
  AND (CP.CODPAGTO NOT IN (1, 10))
GROUP BY 
    SE.IDEMPRESA,
    CF.NOMEEMPRESA,
    SE.NRPEDIDO,
    SE.DTSAIDA,
    SE.HORAPED,
    SE.CDCLIENTE,
    SE.CLIENTE,
    SE.CPFCNPJ,
    SE.VLTOTAL,
    SE.SUBTOTAL,
    SE.DESCONTO,
    SE.STATUS,
    SE.CDVENDEDOR,
    SE.NUMCUPOM,
    SE.CHAVE_NFCE,
    CAST(SE.OBS AS VARCHAR(255));
