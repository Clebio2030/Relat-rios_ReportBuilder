---
type: community
cohesion: 0.39
members: 8
---

# Ciclo de Vida e Status do Pedido

**Cohesion:** 0.39 - loosely connected
**Members:** 8 nodes

## Members
- [[Agrupamento 1 Linha por Pedido (GROUP BY SE.NRPEDIDO)]] - rationale - AUTOMEC_BRAIN/04_Views_E_Consultas/NAO_EMITIDO_PEDIDOS.md
- [[Dicionário de Status SAIDAESTOQUE]] - document - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md
- [[Diferença Pedido Normal vs Troca]] - document - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/DIFERENCA_PEDIDO_VS_TROCA.md
- [[Especificação da View NAO_EMITIDO_PEDIDOS]] - document - AUTOMEC_BRAIN/04_Views_E_Consultas/NAO_EMITIDO_PEDIDOS.md
- [[Status 0 Pedido em Aberto (Digitação  Orçamento)]] - concept - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md
- [[Status 1 Pedido Finalizado sem Documento Fiscal]] - concept - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md
- [[Status 2 e 42 Cancelados  Estornados]] - concept - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md
- [[Status 40 Troca  Devolução de Mercadoria]] - concept - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/DIFERENCA_PEDIDO_VS_TROCA.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Ciclo_de_Vida_e_Status_do_Pedido
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Auditoria Fiscal e Risco DIMP]]
- 1 edge to [[_COMMUNITY_Tabelas e Modelagem do ERP Automec]]
- 1 edge to [[_COMMUNITY_Meios de Pagamento e Regra do Dinheiro]]

## Top bridge nodes
- [[Especificação da View NAO_EMITIDO_PEDIDOS]] - degree 7, connects to 2 communities
- [[Dicionário de Status SAIDAESTOQUE]] - degree 5, connects to 1 community
- [[Status 1 Pedido Finalizado sem Documento Fiscal]] - degree 4, connects to 1 community