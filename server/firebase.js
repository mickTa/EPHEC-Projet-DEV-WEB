const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projet-api-node.firebaseio.com" 
});

const db = admin.firestore(); 

module.exports = db;
