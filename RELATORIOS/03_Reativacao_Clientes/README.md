# 📊 Inteligência Comercial: Reativação de Clientes Inativos

Esta consulta/view foi concebida para a equipe comercial e de televendas, com foco na recuperação ativa de clientes que pararam de comprar, contornando uma falha nativa do ERP Automec onde o campo `CLIENTE.DTULTCOMPRA` não é atualizado com precisão.

---

## 📁 Arquivos do Módulo

| Arquivo | Tipo | Descrição |
| :--- | :--- | :--- |
| [`REATIVANDO_CLIENTES.sql`](./REATIVANDO_CLIENTES.sql) | **View Firebird** | Fonte de dados que calcula a data da última compra real direto da movimentação de saídas finalizadas (`SAIDAESTOQUE`), agrupando por faixas de inatividade. |

---

## 🧠 Regras de Negócio

1. **Cálculo Real da Última Compra:**
   * Utiliza `MAX(SE.DTSAIDA)` filtrando apenas vendas concluídas (`SE.STATUS IN (1, 3)`), ignorando cancelamentos.
2. **Classificação por Faixas de Inatividade (`FAIXA_INATIVIDADE`):**
   * `INATIVO RECENTE (60 A 90 DIAS)`
   * `INATIVO MEDIO (91 A 180 DIAS)`
   * `INATIVO CRITICO (> 180 DIAS)`
   * `PERDIDO (> 365 DIAS)`
3. **Métricas de Relacionamento:**
   * `TOTAL_HISTORICO_COMPRADO`: Soma total gasta pelo cliente na história da empresa.
   * `QTD_PEDIDOS_HISTORICO`: Total de vezes que o cliente comprou.
   * `TICKET_MEDIO`: Gasto médio por pedido do cliente.

---

## 🚀 Como Utilizar

Execute o script [`REATIVANDO_CLIENTES.sql`](./REATIVANDO_CLIENTES.sql) no Firebird para disponibilizar a view `REATIVANDO_CLIENTES` para novos relatórios no ReportBuilder ou exportação para campanhas de WhatsApp/CRM.

