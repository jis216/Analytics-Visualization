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

endpoint = "https://js-cse135-pa4.web.app/";

function createAccount(e){
    e.preventDefault();

    let email = document.getElementById('newEmail').value;
    let password = document.getElementById('newPassword').value;
    let userName = document.getElementById('newUsername').value;
    let requestBody = {
        "email":email, 
        "password": password, 
        "displayName": userName
    };

    let url = endpoint + "user";
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(requestBody)
    })
    .then((res) => {
        if (res.status == 200){
            return res.json();
        }
        return null;
    })
    .then((result) => {
        if(result){
            console.log("create success");
            createSuccess();
        }
        else{
            console.log('create User Failure');
        }
    })
    .catch((error) => {
        console.error('create User Error:', error);
    });
}

function createSuccess(){
    document.getElementById('createAccountSuccess').hidden = false;
    window.location.assign("/login");

}

function updateAccount(userInfoConfig){
        
    let url = endpoint + "user";
    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(userInfoConfig)
    })
    .then((res) => {
        if (res.status == 200){
            return res.json();
        }
        return null;
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