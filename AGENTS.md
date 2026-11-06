# 🧠 Diretrizes & Conhecimento Permanente: ERP Automec / MIAUTOMEC

Este arquivo é lido automaticamente pelo assistente em todas as sessões e conversas deste workspace.

## 💾 Banco de Dados
* **Arquivo:** `D:\Administracao\DB\ZEGRANDE\MIAUTOMEC.FDB` (Firebird 5.0 no porto 3050).
* **Usuário:** SYSDBA / masterkey.

## 🏢 Empresas (CONFIGURACAO)
* **ID 1:** JPR DE MATERIAL DE CONSTRUCAO LTDA
* **ID 2:** ZG COMERCIO DE MATERIAL DE CONSTRUCAO LTDA
* **ID 3:** ZE GRANDE DE MIGUEL COUTO MATERIAL DE CONSTRUCAO LTDA
* **ID 4:** CASA X CONSTRUCAO DECORACAO E UTILIDADES DO LAR LTDA

## 🚦 Status de Pedidos (SAIDAESTOQUE) & Itens (SAIDAPRODUTO)
* **Status do Pedido (`SAIDAESTOQUE.STATUS`):**
  * **`0` = ABERTO** (orçamento / pedido em digitação / não finalizado no caixa).
  * **`1` = FINALIZADO** (venda normal finalizada no caixa SEM documento fiscal).
  * **`2` = CANCELADO** (venda cancelada, desconsiderar).
  * **`3` = NOTAFISCAL EMITIDA** (venda finalizada COM documento fiscal autorizado: Cupom Fiscal / NFC-e / NF-e).
  * **`4` = TROCA EM ABERTO** (devolução em andamento no balcão).
  * **`9` = EXCLUÍDO** (status não é usado no pedido).
  * **`40` = TROCA FINALIZADA** (devolução finalizada no caixa SEM documento fiscal).
  * **`42` = TROCA CANCELADA** (status não é usado).
  * **`43` = TROCA COM NFE** (devolução formalizada com Nota Fiscal de Entrada/Devolução autorizada).
* **Status do Item (`SAIDAPRODUTO.STATUSSE`):**
  * **`9` = ITEM EXCLUÍDO / REEDITADO NO CAIXA**: No ERP Automec, quando um item do pedido é alterado ou excluído na tela, a linha original **não é deletada fisicamente**, ela recebe `STATUSSE = 9`. Uma nova linha é inserida com `STATUSSE = 0`.
  * **Regra de Ouro em SAIDAPRODUTO:** TODA consulta que soma ou lista itens de venda **DEVE OBRIGATORIAMENTE FILTRAR**: `(SP.STATUSSE IS NULL OR SP.STATUSSE <> 9)`. Caso contrário, itens reeditados duplicam o cálculo de vendas!

> **Regra Fiscal Estrita:** Apenas os status **`3`** e **`43`** representam movimentações com documento fiscal emitido.

## 💳 Formas de Pagamento & Agrupamento
* **Regra do Dinheiro na View NAO_EMITIDO_PEDIDOS:** A view filtra para **EXCLUIR DINHEIRO** (`UPPER(COALESCE(R.RECEBTO, '')) NOT LIKE '%DINHEIRO%' AND CP.CODPAGTO NOT IN (1, 10)`), pois o objetivo da auditoria é ver o que **NÃO foi emitido e NÃO é dinheiro** (PIX, Cartão, Vale, A Receber).
* **Agrupamento por Pedido (1 Linha por Pedido):** A view agrupa por `SE.NRPEDIDO` com `GROUP BY`. Vendas parceladas em várias vezes (ex: Cartão 6x, como pedido 2715) **não repetem mais linhas** no relatório. Os campos agregados são:
  * `PARCELA` = `COUNT(CP.CONTROLE)` (quantidade de parcelas).
  * `VALOR_PARCELA` = `SUM(CP.VALOR)` (soma total das parcelas daquele meio).
  * `FORMA_PAGTO` = `LIST(DISTINCT TRIM(R.RECEBTO), ', ')` (concatena formas se houver mais de uma).
* **Filtros de Emissão Estrita:** Apenas `NF.NRDOC IS NULL` (as condições de `NUMCUPOM` e `CHAVE_NFCE` foram removidas do WHERE a pedido do usuário para não filtrar pedidos com notas canceladas ou chaves residuais).
* **Status 3 com Nota Cancelada:** Mapeado em `TIPO_OPERACAO` como `'PEDIDO'` (quando o status é 1 ou 3 com nota cancelada).
* **Risco Fiscal:** Vendas em PIX (`MEIO_PAGTO = 17`) ou Cartão (`MEIO_PAGTO = 03/04`) que estejam em `STATUS = 1` são divergências fiscais com a SEFAZ (cruzamento DIMP).

## 🔍 Objetos Criados
* **Views:**
  * `NAO_EMITIDO_PEDIDOS` (pedidos/trocas não emitidos que não são dinheiro).
  * `REATIVANDO_CLIENTES` (reativação de clientes baseada em vendas reais de `SAIDAESTOQUE`, contornando a falha de `CLIENTE.DTULTCOMPRA`).
  * `AUDITORIA_ENTRADA_SAIDA` (produtos que venderam acima da entrada no acumulado fiscal, agrupado por empresa e depósito).
* **Modelos ReportBuilder (.rtm) / FastReport:**
  * `EntradaXSaida.rtm` (DataPipeline: `AUDITORIA_ENTRADA_SAIDA`).
  * `SemFiscal.rtm` (DataPipeline: `NAO_EMITIDO_PEDIDOS`).
* **Estrutura Organizada de Relatórios (`RELATORIOS/`):**
  * `01_Auditoria_Entrada_vs_Saida/`: `EntradaXSaida.rtm`, `AUDITORIA_ENTRADA_SAIDA.sql`, `README.md`.
  * `02_Vendas_Sem_Documento_Fiscal/`: `SemFiscal.rtm`, `NAO_EMITIDO_PEDIDOS.sql`, `README.md`.
  * `03_Reativacao_Clientes/`: `REATIVANDO_CLIENTES.sql`, `README.md`.
  * `CATALOGO_RELATORIOS.md`: Catálogo central de relatórios, pipelines e regras fiscais.
* **Cérebro de Notas:** `AUTOMEC_BRAIN/` (documentação de tabelas, status, regras e relatórios RTM).
* **Rede Neural Visual:** `AUTOMEC_BRAIN/rede_neural.html`.
* **Motor de Grafo & RAG (Graphify):** `graphify-out/` contendo `graph.json`, `graph.html` (3D interativo), `GRAPH_REPORT.md`, `Relat-rios_IA-callflow.html` e `obsidian/`.

## 🔄 Comando de Aprendizado: `ATUALIZE`
Sempre que o usuário digitar `ATUALIZE` ou `/learn`, o assistente **DEVE ATUALIZAR OS DOIS SISTEMAS OBRIGATORIAMENTE**:
1. **Extrair** todos os novos conhecimentos, correções e regras da conversa.
2. **Atualizar o Cérebro de Notas (`AUTOMEC_BRAIN/`):**
   * Atualizar este arquivo `AGENTS.md`.
   * Atualizar/criar as notas Markdown correspondentes em `AUTOMEC_BRAIN/`.
   * Atualizar os nós e arestas no visualizador `AUTOMEC_BRAIN/rede_neural.html`.
3. **Atualizar o Grafo (`graphify-out/`):**
   * Executar a atualização do Graphify para incorporar novas tabelas, views e conexões.
   * Re-gerar `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md` e o visualizador `graphify-out/graph.html`.
   * Atualizar o cofre `graphify-out/obsidian/`.
4. **Salvar na memória persistente** do MCP `claude-mem` (`save_memory`).
5. **Apresentar um resumo transparente** do que foi sincronizado em ambos os sistemas.

