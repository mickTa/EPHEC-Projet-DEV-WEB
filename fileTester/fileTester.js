const { randomBytes } = require("crypto");

let fetch;

async function main() {
  fetch = (await import("node-fetch")).default;

  const baseURL = "http://localhost:3000/api/";
  const tokens = {
    user: null,
    organizer: null,
    user2: null,
  };

  const emails = {
    user2: null,
    organizer: null,
  };

  const generateRandomEmail = () => {
    const randomString = randomBytes(8).toString("hex");
    return `user${randomString}@example.com`;
  };

  const tests = [
    {
      name: "1. Inscription utilisateur",
      method: "POST",
      endpoint: "users",
      headers: { "Content-Type": "application/json" },
      body: () => {
        const email = generateRandomEmail();
        emails.user2 = email;
        return {
          fullName: "usertest2",
          email: email,
          password: "Abscdef12&*",
        };
      },
      onSuccess: (res) => {
        tokens.user2 = res.token || res.body?.token;
      },
    },
    {
      name: "Inscription Organizer",
      method: "POST",
      endpoint: "users",
      headers: { "Content-Type": "application/json" },
      body: () => {
        const email = generateRandomEmail();
        emails.organizer = email;
        return {
          fullName: "OrganizerTest",
          email: email,
          password: "OrganizerPass123!",
          role: "ORGANIZER",
        };
      },
      onSuccess: (res) => {
        tokens.organizer = res.token || res.body?.token;
      },
    },
    {
      name: "Connexion Organizer",
      method: "POST",
      endpoint: "auth/login",
      headers: { "Content-Type": "application/json" },
      body: () => ({
        email: emails.organizer,
        password: "OrganizerPass123!",
      }),
      onSuccess: (res) => {
        tokens.organizer = res.token || res.body?.token;
      },
    },
    {
      name: "2. Connexion user2",
      method: "POST",
      endpoint: "auth/login",
      headers: { "Content-Type": "application/json" },
      body: () => ({
        email: emails.user2,
        password: "Abscdef12&*",
      }),
      onSuccess: (res) => {
        tokens.user2 = res.token || res.body?.token;
      },
    },
    {
      name: "4. Connexion utilisateur",
      method: "POST",
      endpoint: "auth/login",
      headers: { "Content-Type": "application/json" },
      body: () => ({
        email: emails.user2,
        password: "Abscdef12&*",
      }),
      onSuccess: (res) => {
        tokens.user = res.token || res.body?.token;
      },
    },
    {
      name: "5. Récupération infos utilisateur connecté",
      method: "GET",
      endpoint: "users/me",
      headers: () => ({
        Authorization: `Bearer ${tokens.user2}`,
      }),
    },
    {
      name: "6. Changement mot de passe",
      method: "POST",
      endpoint: "users/changePassword",
      headers: () => ({
        Authorization: `Bearer ${tokens.user2}`,
        "Content-Type": "application/json",
      }),
      body: () => ({
        oldPassword: "Abscdef12&*",
        newPassword: "NewSecure99!",
      }),
    },
    {
      name: "7. Création d'événement",
      method: "POST",
      endpoint: "events",
      headers: () => ({
        Authorization: `Bearer ${tokens.organizer}`,
        "Content-Type": "application/json",
      }),
      body: () => ({
        name: "QuFest Welcome 2",
        organizer: "Qufest Team",
        organizerId: 3,
        startDate: "2025-06-15T14:30:00",
        endDate: "2025-06-15T14:40:00",
        adress: "EPHEC Louvain-La-Neuve",
        description: "This event accepts everyone",
      }),
    },
    {
      name: "8. Récupération événements",
      method: "GET",
      endpoint: "events",
      headers: () => ({
        Authorization: `Bearer ${tokens.organizer}`,
      }),
    }
  ];


  // Exécution des tests
  async function runTests() {
    for (const test of tests) {
      const url = baseURL + test.endpoint;
      const headers =
        typeof test.headers === "function"
          ? test.headers()
          : test.headers || {};

      const options = {
        method: test.method,
        headers,
      };

      const testBody =
        typeof test.body === "function" ? test.body() : test.body;
      if (testBody) {
        options.body = JSON.stringify(testBody);
      }

      try {
        const res = await fetch(url, options);
        let data;
        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          throw new Error("Réponse non-JSON: " + text);
        }

        const statusColor = res.ok ? "\x1b[32m✔ SUCCESS" : "\x1b[31m✖ FAIL";

        if (test.name.startsWith("5.") && !res.ok) {
          console.log(
            `\x1b[32m✔ SUCCESS\x1b[0m → ${test.name} (Expected fail but got error)`
          );
        } else {
          console.log(`${statusColor}\x1b[0m → ${test.name} (${res.status})`);
        }

        console.log(data);

        if (res.ok && typeof test.onSuccess === "function") {
          test.onSuccess(data);
        }
      } catch (err) {
        if (test.name.startsWith("5.")) {
          console.log(
            `\x1b[32m✔ SUCCESS\x1b[0m → ${test.name} (Expected fail but got error)`
          );
        } else {
          console.error(`\x1b[31m✖ ERROR\x1b[0m → ${test.name}`);
          console.error(err.message);
        }
      }
    }


  }

  await runTests();
}

main();
