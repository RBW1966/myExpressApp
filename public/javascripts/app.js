let socket = null;
let user_id = null;

window.addEventListener('load', () => {
  doIt();
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
  console.log('doDisconnect');
  socket.open();
  console.log(getCookie('USER_ID'));
  let myID = getCookie("USER_ID");
  socket.emit('register user', myID);
}

function doLogout() {
  console.log('doLogout');
  location.href = "/logout";
}
function doRecon() {
  console.log('doRecon');
  socket.close();
}
function doTerminate() {
  console.log('doTerminate');
  location.href ="https://github.com/RBW1966/myExpressApp";
}


function doIt() {
    let myID = getCookie("USER_ID");
    console.log(`myID=${myID}`);
    socket = io();
    socket.on('terminate', doTerminate);
    socket.on('logout', doLogout);
    socket.on('recon', doRecon);
    socket.on('disconnect', doDisconnect);
    socket.emit('register user', myID);
    document.getElementById("form1").addEventListener('submit', function(evt) {
      const m = document.getElementById("m");
      evt.preventDefault();
      if (m.value.length) {
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
        console.log(e.target.id);
        switch (e.target.id) {
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
//  })
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