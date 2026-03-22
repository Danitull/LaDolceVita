/**
 * navbar.js — Componenti navbar condivisi
 *
 * Uso:
 *   <nav-main></nav-main>          → navbar principale (tutte le pagine)
 *   <nav-affitti></nav-affitti>    → sub-navbar affitto/wifi/utenze
 *
 * Per modificare i link: aggiorna NAV_LINKS o AFFITTI_TABS qui sotto.
 */

const NAV_LINKS = [
  { href: 'index.html',        label: 'Home' },
  { href: 'Affitti.html',      label: 'Affitto',               activeFor: ['Affitti.html', 'WiFi.html', 'Utenze.html'] },
  { href: '#',                 label: 'Fondo cassa' },
  { href: 'Copponi.html',      label: 'Copponi' },
  { href: 'Registro.html',     label: 'Registro Consumazioni' },
  { href: 'ListinoPrezzi.html',label: 'Listino Prezzi' },
  { href: '#',                 label: 'Acquisti' },
  { href: 'Riepilogo.html',    label: 'Riepilogo' },
  { href: 'Aiuto.html',        label: '❓ Aiuto' },
];

const AFFITTI_TABS = [
  { href: 'Affitti.html', label: 'Affitto' },
  { href: 'WiFi.html',    label: 'Wi Fi' },
  { href: 'Utenze.html',  label: 'Utenze' },
];

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

/* ── Navbar principale ─────────────────────────────────────── */
class NavMain extends HTMLElement {
  connectedCallback() {
    const page = getCurrentPage();

    const items = NAV_LINKS.map(link => {
      const activePages = link.activeFor || [link.href];
      const isActive = activePages.includes(page);
      return `<li><a href="${link.href}"${isActive ? ' class="nav-active"' : ''}>${link.label}</a></li>`;
    }).join('');

    this.innerHTML = `
<nav class="top-navbar glass nav-main">
  <button class="navbar-hamburger" aria-label="Apri menu"
    onclick="this.classList.toggle('is-active'); this.closest('nav').querySelector('ul').classList.toggle('nav-open');">
    <span></span><span></span><span></span>
  </button>
  <ul>${items}</ul>
</nav>`;
  }
}

/* ── Sub-navbar Affitto / Wi Fi / Utenze ───────────────────── */
class NavAffitti extends HTMLElement {
  connectedCallback() {
    const page = getCurrentPage();

    const items = AFFITTI_TABS.map(tab => {
      const isActive = page === tab.href;
      const style = isActive
        ? 'width:calc(100% / 3);background:#3498db;color:#fff;border-radius:20px;'
        : 'width:calc(100% / 3);';
      return `<li style="${style}"><a href="${tab.href}">${tab.label}</a></li>`;
    }).join('');

    this.innerHTML = `
<nav class="top-navbar glass nav-tabs" style="top:7vh !important;height:7vh;">
  <ul>${items}</ul>
</nav>`;
  }
}

customElements.define('nav-main',     NavMain);
customElements.define('nav-affitti',  NavAffitti);
