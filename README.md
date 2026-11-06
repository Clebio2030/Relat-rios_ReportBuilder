# 📊 Relatórios ReportBuilder & Views Firebird — ERP Automec

Repositório central de relatórios analíticos, layouts do **ReportBuilder (`.rtm`)**, views e scripts SQL para o banco de dados **Firebird 5.0 (`MIAUTOMEC.FDB`)** do ERP Automec.

---

## 🗂️ Estrutura do Projeto

```text
Relat-rios_ReportBuilder/
├── RELATORIOS/
│   ├── 01_Auditoria_Entrada_vs_Saida/
│   │   ├── EntradaXSaida.rtm                  <-- Layout visual ReportBuilder (Papel Carta)
│   │   ├── AUDITORIA_ENTRADA_SAIDA.sql        <-- View SQL Firebird
│   │   ├── README.md                          <-- Regras de negócio e instruções
│   │   └── prints/                            <-- Prints das páginas impressas (PNG)
│   │
│   ├── 02_Vendas_Sem_Documento_Fiscal/
│   │   ├── SemFiscal.rtm                      <-- Layout visual ReportBuilder (Papel Carta)
│   │   ├── NAO_EMITIDO_PEDIDOS.sql            <-- View SQL Firebird
│   │   ├── README.md                          <-- Regras de negócio e instruções
│   │   └── prints/                            <-- Prints das páginas impressas (PNG)
│   │
│   ├── 03_Reativacao_Clientes/
│   │   ├── REATIVANDO_CLIENTES.sql            <-- View de inteligência comercial
│   │   └── README.md                          <-- Regras e faixas de inatividade
│   │
│   └── CATALOGO_RELATORIOS.md                 <-- Catálogo detalhado de todos os relatórios
│
├── AUTOMEC_BRAIN/                             <-- Cérebro de conhecimento e regras de negócio
├── render_report.js                           <-- Motor Node.js para renderizar EntradaXSaida em HTML/PNG
├── render_sem_fiscal.js                       <-- Motor Node.js para renderizar SemFiscal em HTML/PNG
└── AGENTS.md                                  <-- Diretrizes permanentes do ecossistema
```

---

## 📋 Relatórios Integrados

### 1️⃣ Auditoria de Entradas vs Saídas Fiscais (Furo Fiscal)
* **Objetivo:** Detectar com precisão matemática produtos onde as vendas com nota fiscal emitida superaram o volume acumulado de notas de compra recebidas.
* **Layout:** [`RELATORIOS/01_Auditoria_Entrada_vs_Saida/EntradaXSaida.rtm`](./RELATORIOS/01_Auditoria_Entrada_vs_Saida/EntradaXSaida.rtm)
* **View:** [`RELATORIOS/01_Auditoria_Entrada_vs_Saida/AUDITORIA_ENTRADA_SAIDA.sql`](./RELATORIOS/01_Auditoria_Entrada_vs_Saida/AUDITORIA_ENTRADA_SAIDA.sql)
* **Pipeline:** `daFireDACQueryDataView1.AUDITORIA_ENTRADA_SAIDA`
* **Regra de Ouro:** Filtra `(SP.STATUSSE IS NULL OR SP.STATUSSE <> 9)` para eliminar itens reeditados/cancelados na tela de venda do caixa.

### 2️⃣ Vendas Sem Documento Fiscal (Não Emitido)
* **Objetivo:** Auditoria de risco com a SEFAZ (cruzamento DIMP). Lista vendas concluídas sem emissão de NFC-e/NF-e pagas via Cartão, PIX, Vale ou A Receber.
* **Layout:** [`RELATORIOS/02_Vendas_Sem_Documento_Fiscal/SemFiscal.rtm`](./RELATORIOS/02_Vendas_Sem_Documento_Fiscal/SemFiscal.rtm)
* **View:** [`RELATORIOS/02_Vendas_Sem_Documento_Fiscal/NAO_EMITIDO_PEDIDOS.sql`](./RELATORIOS/02_Vendas_Sem_Documento_Fiscal/NAO_EMITIDO_PEDIDOS.sql)
* **Pipeline:** `daFireDACQueryDataView1.NAO_EMITIDO_PEDIDOS`
* **Regra:** Exclui pagamentos em dinheiro em espécie (`RECEBTO NOT LIKE '%DINHEIRO%'`) e unifica parcelas em 1 linha por pedido (`GROUP BY SE.NRPEDIDO`).

### 3️⃣ Reativação de Clientes Inativos (Comercial)
* **Objetivo:** Recuperação ativa de clientes sem compras há mais de 60, 90, 180 ou 365 dias, calculando a data real a partir da movimentação de `SAIDAESTOQUE`.
* **View:** [`RELATORIOS/03_Reativacao_Clientes/REATIVANDO_CLIENTES.sql`](./RELATORIOS/03_Reativacao_Clientes/REATIVANDO_CLIENTES.sql)

---

## 🚦 Tabela Resumo de Status (ERP Automec)

### Saída de Estoque (`SAIDAESTOQUE.STATUS`)
* `0`: Aberto / Orçamento
* `1`: Venda Finalizada **Sem Documento Fiscal**
* `2`: Cancelado
* **`3`: Venda Finalizada Com Nota Fiscal Emitida (Fiscal: NFC-e / NF-e)**
* `4`: Troca em Aberto
* `40`: Troca Finalizada **Sem Documento Fiscal**
* **`43`: Troca Com Nota Fiscal de Devolução (Fiscal)**

### Status do Item (`SAIDAPRODUTO.STATUSSE`)
* `0`: Item Ativo Normal
* **`9`: Item Reeditado / Excluído no Caixa** (Linha soft-deleted mantida no banco pelo ERP).

---

## 🚀 Como Utilizar

1. **Compilar as Views no Banco:** Execute os scripts `.sql` dentro de `RELATORIOS/` no Firebird 5.0 (usando ISQL, IBExpert ou DBeaver).
2. **Carregar no ReportBuilder:** Abra o Report Designer no ERP Automec, clique em **Arquivo > Abrir** e carregue o template `.rtm` desejado.
3. **Gerar Prints Automáticos:** Execute os scripts Node.js para renderizar as páginas do relatório em PNG em alta resolução:
   ```bash
   node render_report.js
   node render_sem_fiscal.js
   ```

