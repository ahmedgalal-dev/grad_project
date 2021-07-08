const express = require("express");
const router = express.Router();
const session = require("express-session");

var orgs = require("../lib/admin/orgs.js");

router.get('/reports',(req,res)=>{
  orgs.get_reports((reports)=>{
    res.render('admin/Reports/reports',{reports:reports});
  })
});

router.get('/:addErr',(req,res)=>{
  var err = req.params.addErr;
  var all_orgs = [];
  if(err == "addErr=2"){
    orgs.get_orgs((snapshot)=>{
      snapshot.forEach(doc => {
        all_orgs.push(doc.data());
      });
      res.render('admin/admin',{orgs:all_orgs,err:"Please Fill All Fields"});
    });
  }else if(err == "addErr=1"){
    orgs.get_orgs((snapshot)=>{
      snapshot.forEach(doc => {
        all_orgs.push(doc.data());
      });
      res.render('admin/admin',{orgs:all_orgs,err:"organisation name/number is taken"});
    });
  }
});

router.get('/',(req,res)=>{
  var all_orgs = [];
    orgs.get_orgs((snapshot)=>{
      snapshot.forEach(doc => {
        all_orgs.push(doc.data());
      });
      res.render('admin/admin',{orgs:all_orgs});
    });
  
});

router.post('/add_org',(req,res)=>{
  var org_data = {
   email : req.body.email,
    password : req.body.password,
    confPassword : req.body.confPassword,
   org_name : req.body.org_name,
    org_number : req.body.org_number
  }
  var x =[]
  var emptyFields = false;
  x.push(org_data.email);
  x.push(org_data.password);
  x.push(org_data.confPassword);
  x.push(org_data.org_name);
  x.push(org_data.org_number);
  x.forEach(i => {
    if(i == ""){
      console.log("you have empty fields");
      emptyFields = true;
    }
  });
  if(!emptyFields){
    orgs.add_org(org_data.email,org_data.password,org_data.org_name,org_data.org_number,(ress)=>{
      if(ress == 1){
       res.redirect("/admin/addErr=1");
      }else{
        res.redirect("/admin");
      }
    }); 
  }else{
    res.redirect("/admin/addErr=2");
  }
  
});
  
router.post('/del_org',(req,res)=>{
    let name = req.body.name;
    orgs.del_org(name,(msg)=>{
      console.log(msg);
      res.redirect("/admin");
    });
});

router.get('/logout',(req,res)=>{ 
    admin_logout();
    res.end();
});

module.exports = router;
