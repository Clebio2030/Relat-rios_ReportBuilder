---
type: community
cohesion: 0.67
members: 3
---

# Auditoria Fiscal e Risco DIMP

**Cohesion:** 0.67 - moderately connected
**Members:** 3 nodes

## Members
- [[Regra Emissão Fiscal vs Não Emitido]] - document - AUTOMEC_BRAIN/03_Regras_De_Negocio/EMISSAO_FISCAL_VS_NAO_EMITIDO.md
- [[Risco Fiscal DIMP (Cruzamento CartãoPIX com SEFAZ)]] - rationale - AUTOMEC_BRAIN/03_Regras_De_Negocio/EMISSAO_FISCAL_VS_NAO_EMITIDO.md
- [[Status 3 Venda com Emissão Fiscal Autorizada]] - concept - AUTOMEC_BRAIN/02_Status_E_Ciclo_De_Vida/STATUS_SAIDAESTOQUE.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Auditoria_Fiscal_e_Risco_DIMP
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Ciclo de Vida e Status do Pedido]]

## Top bridge nodes
- [[Regra Emissão Fiscal vs Não Emitido]] - degree 3, connects to 1 community
- [[Status 3 Venda com Emissão Fiscal Autorizada]] - degree 2, connects to 1 community