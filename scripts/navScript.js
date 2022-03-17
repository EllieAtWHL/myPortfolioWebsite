function handleNav() {
    console.log('Link clicked');
    var x = document.getElementById("myTopNav");
    console.log(x.className);
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }