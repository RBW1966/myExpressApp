var socket = null;
var user_id = null;
var terminated = false;
var timer;

var timeout = (function () {
  return function() {
    window.clearTimeout(timer);
    timer = window.setTimeout( () => {
      const m2 = <HTMLInputElement>document.getElementById("m");
      m2.placeholder = 'Type a message...';
    }, 5000);
  }
})();

window.addEventListener('load', () => {
  chat_adoIt();
});
// Disable key press
function chat_disableKeyPressing(e) {
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
function chat_doDisconnect() {
  if (terminated) return;
  console.log('doDisconnect');
  alert('Lost connection to myExpressApp.');
  socket.open();
}
function chat_doLogout() {
  terminated = true;
  console.log('doLogout');
  location.href = "/logout";
}
function chat_doRecon() {
  console.log('doRecon');
  socket.close();
}
function chat_doTerminate() {
  terminated = true;
  console.log('doTerminate');
  alert('myExpressApp is offline.');
  location.href ="https://github.com/RBW1966/myExpressApp";
}
function chat_doIncomingChatMessage(message) {
  // Parse the JSON message argument
  var msg = JSON.parse(message);
  // We will display SENDER: MESSAGE
  var msgString = `${msg.sender}: ${msg.msg}`
  console.log(`INCOMING MESSAGE-${msgString}`);
  // Get the Messages <ul> element
  const messages = document.getElementById("messages");
  // Create the new <li> element
  const newItem = document.createElement("li");
  // Set the <li> inner text
  newItem.appendChild(document.createTextNode(msgString));
  // Append the new <li> to the <ul>
  messages.appendChild(newItem);
  // Scroll to make the new bottom row visible
  messages.scrollTop = messages.scrollHeight - messages.clientHeight;
}
function chat_doConnect() {
  socket.emit('register user', user_id);
}
function chat_adoIt() {
  user_id = chat_getCookie("USER_ID");
  console.log(`myID=${user_id}`);
  socket = io();
  socket.on('terminate', chat_doTerminate);
  socket.on('logout', chat_doLogout);
  socket.on('recon', chat_doRecon);
  socket.on('disconnect', chat_doDisconnect);
  socket.on('chat', chat_doIncomingChatMessage)
  socket.on('connect', chat_doConnect);
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
      chat_disableKeyPressing(e);
      console.log('F5 was ignored.');
    }
    // Backspace
    if (e.keyCode == 8) {
      console.log((<HTMLInputElement>e.target).id);
      switch ((<HTMLInputElement>e.target).id) {
        case "m":
          break;
        default:
          chat_disableKeyPressing(e);
          console.log('Backspace was ignored.');
      }
    }
    // Ctrl+R
    if (e.ctrlKey && (e.which === 82) ) {
      chat_disableKeyPressing(e);
      console.log('Ctrl+R was ignored.');
    }
  });
}

function chat_getCookie(cname) {
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