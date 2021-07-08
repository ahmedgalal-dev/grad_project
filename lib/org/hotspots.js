const session = require("express-session");
const firebase = require("firebase");
const firestore = firebase.firestore();

async function getHotspots(callbck){
     await firestore.collection('donation_hotspot').where("org_id","==",session.uid).get().then((snap)=>{
        callbck(snap);
    });
}

async function edit_hotspot(data,clbck){
    var id;
    await firestore.collection("donation_hotspot").where("name","==",data.name).get().then((snap)=>{
        snap.forEach((doc)=>{
            if(doc.data().name == data.name){
                id = doc.id;
            }
        })
    });
    await firestore.collection("donation_hotspot").doc(id).update({
        most_available : data.most_available +","+data.avamount,
        most_needed : data.need,
    });
    clbck("updated successfully");

}
async function addHotspot(hotspotData,clbck){
    var location = new firebase.firestore.GeoPoint(hotspotData.long, hotspotData.lat);
    var x =hotspotData.available +","+ hotspotData.available_amount;
    console.log("ana x => ",x);
    var data = {
        location: location,
        most_available : x,
        most_needed : hotspotData.needs,
        name : hotspotData.name,
        org_id : hotspotData.org_id
    }
    await firestore.collection("donation_hotspot").add(data).then(()=>{
        clbck("hotspot added successfully");
    }).catch(()=>{
        clbck("couldn't add hotspot (DB error)");
    });
}
 async function delHotspot(name,clbck){
    var hotspots = []
    var found;
    await getHotspots((snap)=>{
        snap.forEach((doc)=>{
            hotspots.push(doc.data());            
        });
    });
    hotspots.forEach( (hotspot)=>{
        if(hotspot.name == name ){
            found = true;
        }
    });
    if(found){
        await firestore.collection("donation_hotspot").where("name","==",name).get().then((snap)=>{
            snap.forEach((doc) => {
                firestore.collection("donation_hotspot").doc(doc.id).delete();
                clbck("hotspot deleted");
            });
        });
    }else{
        clbck("there's no hotspot by this name");
    }
    
}
module.exports.addHotspot = addHotspot;
module.exports.delHotspot = delHotspot;
module.exports.getHotspots = getHotspots;
module.exports.edit_hotspot = edit_hotspot;