# 🚦 Dicionário de Status: SAIDAESTOQUE

O campo `STATUS` da tabela [[SAIDAESTOQUE]] governa todo o ciclo de vida comercial e fiscal do pedido no sistema Automec.

---

## 📋 Mapeamento Completo dos Status (Oficial do Sistema)

| Código | Significado Oficial | Descrição Operacional | Emissão Fiscal |
| :---: | :--- | :--- | :---: |
| **`0`** | **Aberto** | Pedido em digitação ou orçamento ainda não finalizado no caixa | **Não** |
| **`1`** | **Finalizado** | Venda normal finalizada no caixa **sem** emissão de documento fiscal | **Não** |
| **`2`** | **Cancelado** | Pedido cancelado e estornado do sistema | Desconsiderar |
| **`3`** | **NotaFiscal Emitida** | Venda finalizada com emissão de Cupom Fiscal, NFC-e ou NF-e autorizada | **SIM** |
| **`4`** | **Troca em aberto** | Troca/devolução iniciada em digitação no balcão | **Não** |
| **`9`** | **Excluído** | Status não é usado | Desconsiderar |
| **`40`** | **Troca Finalizada** | Movimento de troca de mercadoria finalizada no caixa sem emissão fiscal | **Não** |
| **`42`** | **Troca cancelada** | Status não é usado | Desconsiderar |
| **`43`** | **Troca com NFE** | Devolução formalizada com Nota Fiscal de Devolução emitida | **SIM** |

> [!IMPORTANT]
> **Filtro Estritamente Fiscal:** Quando o objetivo for auditar exclusivamente movimentações com documento fiscal emitido, o filtro correto é:
> ```sql
> WHERE SE.STATUS IN (3, 43)
> ```

---

## ⚡ Gatilhos de Banco que Usam o Status:

No banco de dados, o trigger `SAIDAESTOQUE_PEDIDO_FINALIZADO` monitora a transição de status:
```sql
AS
begin
    if (old.status = 0) then
    begin
        if (new.status = 1) then
            post_event 'GEROUPEDIDO_1|' || new.idempresa; -- Finalizado SEM nota

        if (new.status = 3) then
            post_event 'GEROUPEDIDO_3|' || new.idempresa; -- Finalizado COM nota
    end
end
```

## 🔗 Relações Neurais (Links)
* ⬅️ Campo nativo de [[SAIDAESTOQUE]].
* ➡️ Critério central para separar [[DIFERENCA_PEDIDO_VS_TROCA]].
* ➡️ Filtro da view [[NAO_EMITIDO_PEDIDOS]].
* ➡️ Filtro da view [[AUDITORIA_ENTRADA_SAIDA]].
