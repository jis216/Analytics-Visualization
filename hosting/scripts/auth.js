/**
 * When loading login.html, if user is logged in.
 * If there is any user, redirect to main page.
 */

// function from https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

// let sessionID = getCookie('__session')
// if(sessionID != null){
//     window.location.href = 'index.html';
// }

const endpoint = "https://js-cse135-pa4.web.app/";

function createAccount(e){
    e.preventDefault();
    console.log("create account!");

    let email = document.getElementById('newEmail').value;
    let password = document.getElementById('newPassword').value;
    console.log("email:",email, "pw:",password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
        console.log("create user success: ",result);
        window.location.assign('/login');
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    });
}

function createSuccess(){
    document.getElementById('createAccountSuccess').hidden = false;
}

function updateAccount(userInfoConfig){
        
    console.log('send update request: ', userInfoConfig);
    let url = endpoint + "userUpdate";
    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(userInfoConfig)
    })
    .then((response) => {
        console.log('response return');
        return response.json();
    })
    .then((result) => {
        if(result){
            console.log("update success")
            updateSuccess();
        }
        else{
            console.log('update User Failure');
            updateFailure();
        }
        console.log(result);
    })
    .catch((error) => {
        console.error('update User Error:', error);
    });
    
}
function updateSuccess(){    
    console.log('Create User Success!');
    let msg = document.querySelector(".submit-button a")
    msg.innerHTML = "update success!";
    msg.className = "success";
}
function updateFailure(){    
    console.log('Create User Failure!');
    let msg = document.querySelector(".submit-button a")
    msg.innerHTML = "update failure!";
    msg.className = "failure";
}

// As httpOnly cookies are to be used, do not persist any state client side.
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
function signIn(e){    
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    console.log('before sign in')

    // When the user signs in with email and password.
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
        // Get the user's ID token as it is needed to exchange for a session cookie.
        console.log('user:',userCredentials.user);
        userCredentials.user.getIdToken()
        .then((idToken) => {
            // Session login endpoint is queried and the session cookie is set.
            // CSRF protection should be taken into account.
            // ...
            // const csrfToken = getCookie('csrfToken');
            // return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
            let requestBody = {'idToken': idToken};
        
            console.log('send login request: ', requestBody);
            let url = endpoint + "sessionLogin";
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(requestBody)
            })
            .then((response) => {
                console.log('response return');
                return response.text();
            })
            .then((result) => {
                if(result){
                    loginSuccess();
                }
                else{
                    loginFail("create fail!");
                }
                console.log(result);
            })
            .catch((error) => {
                console.error('Create User Error:', error);
            });
            return;
        });
        return;
    }).then(() => {
        // A page redirect would suffice as the persistence is set to NONE.
        return firebase.auth().signOut();
    });
}
  

function loginSuccess(){    
    console.log('Create User Success!');

    console.log('go to dashboard');
    window.location.assign('/dashboard');
}

function loginFail(message){
    console.log('Create User Failure:', message);
    document.querySelector("#loginForm p").innerHTML = message;
}