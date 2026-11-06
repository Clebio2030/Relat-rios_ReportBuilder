# 🔄 O que Separa a Troca do Pedido

No sistema Automec, tanto pedidos normais de venda quanto operações de troca/devolução ficam registrados na mesma tabela mestre: [[SAIDAESTOQUE]].

A diferenciação entre eles é feita através de campos e regras bem definidos:

---

## 🎯 1. O Campo Divisor Principal: `STATUS`

* **`STATUS = 1`** ➡️ **PEDIDO (VENDA NORMAL):**
  * Representa uma saída regular de estoque para cliente.
  * O valor total (`VLTOTAL`) é positivo.
  * Gera registros positivos em [[CTARECEBER_PROV]] com as formas de pagamento acordadas.

* **`STATUS = 40`** ➡️ **TROCA / DEVOLUÇÃO:**
  * Representa a devolução de itens para o estoque com geração de crédito/vale.
  * O valor total (`VLTOTAL`) é **negativo** (ex: `-R$ 119,90`, `-R$ 414,00`).
  * As parcelas em [[CTARECEBER_PROV]] possuem valor negativo e formas como `'DEVOLUÇÃO VALE'`, `'DEVOLUÇÃO DINHEIRO'`, etc.
  * O campo `NRORCAMENTO` muitas vezes aponta para o `NRPEDIDO` original da venda que foi devolvida.

---

## 🔍 2. Comparativo Detalhado de Campos

| Característica | Pedido Normal (`STATUS = 1`) | Troca / Devolução (`STATUS = 40`) |
| :--- | :--- | :--- |
| **`STATUS` em SAIDAESTOQUE** | `1` | `40` |
| **Sinal do `VLTOTAL`** | Positivo (`+R$`) | Negativo (`-R$`) |
| **Sinal do `VALOR` em CTARECEBER_PROV** | Positivo (`+R$`) | Negativo (`-R$`) |
| **Formas típicas em RECEBTO** | `1 DINHEIRO`, `3 PIX`, `2 DEBITO` | `DEVOLUÇÃO VALE`, `DEVOLUÇÃO DINHEIRO` |
| **Impacto no Estoque** | Saída (`QTDE * -1`) | Entrada (`QTDE * +1`) |
| **Campo `NRORCAMENTO`** | Orçamento prévio ou NULL | ID do pedido original que gerou a devolução |

---

## 💻 3. Como classificar em consultas SQL:

```sql
CASE 
    WHEN SE.STATUS = 40 THEN 'TROCA'
    WHEN SE.STATUS = 0  THEN 'PEDIDO EM ABERTO'
    WHEN SE.STATUS = 1  THEN 'PEDIDO'
    ELSE 'OUTROS'
END AS TIPO_OPERACAO
```

Esta regra está implementada diretamente na view [[NAO_EMITIDO_PEDIDOS]].

