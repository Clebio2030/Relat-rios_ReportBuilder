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

function getProducts(cddeposito) {
    const sqlScript = `
SET HEADING OFF;
SELECT 
    '{"idempresa":' || V.IDEMPRESA ||
    ',"empresa":"' || TRIM(V.NOMEEMPRESA) || '"' ||
    ',"cddeposito":' || V.CDDEPOSITO ||
    ',"deposito":"' || TRIM(V.DEPOSITO) || '"' ||
    ',"cdproduto":"' || TRIM(V.CDPRODUTO) || '"' ||
    ',"descricao":"' || TRIM(REPLACE(REPLACE(V.DESCRICAO, '"', '\\"'), '\\', '\\\\')) || '"' ||
    ',"unid":"' || TRIM(V.UNID) || '"' ||
    ',"qtd_entrada":' || CAST(V.QTD_ENTRADA AS NUMERIC(15,2)) ||
    ',"qtd_vendida":' || CAST(V.QTD_VENDIDA AS NUMERIC(15,2)) ||
    ',"excesso_vendido":' || CAST(V.EXCESSO_VENDIDO AS NUMERIC(15,2)) ||
    ',"estoque_atual":' || CAST(V.ESTOQUE_ATUAL AS NUMERIC(15,2)) ||
    '}'
FROM AUDITORIA_ENTRADA_SAIDA V
${cddeposito ? `WHERE V.CDDEPOSITO = ${cddeposito}` : ''}
ORDER BY V.EXCESSO_VENDIDO DESC;
EXIT;
`;
    const tmpSql = path.join(__dirname, 'tmp_query.sql');
    fs.writeFileSync(tmpSql, sqlScript);

    const cmd = `"${ISQL_PATH}" -u SYSDBA -p masterkey "${DB_PATH}" -q -i "${tmpSql}"`;
    const rawOutput = execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    try { fs.unlinkSync(tmpSql); } catch (e) {}

    const lines = rawOutput.split('\n');
    const products = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
                products.push(JSON.parse(trimmed));
            } catch (e) {}
        }
    }
    return products;
}

function paginateProducts(products) {
    const pages = [];
    let currentIdx = 0;
    const total = products.length;

    // Page 1 has Title Band (~13.8mm), Header (~16.9mm). Can fit 16 items.
    // Following pages have Header (~16.9mm). Can fit 17 items.
    let pageNum = 1;
    while (currentIdx < total) {
        const isFirst = (pageNum === 1);
        const pageSize = isFirst ? 16 : 17;
        const pageItems = products.slice(currentIdx, currentIdx + pageSize);
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

function generatePageHtml(page, totalPages, companyName, totalDifference) {
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
    padding-bottom: 1.5mm;
    margin-bottom: 1mm;
}
.title-band h1 {
    font-size: 15.5pt;
    font-weight: bold;
    color: #000000;
    letter-spacing: -0.3px;
    margin-bottom: 1mm;
}
.title-band p {
    font-size: 8.5pt;
    font-weight: bold;
    color: #222222;
}
.header-band {
    border-bottom: 1.2px solid #000000;
    padding-bottom: 1mm;
    margin-bottom: 0.5mm;
}
.company-title {
    font-size: 13pt;
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
.col-h-deposito { width: 22mm; }
.col-h-produto { width: 146mm; }
.col-h-estoque { width: 35mm; text-align: right; }

.details-container {
    flex: 1;
}
.detail-item {
    height: 13.23mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 0.75pt solid #b0b0b0;
    padding: 0.5mm 0;
}
.line-1 {
    display: flex;
    font-size: 9.5pt;
    color: #000000;
    align-items: baseline;
}
.d-dep { width: 22mm; font-size: 9pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.d-cod { width: 18mm; text-align: right; padding-right: 3mm; font-weight: bold; }
.d-desc { width: 128mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.d-est { width: 35mm; text-align: right; font-weight: bold; }

.line-2 {
    display: flex;
    font-size: 10pt;
    align-items: baseline;
    margin-top: 0.4mm;
}
.f-label { font-weight: bold; font-size: 10pt; color: #000; }
.f-val { margin-left: 1.5mm; margin-right: 5mm; font-size: 10pt; }
.f-dif-val { margin-left: 1.5mm; font-size: 10pt; font-weight: bold; color: #b30000; }

.summary-band {
    margin-top: 2mm;
    padding-top: 1.5mm;
    border-top: 2px solid #000000;
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
}
.sum-label {
    font-size: 16pt;
    font-weight: bold;
    margin-right: 4mm;
}
.sum-val {
    font-size: 16pt;
    font-weight: bold;
    color: #b30000;
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
        <h1>ENTRADAS E SAÍDAS COM NOTA FISCAL ACIMA DE PRODUTOS</h1>
        <p>*Só exibe produtos que estão com saídas acima de entradas feita, só são somados pedidos e trocas com nota fiscal emitido.</p>
    </div>
`;
    }

    html += `
    <div class="header-band">
        <div class="company-title">${companyName}</div>
        <div class="columns-header">
            <div class="col-h-deposito">Depósito</div>
            <div class="col-h-produto">Produto:</div>
            <div class="col-h-estoque">Estoque Atual:</div>
        </div>
    </div>

    <div class="details-container">
`;

    for (const item of page.items) {
        html += `
        <div class="detail-item">
            <div class="line-1">
                <div class="d-dep">${item.deposito}</div>
                <div class="d-cod">${item.cdproduto}</div>
                <div class="d-desc">${item.descricao}</div>
                <div class="d-est">${formatNumber(item.estoque_atual)}</div>
            </div>
            <div class="line-2">
                <span class="f-label">Qtd Entrada Total:</span>
                <span class="f-val">${formatNumber(item.qtd_entrada)}</span>
                <span class="f-label">Qtd Venda Total:</span>
                <span class="f-val">${formatNumber(item.qtd_vendida)}</span>
                <span class="f-label">Dif.:</span>
                <span class="f-dif-val">${formatNumber(item.excesso_vendido)}</span>
            </div>
        </div>
`;
    }

    html += `   </div>`;

    if (page.isLast) {
        html += `
    <div class="summary-band">
        <span class="sum-label">Diferença Total:</span>
        <span class="sum-val">${formatNumber(totalDifference)}</span>
    </div>
`;
    }

    html += `
    <div class="page-footer-left">ReportBuilder 21.02 — FireDAC (AUDITORIA_ENTRADA_SAIDA)</div>
    <div class="page-footer">Página ${page.pageNum} de ${totalPages}</div>
</div>
</body>
</html>
`;
    return html;
}

async function renderReport(cddeposito, outputDirName) {
    console.log(`\n========================================`);
    console.log(`Generating report for CDDEPOSITO = ${cddeposito || 'ALL'}...`);
    const products = getProducts(cddeposito);
    if (products.length === 0) {
        console.log('No products found.');
        return [];
    }

    const companyName = products[0].empresa || 'ERP AUTOMEC';
    const totalDifference = products.reduce((acc, p) => acc + (Number(p.excesso_vendido) || 0), 0);
    const pages = paginateProducts(products);
    console.log(`Total Products: ${products.length} | Total Pages: ${pages.length} | Excesso Total: ${totalDifference.toFixed(2)}`);

    const outDir = path.join(__dirname, 'RELATORIOS', '01_Auditoria_Entrada_vs_Saida', 'prints', outputDirName);
    fs.mkdirSync(outDir, { recursive: true });

    // Also artifact dir
    const artifactDir = path.join('C:\\Users\\Flame\\.gemini\\antigravity\\brain\\fecf6581-03b4-4f3f-a516-bd0cd46ae4a2', 'prints', outputDirName);
    fs.mkdirSync(artifactDir, { recursive: true });

    const generatedImages = [];
    const chromeTmpProfile = path.join('C:\\Users\\Flame\\AppData\\Local\\Temp', 'chrome_report_tmp_' + Date.now());
    fs.mkdirSync(chromeTmpProfile, { recursive: true });

    for (const page of pages) {
        const html = generatePageHtml(page, pages.length, companyName, totalDifference);
        const htmlPath = path.join(outDir, `pagina_${page.pageNum}.html`);
        fs.writeFileSync(htmlPath, html, 'utf-8');

        const imgName = `pagina_${page.pageNum}.png`;
        const imgPath = path.join(outDir, imgName);
        const artifactImgPath = path.join(artifactDir, imgName);

        // Convert file path to file:// URL
        const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

        // Letter size at 96 DPI: 816 x 1056. Force scale factor 2 for crisp 1632x2112
        const chromeArgs = [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            `--user-data-dir="${chromeTmpProfile}"`,
            '--window-size=816,1056',
            '--force-device-scale-factor=2',
            `--screenshot="${imgPath}"`,
            `"${fileUrl}"`
        ];

        const cmd = `"${CHROME_PATH}" ${chromeArgs.join(' ')}`;
        try {
            execSync(cmd, { stdio: 'pipe' });
            // Copy to artifact dir
            fs.copyFileSync(imgPath, artifactImgPath);
            console.log(`[OK] Page ${page.pageNum}/${pages.length} rendered -> ${imgName}`);
            generatedImages.push({
                pageNum: page.pageNum,
                imgPath: imgPath.replace(/\\/g, '/'),
                artifactImgPath: artifactImgPath.replace(/\\/g, '/')
            });
        } catch (err) {
            console.error(`[ERR] Failed to render page ${page.pageNum}:`, err.message);
        }
    }

    try {
        fs.rmSync(chromeTmpProfile, { recursive: true, force: true });
    } catch (e) {}

    return generatedImages;
}

async function main() {
    // 1. Render Casa X (1004) - 193 products
    const casaXImages = await renderReport(1004, 'Casa_X');

    // 2. Render Ze Grande (1002) - first 5 pages for sample preview
    console.log('\nRendering Zé Grande sample...');
    const zgProducts = getProducts(1002);
    console.log(`Zé Grande total products: ${zgProducts.length}. Rendering first 5 pages...`);
    // Sample first 85 products (approx 5 pages)
    const zgSample = zgProducts.slice(0, 84);
    const zgPages = paginateProducts(zgSample);
    const zgOutDir = path.join(__dirname, 'RELATORIOS', '01_Auditoria_Entrada_vs_Saida', 'prints', 'Ze_Grande');
    const zgArtifactDir = path.join('C:\\Users\\Flame\\.gemini\\antigravity\\brain\\fecf6581-03b4-4f3f-a516-bd0cd46ae4a2', 'prints', 'Ze_Grande');
    fs.mkdirSync(zgOutDir, { recursive: true });
    fs.mkdirSync(zgArtifactDir, { recursive: true });
    const chromeTmp = path.join('C:\\Users\\Flame\\AppData\\Local\\Temp', 'chrome_zg_tmp_' + Date.now());
    fs.mkdirSync(chromeTmp, { recursive: true });

    const zgTotalDifference = zgProducts.reduce((acc, p) => acc + (Number(p.excesso_vendido) || 0), 0);

    for (const page of zgPages) {
        const html = generatePageHtml(page, Math.ceil(zgProducts.length / 17), zgProducts[0].empresa, zgTotalDifference);
        const htmlPath = path.join(zgOutDir, `pagina_${page.pageNum}.html`);
        fs.writeFileSync(htmlPath, html, 'utf-8');

        const imgName = `pagina_${page.pageNum}.png`;
        const imgPath = path.join(zgOutDir, imgName);
        const artifactImgPath = path.join(zgArtifactDir, imgName);
        const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

        const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --no-sandbox --user-data-dir="${chromeTmp}" --window-size=816,1056 --force-device-scale-factor=2 --screenshot="${imgPath}" "${fileUrl}"`;
        try {
            execSync(cmd, { stdio: 'pipe' });
            fs.copyFileSync(imgPath, artifactImgPath);
            console.log(`[OK] Zé Grande Page ${page.pageNum} rendered -> ${imgName}`);
        } catch (e) {
            console.error(e.message);
        }
    }
    try { fs.rmSync(chromeTmp, { recursive: true, force: true }); } catch (e) {}

    console.log('\nDone rendering all reports!');
}

main();
