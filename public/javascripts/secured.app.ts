var socket = null;
var user_id = null;
var terminated = false;
var timer;

var timeout = (function () {
  return function() {
    window.clearTimeout(timer);
    timer = window.setTimeout( () => {
      // Nothing to do
    }, 5000);
  }
})();

window.addEventListener('load', () => {
  adoIt();
});
// Disable key press
function disableKeyPressing(e) {
      // keycode for F5 function
      if (e.keyCode === 116) {
        e.returnValue = false;
        e.keyCode = 0;
        return false;
      }
      // keycode for Ctrl+R
      if (e.keyCode === 82) {
        if (e.ctrlKey) {
          e.returnValue = false;
          e.keyCode = 0;
          return false;          
        }
      }
      // keycode for backspace
      if (e.keyCode === 8) {
        // try to cancel the backspace
        e.returnValue = false;
        e.keyCode = 0;
        return false;
      }
}
function doDisconnect() {
  if (terminated) return;
  console.log('doDisconnect');
  alert('Lost connection to myExpressApp.');
  socket.open();
}
function doLogout() {
  terminated = true;
  console.log('doLogout');
  location.href = "/logout";
}
function doRecon() {
  console.log('doRecon');
  socket.close();
}
function doTerminate() {
  terminated = true;
  console.log('doTerminate');
  alert('myExpressApp is offline.');
  location.href ="https://github.com/RBW1966/myExpressApp";
}

function doConnect() {
  socket.emit('register user', user_id);
}
function adoIt() {
  user_id = getCookie("USER_ID");
  console.log(`myID=${user_id}`);
  socket = io();
  socket.on('terminate', doTerminate);
  socket.on('logout', doLogout);
  socket.on('recon', doRecon);
  socket.on('disconnect', doDisconnect);
  socket.on('chat', doIncomingChatMessage)
  socket.on('connect', doConnect);
  socket.emit('register user', user_id);
  document.getElementById("form1").addEventListener('submit', function(evt) {
    const m = <HTMLInputElement>document.getElementById("m");
    evt.preventDefault();
    if (m.value.length) {
      m.placeholder = '';
      let x = timeout();
      socket.emit('chat message', m.value);
      m.value = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    // F5 is pressed
    if((e.which || e.keyCode) == 116) {
      disableKeyPressing(e);
      console.log('F5 was ignored.');
    }
    // Backspace
    if (e.keyCode == 8) {
      console.log((<HTMLInputElement>e.target).id);
      switch ((<HTMLInputElement>e.target).id) {
        case "m":
          break;
        default:
          disableKeyPressing(e);
          console.log('Backspace was ignored.');
      }
    }
    // Ctrl+R
    if (e.ctrlKey && (e.which === 82) ) {
        disableKeyPressing(e);
       console.log('Ctrl+R was ignored.');
    }
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

