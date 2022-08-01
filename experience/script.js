function openTab(event, tabName) {
  
  console.log(event)
  var i, tabcontent, tablinks
  tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove('active')
  }
  tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active')
  }
  document.getElementById(tabName).classList.add('active')
  event.currentTarget.classList.add('active')
}

  // https://www.w3schools.com/howto/howto_js_tabs.asp