let endpoint = "https://js-cse135-pa4.web.app/";
let href = window.location.href;
let pageName = href.substring(endpoint.length);

let pageType;
switch(pageName){
    case 'dashboard':
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
        //window.location.assign('/login');
        return null;
    }
    
}).then(resJSON => {
    if (resJSON){
        userRecord = resJSON;
    }
    return

}).catch((error) => {
    console.log('fetch access Error:', error);
});