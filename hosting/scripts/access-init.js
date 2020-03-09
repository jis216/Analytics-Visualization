const endpoint = "https://js-cse135-pa4.web.app/";
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

console.log('access init');
let url = endpoint + pageType + '-access';
fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
})
.then((response) => {
    return response.text();
})
.then((result) => {
    if(result){
        //load page
        console.log('load page');
    }
    else{
        window.location.assign('/login');
    }
})
.catch((error) => {
    console.log('fetch access Error:', error);
});