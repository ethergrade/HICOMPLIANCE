// Importa la configurazione Firebase
import { firebase, auth, db } from './firebase-config.js';

// Funzione per caricare la lista degli utenti nella pagina admin
async function loadUserList() {
    try {
        const userListDiv = document.getElementById('userList');
        const snapshot = await db.collection('users').get();
        userListDiv.innerHTML = ''; // Pulisci il contenuto precedente

        snapshot.forEach(doc => {
            const userData = doc.data();
            const userDiv = document.createElement('div');
            userDiv.className = 'card mb-3 p-3';
            userDiv.innerHTML = `
                <h5>${userData.nome} ${userData.cognome}</h5>
                <p>Azienda: ${userData.azienda}</p>
                <p>Email: ${userData.email}</p>
                <button class="btn btn-primary" onclick="downloadUserPDF('${doc.id}')">Scarica PDF</button>
                <button class="btn btn-secondary" onclick="analyzeUserPDF('${doc.id}')">Analizza PDF</button>
            `;
            userListDiv.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Errore durante il caricamento degli utenti:', error);
        alert('Errore durante il caricamento degli utenti: ' + error.message);
    }
}

// Funzione per scaricare il PDF di un utente
async function downloadUserPDF(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            alert('Utente non trovato.');
            return;
        }

        const userData = userDoc.data();
        generatePDF(userData);
    } catch (error) {
        console.error('Errore durante il download del PDF:', error);
        alert('Errore durante il download del PDF: ' + error.message);
    }
}

// Funzione per generare il PDF con i dati dell'utente
function generatePDF(userData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = new Date().toISOString().split('T')[0];
    const fileName = `${userData.azienda}_${data}.pdf`;

    doc.text(20, 20, 'Profilo Utente');
    doc.text(20, 40, `Nome: ${userData.nome}`);
    doc.text(20, 50, `Cognome: ${userData.cognome}`);
    doc.text(20, 60, `Azienda: ${userData.azienda}`);
    doc.text(20, 70, `Email: ${userData.email}`);
    doc.text(20, 80, `Dipendenti: ${userData.dipendenti}`);
    doc.text(20, 90, `Indirizzo: ${userData.indirizzo}`);
    doc.text(20, 100, `Telefono: ${userData.telefono}`);

    doc.save(fileName);
}

// Funzione per analizzare il PDF usando le API di OpenAI
async function analyzeUserPDF(userId) {
    try {
        // Simulazione di analisi del PDF tramite una API esterna come OpenAI
        alert(`Analisi del PDF per l\'utente $1 in corso...`);
        // Qui puoi implementare la logica per inviare il PDF a OpenAI per l'analisi
    } catch (error) {
        console.error('Errore durante l\'analisi del PDF:', error);
        alert('Errore durante l\'analisi del PDF: ' + error.message);
    }
}

// Inizializzazione della pagina admin
window.onload = loadUserList;
