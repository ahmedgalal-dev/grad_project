const express = require('express');
const router = express.Router();
const session = require("express-session");
const hotspots = require('../../lib/org/hotspots.js');
const requests = require('../../lib/org/requests.js');
const multer = require("multer");
const { firestore } = require('firebase-admin');

router.post("/deleteHotspot",(req,res)=>{
    var name = req.body.hotspotName;
    hotspots.delHotspot(name,(clbck)=>{
        res.redirect("/org");
    });
});
router.get("/",(req,res)=>{
    var htspts = [];
    hotspots.getHotspots((snap)=>{
        snap.forEach((doc) => {
            htspts.push(doc.data());
        });
        res.render("./org/hotspots",{htspts:htspts});
    })
});
router.get("/show_requests",(req,res)=>{
    requests.getRequests((data,data2)=>{
        console.log(data2);
        res.send({data:data,data2:data2});
    })
})
router.get("/requests",(req,res)=>{
    res.render("./org/req");
    
});
router.post("/requests",(req,res)=>{
    requests.respond(req.body.request_id,req.body.response,req.body.user_id,req.body.reason,(clbck)=>{
        res.render("./org/req");
    })
});

router.get("/addHotspot",(req,res)=>{
    var orgId = session.uid;
    res.render("./org/addHotspot",{orgId:orgId});
});
router.post("/addHotspot",(req,res)=>{
    var data = {
        long : req.body.long,
        lat : req.body.lat,
        available : req.body.available,
        available_amount : req.body.avamount,
        needs : req.body.needs,
        name : req.body.name,
        org_id : req.body.orgId
    }
    requests.valHotspot(data,(isTaken,isEmpty)=>{
        if(!isTaken && !isEmpty){
            hotspots.addHotspot(data,(clbck)=>{
                res.render("./org/addHotspot",{success:"Hotspot added successfully"});
            });
        }
        if(isTaken){
            res.render("./org/addHotspot",{err:"Hotspot name is taken"});
        }
        if(isEmpty){
            res.render("./org/addHotspot",{err:"Please fill all fields"});
        }
    })
});

router.post("/edit_hotspot",(req,res)=>{
    hotspots.edit_hotspot({need:req.body.mostneed,most_available:req.body.mostavailable,name:req.body.name,avamount:req.body.avamount},(clbck)=>{
        res.redirect("/org");
    })
});
module.exports = router;