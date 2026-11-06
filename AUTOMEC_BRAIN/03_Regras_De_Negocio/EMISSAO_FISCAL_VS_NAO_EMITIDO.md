# ⚖️ Emissão Fiscal vs Pedidos Não Emitidos

Compreender o que é um pedido "não emitido" no ERP Automec é vital para relatórios contábeis, fechamento de caixa e cruzamento fiscal com a SEFAZ.

---

## 🧾 1. Como o sistema registra que um pedido FOI EMITIDO:

Quando um pedido é emitido fiscalmente (seja por NFC-e, NF-e ou Cupom Fiscal):
1. **`STATUS = 3`** na tabela [[SAIDAESTOQUE]].
2. **`NUMCUPOM = -1`** (indica emissão de cupom fiscal/NFC-e).
3. **`CHAVE_NFCE`** preenchida com a chave de 44 dígitos da SEFAZ (ex: `33261141182804000136650010000947391678893814`).
4. **Registro em [[NOTAFISCAL]]:** Criado com `NRDOC` preenchido (ex: `000002088` ou `000094684CFE`) e `NFE_EMITIDA = -1`.

---

## 🚫 2. Como identificar pedidos NÃO EMITIDOS:

Um pedido é considerado **não emitido** quando:
1. `SE.STATUS NOT IN (2, 42)` — O pedido é válido (não está cancelado).
2. `NF.NRDOC IS NULL` — Não possui nota fiscal ativa autorizada em [[NOTAFISCAL]] (`COALESCE(NF.NFE_CANCELADA, 0) = 0 AND COALESCE(NF.STATUS, 0) <> 9`).

> [!IMPORTANT]
> **Por que removemos o filtro de `NUMCUPOM` e `CHAVE_NFCE`?**
> No caso de notas canceladas (ex: Pedido 3416), o Automec cancela o registro na `NOTAFISCAL`, mas mantém os campos `NUMCUPOM` e `CHAVE_NFCE` preenchidos na `SAIDAESTOQUE`. Se filtrássemos por eles, o pedido desaparecia do relatório. Portanto, a regra definitiva e soberana é a ausência de documento fiscal ativo (`NF.NRDOC IS NULL`).

---

## 🔎 3. SQL padrão para isolar Não Emitidos:

```sql
SELECT SE.NRPEDIDO, SE.CLIENTE, SE.VLTOTAL
FROM SAIDAESTOQUE SE
LEFT JOIN NOTAFISCAL NF 
    ON NF.NRPEDIDO = SE.NRPEDIDO 
   AND NF.IDEMPRESA = SE.IDEMPRESA 
   AND COALESCE(NF.NFE_CANCELADA, 0) = 0
   AND COALESCE(NF.STATUS, 0) <> 9
WHERE SE.STATUS NOT IN (2, 42)
  AND (NF.NRDOC IS NULL);
```

Implementado e validado na view [[NAO_EMITIDO_PEDIDOS]].

