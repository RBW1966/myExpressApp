window.addEventListener('load', () => {
  doIt();
});

function doIt() {
  const socket = io();
  socket.emit('register user', getCookie('user_id'));
  document.getElementById("form1").addEventListener('submit', function(evt) {
    const m = document.getElementById("m");
    evt.preventDefault();
    socket.emit('chat message', m.value);
    m.value = '';
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}
