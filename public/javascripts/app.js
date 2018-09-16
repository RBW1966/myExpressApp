window.addEventListener('load', () => {
  doIt();
});

function doIt() {
  const socket = io();
  document.getElementById("form1").addEventListener('submit', function(evt) {
    const m = document.getElementById("m");
    evt.preventDefault();
    socket.emit('chat message',  m.value);
    m.value = '';
  });
}