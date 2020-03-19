var dropdown = document.getElementsByClassName("avatar-block");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}

var signOutBTN = document.getElementById('sign-out');
var signOutDialog = document.getElementById('signOutDialog')
var confirmBtn = document.getElementById('confirmBtn');
var cancelBtn = document.getElementById('cancelBtn');


signOutBTN.addEventListener('click', ()=>{
  signOutDialog.showModal();
});

confirmBtn.addEventListener('click', ()=>{
  let url = endpoint + "sessionLogout";

  fetch(url, {
    method: 'GET',
    mode: 'cors', 
    credentials: 'include',
    headers: {
      'Content-Type': 'text/plain',
      'Accept': 'text/plain'
    },
  }).then((res) =>{
    if (res.status == 200){
      window.location.assign("/login");
    }
    else{
      console.log("log out error");
    }
    return
  });
})
