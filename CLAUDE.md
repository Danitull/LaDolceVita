# La Dolce Vita — Guida al progetto

## Struttura del progetto

```
La dolce vita/
├── css/style.css          # Foglio di stile globale
├── js/script.js           # Script per sidebar (index.html)
├── index.html             # Homepage con tiles-grid
├── Affitti.html           # Pagamenti affitto
├── WiFi.html              # Pagamenti WiFi
├── Utenze.html            # Pagamenti utenze
├── Registro.html          # Registro consumazioni (two-panel)
├── Copponi.html           # Gestione copponi
├── ListinoPrezzi.html     # Listino prezzi prodotti
└── Riepilogo.html         # Panoramica generale pagamenti
```

## Regole CSS Responsive

### Breakpoints
- **Desktop**: > 768px (default)
- **Tablet**: ≤ 768px (`@media (max-width: 768px)`)
- **Mobile**: ≤ 480px (`@media (max-width: 480px)`)

### Viewport Meta Tag
Tutti i file HTML devono avere:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Navbar (hamburger menu)
- Su desktop: navbar orizzontale con tutti i link visibili
- Su mobile (≤ 768px): menu collassato con hamburger button `.navbar-hamburger`
- **Classe obbligatoria**: aggiungere `nav-main` alla `<nav>` principale
- La sub-navbar (3 tab: Affitto/WiFi/Utenze) usa la classe `nav-tabs` e NON collassa
- Il toggling è gestito con `onclick` inline sul pulsante hamburger

```html
<nav class="top-navbar glass nav-main">
    <button class="navbar-hamburger" aria-label="Apri menu"
        onclick="this.classList.toggle('is-active'); this.closest('nav').querySelector('ul').classList.toggle('nav-open');">
        <span></span><span></span><span></span>
    </button>
    <ul>...</ul>
</nav>
```

### Sub-navbar (3 tab)
```html
<nav class="top-navbar glass nav-tabs" style="top: 7vh !important; height: 7vh;">
    <ul>
        <li style="width: calc(100% / 3);">...</li>  <!-- NON usare 31.3vw -->
    </ul>
</nav>
```

### Tipografia (clamp)
```css
/* Titoli */
h1: clamp(1.6rem, 4vw, 2.6rem)
h1 (hero): clamp(1.5rem, 5vw, 2.6rem)

/* Testo corpo */
p: clamp(1rem, 2vw, 1.18rem)

/* Navbar link */
.top-navbar a: font-size: clamp(0.78rem, 1.1vw, 1rem)
```

### Tabelle responsive
Sempre wrappare le tabelle:
```html
<div class="table-scroll-wrapper">
    <table class="styled-table">...</table>
</div>
```
Oppure assicurarsi che il genitore abbia `overflow-x: auto`.

**Non usare** `min-width: 600px` su `.styled-table` — rimuovere per evitare overflow su mobile.

### Modali responsive
Sostituire gli stili inline con la classe `.modal-inner-panel`:
```html
<!-- PRIMA (non responsivo) -->
<div style="width:70vw; height:70vh; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);">

<!-- DOPO (responsivo) -->
<div class="modal-inner-panel">
```
La classe `.modal-inner-panel` usa `clamp(280px, 70vw, 700px)` e `max-height: 90vh` con `overflow-y: auto`.

### Summary table panel (Affitti/WiFi/Utenze)
Usare classe `.summary-table-panel` invece di inline `position: absolute; right: 7vw; width: 25vw`:
```html
<div class="summary-table-panel">
```
Su mobile (≤ 768px) diventa `position: static; width: 100%`.

### Layout due pannelli (Registro.html)
```html
<div class="registro-panels" style="display: flex; ...">
    <div class="registro-panel-left table-scroll-wrapper" style="width: 50%;">
    <div class="registro-panel-right table-scroll-wrapper" style="width: 50%;">
```
Su mobile, `.registro-panels` diventa `flex-direction: column` e i pannelli `width: 100%`.

### Immagini
Tutte le immagini devono avere:
```css
img { max-width: 100%; height: auto; }
```
(già incluso in style.css globalmente)

### Tiles Grid (index.html)
- Desktop: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`
- Tablet: `minmax(160px, 1fr)`
- Mobile (≤ 480px): `1fr 1fr` (2 colonne fisse)

## Pattern da evitare
- ❌ `width: 31.3vw` per elementi di navigazione → usare `calc(100% / N)`
- ❌ `min-width: 600px` su tabelle → rimuovere, usare scroll wrapper
- ❌ `height: 70vh` fisso su modali → usare `max-height: 90vh` con overflow
- ❌ `position: absolute; right: Xvw; width: Yvw` per pannelli laterali → usare classi responsive
- ❌ `font-size: 2.6rem` fisso → usare `clamp()`
- ❌ `overflow-y: scroll` su tabella → usare wrapper con `overflow-x: auto`

## Database
- **Backend**: Supabase (PostgreSQL)
- **Tabelle principali**: `Utenti`, `PagamentoAffitti`, `AffittiDaPagare`, `PagamentoWiFi`, `WiFiDaPagare`, `PagamentoUtenze`, `UtenzeDaPagare`, `ElencoProdotti`, `Acquisti_Spese`, `CassaConsumazioni`
- La chiave anon Supabase è esposta nel codice client (normale per Supabase con RLS)
