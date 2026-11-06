---
type: community
cohesion: 0.50
members: 4
---

# Meios de Pagamento e Regra do Dinheiro

**Cohesion:** 0.50 - moderately connected
**Members:** 4 nodes

## Members
- [[Doc Tabela RECEBTO]] - document - AUTOMEC_BRAIN/01_Tabelas/RECEBTO.md
- [[RECEBTO]] - code
- [[Regra Formas de Pagamento e Dinheiro]] - document - AUTOMEC_BRAIN/03_Regras_De_Negocio/FORMAS_DE_PAGAMENTO_E_DINHEIRO.md
- [[Regra de Exclusão de Dinheiro na Auditoria]] - rationale - AUTOMEC_BRAIN/03_Regras_De_Negocio/FORMAS_DE_PAGAMENTO_E_DINHEIRO.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Meios_de_Pagamento_e_Regra_do_Dinheiro
SORT file.name ASC
```

## Connections to other communities
- 1 edge to [[_COMMUNITY_Tabelas e Modelagem do ERP Automec]]
- 1 edge to [[_COMMUNITY_Ciclo de Vida e Status do Pedido]]

## Top bridge nodes
- [[RECEBTO]] - degree 3, connects to 1 community
- [[Regra de Exclusão de Dinheiro na Auditoria]] - degree 2, connects to 1 community