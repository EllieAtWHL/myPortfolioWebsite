// Get the modal
var modal = document.querySelector(".modal");

// Get the button that opens the modal
var btn = document.getElementById("contactMeButton");

// Get the <span> element that closes the modal
var span = document.querySelector(".close");


console.log(modal)
console.log(btn)
console.log(span)

// When the user clicks on the button, open the modal
if(btn){
  btn.onclick = function() {
    modal.style.display = "block";
  }
}

// When the user clicks on <span> (x), close the modal
if(span){
  span.onclick = function() {
    modal.style.display = "none";
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}