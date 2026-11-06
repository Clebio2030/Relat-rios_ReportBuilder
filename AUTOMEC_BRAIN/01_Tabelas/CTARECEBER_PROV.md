# 💳 Tabela: CTARECEBER_PROV

A tabela `CTARECEBER_PROV` armazena o contas a receber provisório gerado a partir de cada pedido no momento da sua digitação ou finalização no PDV/balcão.

## 🔑 Chave Primária
* `CONTROLE` (`INTEGER`) — Identificador sequencial de cada parcela financeira provisória.

## 📌 Principais Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `CONTROLE` | `INTEGER` | ID primário da parcela |
| `IDEMPRESA` | `INTEGER` | Código da filial (FK para [[CONFIGURACAO]]) |
| `NRPEDIDO` | `INTEGER` | Número do pedido gerador (FK para [[SAIDAESTOQUE]]) |
| `NRDOC` | `VARCHAR(15)` | Número do documento de cobrança provisório (normalmente espelha o `NRPEDIDO`) |
| `PARCELA` | `INTEGER` | Número da parcela (1, 2, 3...) |
| `VALOR` | `DOUBLE PRECISION`| Valor desta parcela (negativo quando devolução de vale) |
| `DTVENC` | `TIMESTAMP` | Data de vencimento da parcela |
| `DTMOV` | `TIMESTAMP` | Data de movimentação / registro financeiro |
| `CODPAGTO` | `INTEGER` | Código da forma de recebimento (FK para [[RECEBTO]]) |
| `TPPAGTO` | `INTEGER` | Tipo complementar do pagamento |
| `CAIXA` | `INTEGER` | Número do caixa físico onde a operação foi registrada |
| `ORIGEM` | `VARCHAR(150)`| Descritivo da origem (ex: `'Venda'`) |
| `CDCLIENTE` | `INTEGER` | Código do cliente titular da parcela |

## 💡 Observações de Negócio
1. **Relação 1 para N com [[SAIDAESTOQUE]]:** Um único pedido pode ter múltiplos registros nesta tabela se o cliente dividir a conta (ex: parte no Dinheiro e parte no PIX, ou parcelamento em cartão de crédito).
2. **Forma de Pagamento:** O campo `CODPAGTO` faz join com `CDRECEBTO` na tabela [[RECEBTO]].
3. **Valores Negativos:** Em operações de troca/devolução ([[DIFERENCA_PEDIDO_VS_TROCA]]), o valor pode ser negativo para registrar o estorno ou devolução do vale.

## 🔗 Relações Neurais (Links)
* ⬅️ Recebe o pedido de [[SAIDAESTOQUE]] (`NRPEDIDO, IDEMPRESA`).
* ➡️ Puxa o nome da forma de pagamento de [[RECEBTO]] (`CODPAGTO = CDRECEBTO`).
* ➡️ Pertence à empresa em [[CONFIGURACAO]] (`IDEMPRESA`).
* ➡️ Alimentador do cálculo de [[FORMAS_DE_PAGAMENTO_E_DINHEIRO]].

