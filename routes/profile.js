const express = require("express");
const session = require("express-session")
const router = express.Router();
const firebase = require('firebase');
const admin = require("firebase-admin");



// Edit Profile
router.get("/", (req, res) => {
    firebase.auth().onAuthStateChanged(userCredntial => {
      var dict = {};
      firebase.firestore().collection("users").doc(userCredntial.uid).get().then((querySnapshot) =>{
        const nm = querySnapshot.data().name;
        const nid = querySnapshot.data().national_id;
        const ag = querySnapshot.data().age;
        const ad = querySnapshot.data().address;
        const don = querySnapshot.data().can_donate;
        dict.n = nm;
        dict.ad = ad;
        dict.nid = nid;
        dict.ag = ag;
        dict.don = don;
        res.render('profile', dict);
      });
    });
  });

router.post("/", (req, res) => {
  console.log(req.body);
  console.log("sessiiii" ,session.uid);
    var age = req.body.age1;
    var username = req.body.username1;
    var NatId = req.body.NatId1;
    var address = req.body.address1;
    var blood = req.body.blood;
    var gender = req.body.gender;

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
  
      if (!age || !username || !NatId || !address || !blood || !gender ){
        res.render('profile', {error: "Are you sure you have entered all the data?"})
      }else{
        var cand = true;
        if ( cancer ||  cardiac || lungdisease || hepatitisBandC || HIVinfaction || AIDSorSexually || Chronicalcoholism || Pregnancy || Acutefever ||Earorbody ){
          cand = false;
        }
        else{
          firebase.firestore().collection("users").doc(session.uid).update({
            address: address,
            age: age,
            name: username,
            national_id: NatId,
            can_donate: cand,
            gender: gender,
            blood_type: blood
          }).then(()=>{
            res.redirect("/profile");
          });
        }
      }
  });
module.exports = router;
