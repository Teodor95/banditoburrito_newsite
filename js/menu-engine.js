/**
 * CONFIGURAZIONE BANDITO BURRITO (Google Sheet Live + Backup GitHub CSV)
 */
const DEFAULT_SHEET_KEY = '1FpFJzenKH5EtJARBswa-iDTFP3czS9iOJwyIziW2gww';

const BANDITO_CONFIG = {
    // 1. MENU
    SHEET_TAB_NAME: 'MENU',
    GOOGLE_SHEET_URL: `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_KEY}/gviz/tq?tqx=out:csv&sheet=MENU`,
    GITHUB_BACKUP_CSV_URL: 'data/menu-backup.csv',

    // 2. SOCIAL (Video di Dorel)
    SOCIAL_SHEET_URL: `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_KEY}/gviz/tq?tqx=out:csv&sheet=SOCIAL`,
    GITHUB_BACKUP_SOCIAL_URL: 'data/social-backup.csv',

    // 3. RECENSIONI (Google & TripAdvisor)
    REVIEWS_SHEET_URL: `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_KEY}/gviz/tq?tqx=out:csv&sheet=RECENSIONI`,
    GITHUB_BACKUP_REVIEWS_URL: 'data/recensioni-backup.csv'
};

const CATEGORY_META = {
    'fuori-menu': { label: '🔥 Fuori Menu', subtitle: 'Piatti speciali e proposte fuori carta', macro: 'food' },
    'fritti': { label: '🍟 Fritti', subtitle: 'Sfiziosità calde e croccanti da condividere', macro: 'food' },
    'burritos': { label: '🌯 Burritos', subtitle: 'Accompagnati con nachos e le salse del Bandito', macro: 'food' },
    'hamburger': { label: '🍔 Hamburger del Bandito', subtitle: 'Accompagnati con patate alle erbe fritte', macro: 'food' },
    'taglieri': { label: '🧀 Taglieri', subtitle: 'Serviti con la pinsa romana', macro: 'food' },
    'griglia': { label: '🥩 Piatti alla Griglia', subtitle: 'Accompagnati con patatine fritte', macro: 'food' },
    'dessert': { label: '🍰 Dessert fatti in casa', subtitle: 'I nostri dolci artigianali', macro: 'food' },
    'birre-spina': { label: '🍺 Birre alla Spina', subtitle: 'Selezione alla spina sempre fresca', macro: 'drink' },
    'birre-bottiglia': { label: '🍾 Birre in Bottiglia', subtitle: 'Artigianali, speciali, senza glutine e analcoliche', macro: 'drink' },
    'vini': { label: '🍷 Vini', subtitle: 'Bollicine, Rossi fermi, Bianchi e Lambrusco', macro: 'drink' },
    'bevande': { label: '🍹 Bevande & Cocktail', subtitle: 'Bibite, Spritz, Gin Tonic e Amari', macro: 'drink' }
};

const BANDITO_ALLERGENS = [
    { key: 'glutine', keys: ['glutine', 'grano', '1'], nome: 'Glutine', desc: 'Cereali, grano, segale, orzo, avena, farro, kamut.', icon: 'images/wheat_amber_100x100.webp' },
    { key: 'crostacei', keys: ['crostacei', '2'], nome: 'Crostacei', desc: 'Gamberi, scampi, aragoste, granchi e simili.', icon: 'images/crustaceans_amber_100x100.webp' },
    { key: 'uova', keys: ['uova', 'uovo', 'maionese', '3'], nome: 'Uova e derivati', desc: 'Uova, maionese, emulsionati, pasta all’uovo.', icon: 'images/eggs_amber_100x100.webp' },
    { key: 'pesce', keys: ['pesce', 'salmone', '4'], nome: 'Pesce', desc: 'Prodotti alimentari in cui è presente pesce.', icon: 'images/fish_amber_100x100.webp' },
    { key: 'arachidi', keys: ['arachidi', '5'], nome: 'Arachidi e derivati', desc: 'Snack, creme e condimenti con arachidi.', icon: 'images/peanut_amber_100x100.webp' },
    { key: 'soia', keys: ['soia', '6'], nome: 'Soia', desc: 'Latte di soia, tofu, salsa di soia e derivati.', icon: 'images/soya_amber_100x100.webp' },
    { key: 'latte', keys: ['latte', 'lattosio', 'formaggio', '7'], nome: 'Latte e derivati', desc: 'Formaggi, burro, yogurt, panna, creme e lattosio.', icon: 'images/milk_amber_100x100.webp' },
    { key: 'guscio', keys: ['frutta a guscio', 'guscio', 'noci', 'pistacchi', 'mandorle', '8'], nome: 'Frutta a Guscio', desc: 'Mandorle, nocciole, noci, anacardi, pistacchi.', icon: 'images/treenut_amber_100x100-1.webp' },
    { key: 'sedano', keys: ['sedano', '9'], nome: 'Sedano', desc: 'Sedano in pezzi o in salse e preparati vegetali.', icon: 'images/celery_amber_100x100.webp' },
    { key: 'senape', keys: ['senape', '10'], nome: 'Senape', desc: 'Salse, mostarde e condimenti alla senape.', icon: 'images/mustard_amber_100x100.webp' },
    { key: 'sesamo', keys: ['sesamo', '11'], nome: 'Sesamo', desc: 'Semi di sesamo usati per pane e farine.', icon: 'images/sesame_amber_100x100.webp' },
    { key: 'solfiti', keys: ['solfiti', 'anidride', '12'], nome: 'Anidride solforosa e solfiti', desc: 'Vini, birre, sott’aceti e conserve.', icon: 'images/sulphurdioxide_amber_100x100.webp' },
    { key: 'lupini', keys: ['lupini', '13'], nome: 'Lupini', desc: 'Prodotti alimentari contenenti lupini.', icon: 'images/lupin_amber_100x100.webp' },
    { key: 'molluschi', keys: ['molluschi', '14'], nome: 'Molluschi', desc: 'Cozze, vongole, calamari, ostriche e simili.', icon: 'images/molluscs_amber_100x100.webp' },
    { key: 'surgelato', keys: ['surgelato', 'congelato', '*'], nome: 'Prodotto Congelato (*)', desc: 'Piatto contenente prodotti congelati all’origine.', icon: 'images/frozne-150x150.webp' }
];

function escapeHTML(str = '') {
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    } [m]));
}

function sanitizeUrl(rawUrl = '') {
    const clean = String(rawUrl).trim();
    if (!clean) return '';
    if (/^(https?:\/\/|images\/)/i.test(clean)) {
        return escapeHTML(clean);
    }
    return '';
}

function getCategoryInfo(catSlug) {
    const rawKey = (catSlug || 'altro').toLowerCase().trim();
    if (CATEGORY_META[rawKey]) return { slug: rawKey, ...CATEGORY_META[rawKey] };
    const safeSlug = rawKey.replace(/[^a-z0-9-_]/g, '');
    const pretty = escapeHTML(rawKey.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    return { slug: safeSlug || 'altro', label: `🍽️ ${pretty}`, subtitle: '', macro: 'food' };
}

function resolveSheetCsvUrl(rawUrl, tabName = 'MENU') {
    if (!rawUrl) return '';
    if (rawUrl.includes('tqx=out:csv') || rawUrl.includes('output=csv')) return rawUrl;
    const match = rawUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    }
    return rawUrl;
}

function normalizeImageUrl(rawUrl) {
    if (!rawUrl || !rawUrl.trim()) return '';
    const url = rawUrl.trim();
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (url.includes('drive.google.com') && driveMatch && driveMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
    }
    if (!url.startsWith('http') && !url.startsWith('images/') && !url.startsWith('/')) {
        return `images/${url}`;
    }
    return url;
}

function isCopertoItem(item) {
    return item && item.nome.toLowerCase().trim() === 'coperto';
}

function getBadgeClass(badgeText) {
    const t = badgeText.toLowerCase();
    if (t.includes('🔥') || t.includes('smash') || t.includes('criminale') || t.includes('piccant') || t.includes('fuori menu') || t.includes('special')) {
        return 'badge-pill badge-fire';
    }
    if (t.includes('🌱') || t.includes('veg') || t.includes('glutine') || t.includes('0.0%') || t.includes('analcolic')) {
        return 'badge-pill badge-green';
    }
    if (t.includes('novità') || t.includes('new') || t.includes('esclusiva')) {
        return 'badge-pill badge-new';
    }
    if (t.includes('cl') || t.includes('%') || t.includes('bottiglia') || t.includes('bollicine') || t.includes('fermo')) {
        return 'badge-pill badge-spec';
    }
    return 'badge-pill';
}

function parseAllergensCell(rawH = '') {
    const tokens = rawH
        .split(/[,;|•]+/)
        .map(s => s.replace(/^"|"$/g, '').toLowerCase().trim())
        .filter(s => s && !['no', 'falso', 'false', '0', 'nessuno', '-'].includes(s));

    const matched = [];
    tokens.forEach(token => {
        const found = BANDITO_ALLERGENS.find(a => a.keys.includes(token) || token.includes(a.key));
        if (found && !matched.some(m => m.key === found.key)) {
            matched.push(found);
        }
    });
    return matched;
}

function splitCSVLine(line) {
    const cols = [];
    let cur = '',
        inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"' && line[i + 1] === '"') { cur += '"';
            i++; } else if (ch === '"') { inQuotes = !inQuotes; } else if (ch === ',' && !inQuotes) { cols.push(cur.trim());
            cur = ''; } else { cur += ch; }
    }
    cols.push(cur.trim());
    return cols.map(c => c.replace(/^"|"$/g, '').trim());
}

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    return lines.slice(1).map(line => {
        const cols = splitCSVLine(line);
        const rawPrice = cols[4] || '0';
        const allergensList = parseAllergensCell(cols[7] || '');

        return {
            sede: (cols[0] || 'tutte').toLowerCase(),
            cat: (cols[1] || 'burritos').toLowerCase(),
            nome: cols[2] || '',
            ing: cols[3] || '',
            prezzoRaw: rawPrice,
            prezzoNum: parseFloat(rawPrice.replace(',', '.')) || 0,
            badge: cols[5] || '',
            spicy: Math.min(Math.max(parseInt(cols[6] || '0', 10) || 0, 0), 5),
            allergens: allergensList,
            surgelato: allergensList.some(a => a.key === 'surgelato'),
            disp: !['falso', 'false', '0', 'no'].includes((cols[8] || 'vero').toLowerCase()),
            img: normalizeImageUrl(cols[9] || '')
        };
    }).filter(item => item.nome && item.nome.toLowerCase() !== 'nome' && item.disp);
}

async function fetchMenuData() {
    const primaryUrl = resolveSheetCsvUrl(BANDITO_CONFIG.GOOGLE_SHEET_URL, BANDITO_CONFIG.SHEET_TAB_NAME);

    if (primaryUrl) {
        try {
            const res = await fetch(primaryUrl, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const csvText = await res.text();
            const parsed = parseCSV(csvText);
            if (parsed.length > 0) return { items: parsed, source: 'sheets' };
        } catch (err) {
            console.warn('Google Sheet MENU non disponibile, passo al backup GitHub:', err);
        }
    }

    if (BANDITO_CONFIG.GITHUB_BACKUP_CSV_URL) {
        try {
            const resBackup = await fetch(BANDITO_CONFIG.GITHUB_BACKUP_CSV_URL, { cache: 'no-store' });
            if (!resBackup.ok) throw new Error(`HTTP ${resBackup.status}`);
            const csvBackup = await resBackup.text();
            const parsedBackup = parseCSV(csvBackup);
            if (parsedBackup.length > 0) return { items: parsedBackup, source: 'github' };
        } catch (errBackup) {
            console.warn('Backup GitHub MENU non disponibile:', errBackup);
        }
    }

    return { items: [], source: 'none' };
}

function extractPriceOptions(item) {
    const raw = String(item.prezzoRaw || item.prezzoNum || '0');
    const priceParts = raw.split('/').map(p => p.trim()).filter(Boolean);

    if (priceParts.length <= 1) {
        const val = parseFloat(raw.replace(',', '.')) || item.prezzoNum || 0;
        return [{
            btnLabel: '+ Segna',
            trayName: item.nome,
            price: val
        }];
    }

    const textToSearch = `${item.badge || ''} ${item.ing || ''}`;
    const clMatch = textToSearch.match(/(\d+(?:\s*\/\s*\d+)+)\s*cl\b/i);
    let sizeLabels = [];
    if (clMatch) {
        const nums = clMatch[1].split('/').map(s => s.trim());
        if (nums.length === priceParts.length) {
            sizeLabels = nums.map(n => `${n}cl`);
        }
    }

    return priceParts.map((pStr, idx) => {
        const num = parseFloat(pStr.replace(',', '.')) || 0;
        const priceFormatted = num % 1 === 0 ? num.toString() : num.toFixed(2).replace('.', ',');
        const sizeTag = sizeLabels[idx] || '';

        return {
            btnLabel: sizeTag ? `+ ${sizeTag} (€${priceFormatted})` : `+ €${priceFormatted}`,
            trayName: sizeTag ? `${item.nome} (${sizeTag})` : `${item.nome} (€${priceFormatted})`,
            price: num
        };
    });
}

function createDishCardHTML(item, allowOrder = false) {
    const chilies = '🌶️'.repeat(item.spicy);
    const catInfo = getCategoryInfo(item.cat);
    const coperto = isCopertoItem(item);
    const safeNome = escapeHTML(item.nome);
    const safeIng = escapeHTML(item.ing);
    const safePrezzo = escapeHTML(item.prezzoRaw);
    const safeImg = sanitizeUrl(item.img);

    const imgBlock = safeImg ?
        `<div class="dish-img-wrap"><img src="${safeImg}" alt="${safeNome}" loading="lazy"></div>` :
        '';

    const badgesList = item.badge ?
        item.badge.split(/\s*(?:\||;|•|,(?!\d))\s*/).map(b => b.trim()).filter(Boolean) :
        [];

    const badgesHTML = badgesList
        .map(b => `<span class="${getBadgeClass(b)}">${escapeHTML(b)}</span>`)
        .join('');

    const itemAllergens = item.allergens || [];
    const allergensHTML = itemAllergens.length ?
        `<div class="dish-allergen-list">
        ${itemAllergens.map(a => `
          <span class="allergen-chip" title="${escapeHTML(a.nome)}: ${escapeHTML(a.desc)}">
            <img src="${sanitizeUrl(a.icon)}" alt="${escapeHTML(a.nome)}" loading="lazy">
            ${escapeHTML(a.nome.replace(' e derivati', '').replace(' (*)', ''))}
          </span>
        `).join('')}
      </div>` :
        `<span class="allergen-tag"></span>`;

    const priceOptions = extractPriceOptions(item);
    const actionHTML = (!coperto && allowOrder) ?
        `<div class="dish-actions-group">
        ${priceOptions.map(opt => `
          <button class="btn-add-dish" data-name="${escapeHTML(opt.trayName)}" data-price="${Number(opt.price) || 0}">${escapeHTML(opt.btnLabel)}</button>
        `).join('')}
      </div>` :
        ''

    return `
    <article class="dish-card">
      ${imgBlock}
      <div class="dish-body">
        <div class="dish-badges">
          <span class="badge-cat-tag">${catInfo.label}</span>
          ${badgesHTML}
          ${chilies ? `<span class="badge-pill badge-fire">${chilies}</span>` : ''}
        </div>
        <div class="dish-top">
          <h3 class="dish-title">${safeNome}</h3>
          <span class="dish-price">€ ${safePrezzo}</span>
        </div>
        <p class="dish-desc">${safeIng}</p>
        <div class="dish-footer">
          ${allergensHTML}
          ${actionHTML}
        </div>
      </div>
    </article>
  `;
}

function renderCategorizedSections(items, allowOrder = false) {
    if (!items.length) {
        return `<p style="color:var(--muted);padding:28px 0;text-align:center;">Nessun piatto trovato con questi filtri.</p>`;
    }

    const groups = {};
    items.forEach(item => {
        if (!groups[item.cat]) groups[item.cat] = [];
        groups[item.cat].push(item);
    });

    const orderedCatSlugs = Object.keys(groups);
    let lastMacro = null;
    let html = '';

    orderedCatSlugs.forEach(catSlug => {
        const catInfo = getCategoryInfo(catSlug);
        const catItems = groups[catSlug];

        if (catInfo.macro !== lastMacro) {
            lastMacro = catInfo.macro;
            html += `
        <div class="menu-macro-banner">
          ${lastMacro === 'food' ? '🍽️ DA MANGIARE' : '🍺 DA BERE'}
        </div>
      `;
        }

        html += `
      <section class="menu-cat-section" id="cat-${escapeHTML(catInfo.slug)}">
        <div class="menu-cat-header">
          <div class="menu-cat-title-wrap">
            <h2>${catInfo.label}</h2>
            ${catInfo.subtitle ? `<p class="menu-cat-subtitle">${escapeHTML(catInfo.subtitle)}</p>` : ''}
          </div>
          <span class="menu-cat-count">${catItems.length} proposte</span>
        </div>
        <div class="menu-grid">
          ${catItems.map(i => createDishCardHTML(i, allowOrder)).join('')}
        </div>
      </section>
    `;
    });

    return html;
}

async function initBanditoMenuApp(sedeAttiva) {
    const container = document.getElementById('menu-container');
    const tabsBar = document.getElementById('category-tabs');

    document.getElementById('sync-indicator') ?.remove();

    if (container) {
        container.innerHTML = `<p style="color:var(--muted);padding:40px 0;text-align:center;">Caricamento menu in corso...</p>`;
    }

    const { items: rawItems, source } = await fetchMenuData();
    const sedeItems = rawItems.filter(i => i.sede === 'tutte' || i.sede === sedeAttiva);

    if (source === 'none' || !sedeItems.length) {
        if (tabsBar) tabsBar.innerHTML = '';
        if (container) {
            container.innerHTML = `
        <div style="background:var(--bg-card);border:1px solid var(--gold);border-radius:18px;padding:36px 20px;margin:32px auto;max-width:520px;text-align:center;">
          <div style="font-size:38px;margin-bottom:10px;">📖</div>
          <h2 style="font-family:var(--font-display);font-size:32px;color:var(--gold);margin-bottom:8px;">MENU IN AGGIORNAMENTO</h2>
          <p style="color:var(--text);font-size:15px;">Menu in aggiornamento, chiedi la carta al personale.</p>
        </div>
      `;
        }
        return;
    }

    const copertoRow = sedeItems.find(isCopertoItem);
    const copertoPrice = copertoRow ? copertoRow.prezzoNum : 1.50;

    const uniqueCats = [...new Set(sedeItems.map(i => i.cat))];
    if (tabsBar) {
        tabsBar.innerHTML = uniqueCats.map(slug => {
            const info = getCategoryInfo(slug);
            return `<button class="cat-tab" data-cat="${escapeHTML(slug)}">${info.label}</button>`;
        }).join('');
    }

    let currentCat = 'all';
    let searchQuery = '';
    let filterNew = false;
    let filterSpicy = false;
    let filterVeg = false;

    const storageKey = `bandito_tray_${sedeAttiva}`;
    let tray = [];
    try {
        const parsedTray = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        tray = Array.isArray(parsedTray)
            ? parsedTray.filter(i => i && typeof i.name === 'string' && typeof i.price === 'number' && !isNaN(i.price))
            : [];
    } catch (e) {
        tray = [];
    }
    function getTotalCount() {
        return tray.reduce((acc, i) => acc + (i.qty || 1), 0);
    }

    function getTotalPrice() {
        return tray.reduce((acc, i) => acc + i.price * (i.qty || 1), 0);
    }

    function saveAndRefreshTray() {
        try { sessionStorage.setItem(storageKey, JSON.stringify(tray)); } catch (e) {}
        const trayEl = document.getElementById('table-tray');
        if (!trayEl) return;
        const totalCount = getTotalCount();
        if (!totalCount) {
            trayEl.classList.add('hidden');
            return;
        }
        trayEl.classList.remove('hidden');
        document.getElementById('tray-count').textContent = `${totalCount} selezionat${totalCount === 1 ? 'o' : 'i'}`;
        document.getElementById('tray-total').textContent = `€ ${getTotalPrice().toFixed(2).replace('.', ',')}`;
    }

    function addToTray(name, price) {
        const existing = tray.find(i => i.name === name && i.price === price);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            tray.push({ name, price, qty: 1 });
        }
        saveAndRefreshTray();
    }

    container ?.addEventListener('click', e => {
        const btn = e.target.closest('.btn-add-dish');
        if (!btn) return;
        addToTray(btn.dataset.name, parseFloat(btn.dataset.price) || 0);
    });

    // Ricerca per inizio parola (evita falsi positivi come "pollo" dentro "cipollotto")
    function matchesSearchStartOfWord(text, query) {
        const words = query.split(/\s+/).filter(Boolean);
        return words.every(word => {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?:^|[^a-zA-Z0-9À-ÿ])${escaped}`, 'i');
            return regex.test(text);
        });
    }

    function render() {
        const filtered = sedeItems.filter(item => {
            // Se c'è testo nella barra di ricerca, ignora filtri e categorie attive
            if (searchQuery) {
                const catLabel = getCategoryInfo(item.cat).label;
                const hay = `${item.nome} ${item.ing} ${item.badge} ${catLabel}`;
                return matchesSearchStartOfWord(hay, searchQuery);
            }

            if (currentCat !== 'all' && item.cat !== currentCat) return false;
            if (filterNew) {
                const b = item.badge.toLowerCase();
                if (!b.includes('new') && !b.includes('novità') && !b.includes('nuov')) return false;
            }
            if (filterSpicy && item.spicy < 1) return false;
            if (filterVeg && !item.badge.toLowerCase().includes('veg') && !item.badge.toLowerCase().includes('senza glutine')) return false;
            return true;
        });

        if (container) {
            container.innerHTML = renderCategorizedSections(filtered, true);
        }
    }

    const modal = document.getElementById('app-modal');
    const modalContent = document.getElementById('modal-content');

    function renderTrayModal() {
        if (!modal || !modalContent) return;
        modalContent.innerHTML = `
      <h3 style="font-family:var(--font-display);font-size:30px;margin-bottom:12px;">📋 LA TUA LISTA AL TAVOLO</h3>
      <ul style="list-style:none;margin-bottom:16px;">
        ${tray.map((i, idx) => `
          <li style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <span><strong>${Number(i.qty) || 1}x</strong> ${escapeHTML(i.name)}</span>
            <div style="display:flex;align-items:center;gap:8px;white-space:nowrap;">
              <strong>€ ${(i.price * (i.qty || 1)).toFixed(2).replace('.', ',')}</strong>
              <button data-dec-idx="${idx}" style="background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);width:26px;height:26px;border-radius:6px;cursor:pointer;font-weight:800;">−</button>
              <button data-inc-idx="${idx}" style="background:var(--bg-elevated);border:1px solid var(--border);color:var(--gold);width:26px;height:26px;border-radius:6px;cursor:pointer;font-weight:800;">+</button>
            </div>
          </li>
        `).join('')}
      </ul>
      <div style="margin-bottom:18px;">
        <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:800;">
          <span>Totale:</span>
          <span style="color:var(--gold)">€ ${getTotalPrice().toFixed(2).replace('.', ',')}</span>
        </div>
        <div style="font-size:12px;color:var(--muted);text-align:right;margin-top:4px;">
          Escluso coperto (€ ${copertoPrice.toFixed(2).replace('.', ',')} a persona)
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <button id="clear-tray" class="btn btn-outline" style="flex:1">Svuota</button>
        <button id="close-modal" class="btn btn-gold" style="flex:1">Chiudi</button>
      </div>
    `;

        modal.classList.remove('hidden');

        modalContent.querySelectorAll('[data-dec-idx]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.decIdx, 10);
                if (tray[idx].qty > 1) tray[idx].qty--;
                else tray.splice(idx, 1);
                saveAndRefreshTray();
                if (!tray.length) modal.classList.add('hidden');
                else renderTrayModal();
            };
        });

        modalContent.querySelectorAll('[data-inc-idx]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.incIdx, 10);
                tray[idx].qty = (tray[idx].qty || 1) + 1;
                saveAndRefreshTray();
                renderTrayModal();
            };
        });

        document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');
        document.getElementById('clear-tray').onclick = () => {
            tray.length = 0;
            saveAndRefreshTray();
            modal.classList.add('hidden');
        };
    }
    document.getElementById('btn-open-tray') ?.addEventListener('click', renderTrayModal);

    tabsBar ?.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const isAlreadyActive = tab.classList.contains('active');
            tabsBar.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            if (isAlreadyActive) {
                currentCat = 'all';
            } else {
                tab.classList.add('active');
                currentCat = tab.dataset.cat;
            }
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    document.getElementById('menu-search') ?.addEventListener('input', e => {
        searchQuery = e.target.value.trim().toLowerCase();
        render();
    });

    document.querySelector('[data-filter="new"]') ?.addEventListener('click', e => {
        filterNew = !filterNew;
        e.currentTarget.classList.toggle('active', filterNew);
        render();
    });

    document.querySelector('[data-filter="spicy"]') ?.addEventListener('click', e => {
        filterSpicy = !filterSpicy;
        e.currentTarget.classList.toggle('active', filterSpicy);
        render();
    });

    document.querySelector('[data-filter="veg"]') ?.addEventListener('click', e => {
        filterVeg = !filterVeg;
        e.currentTarget.classList.toggle('active', filterVeg);
        render();
    });

    document.getElementById('btn-allergens') ?.addEventListener('click', () => {
        if (!modal || !modalContent) return;
        modalContent.innerHTML = `
      <h3 style="font-family:var(--font-display);font-size:28px;margin-bottom:8px;">ℹ️ ALLERGENI E PRODOTTI CONGELATI</h3>
      <p style="font-size:12.5px;color:var(--muted);margin-bottom:14px;">
        Chiedi al nostro personale la lista ingredienti e allergeni dettagliata.
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:55vh;overflow-y:auto;margin-bottom:16px;padding-right:4px;">
        ${BANDITO_ALLERGENS.map(a => `
          <div style="display:flex;align-items:center;gap:12px;background:var(--bg-elevated);padding:8px 12px;border-radius:12px;">
            <img src="${sanitizeUrl(a.icon)}" alt="${escapeHTML(a.nome)}" style="width:42px;height:42px;border-radius:8px;object-fit:cover;flex-shrink:0;" loading="lazy">
            <div>
              <strong style="font-size:13px;color:var(--gold);display:block;">${escapeHTML(a.nome)}</strong>
              <span style="font-size:12px;color:var(--muted);">${escapeHTML(a.desc)}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <button id="close-modal-all" class="btn btn-gold" style="width:100%">Chiudi</button>
    `;
        modal.classList.remove('hidden');
        document.getElementById('close-modal-all').onclick = () => modal.classList.add('hidden');
    });

    modal ?.addEventListener('click', e => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    const qrHeader = document.querySelector('.qr-header');
    const searchInput = document.getElementById('menu-search');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (!qrHeader || window.innerWidth > 860) return;
        if (document.activeElement === searchInput) return;

        const currentScrollY = window.scrollY;
        if (currentScrollY <= 80) {
            qrHeader.classList.remove('header-hidden');
        } else if (currentScrollY - lastScrollY > 10) {
            qrHeader.classList.add('header-hidden');
        } else if (lastScrollY - currentScrollY > 10) {
            qrHeader.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    saveAndRefreshTray();
    render();
}

/**
 * ============================================================================
 * SEZIONE SOCIAL & RECENSIONI (Google Sheets Live -> Backup GitHub -> Fallback UI)
 * ============================================================================
 */

function parseSocialCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    return lines.slice(1).map(line => {
        const cols = splitCSVLine(line);
        const title = cols[0] || '';
        const url = cols[1] || '';
        const visRaw = (cols[2] || 'vero').toLowerCase();
        const disp = !['falso', 'false', '0', 'no'].includes(visRaw);
        return { title, url, disp };
    }).filter(item => item.url && /^https?:\/\//i.test(item.url) && item.disp);
}

async function fetchSocialVideos() {
    if (BANDITO_CONFIG.SOCIAL_SHEET_URL) {
        try {
            const res = await fetch(BANDITO_CONFIG.SOCIAL_SHEET_URL, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const parsed = parseSocialCSV(await res.text());
            if (parsed.length > 0) return { items: parsed, source: 'sheets' };
        } catch (err) {
            console.warn('Tab SOCIAL Google Sheet non raggiungibile, provo backup GitHub:', err);
        }
    }

    if (BANDITO_CONFIG.GITHUB_BACKUP_SOCIAL_URL) {
        try {
            const resBackup = await fetch(BANDITO_CONFIG.GITHUB_BACKUP_SOCIAL_URL, { cache: 'no-store' });
            if (!resBackup.ok) throw new Error(`HTTP ${resBackup.status}`);
            const parsedBackup = parseSocialCSV(await resBackup.text());
            if (parsedBackup.length > 0) return { items: parsedBackup, source: 'github' };
        } catch (errBackup) {
            console.warn('Backup GitHub SOCIAL non disponibile:', errBackup);
        }
    }

    return { items: [], source: 'none' };
}

function parseReviewsCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    return lines.slice(1).map(line => {
        const cols = splitCSVLine(line);
        const author = cols[0] || 'Cliente Bandito';
        const rawSource = (cols[1] || 'Google').toLowerCase();
        const source = rawSource.includes('trip') ? 'TripAdvisor' : 'Google';

        const rawSede = (cols[2] || 'RE').toLowerCase();
        const sede = rawSede.includes('sesso') || rawSede.includes('2') ? 'sesso' : 're';
        const sedeLabel = sede === 'sesso' ? '🚀 Sede Sesso' : '📍 Sede RE';

        const reviewText = cols[3] || '';

        // Rileva automaticamente in quale colonna (E oppure F) si trovano Stelle e Disponibile
        const col4 = (cols[4] || '').trim();
        const col5 = (cols[5] || '').trim();
        let rawStars = '5';
        let visRaw = 'vero';

        if (/^[1-5]$/.test(col4)) {
            // Caso: Colonna E = Stelle, Colonna F = Disponibile
            rawStars = col4;
            visRaw = (col5 || 'vero').toLowerCase();
        } else {
            // Caso: Colonna E = Disponibile, Colonna F = Stelle
            visRaw = (col4 || 'vero').toLowerCase();
            rawStars = col5 || '5';
        }

        const stars = Math.min(Math.max(parseInt(rawStars, 10) || 5, 1), 5);
        const disp = !['falso', 'false', '0', 'no'].includes(visRaw);

        return {
            author,
            source,
            sede,
            sedeLabel,
            stars,
            date: `Recensione verificata ${source}`,
            text: reviewText,
            disp
        };
    }).filter(r => r.text.length > 5 && r.disp);
}
async function fetchSheetReviews() {
    if (BANDITO_CONFIG.REVIEWS_SHEET_URL) {
        try {
            const res = await fetch(BANDITO_CONFIG.REVIEWS_SHEET_URL, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const parsed = parseReviewsCSV(await res.text());
            if (parsed.length > 0) return { items: parsed, source: 'sheets' };
        } catch (err) {
            console.warn('Tab RECENSIONI Google Sheet non raggiungibile, provo backup GitHub:', err);
        }
    }

    if (BANDITO_CONFIG.GITHUB_BACKUP_REVIEWS_URL) {
        try {
            const resBackup = await fetch(BANDITO_CONFIG.GITHUB_BACKUP_REVIEWS_URL, { cache: 'no-store' });
            if (!resBackup.ok) throw new Error(`HTTP ${resBackup.status}`);
            const parsedBackup = parseReviewsCSV(await resBackup.text());
            if (parsedBackup.length > 0) return { items: parsedBackup, source: 'github' };
        } catch (errBackup) {
            console.warn('Backup GitHub RECENSIONI non disponibile:', errBackup);
        }
    }

    return { items: [], source: 'none' };
}
/**
 * Gestione scomparsa/ricomparsa automatica di .site-header allo scroll (Home e Contatti)
 */
document.addEventListener('DOMContentLoaded', () => {
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY <= 80) {
            siteHeader.classList.remove('header-hidden');
        } else if (currentScrollY - lastScrollY > 10) {
            siteHeader.classList.add('header-hidden');
        } else if (lastScrollY - currentScrollY > 10) {
            siteHeader.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.getElementById('app-modal') ?.classList.add('hidden');
        document.getElementById('gallery-lightbox') ?.classList.add('hidden');
    }
});
