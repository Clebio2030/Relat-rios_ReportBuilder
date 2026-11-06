# Graph Report - Relatórios_IA  (2026-11-05)

## Corpus Check
- Corpus is ~8,478 words - fits in a single context window. You may not need a graph.

## Summary
- 29 nodes · 33 edges · 5 communities (3 shown, 2 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.95)
- Token cost: 1,250 input · 850 output

## Community Hubs (Navigation)
- Tabelas e Modelagem do ERP Automec
- Ciclo de Vida e Status do Pedido
- Base de Conhecimento e Rede Neural
- Meios de Pagamento e Regra do Dinheiro
- Auditoria Fiscal e Risco DIMP

## God Nodes (most connected - your core abstractions)
1. `NAO_EMITIDO_PEDIDOS` - 7 edges
2. `Especificação da View NAO_EMITIDO_PEDIDOS` - 7 edges
3. `Dicionário de Status SAIDAESTOQUE` - 5 edges
4. `Status 1: Pedido Finalizado sem Documento Fiscal` - 4 edges
5. `Regra Emissão Fiscal vs Não Emitido` - 3 edges
6. `Status 40: Troca / Devolução de Mercadoria` - 3 edges
7. `Diretrizes & Conhecimento Permanente AGENTS.md` - 2 edges
8. `Cérebro de Notas Automec` - 2 edges
9. `Diferença Pedido Normal vs Troca` - 2 edges
10. `Regra Formas de Pagamento e Dinheiro` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Especificação da View NAO_EMITIDO_PEDIDOS` --references--> `NAO_EMITIDO_PEDIDOS`  [EXTRACTED]
  AUTOMEC_BRAIN/04_Views_E_Consultas/NAO_EMITIDO_PEDIDOS.md → NAO_EMITIDO_PEDIDOS.sql
- `Especificação da View NAO_EMITIDO_PEDIDOS` --references--> `Regra de Exclusão de Dinheiro na Auditoria`  [INFERRED]
  AUTOMEC_BRAIN/04_Views_E_Consultas/NAO_EMITIDO_PEDIDOS.md → AUTOMEC_BRAIN/03_Regras_De_Negocio/FORMAS_DE_PAGAMENTO_E_DINHEIRO.md
- `Diretrizes & Conhecimento Permanente AGENTS.md` --conceptually_related_to--> `Cérebro de Notas Automec`  [EXTRACTED]
  AGENTS.md → AUTOMEC_BRAIN/README.md
- `Regra Emissão Fiscal vs Não Emitido` --conceptually_related_to--> `Status 1: Pedido Finalizado sem Documento Fiscal`  [INFERRED]
  AUTOMEC_BRAIN/03_Regras_De_Negocio/EMISSAO_FISCAL_VS_NAO_EMITIDO.md → AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md
- `Regra Emissão Fiscal vs Não Emitido` --conceptually_related_to--> `Status 3: Venda com Emissão Fiscal Autorizada`  [INFERRED]
  AUTOMEC_BRAIN/03_Regras_De_Negocio/EMISSAO_FISCAL_VS_NAO_EMITIDO.md → AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Tabelas Centrais do ERP Automec (Venda, Financeiro, Fiscal, Cadastros)** — saidaestoque, ctareceber_prov, configuracao, recebto, notafiscal [EXTRACTED 1.00]
- **Ciclo de Vida do Pedido (Em Aberto -> Pedido -> Fiscal ou Troca/Cancelado)** — concept_status_0_em_aberto, concept_status_1_pedido, concept_status_3_emitido_fiscal, concept_status_40_troca, concept_status_2_42_cancelado [EXTRACTED 1.00]
- **Mecanismo de Auditoria Fiscal de Vendas Não Emitidas e Não Dinheiro** — nao_emitido_pedidos_nao_emitido_pedidos, rationale_agrupamento_1_linha, rationale_exclusao_dinheiro, rationale_risco_fiscal_dimp [INFERRED 0.95]

## Communities (5 total, 2 thin omitted)

### Community 0 - "Tabelas e Modelagem do ERP Automec"
Cohesion: 0.20
Nodes (5): Doc Tabela CONFIGURACAO, Doc Tabela CTARECEBER_PROV, Doc Tabela NOTAFISCAL, Doc Tabela SAIDAESTOQUE, NAO_EMITIDO_PEDIDOS

### Community 1 - "Ciclo de Vida e Status do Pedido"
Cohesion: 0.39
Nodes (7): Diferença Pedido Normal vs Troca, Dicionário de Status SAIDAESTOQUE, Especificação da View NAO_EMITIDO_PEDIDOS, Status 0: Pedido em Aberto (Digitação / Orçamento), Status 1: Pedido Finalizado sem Documento Fiscal, Status 2 e 42: Cancelados / Estornados, Status 40: Troca / Devolução de Mercadoria

### Community 2 - "Base de Conhecimento e Rede Neural"
Cohesion: 0.50
Nodes (4): Diretrizes & Conhecimento Permanente AGENTS.md, Cérebro de Notas Automec, Visualizador Rede Neural HTML, Firebird 5.0 DB (MIAUTOMEC.FDB)

## Knowledge Gaps
- **7 isolated node(s):** `Doc Tabela CONFIGURACAO`, `Doc Tabela CTARECEBER_PROV`, `Doc Tabela NOTAFISCAL`, `Doc Tabela RECEBTO`, `Doc Tabela SAIDAESTOQUE` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 10 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `NAO_EMITIDO_PEDIDOS` connect `Tabelas e Modelagem do ERP Automec` to `Ciclo de Vida e Status do Pedido`, `Meios de Pagamento e Regra do Dinheiro`?**
  _High betweenness centrality (0.500) - this node is a cross-community bridge._
- **What connects `Doc Tabela CONFIGURACAO`, `Doc Tabela CTARECEBER_PROV`, `Doc Tabela NOTAFISCAL` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `Especificação da View NAO_EMITIDO_PEDIDOS` connect `Ciclo de Vida e Status do Pedido` to `Tabelas e Modelagem do ERP Automec`, `Meios de Pagamento e Regra do Dinheiro`?**
  _High betweenness centrality (0.436) - this node is a cross-community bridge._
- **Why does `Status 1: Pedido Finalizado sem Documento Fiscal` connect `Ciclo de Vida e Status do Pedido` to `Auditoria Fiscal e Risco DIMP`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._