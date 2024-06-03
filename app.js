const express = require( 'express');
const bodyParser = require('body-parser');
const firebaseAdmin = require ('firebase-admin');

const app = express();

// Configure Firebase Admin SDK with your credentials
const serviceAccount = require('/Users/saisomarajuthonta/Desktop/SOMARAJU401/serviceAccountKey.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', (req, res) => {
    res. render('login')
});

app.get('/signup', (req, res) => {
    res. render('signup')
});

// Handle signup
app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userRecord = await firebaseAdmin.auth() .createUser({
            email: email,
            password: password,
        });
        console.log('Successfully created user with UID:', userRecord.uid);
        res.redirect('/dashboard');
    }catch(error) {
        console.error('Error creating user:', error);
        res.redirect('/signup');
    }
});

// Handle login
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
        console.log('Successfully fetched user data:', userRecord.toJSON());
        res.redirect('/dashboard');
    }catch (error) {
        console.error ('User not registered');
        res. redirect('/');
    }
}) ;

app.get('/dashboard',(req, res) => {
    res.render('dashboard');
}) ;

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});