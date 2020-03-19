
endpoint = "https://js-cse135-pa4.web.app/";

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

function deleteAccount(uid){
        
    let url = endpoint + "user/" +uid;
    fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
    })
    .then((res) => {
        if(res.status == '200'){
            console.log("delete success")
        }
        else{
            console.log('delete User Failure');
        }
    })
    .catch((error) => {
        console.error('delete User Error:', error);
    });
    
}

var users = [];
var uids = [];
getUsers().then(async (userResults) => {
    if (userResults == null){
        console.log('no users')
        return
    }
    console.log(userResults);
    for (const u of userResults) {
        uids.push(u.uid);

        let ordered_data = {};
        let column_order = ['uid','email', 'displayName'];

        column_order.forEach((key) => {
            ordered_data[key] = u[key];
        });

        if(u.customClaims){
            ordered_data['user-type'] = 'Admin';
        }
        else{
            ordered_data['user-type'] = 'Analyst';
        }

        let meta_order = ['creationTime', 'lastSignInTime'];
        meta_order.forEach((key) => {
            ordered_data[key] = u.metadata[key];
        });
        
        users.push(ordered_data); 
    }

    let zgRef = document.querySelector('zing-grid');
    zgData = zgRef.querySelector('zg-data');
    zgData.data = users;
    zgRef.hideColumn('uid');
    //zgRef.setData(users);
    return
    
}).then(() => {

    let submitBtn = document.getElementById('user-submit');
    submitBtn.addEventListener('click', ()=>{
        let zgRef = document.querySelector('zing-grid');
        dataArr = zgRef.getData();
        for (let i=0; i < dataArr.length; i++){
            row = dataArr[i]
            const ind = uids.indexOf(row.uid);
            if (ind > -1) {
                uids.splice(ind, 1);
            }
            requestBody = {
                email: row.email,
                displayName: row['display-name'],
            };
            updateAccount(requestBody, row.uid);
            if (i == dataArr.length - 1){
                for(id of uids){
                    deleteAccount(id);
                    const ind = uids.indexOf(id);
                    if (ind > -1) {
                        uids.splice(ind, 1);
                    }
                }
            }
        };
    });
});