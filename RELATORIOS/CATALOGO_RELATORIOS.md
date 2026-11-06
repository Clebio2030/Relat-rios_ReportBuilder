# 📑 Catálogo Integrado de Relatórios & Views: ERP Automec

Este catálogo documenta o pareamento completo entre os modelos visuais do **ReportBuilder (`.rtm`)** e as respectivas **Views e Stored Procedures SQL (`.sql`)** instaladas no banco de dados Firebird (`MIAUTOMEC.FDB`).

---

## 🗂️ Estrutura Geral de Pastas

```text
Relatórios_IA/
├── RELATORIOS/
│   ├── 01_Auditoria_Entrada_vs_Saida/
│   │   ├── EntradaXSaida.rtm               <-- Template Visual ReportBuilder
│   │   ├── AUDITORIA_ENTRADA_SAIDA.sql     <-- View Firebird
│   │   ├── SP_AUDITORIA_ENTRADA_SAIDA.sql  <-- Procedure Selecionável
│   │   └── README.md                       <-- Guia de regras e uso
│   │
│   ├── 02_Vendas_Sem_Documento_Fiscal/
│   │   ├── SemFiscal.rtm                   <-- Template Visual ReportBuilder
│   │   ├── NAO_EMITIDO_PEDIDOS.sql         <-- View Firebird
│   │   └── README.md                       <-- Guia de regras e uso
│   │
│   └── 03_Reativacao_Clientes/
│       ├── REATIVANDO_CLIENTES.sql         <-- View Firebird
│       └── README.md                       <-- Guia comercial
│
├── AUTOMEC_BRAIN/                          <-- Cérebro de documentação e regras
└── AGENTS.md                               <-- Conhecimento permanente do projeto
```

---

## 📋 Mapeamento: Relatório (.rtm) $\longleftrightarrow$ View (.sql)

| # | Relatório | Arquivo `.rtm` | Objeto Firebird | Arquivo `.sql` | Pipeline ReportBuilder | Finalidade |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Entradas X Saídas (Furo Fiscal)** | [`EntradaXSaida.rtm`](./01_Auditoria_Entrada_vs_Saida/EntradaXSaida.rtm) | View `AUDITORIA_ENTRADA_SAIDA` | [`AUDITORIA_ENTRADA_SAIDA.sql`](./01_Auditoria_Entrada_vs_Saida/AUDITORIA_ENTRADA_SAIDA.sql) | `daFireDACQueryDataView1.AUDITORIA_ENTRADA_SAIDA` | Detecta produtos cujas vendas com nota fiscal (`STATUS IN (3, 43)`) superaram o volume acumulado de notas de compra ativas (`STATUS = 1`). Exclui itens reeditados (`STATUSSE <> 9`). |
| **02** | **Vendas Sem Documento Fiscal** | [`SemFiscal.rtm`](./02_Vendas_Sem_Documento_Fiscal/SemFiscal.rtm) | View `NAO_EMITIDO_PEDIDOS` | [`NAO_EMITIDO_PEDIDOS.sql`](./02_Vendas_Sem_Documento_Fiscal/NAO_EMITIDO_PEDIDOS.sql) | `daFireDACQueryDataView1.NAO_EMITIDO_PEDIDOS` | Auditoria de risco fiscal SEFAZ/DIMP. Lista vendas concluídas sem emissão de NFC-e/NF-e pagas via Cartão, PIX, etc. (exclui dinheiro em espécie). Unifica 1 linha por pedido. |
| **03** | **Reativação de Clientes Inativos** | *(Aguardando RTM / Uso direto)* | View `REATIVANDO_CLIENTES` | [`REATIVANDO_CLIENTES.sql`](./03_Reativacao_Clientes/REATIVANDO_CLIENTES.sql) | — | Inteligência de vendas: identifica clientes sem compras há mais de 60, 90, 180 ou 365 dias com base no histórico real de vendas do ERP. |

---

## 📐 Regras Oficiais de Filtragem nos Relatórios

1. **Regra 1 — Filtro de Depósito apenas (`CDDEPOSITO`):**
   * **Finalidade:** Auditoria de estoque físico, conferência de galpão e inventário (`EntradaXSaida.rtm`).
   * **Comportamento:** Ao selecionar apenas o Depósito (ex: `WHERE CDDEPOSITO = 1004` CASA X ou `1002` ZÉ GRANDE), o relatório **filtra tudo** correspondente àquele estoque físico específico de forma abrangente e consolidada.
2. **Regra 2 — Filtro de Período e Empresa (`DTSAIDA` + `IDEMPRESA`):**
   * **Finalidade:** Auditoria fiscal (SEFAZ / DIMP), conciliação financeira e vendas sem documento fiscal (`SemFiscal.rtm`).
   * **Comportamento:** Exige a combinação obrigatória da **Empresa emitente** (`IDEMPRESA = 1, 2, 3 ou 4`) e o **Período de movimentação** (`Data Inicial` a `Data Final`), garantindo a apuração exata por CNPJ e competência.

---

## 🚦 Tabela Resumo de Status (ERP Automec)

### Saída de Estoque (`SAIDAESTOQUE.STATUS`)
* `0`: Aberto / Orçamento
* `1`: Venda Finalizada **Sem Documento Fiscal**
* `2`: Cancelado
* **`3`: Venda Finalizada Com Nota Fiscal Emitida (Fiscal)**
* `4`: Troca em Aberto
* `40`: Troca Finalizada **Sem Documento Fiscal**
* **`43`: Troca Com Nota Fiscal de Devolução (Fiscal)**

### Itens da Saída (`SAIDAPRODUTO.STATUSSE`)
* `0`: Item Ativo Normal
* **`9`: Item Reeditado / Excluído no Caixa** (Linha soft-deleted que NÃO deve ser somada em relatórios de auditoria).

