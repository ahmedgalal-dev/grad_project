const session = require("express-session");
const firebase = require("firebase/app");
const firestore = firebase.firestore();

const admin = require("firebase-admin");
const fs = admin.firestore();


async function valHotspot(data,clbck){
    var isTaken = false;
    var isEmpty = false;
    var arr =[];
    arr.push(data.name);
    arr.push(data.long);
    arr.push(data.lat);
    arr.push(data.available);
    arr.push(data.needs);
    arr.push(data.org_id);
    arr.forEach((element) => {
        if(element == ""){
            isEmpty = true;
        }
    });

    await firestore.collection("donation_hotspot").get().then((snap)=>{
        snap.forEach((doc) => {
            if(data.name == doc.data().name){
                isTaken = true;
            }
        });
        clbck(isTaken,isEmpty);
    });
}

async function get_htspt(id,clbck){
    var hotspot;
    await firestore.collection("donation_hotspot").doc(id).get().then((snap)=>{
        hotspot = {
            lat : snap.data().location._lat,
            long : snap.data().location._long,
            name : snap.data().name,
        };
    });
    clbck(hotspot);
}
async function get_user(id,clbck){
    var user ;
    await firestore.collection("users").doc(id).get().then((snap)=>{
        user = {
            name : snap.data().name,
            national_id : snap.data().national_id,
        };
    });
    clbck(user);
}

async function getRequests(clbck){
    var users_ids,hotspot_ids = [];
    var x,y=0;
    var final_data = [];

    const get_requests = new Promise(async (resolve,reject)=>{
    var data = [];
    var data2 = [];
        await firestore.collection("requests").where("org_id","==",session.uid).get().then(async (snap)=>{
            await snap.forEach((doc) => {
                if(doc.data().status == "pending"){
                    data.push({
                        type : doc.data().type,
                        status : doc.data().status,
                        amount : doc.data().amount,
                        reason : doc.data().reason,
                        medical_reason:doc.data().medical_reason,
                        hotspotId : doc.data().hotspot_id,
                        userId : doc.data().user_id,
                        requestId : doc.id
                    });
                }else{
                    data2.push({
                        type : doc.data().type,
                        status : doc.data().status,
                        amount : doc.data().amount,
                        reason : doc.data().reason,
                        medical_reason:doc.data().medical_reason,
                        hotspotId : doc.data().hotspot_id,
                        userId : doc.data().user_id,
                        requestId : doc.id
                    });
                }
            });

            for(var i =0 ; i<data.length ;i++){
                await firestore.collection("users").doc(data[i].userId).get().then(async (snap)=>{
                    data[i].user_name = await snap.data().name;
                    data[i].user_national_id = await snap.data().national_id;
                });
                await firestore.collection("donation_hotspot").doc(data[i].hotspotId).get().then(async (snap)=>{
                    data[i].hotspot_name = await snap.data().name;
                });
            }
            for(var i =0 ; i<data2.length ;i++){
                await firestore.collection("users").doc(data2[i].userId).get().then(async (snap)=>{
                    data2[i].user_name = await snap.data().name;
                    data2[i].user_national_id = await snap.data().national_id;
                });
                await firestore.collection("donation_hotspot").doc(data2[i].hotspotId).get().then(async (snap)=>{
                    data2[i].hotspot_name = await snap.data().name;
                });
            }
            resolve({data:data,data2:data2});
            }).catch((err)=>{
                reject(Error(err));
            });
    })
    
    await get_requests.then((res)=>{
        clbck(res.data,res.data2);
    }).catch((err)=>{
        console.log(err);
    })

}

async function getNeededDonation(clbck){
    var data = []
    await firestore.collection("requests").where("reason","==","need donation").get().then((snap)=>{
        snap.forEach((doc) => {
            data.push(doc.data());
        });
        clbck(data);
    });
}

async function respond(id,response,user_id,reason,clbck){
    await firestore.collection("requests").doc(id).update({
        status:response
    });
    if(response == "accepted" && reason == "donate"){
        await fs.collection("users").doc(user_id).update({
            num_of_donation : admin.firestore.FieldValue.increment(1)
        });
    }
    clbck("Status changed");
}
async function reject(){

}





module.exports.getRequests = getRequests;
module.exports.getNeededDonation = getNeededDonation;
module.exports.valHotspot = valHotspot;
module.exports.respond = respond;