/**
 * navbar.js — Componenti navbar condivisi + auth guard
 *
 * Uso:
 *   <nav-main></nav-main>          → navbar principale (tutte le pagine)
 *   <nav-affitti></nav-affitti>    → sub-navbar affitto/wifi/utenze
 *
 * Per modificare i link: aggiorna NAV_LINKS o AFFITTI_TABS qui sotto.
 */

/* ── Auth guard ─────────────────────────────────────────────── */
(function () {
  const PUBLIC_PAGES = ['Login.html'];
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (PUBLIC_PAGES.includes(page)) return;

  const PROJECT_REF = 'tjbsnchbezvhhugkgaxx';
  if (!localStorage.getItem(`sb-${PROJECT_REF}-auth-token`)) {
    window.location.replace('/Login.html');
  }
})();

/* ── Logout ─────────────────────────────────────────────────── */
function navbarLogout() {
  localStorage.removeItem('sb-tjbsnchbezvhhugkgaxx-auth-token');
  window.location.replace('/Login.html');
}

/* ── Leggi email utente dalla sessione ──────────────────────── */
function getSessionEmail() {
  try {
    const raw = localStorage.getItem('sb-tjbsnchbezvhhugkgaxx-auth-token');
    return raw ? JSON.parse(raw)?.user?.email : null;
  } catch { return null; }
}

const NAV_LINKS = [
  { href: 'index.html',        label: 'Home' },
  { href: 'Affitti.html',      label: 'Affitto',               activeFor: ['Affitti.html', 'WiFi.html', 'Utenze.html'] },
  { href: 'FondoCassa.html',   label: 'Fondo Cassa' },
  { href: 'Acquisti.html',     label: 'Acquisti' },
  { href: 'Copponi.html',      label: 'Copponi' },
  { href: 'Registro.html',     label: 'Registro' },
  { href: 'ListinoPrezzi.html',label: 'Listino Prezzi' },
  { href: 'Riepilogo.html',    label: 'Riepilogo' },
  { href: 'Profilo.html',      label: '👤 Profilo' },
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

    const email = getSessionEmail();

    // Link admin visibile solo all'amministratore
    const adminLink = email === 'danilotullo01@gmail.com'
      ? `<li><a href="Admin.html"${page === 'Admin.html' ? ' class="nav-active"' : ''}>⚙️ Admin</a></li>`
      : '';

    const userHtml = email
      ? `<div class="nav-user">
           <span class="nav-user-email">${email}</span>
           <button class="nav-logout-btn" onclick="navbarLogout()">Esci</button>
         </div>`
      : '';

    this.innerHTML = `
<nav class="top-navbar glass nav-main">
  <button class="navbar-hamburger" aria-label="Apri menu"
    onclick="this.classList.toggle('is-active'); this.closest('nav').querySelector('ul').classList.toggle('nav-open');">
    <span></span><span></span><span></span>
  </button>
  <ul>${items}${adminLink}</ul>
  ${userHtml}
</nav>`;

    // Inietta Three.js background se non già presente
    if (!document.getElementById('three-bg-script')) {
      const s = document.createElement('script');
      s.id = 'three-bg-script';
      s.type = 'module';
      s.src = '/js/three-bg.js';
      document.head.appendChild(s);
    }

    // Inietta ui.js (toast, confirm, utilità UI)
    if (!document.getElementById('ui-script')) {
      const u = document.createElement('script');
      u.id = 'ui-script';
      u.type = 'module';
      u.src = '/js/ui.js';
      document.head.appendChild(u);
    }
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
