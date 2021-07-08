const express = require('express');
const hand = require('express-handlebars');
const path = require('path');
const app = express();

const session = require('express-session');
var secret ={
  secret:'sessSecret',
  resave: false,
  saveUninitialized: true,
  };
app.use(session(secret));

// FIREBASE CONNECTION
const firebase = require('firebase/app');
const firebaseConfig = {
  apiKey: "AIzaSyCDzg_QY-v1B2dnMcn1cdTqcgxR-DOqzJI",
  authDomain: "blood-donation-app-92caa.firebaseapp.com",
  databaseURL: "https://blood-donation-app-92caa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "blood-donation-app-92caa",
  storageBucket: "blood-donation-app-92caa.appspot.com",
  messagingSenderId: "71223960487",
  appId: "1:71223960487:web:e67f010aa744567530cc82",
  measurementId: "G-99YFH2BSFC"
};
firebase.initializeApp(firebaseConfig);
// FIREBASE CONNECTION (END)

const admin = require("firebase-admin");
const { promiseImpl } = require('ejs');
var adminConfig = {
    databaseURL: "https://blood-donation-app-92caa-default-rtdb.europe-west1.firebasedatabase.app",
    credential: admin.credential.cert({
      projectId: "blood-donation-app-92caa",
      clientEmail: "firebase-adminsdk-dsmap@blood-donation-app-92caa.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCccyYicb8fxzT8\niObITarrrZu2Fc9CrylBkfBU86ahPCDJS8rNRMvP6MhhgGVJogDWTz24xJW1hIaL\nPooXxMEqj5U10HHzL1P+3NjHr5eHzgjVLaoa/v4dKKKKN0R6XoWdR4pyMJNYNiWX\nJT3aa4K3U7uJcVz0PqLo1mKEcCbG16ptntLMH9+HqzVXEs8EiMcUEylV3noiZgol\nMSCgHlhXdtXZnCefG1VM/IbYJnXozkY/aKnKnkp/7R+HnTTbNq326rSTZ8JC6rPD\nOZCIsdaKEgYoyM2PpjugBXMvca7RhlXA11WXYLZCBguGmzJ4AtNJ1/qnwCmntIIO\nHLD/JF0LAgMBAAECggEAGDCBo++8Ylh1q9oq/KttkvULz1J98kyM73N2Glx11hYq\n55TNbYGGlcXjPZgRkRn4USp9W5UhpKgx+VOZHGWyjDcZFfH9vGED9rME3ZMbtca4\nfOWLmJL2jWGcCAzVjKoStKe8Ez3Jemkc1MrQTnYzBs9ufqjFe4o3vBJxtxJ0HGg8\nL3O22GSleoo3PitSuuh44crTP37oBFrypFyOI9wNPx/7TZPzz3ynE51HOw/2gYRP\nCx4KN/G6nJBsejZ3UkOZxiORrRHlVTxrrZbHhjSyVHnOC7vNO00bY4Iv18BmwUJN\nZR0B0BrAImYodjeEOqDfmfRcwOuxMXPNBDbsJfhpSQKBgQDLjGSTcsOaqlPbhMcG\nCZGmDgpDhFhNxjtYBJjJ+MOK7PjvRr6NoToMcwPOZ+lyaxIbT0mNUQZfTP+aYcGN\n+FZxrVlgHlK+6e4OOzjtcIjw/dEeDXR6dCnFUG7uF28g2M8IqChsI1G+StjNK4FF\nme3nzTTzt8PIbd8f5WIUSUixXQKBgQDEw8WyeW7qxL3nI3R2b+HJRmowNnmhH6KZ\nSPZB4FH1E3ObgBARtOfqLjfO/ZXgxCz7iC7xed9m29eKFWMniYtfb6g5SEzCsZgM\nLbkCxPww7maWXTjDM3p5YKbh0G5RZackFRxh9bLzfXKL1L94CwyNOzQ6A5rOsO2Z\niZE+7uPZhwKBgBKOtzC2Ot0kAEc4QMjtIGlKSGdFbqOQmiJ5MNDhLDrDRiLSiVby\nRw+RgNxVnvP+jQUOYn9OzszrgTY7CWF/Lappiod33EVpoHmNrq//HY0TJvidc2wi\noRhLMAHnAwu0mJOKeTz6r14xBrkV6VBGK2mBzP0XWPMyCTCoQhvlXopFAoGAVRbo\nRo8W9TWRfgQqGBG4DWeDAkh8fr4Efc88ly5fouD/jI5r5IxcAjxsa/njt6h+X2P8\nEPcIMh397rvi/jUP7XyGvgbTExrjyth2+oifGrXt7TZxFpELdLPkVyDgpBiWmBb9\nCCvNcFiekXO2PT5h9i1VH4Vxi9KdXVlNU27RX78CgYEAgBa76BhzMgF87cLydbKG\nTXLzKdx4C2N2igq5tjonKnJI1mzcHoYxjyXyf7Yj4us1xS+A7HPCvY9XMCLpPLwR\ngOLOiQvVSPJUkfV0c89k7BnGwNyK/fDOgylh3IzS70hRpKcL0N4p87OmVRQFIYVZ\n3RQeHLGYZvE6u+1j1+AUCFs=\n-----END PRIVATE KEY-----\n",
    })
  }
admin.initializeApp(adminConfig);

var hbs = hand.create();

app.engine('handlebars', hand({
  helpers: {
      times: function (n,block) { 
        var accum = '';
        for(var i = 0; i < n; ++i)
          accum += block.fn(i);
        return accum;
    }
  },
  defaultLayout: 'main'
}));
app.set("view engine", "handlebars");


app.use(express.static(path.join(__dirname, "./views")));

// app.use(bodyParser.urlencoded({ extended: true }));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.get("/", (req, res) => {
  res.render('index');
});
app.get("/logout",(req,res)=>{
  session.uid = "";
  res.render('index');
})

// Admin route
app.use('/admin', require('./routes/admin'));

app.use('/register',require('./routes/register'))

// Organisations ROUTE
app.use('/org', require('./routes/org/org'));

app.use('/hotspots',require('./routes/hotspots'));

app.use('/profile',require('./routes/profile'));

// Login
app.use('/login', require('./routes/login'));

app.use('/logout', require('./routes/login'));



exports.app;
