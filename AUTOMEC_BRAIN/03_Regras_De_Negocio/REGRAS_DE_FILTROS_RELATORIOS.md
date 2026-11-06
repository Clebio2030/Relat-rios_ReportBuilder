# 📐 Regras Oficiais de Filtragem: Relatórios & Consultas ERP Automec

Este documento define a convenção e a arquitetura padrão para filtros aplicados aos relatórios do ERP Automec (ReportBuilder / FastReport / Views SQL).

---

## 🎯 As Duas Regras Fundamentais de Filtro

### 1️⃣ Regra 1: Filtro de Depósito Apenas (Filtra Tudo)
* **Finalidade:** Auditoria de Estoque Físico, Inventário e Diferença de Mercadorias (Furo Fiscal de Estoque).
* **Diretriz de Uso:** Quando o usuário seleciona **apenas o Depósito**, o relatório deve **filtrar tudo** correspondente àquele estoque físico específico, trazendo todas as movimentações daquele galpão independentemente da empresa que emitiu.
* **Por que funciona:** No ERP Automec, o estoque físico é controlado por `CDDEPOSITO` (ex: `1002` = ZÉ GRANDE, `1004` = CASA X). Filtrar apenas o depósito isola completamente o galpão físico e consolida todas as entradas e saídas que passaram por ali.
* **Campos Envolvidos:**
  * `CDDEPOSITO` (Código numérico: `1002`, `1004`, etc.)
  * `DEPOSITO` (Nome textual: `'ZE GRANDE'`, `'CASA X'`, etc.)
* **Exemplo de Aplicação (SQL):**
  ```sql
  WHERE CDDEPOSITO = :CDDEPOSITO
  ```

---

### 2️⃣ Regra 2: Filtro de Período e Empresa
* **Finalidade:** Auditoria Fiscal (SEFAZ / DIMP), Faturamento, Fechamentos Contábeis e Vendas Sem Documento Fiscal.
* **Diretriz de Uso:** Relatórios fiscais, contábeis ou de movimentação financeira devem ser filtrados obrigatoriamente pela combinação da **Empresa Emitente (`IDEMPRESA`)** e do **Período (`Data Inicial` a `Data Final`)**.
* **Por que funciona:** A fiscalização tributária e as obrigações acessórias (SPED, DIMP, Livros de Entrada/Saída) são estritamente vinculadas a cada CNPJ (`IDEMPRESA`) em uma competência temporal fechada (ex: `01/10/2026 a 31/10/2026`).
* **Campos Envolvidos:**
  * `IDEMPRESA` (1 = JPR, 2 = ZG, 3 = ZÉ GRANDE, 4 = CASA X).
  * `NOMEEMPRESA` (Razão Social).
  * `DTSAIDA` ou `DTMOV` (Intervalo de datas da movimentação).
* **Exemplo de Aplicação (SQL):**
  ```sql
  WHERE IDEMPRESA = :IDEMPRESA
    AND DTSAIDA BETWEEN :DT_INICIAL AND :DT_FINAL
  ```

---

## 📋 Matriz de Aplicação por Relatório

| Relatório | Regra Primária Recomendada | Como Aplicar no ReportBuilder / FastReport |
| :--- | :--- | :--- |
| **01. Auditoria Entradas vs Saídas (`EntradaXSaida.rtm`)** | **Regra 1: Depósito Apenas** | Filtrar `WHERE CDDEPOSITO = :CDDEPOSITO`. Filtra todo o estoque físico daquele galpão com precisão cirúrgica. |
| **02. Vendas Sem Documento Fiscal (`SemFiscal.rtm`)** | **Regra 2: Período e Empresa** | Filtrar `WHERE IDEMPRESA = :IDEMPRESA AND DTSAIDA BETWEEN :DTINI AND :DTFIM`. Apura o risco fiscal e financeiro por CNPJ e competência. |
| **03. Reativação de Clientes Inativos (`REATIVANDO_CLIENTES`)** | **Regra 2 (Empresa) ou Sem Filtro** | Filtrar `WHERE IDEMPRESA = :IDEMPRESA` para segmentar a carteira de televendas por filial. |
