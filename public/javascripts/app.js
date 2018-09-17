let socket = null;

window.addEventListener('load', () => {
  doIt();
});

function doTerminate() {
  location.href ="https://www.w3schools.com";
}
function doIt() {
  
  fetch('http://localhost/user')
  .then(function(response) {
    return response.text();
  })
  .then(function(myJson) {
    console.log(myJson);
    socket = io();
    socket.on('terminate', doTerminate);
    socket.emit('register user', myJson);
    document.getElementById("form1").addEventListener('submit', function(evt) {
      const m = document.getElementById("m");
      evt.preventDefault();
      socket.emit('chat message', m.value);
      m.value = '';    
  });
  })
}
