# 📊 Relatório: Vendas Sem Documento Fiscal (Não Emitido)

Este relatório é a ferramenta de auditoria de risco fiscal da empresa (cruzamento DIMP / SEFAZ). Ele lista todas as operações de venda e troca que foram concluídas **sem emissão de documento fiscal** (NFC-e / NF-e) e cujos meios de pagamento **não são dinheiro** (Cartão de Crédito/Débito, PIX, Vale, Cobrança a Receber, etc.).

---

## 📁 Arquivos do Relatório

| Arquivo | Tipo | Descrição |
| :--- | :--- | :--- |
| [`SemFiscal.rtm`](./SemFiscal.rtm) | **Template Visual (ReportBuilder)** | Layout do relatório para impressão / visualização em tela / PDF. |
| [`NAO_EMITIDO_PEDIDOS.sql`](./NAO_EMITIDO_PEDIDOS.sql) | **View Firebird** | Fonte de dados direta usada pelo pipeline do ReportBuilder (`NAO_EMITIDO_PEDIDOS`). |
| [`prints/`](./prints/) | **Prints Renderizados** | Imagens PNG em alta resolução de cada página impressa para Zé Grande e Casa X. |

---

## ⚙️ Conexão no ReportBuilder

* **DataPipeline:** `daFireDACQueryDataView1.NAO_EMITIDO_PEDIDOS`
* **Consulta Interna:** `SELECT ... FROM NAO_EMITIDO_PEDIDOS NAO_EMITIDO_PEDIDOS_1`
* **Agrupamento do Relatório:**
  1. `NOMEEMPRESA` (Empresa emitente / faturadora)
* **Detalhes da Linha (1 Pedido por Linha):**
  * `CDCLIENTE` e `CLIENTE`
  * `NRPEDIDO`
  * `DTSAIDA`
  * `TIPO_OPERACAO` (`PEDIDO`, `TROCA`, etc.)
  * `VLTOTAL_PEDIDO`
* **Totalizadores:** Total em Reais e Quantidade de Pedidos não emitidos por Empresa e Geral.

---

## 🧠 Regras de Negócio e Fiscalidade

1. **Exclusão Estrita de Dinheiro:**
   * O relatório **ignora intencionalmente** operações pagas puramente em dinheiro em espécie (`RECEBTO NOT LIKE '%DINHEIRO%'` e `CP.CODPAGTO NOT IN (1, 10)`), pois o objetivo primordial da auditoria é mitigar o risco com a SEFAZ (cruzamentos de PIX e adquirentes de cartão).
2. **Agrupamento Unificado por Pedido (Zero Duplicações):**
   * Vendas parceladas em várias vezes (ex: Cartão 6x, 10x) **não repetem linhas** no relatório.
   * `PARCELA` = `COUNT(CP.CONTROLE)` (quantidade de parcelas).
   * `VALOR_PARCELA` = `SUM(CP.VALOR)` (soma total das parcelas daquele meio).
   * `FORMA_PAGTO` = `LIST(DISTINCT TRIM(R.RECEBTO), ', ')` (concatena todas as formas utilizadas).
3. **Critério de Emissão Estrito:**
   * Apenas registros onde `NF.NRDOC IS NULL` (sem nota fiscal emitida autorizada e ativa).
   * Considera vendas em `STATUS = 1` e trocas em `STATUS = 40`. Pedidos cancelados (`STATUS IN (2, 42)`) são excluídos.

---

## 🚀 Como Executar / Atualizar no ERP

### 1. Criar ou Atualizar a View no Firebird
Execute o script [`NAO_EMITIDO_PEDIDOS.sql`](./NAO_EMITIDO_PEDIDOS.sql) no Firebird 5.0 (usando ISQL ou IBExpert/DBeaver):
```sql
-- Executar no banco D:\Administracao\DB\ZEGRANDE\MIAUTOMEC.FDB
INPUT "D:\Área de Trabalho\Implantação\Relatórios_IA\RELATORIOS\02_Vendas_Sem_Documento_Fiscal\NAO_EMITIDO_PEDIDOS.sql";
```

### 2. Carregar o Modelo Visual (`.rtm`) no Automec
1. Acesse o menu de Relatórios do ERP Automec.
2. Abra o **Report Designer** (ReportBuilder).
3. Vá em **Arquivo > Abrir... (File > Open...)** e selecione o arquivo:
   `D:\Área de Trabalho\Implantação\Relatórios_IA\RELATORIOS\02_Vendas_Sem_Documento_Fiscal\SemFiscal.rtm`
4. Clique em **Visualizar Impressão (Preview)**. O relatório já carrega os dados vinculados diretamente à view `NAO_EMITIDO_PEDIDOS`.

