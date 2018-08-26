const h1 = document.getElementById("myH1");

h1.innerText = "LOADED!!!!";

window.addEventListener('load', () => {
  doIt();
});

function doIt() {
  console.log("Client side script.")
}