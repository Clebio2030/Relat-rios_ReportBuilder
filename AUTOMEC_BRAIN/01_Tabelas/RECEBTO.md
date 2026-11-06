# 💵 Tabela: RECEBTO

A tabela `RECEBTO` é o dicionário de formas de recebimento e meios de pagamento configurados no sistema Automec.

## 🔑 Chave Primária
* `CDRECEBTO` (`INTEGER`) — Código identificador da forma de recebimento.

## 📌 Principais Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `CDRECEBTO` | `INTEGER` | Código da forma de pagamento |
| `RECEBTO` | `VARCHAR(50)` | Nome/descrição legível da forma (ex: `'1 DINHEIRO'`, `'3 PIX'`, `'2 DEBITO'`) |
| `MEIO_PAGTO` | `VARCHAR(3)` | Código fiscal padrão SEFAZ do meio de pagamento (ex: `01` = Dinheiro, `03` = Cartão Crédito, `04` = Cartão Débito, `17` = PIX) |
| `CDGRUPO` | `INTEGER` | Grupo de recebimento (1 = À Vista, 2 = Cheque, 3 = Cartão, 4 = Carteira, 5 = Vale, 6 = Devolução, 7 = Boleto) |
| `INATIVO` | `INTEGER` | 0 ou NULL = Ativo, -1 = Inativo |

## 🌟 Regra do `LIKE '%DINHEIRO%'`
Para identificar pagamentos em dinheiro com segurança, **não** dependa apenas do código `CDRECEBTO = 1`. A tabela possui registros como:
* `1` ➡️ `'1 DINHEIRO'`
* `10` ➡️ `'DEVOLUÇÃO DINHEIRO'`

Por isso, a regra oficial e assertiva é:
```sql
UPPER(COALESCE(R.RECEBTO, '')) LIKE '%DINHEIRO%'
```
Veja mais detalhes em [[FORMAS_DE_PAGAMENTO_E_DINHEIRO]].

## 🔗 Relações Neurais (Links)
* ⬅️ Relaciona-se com as parcelas em [[CTARECEBER_PROV]] via `CDRECEBTO = CODPAGTO`.
* ➡️ Fornece o código fiscal `MEIO_PAGTO` para validações tributárias da SEFAZ em [[NOTAFISCAL]].

