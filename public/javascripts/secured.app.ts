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
  secured_doIt();
});
// Disable key press
function secured_disableKeyPressing(e) {
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
function secured_doDisconnect() {
  if (terminated) return;
  console.log('doDisconnect');
  alert('Lost connection to myExpressApp.');
  socket.open();
}
function secured_doLogout() {
  terminated = true;
  console.log('doLogout');
  location.href = "/logout";
}
function secured_doRecon() {
  console.log('doRecon');
  socket.close();
}
function secured_doTerminate() {
  terminated = true;
  console.log('doTerminate');
  alert('myExpressApp is offline.');
  location.href ="https://github.com/RBW1966/myExpressApp";
}

function secured_doConnect() {
  socket.emit('register user', user_id);
}
function secured_doIt() {
  user_id = secured_getCookie("USER_ID");
  console.log(`secured_myID=${user_id}`);
  socket = io();
  socket.on('terminate', secured_doTerminate);
  socket.on('logout', secured_doLogout);
  socket.on('recon', secured_doRecon);
  socket.on('disconnect', secured_doDisconnect);
  socket.on('connect', secured_doConnect);
  socket.emit('register user', user_id);
  // Manipulate DOM
  document.addEventListener('keydown', (e) => {
    // F5 is pressed
    if((e.which || e.keyCode) == 116) {
      secured_disableKeyPressing(e);
      console.log('F5 was ignored.');
    }
    // Backspace
    if (e.keyCode == 8) {
      console.log((<HTMLInputElement>e.target).id);
      switch ((<HTMLInputElement>e.target).id) {
        case "m":
          break;
        default:
          secured_disableKeyPressing(e);
          console.log('Backspace was ignored.');
      }
    }
    // Ctrl+R
    if (e.ctrlKey && (e.which === 82) ) {
      secured_disableKeyPressing(e);
      console.log('Ctrl+R was ignored.');
    }
  });
}

function secured_getCookie(cname) {
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

