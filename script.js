// * SSH CONNECTION FUNCTION
let isPulsing = false;
let isTextInputVisible = true;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementsByClassName("switch")[0].click();
  const browserBtn = document.getElementById("btn2");

  // STYLE MOUSE
  


  // Find the :root rule that contains the --btn-color custom property
  

  // Define a function to toggle the box-shadow property


  const exitBtn = document.getElementById("exit-btn");
  exitBtn.addEventListener("click", function () {
    window.WindowInteractApi.close();
  });

  const minimizeBtn = document.getElementById("minimize-btn");
  minimizeBtn.addEventListener("click", function () {
    window.WindowInteractApi.min();
  });

  const maximizeBtn = document.getElementById("maximize-btn");
  maximizeBtn.addEventListener("click", function () {
    window.WindowInteractApi.max();
  });

  browserBtn.addEventListener("click", function () {
    window.api.openBrowser();
  });

  const logoWrapper = document.getElementById("logo-wrapper");
  const logoImg = document.getElementById("logo-img");
  const root = document.documentElement;
  const btn1 = document.getElementById("btn1");

  const btnText = document.getElementById("btn-text");
  btn1.addEventListener("click", function () {
    if (btnText.innerHTML == "Connect") {
      window.api.makeSshTunnel(1);
      btnText.innerHTML = "Disconnect";
    } else {
      btnText.innerHTML = "Connect";
      window.api.makeSshTunnel(0);
    }

    const currentColor = getComputedStyle(root).getPropertyValue("--btn-color");
    if (currentColor === "#50ff1f") {
      root.style.setProperty("--btn-color", "#f12222");
    } else {
      root.style.setProperty("--btn-color", "#50ff1f");
    }

    if (!isPulsing) {
      logoImg.classList.add("turn");
      logoWrapper.classList.add("shadow-pulse");
      isPulsing = true;
    } else {
      logoImg.classList.remove("turn");
      logoWrapper.classList.remove("shadow-pulse");
      isPulsing = false;
    }
  });

  const fileInput = document.getElementById("drop-container");
  const textInput = document.getElementById("input-wrapper");
  const switchBtn = document.getElementsByClassName("switch-button")[0];
  switchBtn.addEventListener("click", function () {
    if (isTextInputVisible) {
      textInput.style.display = "none";
      fileInput.style.display = "flex";
      isTextInputVisible = false; // Update the flag variable
    } else {
      textInput.style.display = "flex";
      fileInput.style.display = "none";
      isTextInputVisible = true; // Update the flag variable
    }
  });
});
