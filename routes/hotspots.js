const express = require("express");
const session = require("express-session");
const router = express.Router();
const firebase = require('firebase');



router.get("/", (req, res) => {
        res.render('hotspots',{uid:session.uid});
    
})

router.post('/', (req, res) => {

    const blood = req.body.blood;
    const amount = req.body.amount;
    const reason = req.body.reason;
    const medical_reason = req.body.medical_reason;
    const agree = req.body.agree;
    var org_id = req.body.org_id;
    var hotspot_id = req.body.hotspot_id;
    var user_id = req.body.user_id;    
    
    if (!blood || !amount || !reason || !agree){
        res.render('hotspots',{error: "Are you sure you have entered all the data?"});
    }else{
     
     

        firebase.firestore().collection("requests").doc().set({
          amount : amount ,
          hotspot_id : hotspot_id,
          reason : reason,
          medical_reason: medical_reason,
          org_id : org_id,
          reason : reason,
          status : "pending",
          type :blood,
          user_id : user_id
      }).then((x)=>{
        res.redirect("hotspots");
      }).catch((error) => {
        var errorMessage = error.message;
        res.render('register',{error: errorMessage});
        
      });

    }
})
module.exports = router;

