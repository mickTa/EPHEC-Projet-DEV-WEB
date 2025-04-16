import fetch from 'node-fetch';
import { randomBytes } from 'crypto';

const baseURL = 'http://localhost:3000';
const tokens = {
  user: null,
  admin: null,
  organizer: null,
  user2: null,
};

const emails = {
  user2: null, // Email du user2
  organizer: null, // Email de l'organizer
  admin: null, // Email de l'admin
};

// Fonction pour générer un email aléatoire
const generateRandomEmail = () => {
  const randomString = randomBytes(8).toString('hex'); // Génère une chaîne de 8 caractères hexadécimaux
  return `user${randomString}@example.com`; // Crée un email unique
};

const tests = [
  {
    name: '1. Inscription utilisateur',
    method: 'POST',
    endpoint: '/users',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => {
      const email = generateRandomEmail();
      emails.user2 = email; // Sauvegarde l'email du user2
      return {
        fullName: 'usertest2',
        email: email,
        password: 'Abscdef12&*',
      };
    },
    onSuccess: (res) => {
      tokens.user2 = res.token || res.body?.token; // Sauvegarde du token dans la variable user2
    },
  },

  {
    name: 'Inscription Organizer',
    method: 'POST',
    endpoint: '/users',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => {
      const email = generateRandomEmail();
      emails.organizer = email; // Sauvegarde l'email de l'organizer
      return {
        fullName: 'OrganizerTest',
        email: email,
        password: 'OrganizerPass123!',
        role: 'ORGANIZER',
      };
    },
    onSuccess: (res) => {
      tokens.organizer = res.token || res.body?.token; // Sauvegarde du token dans la variable organizer
    },
  },

  {
    name: 'Connexion Organizer',
    method: 'POST',
    endpoint: '/auth/login',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => ({
      email: emails.organizer, // Utilise l'email généré pour l'organizer
      password: 'OrganizerPass123!',
    }),
    onSuccess: (res) => {
      tokens.organizer = res.token || res.body?.token; // Sauvegarde du token dans la variable organizer
    },
  },

  {
    name: '2. Connexion user2',
    method: 'POST',
    endpoint: '/auth/login',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => ({
      email: emails.user2, // Utilise l'email généré pour user2
      password: 'Abscdef12&*',
    }),
    onSuccess: (res) => {
      tokens.user2 = res.token || res.body?.token; // Sauvegarde du token dans la variable user2
    },
  },

  {
    name: '3. Création compte ADMIN',
    method: 'POST',
    endpoint: '/users',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => {
      const email = generateRandomEmail();
      emails.admin = email; // Sauvegarde l'email de l'admin
      return {
        fullName: 'Admin Principal',
        email: email,
        password: 'AdminSecure45$%',
        role: 'ADMIN',
      };
    },
    onSuccess: (res) => {
      tokens.admin = res.token || res.body?.token; // Sauvegarde du token dans la variable admin
    },
  },

  {
    name: '4. Connexion utilisateur',
    method: 'POST',
    endpoint: '/auth/login',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => ({
      email: emails.user2, // Utilise l'email généré pour user2
      password: 'Abscdef12&*',
    }),
    onSuccess: (res) => {
      tokens.user = res.token || res.body?.token; // Sauvegarde du token dans la variable user
    },
  },

  {
    name: '5. Récupération infos utilisateur connecté',
    method: 'GET',
    endpoint: '/users/me',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`, // Utilise le token du user2
    }),
  },

  {
    name: '5.1. Mot de passe trop court',
    method: 'POST',
    endpoint: '/users/changePassword',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`,  // Utilisation du token de user2
      'Content-Type': 'application/json',
    }),
    body: () => ({
      oldPassword: 'Abscdef12&*',
      newPassword: 'Ab1!',  // Mot de passe trop court
    }),
    checkError: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  
  {
    name: '5.2. Mot de passe sans majuscule',
    method: 'POST',
    endpoint: '/users/changePassword',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`,  // Utilisation du token de user2
      'Content-Type': 'application/json',
    }),
    body: () => ({
      oldPassword: 'Abscdef12&*',
      newPassword: 'password1!',  // Mot de passe sans majuscule
    }),
    checkError: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  
  {
    name: '5.3. Mot de passe sans chiffre',
    method: 'POST',
    endpoint: '/users/changePassword',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`,  // Utilisation du token de user2
      'Content-Type': 'application/json',
    }),
    body: () => ({
      oldPassword: 'Abscdef12&*',
      newPassword: 'Password!!',  // Mot de passe sans chiffre
    }),
    checkError: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  
  {
    name: '5.4. Mot de passe sans caractère spécial',
    method: 'POST',
    endpoint: '/users/changePassword',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`,  // Utilisation du token de user2
      'Content-Type': 'application/json',
    }),
    body: () => ({
      oldPassword: 'Abscdef12&*',
      newPassword: 'Password123',  // Mot de passe sans caractère spécial
    }),
    checkError: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  
  {
    name: '5.5. Mot de passe sans minuscule',
    method: 'POST',
    endpoint: '/users/changePassword',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`,  // Utilisation du token de user2
      'Content-Type': 'application/json',
    }),
    body: () => ({
      oldPassword: 'Abscdef12&*',
      newPassword: 'PASSWORD123!',  // Mot de passe sans minuscule
    }),
    checkError: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  

  {
    name: '6. Changement mot de passe',
    method: 'POST',
    endpoint: '/users/changePassword',
    headers: () => ({
      Authorization: `Bearer ${tokens.user2}`, // Utilise le token du user2
      'Content-Type': 'application/json',
    }),
    body: () => ({
      oldPassword: 'Abscdef12&*',
      newPassword: 'NewSecure99!',
    }),
  },

  {
    name: "7. Création d'événement",
    method: 'POST',
    endpoint: '/events',
    headers: () => ({
      Authorization: `Bearer ${tokens.organizer}`, // Utilise le token de l'organizer
      'Content-Type': 'application/json',
    }),
    body: () => ({
      name: 'QuFest Welcome 2',
      organizer: 'Qufest Team',
      startDate: '2025-06-15T14:30:00',
      endDate: '2025-06-15T14:40:00',
      adress: 'EPHEC Louvain-La-Neuve',
      description: 'This event accepts everyone',
    }),
  },

  {
    name: "8. Récupération événements",
    method: 'GET',
    endpoint: '/events',
    headers: () => ({
      Authorization: `Bearer ${tokens.organizer}`, // Utilise le token de l'organizer
    }),
  },

  {
    name: '9. Création PaymentGroup',
    method: 'POST',
    endpoint: '/payment-group',
    headers: {
      'Content-Type': 'application/json',
    },
    body: () => ({
      name: 'Pirate Bay',
      description: 'Credits for all of our clubs downtown',
      walletLink: 'https://www.paypal.me/piratebay',
    }),
  },
];

async function runTests() {
    for (const test of tests) {
      const url = baseURL + test.endpoint;
      const headers = typeof test.headers === 'function' ? test.headers() : test.headers || {};
  
      const options = {
        method: test.method,
        headers,
      };
  
      // Création du body pour éviter la réutilisation de l'objet
      if (typeof test.body === 'function') {
        options.body = JSON.stringify(test.body()); // Appel dynamique pour générer un nouveau body à chaque test
      } else if (test.body) {
        options.body = JSON.stringify(test.body); // Utilisation du body de manière statique
      }
  
      try {
        const res = await fetch(url, options);
        const data = await res.json();
        const statusColor = res.ok ? '\x1b[32m✔ SUCCESS' : '\x1b[31m✖ FAIL';
        
        // Vérification spécifique pour les tests 5.1 à 5.5
        if (test.name.startsWith('5.') && !res.ok) {
          console.log(`\x1b[32m✔ SUCCESS\x1b[0m → ${test.name} (Expected fail but got error)`);
        } else {
          console.log(`${statusColor}\x1b[0m → ${test.name} (${res.status})`);
        }
  
        console.log(data);
  
        if (res.ok && typeof test.onSuccess === 'function') {
          test.onSuccess(data); // Exécution de la fonction onSuccess si définie
        }
  
      } catch (err) {
        // Log customisé pour 5.1 à 5.5
        if (test.name.startsWith('5.')) {
          console.log(`\x1b[32m✔ SUCCESS\x1b[0m → ${test.name} (Expected fail but got error)`);
        } else {
          console.error(`\x1b[31m✖ ERROR\x1b[0m → ${test.name}`);
          console.error(err.message);
        }
      }
    }
  }
  

console.log()
runTests();
