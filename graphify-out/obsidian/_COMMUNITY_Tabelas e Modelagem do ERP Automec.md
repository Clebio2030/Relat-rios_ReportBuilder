---
type: community
cohesion: 0.20
members: 10
---

# Tabelas e Modelagem do ERP Automec

**Cohesion:** 0.20 - loosely connected
**Members:** 10 nodes

## Members
- [[CONFIGURACAO]] - code
- [[CTARECEBER_PROV]] - code
- [[Doc Tabela CONFIGURACAO]] - document - AUTOMEC_BRAIN/01_Tabelas/CONFIGURACAO.md
- [[Doc Tabela CTARECEBER_PROV]] - document - AUTOMEC_BRAIN/01_Tabelas/CTARECEBER_PROV.md
- [[Doc Tabela NOTAFISCAL]] - document - AUTOMEC_BRAIN/01_Tabelas/NOTAFISCAL.md
- [[Doc Tabela SAIDAESTOQUE]] - document - AUTOMEC_BRAIN/01_Tabelas/SAIDAESTOQUE.md
- [[NAO_EMITIDO_PEDIDOS]] - code - NAO_EMITIDO_PEDIDOS.sql
- [[NAO_EMITIDO_PEDIDOS.sql]] - code - NAO_EMITIDO_PEDIDOS.sql
- [[NOTAFISCAL]] - code
- [[SAIDAESTOQUE]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Tabelas_e_Modelagem_do_ERP_Automec
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Meios de Pagamento e Regra do Dinheiro]]
- 1 edge to [[_COMMUNITY_Ciclo de Vida e Status do Pedido]]

## Top bridge nodes
- [[NAO_EMITIDO_PEDIDOS]] - degree 7, connects to 2 communities