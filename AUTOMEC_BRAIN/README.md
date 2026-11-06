# 🧠 CÉREBRO ERP AUTOMEC / MIAUTOMEC

Bem-vindo à base de conhecimento (Cérebro Digital) do ecossistema de banco de dados do sistema Automec (Firebird `MIAUTOMEC.FDB`).

Este repositório foi construído no formato de **Rede Neural de Conhecimento (Knowledge Graph / Second Brain)** interconectado através de links bidirecionais (`[[...]]`), compatível com **Obsidian**, **Foam**, **Quartz** e visualizadores neurais em grafo.

---

## 🗺️ Mapa de Conexões Neurais (Hub Central)

### 📂 1. Tabelas Principais do Núcleo
* [[SAIDAESTOQUE]] — Cabeçalho de pedidos de venda, orçamentos, trocas e controle de saída de mercadorias.
* [[CTARECEBER_PROV]] — Parcelas e financeiro provisório gerado para cada pedido (contas a receber).
* [[RECEBTO]] — Cadastro de formas de recebimento e meios de pagamento (Dinheiro, PIX, Cartão, Boleto, Vale).
* [[CONFIGURACAO]] — Cadastro das empresas/filiais do grupo e parâmetros fiscais/operacionais.
* [[NOTAFISCAL]] — Registro de documentos fiscais autorizados (NF-e, NFC-e, CFe).

### 🚦 2. Status e Ciclo de Vida
* [[STATUS_SAIDAESTOQUE]] — Dicionário completo do significado de cada código de status do pedido e itens (`STATUSSE = 9`).
* [[DIFERENCA_PEDIDO_VS_TROCA]] — O que separa uma venda de uma troca/devolução no banco.

### ⚖️ 3. Regras de Negócio e Fiscal
* [[EMISSAO_FISCAL_VS_NAO_EMITIDO]] — Regras para identificar pedidos emitidos com documento fiscal vs não emitidos.
* [[FORMAS_DE_PAGAMENTO_E_DINHEIRO]] — Como classificar recebimentos em Dinheiro (`LIKE '%DINHEIRO%'`) vs meios eletrônicos.

### 🔍 4. Views e Procedimentos Criados
* [[AUDITORIA_ENTRADA_SAIDA]] — Auditoria acumulada fiscal de compras vs vendas com eliminação de furos irreais.
* [[NAO_EMITIDO_PEDIDOS]] — Vendas e trocas não emitidas que não foram pagas em dinheiro (risco fiscal DIMP).
* [[REATIVANDO_CLIENTES]] — Reativação de clientes inativos baseada no histórico real de vendas.

### 📑 5. Relatórios Visuais ReportBuilder (.rtm)
* [[EntradaXSaida]] — Relatório visual de auditoria de compras vs saídas fiscais (`EntradaXSaida.rtm`).
* [[SemFiscal]] — Relatório visual de pedidos e trocas não emitidos (`SemFiscal.rtm`).
* 📁 Pasta Central de Relatórios: [`RELATORIOS/CATALOGO_RELATORIOS.md`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/CATALOGO_RELATORIOS.md).

---

## 🌐 Visualizador em Rede Neural Interativa
Para abrir a rede neural visual e interativa com física de nós e conexões do banco, abra o arquivo:
👉 [rede_neural.html](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/AUTOMEC_BRAIN/rede_neural.html) no seu navegador!
