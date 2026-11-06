# 💵 Formas de Pagamento e a Regra do LIKE '%DINHEIRO%'

O controle financeiro do PDV/balcão do ERP Automec utiliza as tabelas [[CTARECEBER_PROV]] e [[RECEBTO]].

---

## 🎯 1. Por que usar `LIKE '%DINHEIRO%'`?

Muitos desenvolvedores cometem o erro de filtrar `CODPAGTO = 1`. Porém, na base de dados real do sistema:
* `CDRECEBTO = 1` ➡️ `'1 DINHEIRO'` (Venda à vista em espécie)
* `CDRECEBTO = 10` ➡️ `'DEVOLUÇÃO DINHEIRO'` (Troca devolvendo troco/dinheiro)
* Outras filiais podem ter `'DINHEIRO BALCÃO'` ou variações cadastradas.

A verificação mais robusta e à prova de falhas é:
```sql
CASE 
    WHEN UPPER(COALESCE(R.RECEBTO, '')) LIKE '%DINHEIRO%' THEN 'S'
    ELSE 'N'
END AS E_DINHEIRO
```

---

## 🚨 2. Risco Fiscal: Meios Eletrônicos (PIX / Cartão) sem Nota

* **Dinheiro em espécie:** Tradicionalmente em lojas de varejo e construção, vendas em dinheiro sem nota ocorrem no balcão (venda não fiscal).
* **PIX e Cartões de Crédito/Débito:** Bancos e adquirentes enviam declarações automáticas à SEFAZ (DIMP / DIRF / e-Financeira). Vendas em PIX ou Cartão sem documento fiscal representam divergência imediata no cruzamento de dados da Receita Estadual.
* Por isso, a visualização [[NAO_EMITIDO_PEDIDOS]] com o flag `E_DINHEIRO` permite auditar rapidamente pedidos recebidos via PIX/Cartão que ficaram sem nota fiscal emitida.

---

## 🔗 Links Neurais
* ⬅️ Regra aplicada nas parcelas de [[CTARECEBER_PROV]].
* ⬅️ Descrições fornecidas por [[RECEBTO]].
* ➡️ Campo computado `E_DINHEIRO` da view [[NAO_EMITIDO_PEDIDOS]].

