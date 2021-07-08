const session = require('express-session');

const firebase = require('firebase/app');
require("firebase/firestore");
require("firebase/auth");
const firestore = firebase.firestore();
const fauth = firebase.auth();
async function get_info(callbck) {
    var userInfo = await firestore.collection('users').doc(session.uid).get();
    userInfo = await userInfo.data();
    var authInfo = await fauth.currentUser;
    var info = {
        user_type:userInfo.user_type,
        userInfo:userInfo,
        email:authInfo.email
    }
        callbck(info);
}

module.exports.get_info = get_info;