
window.addEventListener('load',()=>{
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

});


['username', 'email'].forEach((elemID) => {
    let editable = document.querySelector(`span[title|=${elemID}].editable`);
    let edit_button = document.querySelector(`button[title|=${elemID}].edit`);
    edit_button.addEventListener('click', () =>{
        if(edit_button.innerHTML == "edit"){
            let editable_input;
            editable_input = document.createElement('input');
            editable_input.type = "text";
            editable_input.value = editable.innerHTML;

            editable_input.className = "editable";
            editable_input.title = elemID;
    
            editable.parentNode.replaceChild(editable_input, editable);
            editable = editable_input;
            edit_button.innerHTML = "finish";
        }
        else{
            let editable_text = document.createElement('span');
            editable_text.className = "editable";
            editable_text.innerHTML = editable.value;
            editable_text.title = elemID;
            editable.parentNode.replaceChild(editable_text, editable);
            editable = editable_text;
            edit_button.innerHTML = "edit";
        }
    });
});


document.getElementById("user-update").addEventListener('click', () => {
    userConfig = {
        'username': document.querySelector(`span[title|=username].editable`).innerHTML,
        'email': document.querySelector(`span[title|=email].editable`).innerHTML
    };
    updateAccount(userConfig);
});


