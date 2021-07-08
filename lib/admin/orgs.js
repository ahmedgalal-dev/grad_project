const firebase = require('firebase/app');
const admin = require('firebase-admin');
require('firebase/auth');
require("firebase/firestore");
const firestore = firebase.firestore();
const fauth = firebase.auth();

//GET ORGS& HOTSPOTS------------
async function get_orgs(callbck){
    await firestore.collection('users').where('user_type', '==', 'org').get().then((snapshot)=>{
        callbck(snapshot);
    });
}
async function get_reports(clbck){
    var reports = [];
    const get_rep = new Promise(async (resolve,reject)=>{
        await firestore.collection('requests').where("status","==","accepted").get().then((requests)=>{
            requests.forEach((element)=>{
                reports.push(element.data());
            });
        }).catch((err)=>{
            reject(err);
        });
        for(var i =0 ; i<reports.length ;i++){
            await firestore.collection("users").doc(reports[i].user_id).get().then(async (snap)=>{
                reports[i].user_name = await snap.data().name;
                reports[i].user_national_id = await snap.data().national_id;
            });
            await firestore.collection("donation_hotspot").doc(reports[i].hotspot_id).get().then(async (snap)=>{
                reports[i].hotspot_name = await snap.data().name;
            });
            await firestore.collection("users").doc(reports[i].org_id).get().then(async (snap)=>{
                reports[i].org_name = await snap.data().name;
            });
        }
        resolve(reports);
    })
    get_rep.then(async (reports)=>{
        console.log(reports);
        clbck(reports);
    })
}
async function get_htspt(callbck){
    const htspt = await firestore.collection('donation_hotspot').get();
    callbck(htspt);
}

//ADD, DELETE & EDIT ORGANISATIONS-------------
async function add_org(email,password,name,org_num,callbck){
    var uid;
    var taken = false;
    await get_orgs((orgs)=>{
        orgs.forEach(org =>{
            if(org.data().name == name || org.data().org_number == org_num){
                taken = true;
            }
        });
    });
    if(taken){
        callbck(1);
    }else{
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            uid = userCredential.user.uid;
        })
        .catch((error) => {
            callbck(error.message);
        });
        if(uid){
            await firestore.collection('users').doc(uid).set({
                name:name,
                org_number:org_num,
                user_type:"org"
            });
            callbck("Organisation added successfully");
        }
    }
}
async function del_org(name,callbck){
    var uid;

    await firestore.collection('users').where('user_type', '==', 'org').get().then((orgs)=>{
        orgs.forEach((org) => {
            if (org.data().name == name){
                uid = org.id;
            }
        });

    });

    await firestore.collection("users").doc(uid).delete();
    await admin.auth().deleteUser(uid);
    //await fauth.currentUser.delete();
    callbck("ORGANISATION DELETED !!");
}

function get_org(org_name){
    
}

module.exports.get_orgs = get_orgs;
module.exports.add_org = add_org;
module.exports.get_htspt = get_htspt;
module.exports.del_org = del_org; 
module.exports.get_org = get_org;
module.exports.get_reports = get_reports;