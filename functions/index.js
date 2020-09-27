const functions = require('firebase-functions');
const Filter = require('bad-words');

const admin = require('firebase-admin');
const { firestore } = require('firebase');
admin.initializeApp();

const db = admin.firestore();

exports.detectBadWords = functions.firestore.document('messages/{msgId}').onCreate(async (doc, ctx) => {
    const filter = new Filter();
    const {text, uid} = doc.data();

    if (filter.isProfane(text)){
        const cleanText = filter.clean(text);
        await doc.ref.update({text: {cleanText}})
    }
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
