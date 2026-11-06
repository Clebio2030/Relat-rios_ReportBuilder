# 📊 View: AUDITORIA_ENTRADA_SAIDA (Auditoria Fiscal Acumulada)

## 🎯 Objetivo
Identificar produtos cuja **quantidade vendida fiscalmente superou a quantidade que deu entrada com nota de compra** no **ACUMULADO HISTÓRICO**, eliminando completamente distorções de virada de mês (ex: compras volumosas feitas no início do ano que atendem vendas graduais ao longo dos meses seguintes).

* **View SQL:** [`AUDITORIA_ENTRADA_SAIDA.sql`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/01_Auditoria_Entrada_vs_Saida/AUDITORIA_ENTRADA_SAIDA.sql)
* **Template Visual ReportBuilder:** [`EntradaXSaida.rtm`](file:///d:/Área%20de%20Trabalho/Implantação/Relatórios_IA/RELATORIOS/01_Auditoria_Entrada_vs_Saida/EntradaXSaida.rtm)

---

## 💡 Por que o Cálculo Deve Ser Acumulado? (Caso Real do Produto 2134)

No produto **`2134` (CX D AGUA 1000LT FORTLEV)** no depósito **`1004` (CASA X)**:
* Em **25/03/2026**, deram entrada em **30 caixas d'água** (NF 1533719).
* O produto foi vendendo ao longo de Abril.
* Em **Maio/2026**, foram vendidas **14 unidades** e deram entrada em mais **10 unidades** (NF 1544375 em 13/05/2026).
* **O Erro da Análise Mensal Isolada:**
  * Se olharmos apenas Maio/2026: Entrada = 10, Venda = 14 $\rightarrow$ apontaria falsamente um "excesso" de +4 caixas vendidas.
  * **A Realidade do Estoque:** O saldo no início de Maio era positivo (ainda restavam 25 peças do lote de 30 de Março). Portanto, a venda de 14 peças estava **100% coberta fiscalmente**!
* **A Correção pelo Acumulado:**
  * Ao somar todas as compras acumuladas ($30 + 10 = 40$) e comparar com as vendas acumuladas até Maio ($24$), o sistema constata que **não havia excesso nem furo** em Maio ($24 \le 40$).

---

## 🚦 Regras de Negócio e Status

### 1. Entradas Fiscais (`ENTRPRODUTO` + `ENTRESTOQUE`)
* **Status Considerado:** Apenas entradas ativas de compras (`E.STATUS = 1`).
* **Cancelados:** Ignora `E.STATUS = 2`.
* **Volume:** `SUM(EP.QTDE)`.

### 2. Saídas Fiscais (`SAIDAPRODUTO` + `SAIDAESTOQUE`)
* **Status Considerados:**
  * `SE.STATUS = 3`: NotaFiscal Emitida (NFC-e / NF-e autorizada).
  * `SE.STATUS = 43`: Troca com NFE (Devolução fiscal de cliente).
* **Status Ignorados:**
  * `SE.STATUS = 1`: Finalizado sem emissão fiscal.
  * `SE.STATUS = 40`: Troca sem emissão fiscal.
  * `SE.STATUS IN (0, 2, 4, 9, 42)`: Aberto, cancelados e não usados.

### 3. Regra de Ouro em `SAIDAPRODUTO` (STATUSSE <> 9)
* **Filtro Mandatório:** `(SP.STATUSSE IS NULL OR SP.STATUSSE <> 9)`
* Quando o operador de caixa edita ou cancela uma linha de item de um pedido no ERP Automec, o sistema não deleta a linha: ele grava `STATUSSE = 9` e gera uma nova linha com `STATUSSE = 0`. Consultas que somam sem esse filtro duplicam itens reeditados (como ocorreu no caso do produto 2134 que mostrava 51 peças vendidas em vez das 38 reais).

### 4. Filtro de Furo Fiscal Real
* A View filtra:
  $$\mathbf{QTD\_VENDIDA > QTD\_ENTRADA}$$
* Traz exclusivamente produtos onde o **total de notas fiscais emitidas para clientes superou o total de notas fiscais de compra recebidas** para aquele estoque.

---

## 🏛️ Estrutura das Colunas da View

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `IDEMPRESA` | `INTEGER` | ID da Empresa faturadora (1: JPR, 2: ZG, 3: ZÉ GRANDE, 4: CASA X). |
| `NOMEEMPRESA` | `VARCHAR(60)` | Nome da empresa faturadora. |
| `CDDEPOSITO` | `INTEGER` | Código do Estoque / Depósito Físico (1002: ZÉ GRANDE, 1004: CASA X). |
| `DEPOSITO` | `VARCHAR(30)` | Nome do Depósito Físico. |
| `CDPRODUTO` | `VARCHAR(10)` | Código interno do produto. |
| `DESCRICAO` | `VARCHAR(150)` | Descrição completa do produto. |
| `UNID` | `VARCHAR(3)` | Unidade de medida (UN, CX, KG, MT). |
| `QTD_ENTRADA` | `DOUBLE` | Quantidade total acumulada que deu entrada com nota de compra. |
| `QTD_VENDIDA` | `DOUBLE` | Quantidade total acumulada vendida com documento fiscal (Status 3 e 43). |
| `EXCESSO_VENDIDO` | `DOUBLE` | Volume vendido a descoberto fiscal (`QTD_VENDIDA - QTD_ENTRADA`). |
| `ESTOQUE_ATUAL` | `DOUBLE` | Saldo físico atual em tempo real daquele produto no depósito (`MOVIMENTO.QTDEATUAL`). |
| `DT_PRIMEIRA_ENTRADA` | `TIMESTAMP` | Data da primeira nota de entrada registrada. |
| `DT_ULTIMA_ENTRADA` | `TIMESTAMP` | Data da última nota de entrada registrada. |
| `DT_PRIMEIRA_VENDA` | `TIMESTAMP` | Data da primeira venda fiscal registrada. |
| `DT_ULTIMA_VENDA` | `TIMESTAMP` | Data da última venda fiscal registrada. |
