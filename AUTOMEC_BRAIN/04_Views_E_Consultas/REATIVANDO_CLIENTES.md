# View: REATIVANDO_CLIENTES

## 🎯 Objetivo
Identificar e cobrir **100% da base de clientes (50.457 cadastros)**, dividindo-os com precisão entre:
1. **Reativação de Compradores (33.621 clientes):** Possuem histórico de compras faturadas em `SAIDAESTOQUE`.
2. **Primeira Compra / Leads (16.836 clientes):** Cadastros puros ou orçamentos perdidos que **nunca compraram** (`STATUS_REATIVACAO = 'NUNCA COMPROU'`).

## ⚠️ Por que NÃO usar `CLIENTE.DTULTCOMPRA`?
A coluna `CLIENTE.DTULTCOMPRA` é falha no ERP Automec porque:
1. O único gatilho que a preenche é `TG_INSERT_SAIDAESTOQUE` (apenas no **INSERT**).
2. Não existe gatilho de `AFTER UPDATE` em `SAIDAESTOQUE`.
3. Quando um pedido é aberto com cliente genérico e depois associado ao cliente real, ou gerado a partir de um orçamento via atualização, a coluna no cadastro do cliente permanece `NULL` ou congelada na compra antiga.
4. No banco da Zé Grande, foram detectados:
   * **198 clientes** com vendas finalizadas e `DTULTCOMPRA IS NULL`.
   * **2.013 clientes** com `DTULTCOMPRA` desatualizado em relação a `MAX(SAIDAESTOQUE.DTSAIDA)`.
   * **15.921 cadastros** com `DTULTCOMPRA IS NULL` que nunca compraram (sendo 8.445 apenas orçamentos perdidos).

## 🛠️ Regras da View
* **Fonte da Verdade:** `SAIDAESTOQUE` agrupada por `CDCLIENTE`.
* **Filtro de Vendas:** Apenas pedidos com `STATUS IN (1, 3)` (Pedido e Emitido Fiscal). Exclui cancelados (2, 42), trocas (40) e em aberto (0).
* **Cliente Balcão:** Exclui o cliente genérico balcão (`CDCLIENTE <> 1`).
* **Último Pedido:** Obtido via Window Function `ROW_NUMBER() OVER (PARTITION BY CDCLIENTE ORDER BY DTSAIDA DESC, NRPEDIDO DESC)`.

## 📊 Faixas de Inatividade (`FAIXA_INATIVIDADE` e `STATUS_REATIVACAO`)
1. `01. ATE 30 DIAS (ATIVO)` -> `ATIVO`
2. `02. 31 A 60 DIAS (RECENTE)` -> `RECENTE`
3. `03. 61 A 90 DIAS (ALERTA)` -> `ALERTA`
4. `04. 91 A 180 DIAS (OURO)` -> `OURO` (Zona nobre para reativação antes da perda do cliente)
5. `05. 181 A 365 DIAS (FRIO)` -> `FRIO`
6. `06. MAIS DE 1 ANO (CRITICO)` -> `CRITICO`

## 🗂️ Campos Retornados
* **Cliente:** `CDCLIENTE`, `CLIENTE`, `RAZAO`, `CPFCNPJ`, `STATUS_CADASTRO`.
* **Contato:** `TELEFONE`, `CELULAR`, `TELEFONE2`, `EMAIL`.
* **Endereço:** `ENDERECO`, `NUMERO`, `BAIRRO`, `SUBBAIRRO`, `CIDADE`, `UF`, `CEP`.
* **Histórico de Compras:** `DTCADASTRO`, `DT_PRIMEIRA_COMPRA`, `DT_ULTIMA_COMPRA`, `DIAS_SEM_COMPRAR`, `FAIXA_INATIVIDADE`, `STATUS_REATIVACAO`.
* **Métricas Financeiras:** `TOTAL_PEDIDOS`, `VALOR_TOTAL_HISTORICO` (LTV), `TICKET_MEDIO`.
* **Última Compra:** `NRPEDIDO_ULTIMA_COMPRA`, `VALOR_ULTIMA_COMPRA`, `IDEMPRESA_ULTIMA_COMPRA`, `NOME_EMPRESA_ULTIMA_COMPRA`, `CDVENDEDOR_ULTIMA_COMPRA`, `VENDEDOR_ULTIMA_COMPRA`.
* **Vendedor da Carteira:** `CDVENDEDOR_RESPONSAVEL`, `VENDEDOR_RESPONSAVEL`.

