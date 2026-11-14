/**
 * CONFIGURAZIONE COLLEGATA AL TUO GOOGLE SHEET (Tab: MENU)
 */
const DEFAULT_SHEET_KEY = ['1FpFJzenKH5EtJARBswa', 'iDTFP3czS9iOJwyIziW2gww'].join('-');

const BANDITO_CONFIG = {
  SHEET_TAB_NAME: 'MENU',
  GOOGLE_SHEET_URL: `https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_KEY}/gviz/tq?tqx=out:csv&sheet=MENU`
};

const CATEGORY_META = {
  'fuori-menu':      { label: '🔥 Fuori Menu',            subtitle: 'Piatti speciali e proposte fuori carta',                  macro: 'food' },
  'fritti':          { label: '🍟 Fritti',                subtitle: 'Sfiziosità calde e croccanti da condividere',           macro: 'food' },
  'burritos':        { label: '🌯 Burritos',              subtitle: 'Accompagnati con nachos e le salse del Bandito',        macro: 'food' },
  'hamburger':       { label: '🍔 Hamburger del Bandito', subtitle: 'Accompagnati con patate alle erbe fritte',              macro: 'food' },
  'taglieri':        { label: '🧀 Taglieri',              subtitle: 'Serviti con la pinsa romana',                           macro: 'food' },
  'griglia':         { label: '🥩 Piatti alla Griglia',   subtitle: 'Accompagnati con patatine fritte',                      macro: 'food' },
  'dessert':         { label: '🍰 Dessert fatti in casa', subtitle: 'I nostri dolci artigianali',                              macro: 'food' },
  'birre-spina':     { label: '🍺 Birre alla Spina',      subtitle: 'Selezione alla spina sempre fresca',                      macro: 'drink' },
  'birre-bottiglia': { label: '🍾 Birre in Bottiglia',    subtitle: 'Artigianali, speciali, senza glutine e analcoliche',      macro: 'drink' },
  'vini':            { label: '🍷 Vini',                  subtitle: 'Bollicine, Rossi fermi, Bianchi e Lambrusco',             macro: 'drink' },
  'bevande':         { label: '🍹 Bevande & Cocktail',    subtitle: 'Bibite, Spritz, Gin Tonic e Amari',                       macro: 'drink' }
};

function getCategoryInfo(catSlug) {
  const key = (catSlug || 'altro').toLowerCase().trim();
  if (CATEGORY_META[key]) return { slug: key, ...CATEGORY_META[key] };
  const pretty = key.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return { slug: key, label: `🍽️ ${pretty}`, subtitle: '', macro: 'food' };
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

const FALLBACK_MENU = [
  { sede: 'tutte', cat: 'fuori-menu', nome: 'Battuta di Fassona Piemontese', ing: 'Carne cruda di Fassona Piemontese selezionata', prezzoRaw: '15', prezzoNum: 15, badge: '🔥 Fuori Menu', spicy: 0, surgelato: false, disp: true, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'fuori-menu', nome: 'Focaccia Fatta in Casa (Crudo e Burrata)', ing: 'Prosciutto crudo, burrata e pesto', prezzoRaw: '10', prezzoNum: 10, badge: 'Fatta in Casa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'fuori-menu', nome: 'Focaccia Fatta in Casa (Pancetta)', ing: 'Pancetta e scaglie di parmigiano', prezzoRaw: '10', prezzoNum: 10, badge: 'Fatta in Casa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'fuori-menu', nome: 'Stinco di Maiale', ing: 'Servito con patate e senape al miele', prezzoRaw: '16', prezzoNum: 16, badge: '🔥 Speciale', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'fritti', nome: 'Alette di Pollo', ing: 'Accompagnate con la nostra salsa', prezzoRaw: '6', prezzoNum: 6, badge: '', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'fritti', nome: 'Patatine Fritte', ing: 'Accompagnate con salse', prezzoRaw: '4', prezzoNum: 4, badge: '', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'fritti', nome: 'Pollo Croccante', ing: 'Alla Paprika servito con salsa ranch (200 gr)', prezzoRaw: '6', prezzoNum: 6, badge: 'Croccante', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'fritti', nome: 'Jalapeños Piccanti', ing: 'Ripieni di formaggio filante', prezzoRaw: '6', prezzoNum: 6, badge: '🌶️ Piccante', spicy: 2, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'fritti', nome: 'Nachos Cheese', ing: 'Croccanti triangoli di tortilla con un cuore filante di cheddar e peperoni', prezzoRaw: '6', prezzoNum: 6, badge: '', spicy: 0, surgelato: true, disp: true, img: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'burritos', nome: 'Pork Burrito', ing: 'Stracotto di maiale, fagioli, formaggio, insalata, pomodoro, jalapeños, cipollotto fresco, salsa piccante, guacamole. (Accompagnato con nachos e le salse del Bandito)', prezzoRaw: '12', prezzoNum: 12, badge: '⭐ Best Seller', spicy: 1, surgelato: true, disp: true, img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'burritos', nome: 'Chicken Burrito', ing: 'Pollo marinato alla paprika e birra, fagioli, formaggio, insalata, pomodoro, jalapeños, cipollotto fresco, salsa piccante, guacamole. (Accompagnato con nachos e le salse del Bandito)', prezzoRaw: '11', prezzoNum: 11, badge: '', spicy: 1, surgelato: true, disp: true, img: 'https://images.unsplash.com/photo-1584031036380-3fb6f2d51880?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'burritos', nome: 'Smoked Salmon Burrito', ing: 'Salmone affumicato, crema di formaggio, insalata, pomodoro, guacamole, fagioli, cipollotto fresco, salsa piccante. (Accompagnato con nachos e le salse del Bandito)', prezzoRaw: '13', prezzoNum: 13, badge: 'Novità', spicy: 1, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'hamburger', nome: 'Bandito Burger', ing: '150 gr di Bufalo fresco, salsa messicana, insalata, pane bianco fatto in casa, pomodoro, pancetta, stracciatella. (Accompagnato con patate alle erbe fritte)', prezzoRaw: '14', prezzoNum: 14, badge: '👑 Signature', spicy: 0, surgelato: true, disp: true, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'hamburger', nome: 'Pablo Burger', ing: '200 gr di manzo fresco (Macelleria Bonini), pane rustico fatto in casa, maionese alla senape, cheddar, bacon, pomodoro, insalata iceberg e cipolla caramellata.', prezzoRaw: '14', prezzoNum: 14, badge: 'Macelleria Bonini', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'hamburger', nome: 'Pulled Pork Burger', ing: '150 gr di Pulled Pork, pane rustico fatto in casa, cheddar, cipolla caramellata, verza marinata, maionese, carote e salsa BBQ.', prezzoRaw: '14', prezzoNum: 14, badge: '', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'hamburger', nome: 'Veg Burger', ing: 'Hamburger di spinaci, pane bianco fatto in casa, maionese all\'aglio nero, scaglie di Parmigiano Reggiano, pomodoro e insalata.', prezzoRaw: '8', prezzoNum: 8, badge: '🌱 Vegetariano', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'hamburger', nome: 'Smash Burger', ing: '200 gr di manzo fresco, 3 fette cheddar, 2 bacon, cipolla caramellata, cipolla croccante e salsa burger.', prezzoRaw: '16', prezzoNum: 16, badge: '🔥 Smash', spicy: 0, surgelato: true, disp: true, img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'hamburger', nome: 'Criminale Smash Burger', ing: '2 patty di carne, pane fresco, pancetta croccante, cipolla candita, formaggio di capra, salsa smoke BBQ.', prezzoRaw: '16', prezzoNum: 16, badge: '🔥 Il Criminale', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'taglieri', nome: 'Mix di Salumi', ing: 'Prosciutto crudo di Parma 24 mesi, pancetta nostrana, mortadella bolognese, salame nostrano e burrata pugliese. (Servito con la pinsa romana)', prezzoRaw: '13', prezzoNum: 13, badge: 'Con Pinsa Romana', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'griglia', nome: 'Spare Ribs', ing: '500 gr costine di maiale marinate alla birra, cotte a bassa temperatura con salsa BBQ. (Accompagnate con patatine fritte)', prezzoRaw: '16', prezzoNum: 16, badge: '🔥 Cottura Lenta', spicy: 0, surgelato: true, disp: true, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80' },
  { sede: 'tutte', cat: 'griglia', nome: 'Scottona Iberica', ing: '300 gr di controfiletto di Scottona Iberica alla griglia. (Accompagnata con patatine fritte)', prezzoRaw: '24', prezzoNum: 24, badge: '🥩 Top Grill', spicy: 0, surgelato: true, disp: true, img: '' },
  { sede: 'tutte', cat: 'dessert', nome: 'Tiramisù', ing: 'Dessert artigianale fatto in casa', prezzoRaw: '5', prezzoNum: 5, badge: 'Fatto in Casa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'dessert', nome: 'Mascarpone', ing: 'Crema al mascarpone con scaglie di cioccolato', prezzoRaw: '5', prezzoNum: 5, badge: 'Fatto in Casa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'dessert', nome: 'Panna cotta', ing: 'Servita ai frutti di bosco', prezzoRaw: '5', prezzoNum: 5, badge: 'Fatto in Casa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'dessert', nome: 'Churros', ing: 'Churros caldi e croccanti', prezzoRaw: '4', prezzoNum: 4, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'dessert', nome: 'Cheesecake', ing: 'Guarnita al caramello salato', prezzoRaw: '5', prezzoNum: 5, badge: 'Fatto in Casa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-spina', nome: 'Aktien Hell', ing: '33 / 50 cl. – 5% | Helles di colore giallo paglierino chiaro, schiuma fine e persistente.', prezzoRaw: '3.5 / 5.5', prezzoNum: 5.5, badge: '33 / 50 cl', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-spina', nome: 'Delirium Tremens', ing: '50 cl. – 8.5% | Bionda ad alta fermentazione dorata intensa con note di spezie, frutta candita e malto dolce.', prezzoRaw: '6', prezzoNum: 6, badge: '50 cl • 8.5%', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-spina', nome: 'Leffe Rossa', ing: '33 cl. – 6.5% | Birra d\'abbazia ad alta fermentazione ambrata scura con note di caramello e malto tostato.', prezzoRaw: '5.5', prezzoNum: 5.5, badge: '33 cl • 6.5%', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-spina', nome: 'Bandito Burrito IPA KM 0', ing: '40 cl. – 6.5% | Color arancio acceso, note agrumate di mandarino intrecciate a sentori maltati.', prezzoRaw: '6', prezzoNum: 6, badge: '🍺 IPA del Bandito KM0', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-spina', nome: 'Guinness', ing: '25 / 50 cl. – 4.2% | Stout scura ad alta fermentazione con densa schiuma beige da malto d\'orzo tostato.', prezzoRaw: '3.5 / 6', prezzoNum: 6, badge: '25 / 50 cl', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-spina', nome: 'Hoegaarden', ing: '50 cl. – 4.9% | Birra bianca belga (Witbier) con coriandolo e scorza d\'arancia.', prezzoRaw: '6', prezzoNum: 6, badge: '50 cl • Witbier', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Ayinger Bräuweisse', ing: '50 cl. – 5.1% | Giallo paglierino opalescente con sentori di frumento e banana.', prezzoRaw: '5.5', prezzoNum: 5.5, badge: '50 cl • Weisse', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Zerocinquanta Guglielmo', ing: '50 cl. – 4.9% | Lager chiara, profumata e leggera.', prezzoRaw: '6', prezzoNum: 6, badge: '50 cl • Lager', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Zerocinquanta Cordelia', ing: '50 cl. – 5.8% | IPA dal gusto ricco con sentori di fiori e agrumi.', prezzoRaw: '6', prezzoNum: 6, badge: '50 cl • IPA', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Zerocinquanta Amleto', ing: '50 cl. – 6.5% | Rossa in puro stile tedesco a bassa fermentazione.', prezzoRaw: '6', prezzoNum: 6, badge: '50 cl • Rossa', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Theresianer Pils non Filtrata', ing: '50 cl. – 5.0% | Non filtrata con note erbacee del luppolo.', prezzoRaw: '6', prezzoNum: 6, badge: '50 cl • Non Filtrata', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Birrificio Dada – Lop Lop (Golden Lager)', ing: '50 cl. – 5.0% | Dorata carica con luppoli Chinook e Styrian.', prezzoRaw: '7', prezzoNum: 7, badge: '50 cl • Artigianale', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Birrificio Dada – Gattomao (Belgian Ale)', ing: '75 cl. – 7.5% | Belgian Ale con profumi di frutta matura e sentori caramellati.', prezzoRaw: '13', prezzoNum: 13, badge: '75 cl • Condivisibile', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Theresianer Senza Glutine', ing: '33 cl. – 4.8% | Lager non filtrata senza glutine.', prezzoRaw: '5', prezzoNum: 5, badge: '🌾 Senza Glutine', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'birre-bottiglia', nome: 'Forst 0.0', ing: '33 cl. – 0% | Vivace e dissetante a zero gradi alcolici.', prezzoRaw: '5', prezzoNum: 5, badge: '0.0% Analcolica', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Lambrusco 800 Nero', ing: 'Rosso frizzante emiliano', prezzoRaw: '12', prezzoNum: 12, badge: 'Bottiglia', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Blanc De Blancs Millesimato Extra Dry Cantina Contarini', ing: 'Bollicine', prezzoRaw: '14', prezzoNum: 14, badge: 'Bollicine', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Prosecco Valdobbiadene Superiore DOCG', ing: 'Bollicine DOCG', prezzoRaw: '18', prezzoNum: 18, badge: 'Bollicine', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Lagrein Colterenzio', ing: 'Rosso Fermo Alto Adige', prezzoRaw: '22', prezzoNum: 22, badge: 'Rosso Fermo', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Pinot Nero Colterenzio', ing: 'Rosso Fermo Alto Adige', prezzoRaw: '24', prezzoNum: 24, badge: 'Rosso Fermo', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Morellino di Scansano DOCG (Cantina Roggiano)', ing: 'Rosso Fermo Toscano', prezzoRaw: '18', prezzoNum: 18, badge: 'Rosso Fermo', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Gewürztraminer Colterenzio', ing: 'Bianco Fermo Alto Adige', prezzoRaw: '22', prezzoNum: 22, badge: 'Bianco Fermo', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'vini', nome: 'Ribolla Gialla Obiz', ing: 'Bianco Fermo Friulano', prezzoRaw: '18', prezzoNum: 18, badge: 'Bianco Fermo', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Acqua', ing: '50 / 75 cl. Naturale / Frizzante', prezzoRaw: '1.50 / 2.50', prezzoNum: 2.5, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Gassate in vetro', ing: 'Coca Cola / Coca Cola Zero / Fanta / Tè Pesca / Tè Limone', prezzoRaw: '3.5', prezzoNum: 3.5, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Spritz', ing: 'Aperol / Campari Spritz', prezzoRaw: '7', prezzoNum: 7, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Cocktail (Gin Tonic)', ing: 'Selezione Gin Tonic secondo fascia gin scelto', prezzoRaw: '8 / 9 / 10 / 12', prezzoNum: 8, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Amari Classici', ing: 'Montenegro / Sambuca / Limoncino / Jägermeister / Grappa liscia e barricata', prezzoRaw: '3.5', prezzoNum: 3.5, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Amari Speciali', ing: 'Amaro del Capo / Jefferson', prezzoRaw: '4.5', prezzoNum: 4.5, badge: '', spicy: 0, surgelato: false, disp: true, img: '' },
  { sede: 'tutte', cat: 'bevande', nome: 'Coperto', ing: 'Servizio al tavolo', prezzoRaw: '1.5', prezzoNum: 1.5, badge: '', spicy: 0, surgelato: false, disp: true, img: '' }
];

const BANDITO_ALLERGENS = [
  { key: 'glutine',    keys: ['glutine', 'grano', '1'],             nome: 'Glutine',                      desc: 'Cereali, grano, segale, orzo, avena, farro, kamut.', icon: 'images/wheat_amber_100x100.webp' },
  { key: 'crostacei',  keys: ['crostacei', '2'],                    nome: 'Crostacei',                    desc: 'Gamberi, scampi, aragoste, granchi e simili.', icon: 'images/crustaceans_amber_100x100.webp' },
  { key: 'uova',       keys: ['uova', 'uovo', 'maionese', '3'],     nome: 'Uova e derivati',              desc: 'Uova, maionese, emulsionati, pasta all’uovo.', icon: 'images/eggs_amber_100x100.webp' },
  { key: 'pesce',      keys: ['pesce', 'salmone', '4'],             nome: 'Pesce',                        desc: 'Prodotti alimentari in cui è presente pesce.', icon: 'images/fish_amber_100x100.webp' },
  { key: 'arachidi',   keys: ['arachidi', '5'],                     nome: 'Arachidi e derivati',          desc: 'Snack, creme e condimenti con arachidi.', icon: 'images/peanut_amber_100x100.webp' },
  { key: 'soia',       keys: ['soia', '6'],                         nome: 'Soia',                         desc: 'Latte di soia, tofu, salsa di soia e derivati.', icon: 'images/soya_amber_100x100.webp' },
  { key: 'latte',      keys: ['latte', 'lattosio', 'formaggio', '7'], nome: 'Latte e derivati',           desc: 'Formaggi, burro, yogurt, panna, creme e lattosio.', icon: 'images/milk_amber_100x100.webp' },
  { key: 'guscio',     keys: ['frutta a guscio', 'guscio', 'noci', 'pistacchi', 'mandorle', '8'], nome: 'Frutta a Guscio', desc: 'Mandorle, nocciole, noci, anacardi, pistacchi.', icon: 'images/treenut_amber_100x100-1.webp' },
  { key: 'sedano',     keys: ['sedano', '9'],                       nome: 'Sedano',                       desc: 'Sedano in pezzi o in salse e preparati vegetali.', icon: 'images/celery_amber_100x100.webp' },
  { key: 'senape',     keys: ['senape', '10'],                      nome: 'Senape',                       desc: 'Salse, mostarde e condimenti alla senape.', icon: 'images/mustard_amber_100x100.webp' },
  { key: 'sesamo',     keys: ['sesamo', '11'],                      nome: 'Sesamo',                       desc: 'Semi di sesamo usati per pane e farine.', icon: 'images/sesame_amber_100x100.webp' },
  { key: 'solfiti',    keys: ['solfiti', 'anidride', '12'],         nome: 'Anidride solforosa e solfiti', desc: 'Vini, birre, sott’aceti e conserve.', icon: 'images/sulphurdioxide_amber_100x100.webp' },
  { key: 'lupini',     keys: ['lupini', '13'],                      nome: 'Lupini',                       desc: 'Prodotti alimentari contenenti lupini.', icon: 'images/lupin_amber_100x100.webp' },
  { key: 'molluschi',  keys: ['molluschi', '14'],                   nome: 'Molluschi',                    desc: 'Cozze, vongole, calamari, ostriche e simili.', icon: 'images/molluscs_amber_100x100.webp' },
  { key: 'surgelato',  keys: ['surgelato', 'congelato', 'si', 'sì', 'vero', 'true', '*'], nome: 'Prodotto Congelato (*)', desc: 'Piatto contenente prodotti congelati all’origine.', icon: 'images/frozne-150x150.webp' }
];

function parseAllergensCell(rawH = '', rawK = '') {
  const combined = `${rawH},${rawK}`
    .split(/[,;|•]+/)
    .map(s => s.replace(/^"|"$/g, '').toLowerCase().trim())
    .filter(s => s && s !== 'no' && s !== 'falso' && s !== 'false' && s !== '0');

  const matched = [];
  combined.forEach(token => {
    const found = BANDITO_ALLERGENS.find(a => a.keys.includes(token) || token.includes(a.key));
    if (found && !matched.some(m => m.key === found.key)) {
      matched.push(found);
    }
  });
  return matched;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.slice(1).map(line => {
    const cols = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    const rawPrice = (cols[4] || '0').replace(/^"|"$/g, '');
    const allergensList = parseAllergensCell(cols[7] || '', cols[10] || '');

    return {
      sede: (cols[0] || 'tutte').replace(/^"|"$/g, '').toLowerCase().trim(),
      cat: (cols[1] || 'burritos').replace(/^"|"$/g, '').toLowerCase().trim(),
      nome: (cols[2] || '').replace(/^"|"$/g, '').trim(),
      ing: (cols[3] || '').replace(/^"|"$/g, '').trim(),
      prezzoRaw: rawPrice,
      prezzoNum: parseFloat(rawPrice.replace(',', '.')) || 0,
      badge: (cols[5] || '').replace(/^"|"$/g, '').trim(),
      spicy: parseInt((cols[6] || '0').replace(/^"|"$/g, ''), 10) || 0,
      allergens: allergensList,
      surgelato: allergensList.some(a => a.key === 'surgelato'),
      disp: !['falso', 'false', '0', 'no'].includes((cols[8] || 'vero').replace(/^"|"$/g, '').toLowerCase().trim()),
      img: normalizeImageUrl((cols[9] || '').replace(/^"|"$/g, ''))
    };
    }).filter(item => item.nome && item.nome.toLowerCase() !== 'nome' && item.disp);
}

async function fetchMenuData() {
  const csvUrl = resolveSheetCsvUrl(BANDITO_CONFIG.GOOGLE_SHEET_URL, BANDITO_CONFIG.SHEET_TAB_NAME);
  if (!csvUrl) return { items: FALLBACK_MENU, live: false };
  try {
    const res = await fetch(csvUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csvText = await res.text();
    const parsed = parseCSV(csvText);
    if (!parsed.length) throw new Error('CSV vuoto');
    return { items: parsed, live: true };
  } catch (err) {
    console.warn('Uso menu di fallback locale:', err);
    return { items: FALLBACK_MENU, live: false };
  }
}

function createDishCardHTML(item, allowOrder = false) {
  const chilies = '🌶️'.repeat(item.spicy);
  const catInfo = getCategoryInfo(item.cat);
  const coperto = isCopertoItem(item);
  const imgBlock = item.img
    ? `<div class="dish-img-wrap"><img src="${item.img}" alt="${item.nome}" loading="lazy"></div>`
    : '';

  const badgesList = item.badge
    ? item.badge.split(/\s*(?:\||;|•|,(?!\d))\s*/).map(b => b.trim()).filter(Boolean)
    : [];

  const badgesHTML = badgesList
    .map(b => `<span class="${getBadgeClass(b)}">${b}</span>`)
    .join('');

  const itemAllergens = item.allergens || (item.surgelato ? [BANDITO_ALLERGENS.find(a => a.key === 'surgelato')] : []);
  const allergensHTML = itemAllergens.length
    ? `<div class="dish-allergen-list">
        ${itemAllergens.map(a => `
          <span class="allergen-chip" title="${a.nome}: ${a.desc}">
            <img src="${a.icon}" alt="${a.nome}">
            ${a.nome.replace(' e derivati', '').replace(' (*)', '')}
          </span>
        `).join('')}
      </div>`
    : `<span class="allergen-tag"></span>`;

  const actionHTML = (!coperto && allowOrder && item.disp)
    ? `<button class="btn-add-dish" data-name="${item.nome}" data-price="${item.prezzoNum}">+ Segna</button>`
    : '';

  return `
    <article class="dish-card ${!item.disp ? 'sold-out' : ''}">
      ${imgBlock}
      <div class="dish-body">
        <div class="dish-badges">
          <span class="badge-cat-tag">${catInfo.label}</span>
          ${badgesHTML}
          ${chilies ? `<span class="badge-pill badge-fire">${chilies}</span>` : ''}
          ${!item.disp ? `<span class="badge-pill badge-soldout">🚫 Esaurito</span>` : ''}
        </div>
        <div class="dish-top">
          <h3 class="dish-title">${item.nome}</h3>
          <span class="dish-price">€ ${item.prezzoRaw}</span>
        </div>
        <p class="dish-desc">${item.ing}</p>
        <div class="dish-footer">
          ${allergensHTML}
          ${actionHTML}
        </div>
      </div>
    </article>
  `;
}

function renderMacroCategoryIndex(containerEl, items, targetUrlPrefix = '') {
  if (!containerEl) return;
  const counts = {};
  items.forEach(i => { counts[i.cat] = (counts[i.cat] || 0) + 1; });

  const uniqueCats = [...new Set(items.map(i => i.cat))];
  const foodCats = uniqueCats.filter(c => getCategoryInfo(c).macro === 'food');
  const drinkCats = uniqueCats.filter(c => getCategoryInfo(c).macro === 'drink');

  const makePills = (catList) => catList.map(slug => {
    const info = getCategoryInfo(slug);
    const href = targetUrlPrefix ? `${targetUrlPrefix}#cat-${slug}` : `#cat-${slug}`;
    return `
      <a href="${href}" class="macro-cat-pill" data-jump-cat="${slug}">
        <span>${info.label}</span>
        <small>(${counts[slug] || 0})</small>
      </a>
    `;
  }).join('');

  containerEl.innerHTML = `
    <div class="macro-box">
      <div class="macro-box-title">🍽️ DA MANGIARE</div>
      <div class="macro-cat-links">${makePills(foodCats)}</div>
    </div>
    <div class="macro-box">
      <div class="macro-box-title">🍺 DA BERE</div>
      <div class="macro-cat-links">${makePills(drinkCats)}</div>
    </div>
  `;
}

function renderCategorizedSections(items, allowOrder = false) {
  if (!items.length) {
    return `<p style="color:var(--muted);padding:20px 0;text-align:center;">Nessun piatto trovato con questi filtri.</p>`;
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
      <section class="menu-cat-section" id="cat-${catSlug}">
        <div class="menu-cat-header">
          <div class="menu-cat-title-wrap">
            <h2>${catInfo.label}</h2>
            ${catInfo.subtitle ? `<p class="menu-cat-subtitle">${catInfo.subtitle}</p>` : ''}
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

async function initBanditoHomePreview(sedeDefault = 'sede1') {
  const indexEl = document.getElementById('home-categories-index');
  const gridEl = document.getElementById('home-specials-grid');
  const { items } = await fetchMenuData();
  const sedeItems = rawItems.filter(i => i.disp && (i.sede === 'tutte' || i.sede === sedeAttiva));

  if (indexEl) renderMacroCategoryIndex(indexEl, sedeItems, 'menu-sede1.html');
  if (gridEl) {
    const withPhoto = sedeItems.filter(i => i.img);
    gridEl.innerHTML = renderCategorizedSections(withPhoto, false);
  }
}

async function initBanditoMenuApp(sedeAttiva) {
  const container = document.getElementById('menu-container');
  const tabsBar = document.getElementById('category-tabs');

  // Rimuove qualsiasi avviso di caricamento/sincronizzazione eventualmente rimasto nell'HTML
  document.getElementById('sync-indicator')?.remove();

  const { items: rawItems } = await fetchMenuData();
  const sedeItems = rawItems.filter(i => i.disp && (i.sede === 'tutte' || i.sede === sedeAttiva));

  const copertoRow = sedeItems.find(isCopertoItem);
  const copertoPrice = copertoRow ? copertoRow.prezzoNum : 1.50;

  // Versione B: mostra solo le categorie reali senza il bottone "Tutte le Categorie"
  const uniqueCats = [...new Set(sedeItems.map(i => i.cat))];
  if (tabsBar) {
    tabsBar.innerHTML = uniqueCats.map(slug => {
      const info = getCategoryInfo(slug);
      return `<button class="cat-tab" data-cat="${slug}">${info.label}</button>`;
    }).join('');
  }

  let currentCat = 'all';
  let searchQuery = '';
  let filterNew = false;
  let filterSpicy = false;
  let filterVeg = false;
  const tray = [];

  function getTotal() {
    return copertoPrice + tray.reduce((acc, i) => acc + i.price, 0);
  }

  function render() {
    const filtered = sedeItems.filter(item => {
      if (currentCat !== 'all' && item.cat !== currentCat) return false;
      if (filterNew) {
        const b = item.badge.toLowerCase();
        if (!b.includes('new') && !b.includes('novità') && !b.includes('nuov')) return false;
      }
      if (filterSpicy && item.spicy < 1) return false;
      if (filterVeg && !item.badge.toLowerCase().includes('veg') && !item.badge.toLowerCase().includes('senza glutine')) return false;
      if (searchQuery) {
        const catLabel = getCategoryInfo(item.cat).label.toLowerCase();
        const hay = `${item.nome} ${item.ing} ${item.badge} ${catLabel}`.toLowerCase();
        if (!hay.includes(searchQuery)) return false;
      }
      return true;
    });

    if (container) {
      container.innerHTML = renderCategorizedSections(filtered, true);
      container.querySelectorAll('.btn-add-dish').forEach(btn => {
        btn.addEventListener('click', () => {
          tray.push({ name: btn.dataset.name, price: parseFloat(btn.dataset.price) });
          updateTrayUI();
        });
      });
    }
  }

  function updateTrayUI() {
    const trayEl = document.getElementById('table-tray');
    if (!trayEl) return;
    if (!tray.length) {
      trayEl.classList.add('hidden');
      return;
    }
    trayEl.classList.remove('hidden');
    document.getElementById('tray-count').textContent = `${tray.length} selezionati`;
    document.getElementById('tray-total').textContent = `€ ${getTotal().toFixed(2).replace('.', ',')}`;
  }

  const modal = document.getElementById('app-modal');
  const modalContent = document.getElementById('modal-content');

  function renderTrayModal() {
    if (!modal || !modalContent) return;
    modalContent.innerHTML = `
      <h3 style="font-family:var(--font-display);font-size:30px;margin-bottom:12px;">📋 LA TUA LISTA AL TAVOLO</h3>
      <ul style="list-style:none;margin-bottom:16px;">
        <li style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;color:var(--gold);font-weight:700;">
          <span>Coperto</span>
          <strong>€ ${copertoPrice.toFixed(2).replace('.', ',')}</strong>
        </li>
        ${tray.map((i, idx) => `
          <li style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <span>1x ${i.name}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <strong>€ ${i.price.toFixed(2).replace('.', ',')}</strong>
              <button data-remove-idx="${idx}" style="background:none;border:none;color:var(--chili);cursor:pointer;font-weight:800;">✕</button>
            </div>
          </li>
        `).join('')}
      </ul>
      <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:800;margin-bottom:18px;">
        <span>Totale:</span>
        <span style="color:var(--gold)">€ ${getTotal().toFixed(2).replace('.', ',')}</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button id="clear-tray" class="btn btn-outline" style="flex:1">Svuota</button>
        <button id="close-modal" class="btn btn-gold" style="flex:1">Chiudi</button>
      </div>
    `;

    modal.classList.remove('hidden');

    modalContent.querySelectorAll('[data-remove-idx]').forEach(btn => {
      btn.onclick = () => {
        tray.splice(parseInt(btn.dataset.removeIdx, 10), 1);
        updateTrayUI();
        if (!tray.length) modal.classList.add('hidden');
        else renderTrayModal();
      };
    });

    document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');
    document.getElementById('clear-tray').onclick = () => {
      tray.length = 0;
      updateTrayUI();
      modal.classList.add('hidden');
    };
  }

  document.getElementById('btn-open-tray')?.addEventListener('click', renderTrayModal);

  // Click categoria: se clicchi una categoria già attiva, torna a mostrare tutte le categorie
  tabsBar?.querySelectorAll('.cat-tab').forEach(tab => {
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

  document.getElementById('menu-search')?.addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    render();
  });

  document.querySelector('[data-filter="new"]')?.addEventListener('click', e => {
    filterNew = !filterNew;
    e.currentTarget.classList.toggle('active', filterNew);
    render();
  });

  document.querySelector('[data-filter="spicy"]')?.addEventListener('click', e => {
    filterSpicy = !filterSpicy;
    e.currentTarget.classList.toggle('active', filterSpicy);
    render();
  });

  document.querySelector('[data-filter="veg"]')?.addEventListener('click', e => {
    filterVeg = !filterVeg;
    e.currentTarget.classList.toggle('active', filterVeg);
    render();
  });

  document.getElementById('btn-allergens')?.addEventListener('click', () => {
    if (!modal || !modalContent) return;
    modalContent.innerHTML = `
      <h3 style="font-family:var(--font-display);font-size:28px;margin-bottom:8px;">ℹ️ ALLERGENI E PRODOTTI CONGELATI</h3>
      <p style="font-size:12.5px;color:var(--muted);margin-bottom:14px;">
        Chiedi al nostro personale la lista ingredienti e allergeni dettagliata.
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:55vh;overflow-y:auto;margin-bottom:16px;padding-right:4px;">
        ${BANDITO_ALLERGENS.map(a => `
          <div style="display:flex;align-items:center;gap:12px;background:var(--bg-elevated);padding:8px 12px;border-radius:12px;">
            <img src="${a.icon}" alt="${a.nome}" style="width:42px;height:42px;border-radius:8px;object-fit:cover;flex-shrink:0;">
            <div>
              <strong style="font-size:13px;color:var(--gold);display:block;">${a.nome}</strong>
              <span style="font-size:12px;color:var(--muted);">${a.desc}</span>
            </div>
          </div>
        `).join('')}
      </div>
      <button id="close-modal-all" class="btn btn-gold" style="width:100%">Chiudi</button>
    `;
    modal.classList.remove('hidden');
    document.getElementById('close-modal-all').onclick = () => modal.classList.add('hidden');
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
      // Scorrendo in giù -> sparisce tutto l'header
      qrHeader.classList.add('header-hidden');
    } else if (lastScrollY - currentScrollY > 10) {
      // Scorrendo in su -> ricompare tutto l'header
      qrHeader.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
  render();
}