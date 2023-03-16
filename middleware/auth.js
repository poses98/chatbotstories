var admin = require('firebase-admin');

var serviceAccount = require('../firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middleware function to ensure user authentication
exports.authenticateUser = async (req, res, next) => {
  try {
    // get the Firebase ID token from the Authorization header
    const idToken = req.headers.authorization.split('Bearer ')[1];
    // verify the ID token using the Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // attach the user ID to the request object
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Unauthorized' });
  }
};
