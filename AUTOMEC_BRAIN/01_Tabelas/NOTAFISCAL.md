# 🧾 Tabela: NOTAFISCAL

A tabela `NOTAFISCAL` armazena os documentos fiscais eletrônicos (NF-e, NFC-e e Cupom Fiscal Eletrônico) gerados e autorizados no sistema.

## 🔑 Chave Primária
* `(NRDOC, IDEMPRESA)` — Chave composta pelo número do documento fiscal e ID da filial.

## 📌 Principais Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `NRDOC` | `VARCHAR(15)` | Número da nota fiscal emitida (ex: `'000002088'`, `'000094684CFE'`) |
| `IDEMPRESA` | `INTEGER` | Empresa emissora (FK para [[CONFIGURACAO]]) |
| `NRPEDIDO` | `INTEGER` | Número do pedido gerador (FK para [[SAIDAESTOQUE]]) |
| `DTEMISS` | `TIMESTAMP` | Data da autorização / emissão fiscal |
| `VALOR` | `DOUBLE PRECISION`| Valor total da nota |
| `NFE_EMITIDA` | `INTEGER` | `-1` se emitida com sucesso, `0` se não emitida |
| `NFE_CANCELADA` | `INTEGER` | `-1` se cancelada na SEFAZ, `0` se ativa |
| `CHAVE` | `VARCHAR(60)` | Chave de acesso de 44 dígitos da NF-e |
| `DEVOLUCAO` | `INTEGER` | `-1` se for nota de devolução, `0` se venda normal |

## 💡 Como verificar se um pedido NÃO tem Nota Fiscal:
No ERP Automec, para saber se um pedido de [[SAIDAESTOQUE]] está sem documento fiscal:
```sql
LEFT JOIN NOTAFISCAL NF 
    ON NF.NRPEDIDO = SE.NRPEDIDO 
   AND NF.IDEMPRESA = SE.IDEMPRESA 
   AND COALESCE(NF.NFE_CANCELADA, 0) = 0
WHERE NF.NRDOC IS NULL
```
Veja a explicação detalhada em [[EMISSAO_FISCAL_VS_NAO_EMITIDO]].

## 🔗 Relações Neurais (Links)
* ⬅️ Vincula-se ao pedido em [[SAIDAESTOQUE]] (`NRPEDIDO, IDEMPRESA`).
* ➡️ Define a emissão fiscal de [[NAO_EMITIDO_PEDIDOS]].

