import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tjbsnchbezvhhugkgaxx.supabase.co'
const supabaseKey = 'sb_publishable_I50IGnnBs3JFt668jt6OTg_NHxNEc8p'
const supabase = createClient(supabaseUrl, supabaseKey)


// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const chevron = document.querySelector('#side-tab .chevron');
    const sideTab   = document.getElementById('side-tab');
    sidebar.classList.toggle('open');
    sideTab.classList.toggle('open');

    if (sidebar.classList.contains('open')) {
        chevron.style.transform = 'rotate(180deg)';
    } else {
        chevron.style.transform = 'rotate(0deg)';
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('img-modal');
    const continuaBtn = document.getElementById('continua-btn');
    caricaUtenti(); // Chiamata alla funzione getUtenti quando si clicca su "Continua"
    if (modal && continuaBtn) {
        setTimeout(() => {
            continuaBtn.style.opacity = '1';
            continuaBtn.style.pointerEvents = 'auto';
        }, 500);
        continuaBtn.addEventListener('click', function() {
            

            modal.style.display = 'none';
        });
    }
});

// Funzione per ottenere tutti gli utenti
async function getUtenti() {
  const { data, error } = await supabase
    .from('Utenti')   // nome della tabella
    .select('*')      // equivalente a SELECT * FROM Utenti
    .eq('IsDeleted', false) // aggiunge la condizione WHERE IsDeleted = false

  if (error) {
    console.error('Errore nella query:', error)
    return null
  }

  console.log('Dati ottenuti:', data)
  return data
}

// Funzione che carica gli utenti e li mette nella tabella
async function caricaUtenti() {
  const { data, error } = await supabase
    .from('Utenti')
    .select('*')

  if (error) {
    console.error('Errore nel caricamento utenti:', error)
    return
  }
console.log('Dati ottenuti:', data);

  // Trova la tabella nel DOM
  const tbody = document.querySelector('.styled-table tbody')
  if (!tbody) return
  tbody.innerHTML = '' // pulisce eventuali righe statiche

  // Inserisce una riga per ogni utente
  data.forEach(utente => {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td>${utente.id}</td> 
      <td>${utente.nome}</td>
    `
    tbody.appendChild(tr)
  })
}

// Esegui la funzione all’apertura della pagina
window.addEventListener('DOMContentLoaded', caricaUtenti)