# 🏢 Tabela: CONFIGURACAO

A tabela `CONFIGURACAO` guarda o cadastro de cada empresa, loja e filial do grupo empresarial dentro do mesmo banco de dados multiloja.

## 🔑 Chave Primária
* `IDEMPRESA` (`INTEGER`) — Código da filial / empresa.

## 📌 Principais Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `IDEMPRESA` | `INTEGER` | Identificador da empresa |
| `NOMEEMPRESA` | `VARCHAR(60)` | Nome fantasia / comercial da loja |
| `CNPJ` | `VARCHAR(20)` | CNPJ da empresa |
| `INSCEST` | `VARCHAR(15)` | Inscrição Estadual |
| `SERIE_NFE` | `INTEGER` | Série padrão de emissão de NF-e |
| `SERIE_NFCE` | `INTEGER` | Série padrão de emissão de NFC-e |
| `UF` | `CHAR(2)` | Estado da empresa |

## 🏬 Empresas Ativas no Banco MIAUTOMEC:

| ID | Nome Empresa |
| :---: | :--- |
| **1** | JPR DE MATERIAL DE CONSTRUÇÃO LTDA |
| **2** | ZG COMERCIO DE MATERIAL DE CONSTRUÇÃO LTDA |
| **3** | ZE GRANDE DE MIGUEL COUTO MATERIAL DE CONSTRUÇÃO LTDA |
| **4** | CASA X CONSTRUCAO DECORACAO E UTILIDADES DO LAR LTDA |

## 🔗 Relações Neurais (Links)
* ➡️ Toda saída em [[SAIDAESTOQUE]] pertence a uma `IDEMPRESA`.
* ➡️ Todo contas a receber em [[CTARECEBER_PROV]] pertence a uma `IDEMPRESA`.
* ➡️ Todo documento fiscal em [[NOTAFISCAL]] pertence a uma `IDEMPRESA`.

