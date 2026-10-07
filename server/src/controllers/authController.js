//==============================================================================
// This controller is mainly responsible for handling the request and response.
//==============================================================================

// Get Firestore database connection
// This allows us to access collections such as "users"
const { db } = require("../config/db");

// Import custom error handler
// Used to return appropriate HTTP errors such as 400 and 500
const ApiError = require("../utilities/ApiError");

// Import authentication helper functions
// These functions keep database and authentication logic separate from the controller
const {
  findUser,
  hashPassword,
  userDetailsToJSON,
  jwtSignUser,
  comparePassword,
} = require("../utilities/authServices");

module.exports = {
  // Get a list of all registered users
  async listUsers(req, res, next) {
    // Reference the "users" collection in Firestore
    const usersRef = db.collection("users");
    // Retrieve all user documents from Firestore
    const snapshot = await usersRef.get();

    // Return a 400 error if the collection contains no users
    if (snapshot.empty) {
      return next(ApiError.badRequest("No users exist for this collection"));
    }

    // Create an array to store the user information
    let users = [];

    // Loop through each Firestore document
    snapshot.forEach((doc) => {
      // Add the user's public information to the array
      // The password is intentionally excluded for security
      users.push({
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email,
        isAdmin: doc.data().isAdmin,
      });
    });

    // Send the list of users back to the client
    res.send(users);
  },

  // Register a new user
  async register(req, res, next) {
    try {
      // Get the registration details sent in the request body
      const { username, email, password } = req.body;

      // Check whether a user with this email already exists
      const userMatch = await findUser(email);
      // Stop registration if the email is already registered
      if (userMatch.length > 0) {
        return next(ApiError.badRequest("This email already exists"));
      }

      // Reference the "users collection in Firestore"
      const usersRef = db.collection("users");
      // Create a new user document
      // The password is hashed before it is stored in the database
      const response = await usersRef.add({
        username: username,
        email: email,
        password: await hashPassword(password),
        isAdmin: false,
      });

      // Display the new user's Firestore document ID
      console.log(`User: ${response.id} registered!`);

      // Structure the data payload to be saved within the token
      // Sensitive information such as the password is excluded
      const userJSON = await userDetailsToJSON(response.id);

      // Create a JWT and send it back to the client
      res.send({
        token: jwtSignUser(userJSON),
      });
    } catch (err) {
      // Handle unexpected errors during registration
      return next(
        ApiError.internal(
          "Your profile could not be registered at this time...",
          err,
        ),
      );
    }
  },

  // Login an existing user
  async login(req, res, next) {
    // Save form data to local variables
    const { email, password } = req.body;

    // Check user is saved to the db already
    const userMatch = await findUser(email);
    if (!userMatch.length) {
      return next(ApiError.badRequest("Incorrect email or password"));
    }

    const passwordMatch = await comparePassword(
      userMatch[0].password,
      password,
    );

    if (!passwordMatch) {
      return next(ApiError.badRequest("Incorrect email or password"));
    }

    // Dealing with response & minting the token
    console.log(`Success - user created: ${userMatch[0].id}`);
    // Structure the data payload to be saved within the token
    // Sensitive information such as the password is excluded
    const userJSON = await userDetailsToJSON(userMatch[0].id);

    // Create a JWT and send it back to the client
    res.send({
      token: jwtSignUser(userJSON),
    });
  },
};
