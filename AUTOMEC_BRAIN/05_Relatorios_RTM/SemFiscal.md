# 📑 Template ReportBuilder: SemFiscal.rtm

## 🎯 Identificação
* **Arquivo:** [`SemFiscal.rtm`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/02_Vendas_Sem_Documento_Fiscal/SemFiscal.rtm)
* **Pasta Oficial:** [`RELATORIOS/02_Vendas_Sem_Documento_Fiscal/`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/02_Vendas_Sem_Documento_Fiscal/)
* **Engine:** Delphi ReportBuilder (`TppReport`)
* **Pipeline:** `daFireDACQueryDataView1.NAO_EMITIDO_PEDIDOS`
* **Fonte de Dados:** View [`NAO_EMITIDO_PEDIDOS`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/02_Vendas_Sem_Documento_Fiscal/NAO_EMITIDO_PEDIDOS.sql)

---

## 📊 Estrutura Visual do Relatório
* **Cabeçalho:** Logotipo, Nome da Empresa (`NOMEEMPRESA`), Título: "Vendas e Trocas Não Emitidas (Sem Documento Fiscal)".
* **Grupos de Quebra:**
  1. `NOMEEMPRESA` (Empresa faturadora)
* **Colunas Detalhadas (1 Pedido por Linha):**
  * `CDCLIENTE` e `CLIENTE`: Código e nome do cliente.
  * `NRPEDIDO`: Número do pedido / orçamento no ERP.
  * `DTSAIDA`: Data da operação.
  * `TIPO_OPERACAO`: Identifica se é `PEDIDO` ou `TROCA`.
  * `VLTOTAL_PEDIDO`: Valor total da venda.
* **Rodapé do Grupo / Relatório:**
  * Quantidade de pedidos não emitidos por empresa e total geral.
  * Soma total em R$ não emitida por empresa e total geral.

---

## 🛠️ Como Carregar no ERP
1. No Automec, abra o **Gerenciador de Relatórios / ReportBuilder**.
2. Clique em **Arquivo > Abrir** e selecione `RELATORIOS/02_Vendas_Sem_Documento_Fiscal/SemFiscal.rtm`.
3. Para visualizar, selecione **Visualizar (Preview)**.

