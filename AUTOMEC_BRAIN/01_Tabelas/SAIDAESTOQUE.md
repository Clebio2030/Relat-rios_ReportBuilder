# 📦 Tabela: SAIDAESTOQUE

A tabela `SAIDAESTOQUE` é a tabela central de movimentos de saída de mercadorias no ERP Automec. Nela residem todos os pedidos de venda, orçamentos, vendas finalizadas e devoluções/trocas de mercadorias.

## 🔑 Chave Primária
* `(NRPEDIDO, IDEMPRESA)` — Chave composta pelo número do pedido e filial.

## 📌 Principais Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `NRPEDIDO` | `INTEGER` | Identificador único do pedido dentro da empresa |
| `IDEMPRESA` | `INTEGER` | Código da empresa filial (FK para [[CONFIGURACAO]]) |
| `DTSAIDA` | `TIMESTAMP` | Data em que a saída foi realizada |
| `HORAPED` | `TIMESTAMP` | Horário de início/registro do pedido |
| `HORALOG` | `TIMESTAMP` | Timestamp da última atualização no sistema |
| `CDCLIENTE` | `INTEGER` | Código do cliente |
| `CLIENTE` | `VARCHAR(100)` | Nome/Razão social do cliente |
| `CPFCNPJ` | `VARCHAR(15)` | CPF ou CNPJ do destinatário |
| `VLTOTAL` | `DOUBLE PRECISION`| Valor líquido final do pedido (negativo em trocas) |
| `SUBTOTAL` | `DOUBLE PRECISION`| Valor bruto antes de descontos |
| `DESCONTO` | `DOUBLE PRECISION`| Valor monetário do desconto concedido |
| `STATUS` | `INTEGER` | Código de ciclo de vida do pedido (ver [[STATUS_SAIDAESTOQUE]]) |
| `NUMCUPOM` | `INTEGER` | -1 quando emitido cupom/NFC-e fiscal, NULL quando não emitido |
| `CHAVE_NFCE` | `VARCHAR(60)` | Chave de 44 dígitos da NFC-e autorizada na SEFAZ |
| `NRORCAMENTO` | `INTEGER` | Número do pedido de referência ou orçamento de origem |
| `CDVENDEDOR` | `INTEGER` | Código do vendedor responsável |
| `OBS` | `VARCHAR(255)` | Observações gerais do pedido |

## 🔗 Relações Neurais (Links)
* ➡️ Gera parcelas financeiras em [[CTARECEBER_PROV]] via `NRPEDIDO` e `IDEMPRESA`.
* ➡️ Associa-se com a empresa em [[CONFIGURACAO]] via `IDEMPRESA`.
* ➡️ Liga-se com documento fiscal em [[NOTAFISCAL]] via `NRPEDIDO` e `IDEMPRESA`.
* ➡️ Seu campo `STATUS` define se é [[DIFERENCA_PEDIDO_VS_TROCA]] (`STATUS = 40` troca vs `STATUS = 1` pedido).
* ➡️ Base da view [[NAO_EMITIDO_PEDIDOS]].

