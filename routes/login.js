const express = require("express");
const session = require("express-session");
const router = express.Router();
const firebase = require('firebase/app');

const user_info = require('../lib/admin/info');

// Login
router.get("/", (req, res) => {
    res.render('login');
  });

router.post("/", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
  
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredntial)=>{
      session.uid = userCredntial.user.uid;
      user_info.get_info((info)=>{
        let type = info.user_type;
        if(type == "user"){
          res.redirect("/hotspots");
        }
        else if(type == "admin"){
          res.redirect("/admin");
        }
        else if(type = "org"){
          res.redirect("/org/");
        }
      });
    }).catch((error) => {
      var errorMessage = error.message;
      res.render('login',{error: errorMessage});
    })
  });
module.exports = router;
