# 📑 Template ReportBuilder: EntradaXSaida.rtm

## 🎯 Identificação
* **Arquivo:** [`EntradaXSaida.rtm`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/01_Auditoria_Entrada_vs_Saida/EntradaXSaida.rtm)
* **Pasta Oficial:** [`RELATORIOS/01_Auditoria_Entrada_vs_Saida/`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/01_Auditoria_Entrada_vs_Saida/)
* **Engine:** Delphi ReportBuilder (`TppReport`)
* **Pipeline:** `daFireDACQueryDataView1.AUDITORIA_ENTRADA_SAIDA`
* **Fonte de Dados:** View [`AUDITORIA_ENTRADA_SAIDA`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/01_Auditoria_Entrada_vs_Saida/AUDITORIA_ENTRADA_SAIDA.sql)

---

## 📊 Estrutura Visual do Relatório
* **Cabeçalho:** Logotipo, Nome da Empresa (`NOMEEMPRESA`), Título: "Auditoria de Entradas vs Saídas Fiscais".
* **Grupos de Quebra:**
  1. `NOMEEMPRESA` (Empresa faturadora)
  2. `DEPOSITO` (Estoque físico / galpão)
* **Colunas Detalhadas:**
  * `CDPRODUTO`: Código interno do item.
  * `DESCRICAO`: Descrição do produto.
  * `ESTOQUE_ATUAL`: Quantidade física atual no estoque (`MOVIMENTO.QTDEATUAL`).
  * `QTD_ENTRADA`: Quantidade total acumulada de compras com nota de entrada (`E.STATUS = 1`).
  * `QTD_VENDIDA`: Quantidade total acumulada de vendas com documento fiscal (`SE.STATUS IN (3, 43)` e `SP.STATUSSE <> 9`).
  * `EXCESSO_VENDIDO`: Furo fiscal (`QTD_VENDIDA - QTD_ENTRADA`).
* **Rodapé do Grupo / Relatório:**
  * Total de itens com furo fiscal por depósito e geral.
  * Soma total de peças em excesso vendido.

---

## 🛠️ Como Carregar no ERP
1. No Automec, abra o **Gerenciador de Relatórios / ReportBuilder**.
2. Clique em **Arquivo > Abrir** e selecione `RELATORIOS/01_Auditoria_Entrada_vs_Saida/EntradaXSaida.rtm`.
3. Para visualizar, selecione **Visualizar (Preview)**.

