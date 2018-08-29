const h1 = document.getElementById("myH1");

h1.innerText = "LOADED!!!!";

window.addEventListener('load', () => {
  doIt();
});

function doIt() {
  setTimeout(() => {
    console.log("Client side script.");
    h1.innerText = "======== TIMER ========";
  }, 5000);
}