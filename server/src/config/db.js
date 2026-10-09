// Our connection file establishes a connection to Firebase
// Import libraries
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
// const { getStorage } = require("firebase-admin/storage");

const config = require("./config");

const dbStartup = require("debug")("app:db");

// Get Firebase service account credentials
const serviceAccountKey = config.db.serviceAccountKey;

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccountKey),
  storageBucket: config.db.storageBucket,
});

// Create Firestore connection

const db = getFirestore();

// Create Firebase Storage bucket connection
// const bucket = getStorage().bucket();

// Test Firestore connection
// db.listCollection() sends a request to Firestore
const dbPing = db.listCollections().then((collections) => {
  // Logs a successful connection
  dbStartup("Connected to Cloud Firestore");

  // Display the collection names found
  for (const collection of collections) {
    dbStartup(`Found db collection: ${collection.id}`);
  }
});

// Export database connections
module.exports = {
  db,
  dbPing,
};
