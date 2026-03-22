# CLAUDE.md — Regole di Layout per La Dolce Vita

## Struttura pagine

### Navbar
- **Non toccare** la navbar principale (`.top-navbar`) né le sub-navbar — ci lavora un'altra sessione.
- I wrapper della navbar usano `position: absolute; height: 7vh`. Sono intenzionalmente separati dal flow del documento.

### Contenuto principale
- Usare sempre la classe `.page-content` per il contenuto sotto la navbar.
- Su pagine con **due navbar** (Affitti, WiFi, Utenze): `class="page-content"` → `padding-top: 15vh`
- Su pagine con **una navbar** (ListinoPrezzi, Copponi): `class="page-content single-nav"` → `padding-top: 9vh`
- `.page-content` usa `display: flex; flex-wrap: wrap` → diventa colonna verticale su mobile (< 640px)

### Layout a due colonne (Affitti / WiFi / Utenze)
```html
<div class="page-content">
    <div class="main-table-area">   <!-- flex: 1; min-width: 0 -->
        <div class="table-responsive">
            <table class="styled-table">...</table>
        </div>
    </div>
    <div class="totale-area">       <!-- width: 320px su desktop, 100% su mobile -->
        <div class="table-responsive">
            <table id="TabellaTotale" class="styled-table">...</table>
        </div>
    </div>
</div>
```

### Tabelle scrollabili
- Tutte le `<table class="styled-table">` vanno wrappate in `<div class="table-responsive">`.
- `min-width: 600px` su `.styled-table` è intenzionale per leggibilità desktop; il wrapper gestisce l'overflow su mobile.
- **Non usare mai** `position: absolute` per posizionare tabelle di contenuto dati.

## Breakpoints

| Viewport | Comportamento |
|----------|---------------|
| ≤ 640px  | Layout verticale (flex-direction: column), totale sotto la tabella, padding ridotto |
| ≤ 900px  | `.totale-area` si stringe a 260px |
| 1280px+  | Layout a due colonne affiancate |

## Registro.html — slide meccanismo
- Il container usa `position: relative; margin-top: 14vh` invece di `position: absolute`.
- I pannelli `#currentDiv` e `#newDiv` restano `position: absolute` all'interno del container, con `transition: left 0.4s ease`.
- Le due colonne interne usano `class="registro-col"` con `flex: 1; min-width: 280px` + `flex-wrap: wrap`.

## Regole generali

1. **Niente `position: absolute` per contenuto dati** — riservato solo a overlay/modal e navbar.
2. **Sempre `overflow-x: hidden`** su `body` e `overflow-x: auto` sui wrapper tabella.
3. **Usare `min-width` con `flex: 1`** invece di `width` percentuale fissa per colonne responsive.
4. **Modal su mobile**: `width: 95vw !important; height: auto !important` tramite media query ≤ 640px.
5. **Non aggiungere** `position: absolute; top: X; left: Y` per centrare contenuto — usare `display: flex; align-items: center; justify-content: center` sul parent.
6. **Non toccare font** — gestiti da un'altra sessione.

## Classi CSS chiave (style.css)

| Classe | Scopo |
|--------|-------|
| `.page-content` | Wrapper layout pagina con padding per navbar doppie |
| `.page-content.single-nav` | Variante per pagine con una sola navbar |
| `.main-table-area` | Area flessibile della tabella principale |
| `.totale-area` | Pannello totali (destra su desktop, sotto su mobile) |
| `.table-responsive` | Wrapper scroll orizzontale per tabelle |
| `.registro-col` | Colonna flessibile nel Registro (min-width: 280px) |
