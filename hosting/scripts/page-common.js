import { NONAME } from "dns";

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

if (userRecord.admin){
  document.getElementById('manage-link').style = "{display: block;}";
}
else{
  document.getElementById('manage-link').style = "{display: none;}";
}