---
source_file: "AUTOMEC_BRAIN/04_Views_E_Consultas/NAO_EMITIDO_PEDIDOS.md"
type: "document"
community: "Ciclo de Vida e Status do Pedido"
tags:
  - graphify/document
  - graphify/EXTRACTED
  - community/Ciclo_de_Vida_e_Status_do_Pedido
---

# Especificação da View NAO_EMITIDO_PEDIDOS

## Connections
- [[Agrupamento 1 Linha por Pedido (GROUP BY SE.NRPEDIDO)]] - `rationale_for` [EXTRACTED]
- [[NAO_EMITIDO_PEDIDOS]] - `references` [EXTRACTED]
- [[Regra de Exclusão de Dinheiro na Auditoria]] - `references` [INFERRED]
- [[Status 0 Pedido em Aberto (Digitação  Orçamento)]] - `references` [EXTRACTED]
- [[Status 1 Pedido Finalizado sem Documento Fiscal]] - `references` [EXTRACTED]
- [[Status 2 e 42 Cancelados  Estornados]] - `cites` [EXTRACTED]
- [[Status 40 Troca  Devolução de Mercadoria]] - `references` [EXTRACTED]

#graphify/document #graphify/EXTRACTED #community/Ciclo_de_Vida_e_Status_do_Pedido