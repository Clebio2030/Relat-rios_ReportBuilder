# 📊 Relatório: Auditoria de Entradas vs Saídas Fiscais (Furo Fiscal)

Este módulo compara a quantidade total acumulada de compras com nota fiscal recebida contra a quantidade total acumulada de saídas fiscais emitidas (Cupom Fiscal / NFC-e / NF-e e Trocas com NF), apontando com precisão matemática onde houve furo ou excesso de venda fiscal.

---

## 📁 Arquivos do Relatório

| Arquivo | Tipo | Descrição |
| :--- | :--- | :--- |
| [`EntradaXSaida.rtm`](./EntradaXSaida.rtm) | **Template Visual (ReportBuilder)** | Layout do relatório para impressão / visualização em tela / PDF. |
| [`AUDITORIA_ENTRADA_SAIDA.sql`](./AUDITORIA_ENTRADA_SAIDA.sql) | **View Firebird** | Fonte de dados direta usada pelo pipeline do ReportBuilder/FastReport (`AUDITORIA_ENTRADA_SAIDA`). |

---

## ⚙️ Conexão no ReportBuilder

* **DataPipeline:** `daFireDACQueryDataView1.AUDITORIA_ENTRADA_SAIDA`
* **Consulta Interna:** `SELECT ... FROM AUDITORIA_ENTRADA_SAIDA AUDITORIA_ENTRADA_SAI_1`
* **Agrupamento do Relatório:**
  1. `NOMEEMPRESA` (Empresa faturadora)
  2. `DEPOSITO` (Estoque físico / galpão)
* **Ordenação / Detalhe:** `CDPRODUTO`, `DESCRICAO`, `ESTOQUE_ATUAL`, `QTD_ENTRADA`, `QTD_VENDIDA`, `EXCESSO_VENDIDO`.

---

## 🧠 Regras de Negócio e Fiscalidade

1. **Entradas Fiscais (`ENTRPRODUTO` + `ENTRESTOQUE`):**
   * Considera exclusivamente notas fiscais de compra recebidas e confirmadas (`E.STATUS = 1`).
   * Ignora compras canceladas (`E.STATUS = 2`).
2. **Saídas Fiscais (`SAIDAPRODUTO` + `SAIDAESTOQUE`):**
   * Considera estritamente documentos fiscais emitidos e autorizados:
     * `SE.STATUS = 3` (NotaFiscal Emitida / NFC-e / NF-e).
     * `SE.STATUS = 43` (Troca com Nota Fiscal de Devolução emitida).
   * Ignora pedidos finalizados sem nota (`STATUS = 1`), orçamentos (`0`), trocas sem NF (`40`) e cancelados (`2, 42`).
3. **Regra de Ouro (Exclusão de Reedições no Caixa):**
   * Filtra obrigatoriamente: `(SP.STATUSSE IS NULL OR SP.STATUSSE <> 9)`.
   * No ERP Automec, itens reeditados ou excluídos na tela de venda permanecem no banco com `STATUSSE = 9`. Esse filtro impede que itens reeditados dupliquem a soma vendida.
4. **Cálculo Acumulado Real (Sem Falso Positivo):**
   * O relatório compara o saldo total histórico até a data de análise, impedindo que lotes comprados em meses anteriores sejam apontados como "furo" no mês seguinte.
5. **Critério de Exibição:**
   * Apenas produtos onde `QTD_VENDIDA > QTD_ENTRADA` são exibidos (`EXCESSO_VENDIDO > 0`).

---

## 🚀 Como Executar / Atualizar no ERP

### 1. Criar ou Atualizar a View no Firebird
Execute o script [`AUDITORIA_ENTRADA_SAIDA.sql`](./AUDITORIA_ENTRADA_SAIDA.sql) no Firebird 5.0 (usando ISQL ou IBExpert/DBeaver):
```sql
-- Executar no banco D:\Administracao\DB\ZEGRANDE\MIAUTOMEC.FDB
INPUT "D:\Área de Trabalho\Implantação\Relatórios_IA\RELATORIOS\01_Auditoria_Entrada_vs_Saida\AUDITORIA_ENTRADA_SAIDA.sql";
```

### 2. Carregar o Modelo Visual (`.rtm`) no Automec
1. Acesse o menu de Relatórios do ERP Automec.
2. Abra o **Report Designer** (ReportBuilder).
3. Vá em **Arquivo > Abrir... (File > Open...)** e selecione o arquivo:
   `D:\Área de Trabalho\Implantação\Relatórios_IA\RELATORIOS\01_Auditoria_Entrada_vs_Saida\EntradaXSaida.rtm`
4. Clique em **Visualizar Impressão (Preview)**. O relatório já carrega os dados vinculados diretamente à view `AUDITORIA_ENTRADA_SAIDA`.

