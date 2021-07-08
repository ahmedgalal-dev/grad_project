const session = require('express-session');

const firebase = require('firebase/app');
require("firebase/auth");
require("firebase/firestore");


// ADMIN SIGNIN & OUT
 function admin_login(mail,pass,ret){
  firebase.auth().signInWithEmailAndPassword(mail, pass)
  .then((userCredential) => {
    var user = userCredential.user;
    session.uid = user.uid;
    ret({success:1,uid:user.uid});
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    ret({success:0,error:errorMessage});
  });
}

function admin_logout(){
  session.uid = "";
    firebase.auth().signOut();
}
// END



module.exports.admin_login = admin_login;
module.exports.admin_logout = admin_logout;
