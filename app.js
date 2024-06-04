const express = require( 'express');
const bodyParser = require('body-parser');
const admin = require ('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const app = express();
const db = getFirestore();

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); 
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
    const userData = req.body;
    console.log(userData);
    try {
        const docRef = await db.collection('Loginpage').add(userData);
        res.status(201).json({ message: "User added successfully", username: userData.email });
        // If you want to redirect, you should do it on the client-side after the response is received
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Handle login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`User: ${email}`)
    try {
        const snapshot = await db.collection('Loginpage')
            .where('name', '==', email)
            .where('password', '==', password)
            .get();
        console.log(`Snapshot: ${snapshot}`)
        if (snapshot.empty) {
            res.status(401).json({ error: 'Invalid email or password' });
        } else {
            const user = snapshot.docs[0].data();
            res.status(200).json({ message: 'Login successful', username: user.name });
            // If you want to redirect, you should do it on the client-side after the response is received
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/dashboard',(req, res) => {
    res.render('dashboard');
}) ;

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});