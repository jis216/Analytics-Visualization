
let endpoint = "https://js-cse135-pa4.web.app/";

async function getUsers(){
    let url = endpoint + "users/all";

    let res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
    }});
    if(res){
        return await res.json();
    }
    else{
        return null
    }
    
}

function updateAccount(userInfoConfig, uid){
        
    let url = endpoint + "user/" +uid;
    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(userInfoConfig)
    })
    .then((res) => {
        console.log('response return');
        if(res.status == '200'){
            console.log("update success")
        }
        else{
            console.log('update User Failure');
        }
    })
    .catch((error) => {
        console.error('update User Error:', error);
    });
    
}

var users = [];
getUsers().then(async (userResults) => {
    if (userResults == null){
        console.log('no users')
        return
    }
    for (const u of userResults) {
        let ordered_data = {};
        let column_order = ['uid','email', 'display-name']; // , 'userType'
        column_order.forEach((key) => {
            ordered_data[key] = u[key];
        });

        let meta_order = ['creationTime', 'lastSignInTime']; // , 'userType'
        meta_order.forEach((key) => {
            ordered_data[key] = u.metadata[key];
        });

        users.push(ordered_data); 
    }
    console.log('users:');
    console.log(users);
    let zgRef = document.querySelector('zing-grid');

    return await zgRef.setData(users);
    
}).then((grid) => {
    let colgroup = document.querySelector('zing-grid zg-colgroup');
    let remove_col = document.createElement('zg-column');
    remove_col.type = "remover";
    colgroup.appendChild(remove_col);

    let uid = colgroup.querySelector('zg-column[index|=uid]')
    uid.editor="false";

    let submitBtn = document.getElementById('user-submit');
    submitBtn.addEventListener('click', ()=>{
        let zgRef = document.querySelector('zing-grid');
        dataArr = zgRef.getData();
        dataArr.forEach((row) => {
            requestBody = {
                email: row.email,
                displayName: row['display-name']
            };
            updateAccount(requestBody, row.uid);
        });
    });
});