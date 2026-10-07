// Get Firestore database connection
const { db } = require("../config/db");

// Get the application configuration, including the secret key used to sign JWT tokens
const config = require("../config/config");

// Use bcrypt to securely hash passwords during registration and compare passwords during login
const bcrypt = require("bcrypt");

// Use JWT to create authentication tokens after a successful registration or login
const jwt = require("jsonwebtoken");

// Use Lodash to remove the user's password before putting their information into the JWT payload
const _ = require("lodash");

module.exports = {
  // Find a user by their email address
  async findUser(email) {
    // Reference the "users" collection in Firestore
    const usersRef = db.collection("users");
    // Query Firestore for users with a matching email
    const snapshot = await usersRef.where("email", "==", email).get();

    // Create an array to store matching users
    let users = [];

    // Loop through each Firestore document
    snapshot.forEach((doc) => {
      // Add the user's public information to the array
      users.push({
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email,
        password: doc.data().password,
        isAdmin: doc.data().isAdmin,
      });
    });

    /*
    // Find users with an email address matching the provided email
    const userMatch = users.filter((user) => user.email === email);
    */

    // Return the matching users
    return users;
  },

  // Hash a user's password before storing it in the database
  async hashPassword(password) {
    // Generate a random salt to make the password hash more secure
    const salt = await bcrypt.genSalt(10);

    // Create a secure hash of the user's password
    const hashPassword = await bcrypt.hash(password, salt);

    // Return the hashed password
    return hashPassword;
  },

  // Create a safe user object for the JWT payload
  async userDetailsToJSON(id) {
    // Reference the "users" collection in Firestore
    const usersRef = db.collection("users");

    // Retrieve the user document using its Firestore document ID
    const user = await usersRef.doc(id).get();
    // Create a user object without the password
    // The password must not be included in the JWT payload
    const userJSON = _.omit(
      {
        id: id,
        ...user.data(),
      },
      "password",
    );
    // Display the user information for debugging
    console.log(userJSON);
    // Return the safe user object
    return userJSON;
  },

  // Create a JWT authentication token for the user (Mint the token)
  jwtSignUser(user) {
    // Use the user's safe information as the JWT payload
    const payload = user;

    // Get the JWT secret from the application configuration
    const secret = config.authentication.jwtSecret;

    // Set the token lifetime to 24 hours
    // 60 seconds × 60 minutes × 24 hours = 86,400 seconds
    const tokenExpireTime = 60 * 60 * 24; // TTL (Time to Live)

    // Sign the payload using the JWT secret
    const token = jwt.sign(payload, secret, { expiresIn: tokenExpireTime });
    // Return the generated token
    return token;
  },

  async comparePassword(dbPassword, password) {
    const passwordMatch = await bcrypt.compare(password, dbPassword);

    return passwordMatch;
  },
};
