const functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuidv4 = require('uuid/v4');

const firebaseConfig = {
    apiKey: "AIzaSyDaoHPwaIvHibFdsVieKLt_J9WrDjNLNHo",
    authDomain: "js-cse135-pa4.firebaseapp.com",
    databaseURL: "https://js-cse135-pa4.firebaseio.com",
    projectId: "js-cse135-pa4",
    storageBucket: "js-cse135-pa4.appspot.com",
    messagingSenderId: "697908584043",
    appId: "1:697908584043:web:afd2211ef0699329b39b2e",
    measurementId: "G-DZ3F6MXWGX"
};

// set up firestore, express and other middlewares
admin.initializeApp(firebaseConfig);
var firestore = admin.firestore();

// set up the express app, cors and cookie middleware
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({
    origin: ['https://jis216.github.io', 'https://js-cse135-pa4.web.app', 'https://js-cse135-pa4.firebaseapp.com', 'http://localhost:5000'],
    credentials: true
});

// set up the authentication object
var auth = admin.auth();

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

const app = express();
app.use(cors);
app.use(cookieParser);

app.post('/sessionLogin', (req, res) => {
    // Set session expiration to 2 hours.
    const timeToExpire = 2 * 60 * 60 * 1000;

    console.log("request content:", req.body);

    // const csrfToken = req.body.csrfToken.toString();
    // // Guard against CSRF attacks.
    // if (csrfToken !== req.cookies.csrfToken) {
    //   res.status(401).send('UNAUTHORIZED REQUEST!');
    //   return;
    // }

    // Get the ID token passed and the CSRF token.
    const idToken = JSON.parse(req.body).idToken.toString();
    
    auth.verifyIdToken(idToken).then((decodedIdToken) => {
        // Create session cookie and set it.
        console.log('idToken', idToken, 'expiresIn', timeToExpire)

        return auth.createSessionCookie(idToken, {'expiresIn': timeToExpire})
        
    }).then((sessionCookie) => {
        if(sessionCookie){
            console.log('sessionCookie: ', sessionCookie);
            // Set cookie policy for session cookie.
            const options = {maxAge: timeToExpire,  'httpOnly': false, 'SameSite':'None'}; //httpOnly: true, secure: true
            res.cookie('__session', sessionCookie, options);
            res.status(200).send('cookie success!');
            res.end();
            console.log("session cookie success");
        }
        else{
            // A user that was not recently signed in is trying to set a session cookie.
            // To guard against ID token theft, require re-authentication.
            res.status(401).send('Recent sign in required!');
        }
        return
    }).catch( (error) => {
        console.log("session error:", error);
        res.status(401).send('sessionCookie error:', error);
    });
    
});

app.get('/users/all', (req, res) => {
    auth.listUsers(50)
    .then((listUsersResult) => {
        console.log('user list:',listUsersResult.users);
        res.status(200).send(JSON.stringify(listUsersResult.users));
        return
    })
    .catch((error) => {
        console.log('Error listing users:', error);
        res.status(500).send();
    });
    
});

// get userRecord through uid
app.get('/user/:uid', (req, res) => {

    auth.getUser(req.params.uid)
    .then((userRecord) => {
        res.status(200).send(JSON.stringify(userRecord));
        return;

    })
    .catch((error) => {
        console.log('Error fetching user data:', error);
        res.status(404).send();
    });
    
});

// update a user
app.put('/user/:uid', (req, res) =>{
    // check if the request body is a proper JSON
    let testDict = tryParseJSON(req.body);
    if(testDict === false){
        res.status(400).send('malformed request body');
        return
    }

    let dataDict = testDict;

    auth.updateUser(req.params.uid, {
        email: dataDict.email,
        displayName: dataDict.displayName,
    })
    .then((userRecord) => {
        res.status(200).send(userRecord.toJSON());
        return
    })
    .catch((error) => {
        console.log(error);
        console.log('Error updating a user');
        
        res.status(403).send(JSON.stringify({}));
    });
});

// create a new user
app.post('/user', (req, res) => {

    // check if the request body is a proper JSON
    let testDict = tryParseJSON(req.body);
    if(testDict === false){
        res.status(400).send('malformed request body');
        return
    }

    let dataDict = testDict;

    admin.auth().createUser({
        email: dataDict.email,
        password: dataDict.password,
        displayName: dataDict.displayName,
    }).then((userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);

        // add administrator privilege to certain users
        if ( dataDict.email.endsWith('@admin.ucsd.edu') || dataDict.email.includes('cse135grader')) {
            admin.auth().setCustomUserClaims(userRecord.uid, {admin: true});
        }
        res.status(200).send(JSON.stringify(userRecord.uid));
        return;
    }).catch((error) => {
        console.log('Error creating new user:', error);
        res.status(403).send(JSON.stringify(error));
    });

})

app.put('/user', (req, res) =>{
    const sessionCookie = req.cookies.__session || '';

    // check if the request body is a proper JSON
    let testDict = tryParseJSON(req.body);
    if(testDict === false){
        res.status(400).send('malformed request body');
        return
    }

    let dataDict = testDict;

    // Verify the session cookie.
    auth.verifySessionCookie(sessionCookie, true)
    .then((decodedIdToken) => {
        console.log('decoding success ');

        let uid = decodedIdToken.uid;
        return admin.auth().updateUser(uid, {
            email: dataDict.email,
            displayName: dataDict.username,
        });
        
    })
    .then((userRecord) => {
        console.log('Successfully updated user', userRecord.toJSON());
        res.status(200).send(userRecord.toJSON());
        return
    })
    .catch((error) => {
        console.log(error);
        console.log('Need to login first');
        
        res.status(403).send(JSON.stringify({}));
        
    });
});

// Verify session cookie and check permissions for a user
app.get('/user-access', (req, res) => {
    const sessionCookie = req.cookies.__session || '';
    // Verify the session cookie.
    auth.verifySessionCookie(sessionCookie)
      .then((decodedIdToken) => {
        res.status(200).send(JSON.stringify(decodedIdToken));
        return
      })
      .catch(error => {
        console.log(error);
        console.log('Need to login first');
        // Session cookie is unavailable or invalid. Force user to login.
        res.status(403).send();        
    });
});

// Verify session cookie and check permissions for an administrator
app.get('/admin-access', (req, res) => {
    const sessionCookie = req.cookies.__session || '';
    // Verify the session cookie.
    auth.verifySessionCookie(sessionCookie, true)
    .then((decodedIdToken) => {
        // Check custom claims to confirm user is an admin.
        if (decodedIdToken.admin === true) {
            res.status(200).send(JSON.stringify(decodedIdToken));
        }
        res.status(403).send();
        return
    })
    .catch((error) => {
        // Session cookie is unavailable or invalid. Force user to login.
        console.log('need to login first');
        res.status(403).send();
    });
});

app.get('/sessionLogout', (req, res) => {
    res.clearCookie('__session');
    res.status(200).send('to /login');
});

//GET at '/session' -> generate session id and send set-cookie header
app.get('/sessionize', (req, res) => {
    //check if has a session already or not
    if( !(req.cookies && req.cookies.__session) ){

        // if there is no cookie, get new session id
        let sessionID = uuidv4().toString();
        
        res.type('text/plain');
        res.cookie('__session', sessionID, {
            domain: 'js-cse135-pa4.web.app', 
            path: '/',
            'httpOnly': false,
            'SameSite': 'None',
        });

        //send back sessionID
        res.status(200).send(sessionID);
    }
    else{
        // session already exists, no new cookie/session id generated
        res.status(200).send('false');
    }
    
});

//POST at '/collect/document' -> update document or get document
app.post('/collect/document', (req, res) => {
    if( !(req.cookies && req.cookies.__session) ){
        res.status(401).send('no cookie!');
        return
    }

    // forbid mal-formed id => if wrong format, return
    if (!testSessionID(req.cookies.__session)){
        res.status(400).send('malformed session id');
        return
    }
    let sessionID = req.cookies.__session;
    
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

    // check if such collection exist (valid sessionID?)
    let colRef = firestore.collection(sessionID);
    if (!colRef){
        res.status(403).send("collection doesn't exist");
        return
    }

    // check if the document exists
    let docRef = colRef.doc(docuNm);
    if (!docRef){
        res.status(403).send("document doesn't exist");
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
            res.status(500).send("get document error: ", error);
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
app.get('/collect/collection', (req, res) => {
    if( !(req.cookies && req.cookies.__session) ){
        res.status(401).send('no cookie!');
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
app.post('/collect/collection', (req, res) => {
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
app.get('/collect/all', (_, res) => {
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

app.get("/showdb", (_, res) => { 
    res.redirect('https://js-cse135-pa4.web.app/showdb.html');
    res.end();
});

exports.app = functions.https.onRequest(app);
