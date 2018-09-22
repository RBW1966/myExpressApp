let socket = null;
let user_id = null;
let terminated = false;

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
  if (terminated) return;
  console.log('doDisconnect');
  alert('Lost connection to myExpressApp.');
  location.href ="https://github.com/RBW1966/myExpressApp";
}
function doLogout() {
  //alert('You were logged off by the administrator.');
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
function doIncomingChatMessage(message) {
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
function doIt() {
  let myID = getCookie("USER_ID");
  console.log(`myID=${myID}`);
  socket = io();
  socket.on('terminate', doTerminate);
  socket.on('logout', doLogout);
  socket.on('recon', doRecon);
  socket.on('disconnect', doDisconnect);
  socket.on('chat', doIncomingChatMessage)
  socket.emit('register user', myID);
  document.getElementById("form1").addEventListener('submit', function(evt) {
    const m = document.getElementById("m");
    evt.preventDefault();
    if (m.value.length) {
      m.placeholder = '';
      setTimeout( () => { document.getElementById("m").placeholder = 'Type a message...' }, 5000);
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