const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const admin = require("firebase-admin");


var firebaseConfig = {
  apiKey: "AIzaSyCDzg_QY-v1B2dnMcn1cdTqcgxR-DOqzJI",
  authDomain: "blood-donation-app-92caa.firebaseapp.com",
  databaseURL: "https://blood-donation-app-92caa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "blood-donation-app-92caa",
  storageBucket: "blood-donation-app-92caa.appspot.com",
  messagingSenderId: "71223960487",
  appId: "1:71223960487:web:e67f010aa744567530cc82",
  measurementId: "G-99YFH2BSFC"
};

const db = firebase.firestore();

// Register
router.get("/", (req, res) => {
  res.render('register');
});

router.post("/", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
  
    const age = req.body.age;
    const username = req.body.username;
    const national_id = req.body.Nid;
    const address = req.body.address;
    const rech = req.body.rech;
    const gender = req.body.gender;
    
    const cancer = req.body.cancer;
    const cardiac = req.body.Cardiac;
    const lungdisease = req.body.lungdisease;
    const hepatitisBandC = req.body.hepatitisBandC;
    const HIVinfaction = req.body.HIVinfaction;
    const AIDSorSexually = req.body.AIDSorSexually;
    const Chronicalcoholism = req.body.Chronicalcoholism;
    const Pregnancy = req.body.Pregnancy;
    const Acutefever = req.body.Acutefever;
    const Earorbody = req.body.Earorbody;
  
  
  if ( !age || !username || !national_id || !address || !rech || !gender){
    res.render('register',{error: "Are you sure you have entered all the data?"});
  }else{
    firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {

      const user = firebase.auth().currentUser;
      user.sendEmailVerification().then(function() {
        res.render('login', {alert : window.alert("Verification link sent to your email. Kinldy check to verify your account")})
      }).catch(function(error) {
        // window.alert(error)
      });

      var cant = true;
      if ( cancer ||  cardiac || lungdisease || hepatitisBandC || HIVinfaction || AIDSorSexually || Chronicalcoholism || Pregnancy || Acutefever ||Earorbody ){
        cant = false;
      }
      else{
        cant
      };
      res.redirect("/login");
        return db.collection('users').doc(userCredential.user.uid).set({
        address: address,
        age: age,
        blood_type: rech,
        can_donate: cant,
        name: username,
        national_id: national_id,
        gender: gender,
        num_of_donation: 0,
        user_type: "user",
         
      })
    }).catch((error) => {
      var errorMessage = error.message;
      res.render('register',{error: errorMessage});
    });
  }
  });

  module.exports = router;
