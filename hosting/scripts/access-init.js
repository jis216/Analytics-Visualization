let endpoint = "https://js-cse135-pa4.web.app/";
let href = window.location.href;
let pageName = href.substring(endpoint.length);

let pageType;
switch(pageName){
    case 'dashboard':
        pageType = 'user';
        break;
    case 'profile':
        pageType = 'user';
        break;
    case 'reports/browsers':
        pageType = 'user';
        break;
    case 'reports/speed':
        pageType = 'user';
        break;
    default:
        pageType = pageName;
        break;
};

var userRecord;
console.log('access init');
let url = endpoint + pageType + '-access';
fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
})
.then((response) => {
    if (response.status == 200){
        console.log('grant access to this page');
        return response.json();
    }
    else{
        console.log('go to login')
        window.stop();
        window.location.assign('/login');
        return null;
    }
    
}).then(resJSON => {
    if (resJSON){
        userRecord = resJSON;
        if( document.getElementById('manage-link')){
            if(userRecord.admin){
                document.getElementById('manage-link').style = "{display: block;}";
            }
            else{
                document.getElementById('manage-link').style = "{display: none;}";
            }
        }
        
    }
    if(pageName == 'profile'){
        document.querySelector(`span[title|=username].editable`).innerHTML = userRecord.name;
        document.querySelector(`span[title|=email].editable`).innerHTML = userRecord.email;

        let userType;
        if (userRecord.admin){
            userType = 'Administrator';
            document.getElementById("enter-admin").hidden = false;
            document.getElementById("enter-admin").addEventListener('click', () => {
                window.location.assign('/admin');
            });
        }
        else{
            document.getElementById("enter-admin").hidden = true;
            userType = 'Analyst';
        }
        document.querySelector(`span[title|=user-type].editable`).innerHTML = userType;
    }
    return

}).catch((error) => {
    console.log('fetch access Error:', error);
});