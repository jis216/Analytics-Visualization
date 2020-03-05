const functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuidv4 = require('uuid/v4');

// firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCxQpyysjeSrmO29Ru6_pEi3lzIw-gZQSM",
    authDomain: "js-cse135-pa3.firebaseapp.com",
    databaseURL: "https://js-cse135-pa3.firebaseio.com",
    projectId: "js-cse135-pa3",
    storageBucket: "js-cse135-pa3.appspot.com",
    messagingSenderId: "598533563714",
    appId: "1:598533563714:web:3c968ebc5f35bd66af14db",
    measurementId: "G-9HSW5W79GV"
};

// set up firestore, express and other middlewares
admin.initializeApp(firebaseConfig);
var firestore = admin.firestore();
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({
    origin: ['https://jis216.github.io', 'https://js-cse135-pa3.web.app'],
    credentials: true
});

//check if the session id is a hex-number string that follows the pattern 8-4-4-4-12
function testSessionID(input){
    const uidReg = RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    return uidReg.test(input);
}

function tryParseJSON (jsonString){
    try {
        var obj = JSON.parse(jsonString);

        // JSON.parse(str) needs to be an object and can't be null
        if (obj && typeof obj === "object") {
            return obj;
        }
    }
    catch (e) { return false; }

    return false;
}

const session = express();
session.use(cors);
session.use(cookieParser);

//GET at '/session' -> generate session id and send set-cookie header
session.get('/', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', req.origin);
    //check if has a session already or not
    if( !(req.cookies && req.cookies.__session) ){

        // if there is no cookie, get new session id
        let sessionID = uuidv4().toString();
        
        res.type('text/plain');
        res.cookie('__session', sessionID, { 
            'domain': 'us-central1-js-cse135-pa3.cloudfunctions.net', 
            'path': '/', 
            'httpOnly': false,
            'SameSite': 'None',
            'Secure': true
        });

        //send back sessionID
        res.status(200).send(sessionID);
    }
    else{
        // session already exists, no new cookie/session id generated
        res.status(200).send('false');
    }
    
});
exports.sessionize = functions.https.onRequest(session);

const collection = express();
collection.use(cors);
collection.use(cookieParser);

//POST at '/collect/document' -> update document or get document
collection.post('/document', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', req.origin);
    if( !(req.cookies && req.cookies.__session) ){
        res.status(405).send('no cookie!');
        return
    }

    // forbid mal-formed id => if wrong format, return
    if (!testSessionID(req.cookies.__session)){
        res.status(400).send('malformed session id');
        return
    }
    let sessionID = req.cookies.__session;

    // check if such collection exist (valid sessionID?)
    let colRef = firestore.collection(sessionID);
    if (!colRef){
        res.status(400).send("collection doesn't exist");
        return
    }
    
    // check if the request body is a proper JSON
    let testDict = tryParseJSON(req.body);
    if(testDict === false){
        res.status(400).send('malformed request body');
        return
    }
    let dataDict = testDict;

    // check if the request body has 'operation' or not
    let op = dataDict.operation
    delete dataDict.operation;
    if (!op){
        res.status(400).send("no op in request");
        return
    }

    // check if the request body has 'doc' or not
    let docuNm = dataDict.doc;
    delete dataDict.doc;
    if (!docuNm){
        res.status(400).send("no document name in request");
        return
    }

    // check if the document exists
    let docRef = colRef.doc(docuNm);
    if (!docRef){
        res.status(400).send("document doesn't exist");
        return
    }
            
    if (op === "getData"){
        docRef.get().then( (doc) => {
            if (doc.exists) {
                res.status(200).send( JSON.stringify(doc.data()) );
            } else {
                res.status(403).send("document doesn't exist");
            }
            return
        }).catch( (error) => {
            res.status(405).send("get document error: ", error);
        });
    } else if (op === "setData"){
        docRef.set(dataDict);
        res.status(200).send('store document');
    }
    else{
        res.status(400).send('wrong op content');
    }
    
});


//GET at '/collect/collection' -> return the collection specified by the cookie
collection.get('/collection', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', req.origin);
    if( !(req.cookies && req.cookies.__session) ){
        res.status(405).send('no cookie!');
        return
    }

    // forbid mal-formed id => if wrong format, return
    if (!testSessionID(req.cookies.__session)){
        res.status(400).send('malformed session id');
        return
    }
    let sessionID = req.cookies.__session;

    // check if such collection exist (valid sessionID?)
    let colRef = firestore.collection(sessionID);
    if (!colRef){
        res.status(400).send("collection doesn't exist");
        return
    }

    const collection = {};
    colRef.get().then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
            // add every document into the collection
            collection[doc.id] = doc.data();
        });
        // send the whole collection back
        res.status(200).send(JSON.stringify(collection));
        return

    }).catch( (error) => {
        res.status(400).send( 'get collection error: ', error);
    });
    
});

//POST at '/collect/collection', request is the collection name (plain text)
collection.post('/collection', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', req.origin);

    // forbid mal-formed id => if wrong format, return
    if (!testSessionID(req.body)){
        res.status(400).send('malformed session id');
        return
    }
    let sessionID = req.body;

    // check if such collection exist (valid sessionID?)
    let colRef = firestore.collection(sessionID);
    if (!colRef){
        res.status(400).send("collection doesn't exist");
        return
    }

    const collection = {};
    colRef.get().then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
            // add every document into the collection
            collection[doc.id] = doc.data();
        });
        // send the whole collection back
        res.status(200).send(JSON.stringify(collection));
        return
    }).catch( (error) => {
        res.status(400).send( 'get collection error: ', error);
    });
});

//GET at '/collect/all', return names of all collections
collection.get('/all', (_, res) => {
    //res.setHeader('Access-Control-Allow-Origin', req.origin);

    let collections = [];
    firestore.listCollections().then(allCollections => {
        for (let collection of allCollections) {
            // push every collection name
            collections.push(collection.id);
        }
        // send back names of all collections
        res.status(200).send(JSON.stringify(collections));
        return
    }).catch( (error) => {
        res.status(400).send( 'get all collection names error: ', error);
    });
    
});

// set the /collect endpoint
exports.collect = functions.https.onRequest(collection);

// endpoint /showdb redirects you to the web app showdb site
exports.showdb = functions.https.onRequest((req, res) =>{
    res.redirect('https://js-cse135-pa3.web.app/showdb.html');
   
})