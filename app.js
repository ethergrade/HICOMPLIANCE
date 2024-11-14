// Importa la configurazione Firebase
import { firebase, auth, db, storage } from './firebase-config.js';

// Funzione per la registrazione degli utenti
async function registerUser(email, password) {
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('Registrazione avvenuta con successo! Ora puoi accedere.');
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        alert('Errore durante la registrazione: ' + error.message);
    }
}

// Funzione per il login degli utenti
async function loginUser(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Accesso riuscito!');
        window.location.href = 'admin.html'; // Redirige alla pagina admin dopo il login
    } catch (error) {
        console.error('Errore durante l'accesso:', error);
        alert('Errore durante l'accesso: ' + error.message);
    }
}

// Funzione per il logout dell'utente
async function logoutUser() {
    try {
        await auth.signOut();
        alert('Disconnessione avvenuta con successo!');
        window.location.href = 'index.html'; // Redirige alla pagina di login
    } catch (error) {
        console.error('Errore durante la disconnessione:', error);
        alert('Errore durante la disconnessione: ' + error.message);
    }
}

// Funzione per salvare i dati di profilazione utente
async function saveUserProfile(userId, userProfileData) {
    try {
        await db.collection('users').doc(userId).set(userProfileData);
        alert('Profilo utente salvato con successo!');
    } catch (error) {
        console.error('Errore durante il salvataggio del profilo:', error);
        alert('Errore durante il salvataggio del profilo: ' + error.message);
    }
}

// Funzione per ottenere i dati di profilazione utente
async function getUserProfile(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            return userDoc.data();
        } else {
            console.error('Nessun profilo trovato per l'utente:', userId);
        }
    } catch (error) {
        console.error('Errore durante il recupero del profilo:', error);
    }
}

// Funzione per visualizzare la lista degli utenti
async function displayUserList() {
    try {
        const snapshot = await db.collection('users').get();
        const userList = [];
        snapshot.forEach(doc => {
            userList.push({ id: doc.id, ...doc.data() });
        });
        return userList;
    } catch (error) {
        console.error('Errore durante il recupero della lista degli utenti:', error);
    }
}

// Funzione per scaricare il PDF dell'utente
async function downloadUserPDF(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            generatePDF(userDoc.data());
        } else {
            alert('Utente non trovato.');
        }
    } catch (error) {
        console.error('Errore durante il download del PDF:', error);
    }
}

// Funzione per generare il PDF con i dati dell'utente
function generatePDF(userData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = new Date().toISOString().split('T')[0];
    const fileName = `${userData.azienda}_${data}.pdf`;

    // Aggiungi informazioni utente nel PDF
    doc.text(20, 20, 'Profilo Utente');
    doc.text(20, 40, `Nome: ${userData.nome || ''}`);
    doc.text(20, 50, `Cognome: ${userData.cognome || ''}`);
    doc.text(20, 60, `Azienda: ${userData.azienda || ''}`);
    doc.text(20, 70, `Email: ${userData.email || ''}`);
    doc.text(20, 80, `Dipendenti: ${userData.dipendenti || ''}`);
    doc.text(20, 90, `Indirizzo: ${userData.indirizzo || ''}`);
    doc.text(20, 100, `Telefono: ${userData.telefono || ''}`);

    // Salva il PDF
    doc.save(fileName);
}

export { registerUser, loginUser, logoutUser, saveUserProfile, getUserProfile, displayUserList, downloadUserPDF };
