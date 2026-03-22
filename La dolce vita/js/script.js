import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://tjbsnchbezvhhugkgaxx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYnNuY2hiZXp2aGh1Z2tnYXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTA4ODAsImV4cCI6MjA3OTA2Njg4MH0.eMDjkjvirN1DrUPysy34TgycmwMkAoMmMuxJ1_o9vzg'
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