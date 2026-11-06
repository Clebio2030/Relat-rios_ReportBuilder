const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DB_PATH = 'localhost/3050:D:\\Administracao\\DB\\ZEGRANDE\\MIAUTOMEC.FDB';
const ISQL_PATH = 'C:\\Program Files\\Firebird\\Firebird_5_0\\isql.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function formatNumber(num) {
    if (num === null || num === undefined) return '0,00';
    return Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dtStr) {
    if (!dtStr) return '';
    // Format YYYY-MM-DD to DD/MM/YYYY
    const parts = dtStr.split(' ')[0].split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dtStr;
}

function getOrders(idempresa, limit = 125) {
    const sqlScript = `
SET HEADING OFF;
SELECT FIRST ${limit}
    '{"idempresa":' || V.IDEMPRESA ||
    ',"empresa":"' || TRIM(V.NOMEEMPRESA) || '"' ||
    ',"nrpedido":' || V.NRPEDIDO ||
    ',"dtsaida":"' || CAST(V.DTSAIDA AS VARCHAR(25)) || '"' ||
    ',"cdcliente":' || COALESCE(V.CDCLIENTE, 0) ||
    ',"cliente":"' || TRIM(REPLACE(REPLACE(COALESCE(V.CLIENTE, ''), '"', '\\"'), '\\', '\\\\')) || '"' ||
    ',"vltotal":' || CAST(V.VLTOTAL_PEDIDO AS NUMERIC(15,2)) ||
    ',"tipo":"' || TRIM(COALESCE(V.TIPO_OPERACAO, '')) || '"' ||
    '}'
FROM NAO_EMITIDO_PEDIDOS V
WHERE V.IDEMPRESA = ${idempresa}
ORDER BY V.DTSAIDA DESC, V.NRPEDIDO DESC;
EXIT;
`;
    const tmpSql = path.join(__dirname, 'tmp_query_sf.sql');
    fs.writeFileSync(tmpSql, sqlScript);

    const cmd = `"${ISQL_PATH}" -u SYSDBA -p masterkey "${DB_PATH}" -q -i "${tmpSql}"`;
    const rawOutput = execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    try { fs.unlinkSync(tmpSql); } catch (e) {}

    const lines = rawOutput.split('\n');
    const orders = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
                orders.push(JSON.parse(trimmed));
            } catch (e) {}
        }
    }
    return orders;
}

function paginateOrders(orders) {
    const pages = [];
    let currentIdx = 0;
    const total = orders.length;

    // Page 1: TitleBand (~8.7mm), HeaderBand (~16.9mm). Can fit 24 items (height 9.53mm).
    // Subsequent pages: HeaderBand (~16.9mm). Can fit 25 items.
    let pageNum = 1;
    while (currentIdx < total) {
        const isFirst = (pageNum === 1);
        const pageSize = isFirst ? 24 : 25;
        const pageItems = orders.slice(currentIdx, currentIdx + pageSize);
        currentIdx += pageSize;
        pages.push({
            pageNum,
            isFirst,
            items: pageItems,
            isLast: (currentIdx >= total)
        });
        pageNum++;
    }
    return pages;
}

function generateSemFiscalHtml(page, totalPages, companyName, totalOrders, totalValue) {
    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
@page {
    size: 215.9mm 279.4mm;
    margin: 0;
}
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
body {
    background-color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    color: #000000;
    width: 215.9mm;
    height: 279.4mm;
    padding-top: 6.35mm;
    padding-left: 6.35mm;
    padding-right: 6.35mm;
    padding-bottom: 11.9mm;
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
}
.report-container {
    width: 203.2mm;
    height: 261.15mm;
    position: relative;
    display: flex;
    flex-direction: column;
}
.title-band {
    text-align: center;
    padding-bottom: 1mm;
    margin-bottom: 1mm;
}
.title-band h1 {
    font-size: 17pt;
    font-weight: bold;
    color: #000000;
    letter-spacing: -0.2px;
}
.header-band {
    border-bottom: 1.2px solid #000000;
    padding-bottom: 1mm;
    margin-bottom: 1mm;
}
.company-title {
    font-size: 13.5pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2mm;
    color: #000000;
}
.columns-header {
    display: flex;
    font-size: 10.5pt;
    font-weight: bold;
    color: #000000;
}
.col-h-data { width: 24mm; }
.col-h-pedido { width: 24mm; }
.col-h-cliente { width: 85mm; }
.col-h-valor { width: 32mm; text-align: right; }
.col-h-tipo { width: 38mm; text-align: left; padding-left: 6mm; }

.details-container {
    flex: 1;
}
.detail-item {
    height: 9.53mm;
    display: flex;
    align-items: center;
    border-bottom: 0.5pt solid #d0d0d0;
    font-size: 9.5pt;
    color: #000000;
}
.d-data { width: 24mm; font-size: 9.5pt; }
.d-pedido { width: 24mm; font-weight: bold; }
.d-cliente { width: 85mm; display: flex; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.d-cdcli { width: 16mm; text-align: right; padding-right: 2.5mm; font-weight: 500; color: #444; }
.d-nomecli { width: 68mm; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.d-valor { width: 32mm; text-align: right; font-weight: bold; }
.d-tipo { width: 38mm; padding-left: 6mm; font-size: 9pt; font-weight: 500; color: #333; }

.summary-band {
    margin-top: 2mm;
    padding-top: 1.5mm;
    border-top: 2px solid #000000;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
.sum-group {
    display: flex;
    align-items: baseline;
}
.sum-label {
    font-size: 15pt;
    font-weight: bold;
    margin-right: 3mm;
}
.sum-val {
    font-size: 16pt;
    font-weight: bold;
    color: #000000;
}
.page-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 8.5pt;
    color: #444444;
}
.page-footer-left {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 8pt;
    color: #777777;
}
</style>
</head>
<body>
<div class="report-container">
`;

    if (page.isFirst) {
        html += `
    <div class="title-band">
        <h1>RELATÓRIO - PEDIDOS SEM EMISSÃO FISCAL</h1>
    </div>
`;
    }

    html += `
    <div class="header-band">
        <div class="company-title">${companyName}</div>
        <div class="columns-header">
            <div class="col-h-data">Data:</div>
            <div class="col-h-pedido">Nr. Pedido:</div>
            <div class="col-h-cliente">Cliente:</div>
            <div class="col-h-valor">Valor:</div>
            <div class="col-h-tipo">Tipo:</div>
        </div>
    </div>

    <div class="details-container">
`;

    for (const item of page.items) {
        html += `
        <div class="detail-item">
            <div class="d-data">${formatDate(item.dtsaida)}</div>
            <div class="d-pedido">${item.nrpedido}</div>
            <div class="d-cliente">
                <span class="d-cdcli">${item.cdcliente}</span>
                <span class="d-nomecli">${item.cliente}</span>
            </div>
            <div class="d-valor">${formatNumber(item.vltotal)}</div>
            <div class="d-tipo">${item.tipo}</div>
        </div>
`;
    }

    html += `   </div>`;

    if (page.isLast) {
        html += `
    <div class="summary-band">
        <div class="sum-group">
            <span class="sum-label">Qtd Pedidos:</span>
            <span class="sum-val">${totalOrders}</span>
        </div>
        <div class="sum-group">
            <span class="sum-label">Valor Total:</span>
            <span class="sum-val">R$ ${formatNumber(totalValue)}</span>
        </div>
    </div>
`;
    }

    html += `
    <div class="page-footer-left">ReportBuilder 21.02 — FireDAC (NAO_EMITIDO_PEDIDOS)</div>
    <div class="page-footer">Página ${page.pageNum} de ${totalPages}</div>
</div>
</body>
</html>
`;
    return html;
}

async function renderSemFiscal(idempresa, dirName, limitOrders = 125) {
    console.log(`\n========================================`);
    console.log(`Querying orders for IDEMPRESA = ${idempresa}...`);
    const orders = getOrders(idempresa, limitOrders);
    if (orders.length === 0) {
        console.log('No orders found.');
        return [];
    }

    const companyName = orders[0].empresa || 'ERP AUTOMEC';
    const totalOrders = orders.length;
    const totalValue = orders.reduce((acc, o) => acc + (Number(o.vltotal) || 0), 0);
    const pages = paginateOrders(orders);
    console.log(`Orders Loaded: ${orders.length} | Pages: ${pages.length} | Valor Total Lote: R$ ${totalValue.toFixed(2)}`);

    const outDir = path.join(__dirname, 'RELATORIOS', '02_Vendas_Sem_Documento_Fiscal', 'prints', dirName);
    fs.mkdirSync(outDir, { recursive: true });

    const artifactDir = path.join('C:\\Users\\Flame\\.gemini\\antigravity\\brain\\fecf6581-03b4-4f3f-a516-bd0cd46ae4a2', 'prints_sem_fiscal', dirName);
    fs.mkdirSync(artifactDir, { recursive: true });

    const chromeTmp = path.join('C:\\Users\\Flame\\AppData\\Local\\Temp', 'chrome_sf_tmp_' + Date.now());
    fs.mkdirSync(chromeTmp, { recursive: true });

    const generated = [];
    for (const page of pages) {
        const html = generateSemFiscalHtml(page, pages.length, companyName, totalOrders, totalValue);
        const htmlPath = path.join(outDir, `pagina_${page.pageNum}.html`);
        fs.writeFileSync(htmlPath, html, 'utf-8');

        const imgName = `pagina_${page.pageNum}.png`;
        const imgPath = path.join(outDir, imgName);
        const artifactImgPath = path.join(artifactDir, imgName);
        const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

        const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${chromeTmp}" --window-size=816,1056 --force-device-scale-factor=2 --screenshot="${imgPath}" "${fileUrl}"`;
        try {
            execSync(cmd, { stdio: 'pipe' });
            fs.copyFileSync(imgPath, artifactImgPath);
            console.log(`[OK] Page ${page.pageNum}/${pages.length} rendered -> ${imgName}`);
            generated.push({
                pageNum: page.pageNum,
                imgPath: imgPath.replace(/\\/g, '/'),
                artifactImgPath: artifactImgPath.replace(/\\/g, '/')
            });
        } catch (err) {
            console.error(`[ERR] Page ${page.pageNum}:`, err.message);
        }
    }
    try { fs.rmSync(chromeTmp, { recursive: true, force: true }); } catch (e) {}
    return generated;
}

async function main() {
    // 1. Zé Grande (Empresa 3) - 5 páginas
    await renderSemFiscal(3, 'Ze_Grande', 124);

    // 2. Casa X (Empresa 4) - 5 páginas
    await renderSemFiscal(4, 'Casa_X', 124);

    console.log('\nAll SemFiscal prints generated successfully!');
}

main();

