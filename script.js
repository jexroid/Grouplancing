// * SSH CONNECTION FUNCTION
let whiteThemed = true;
let isPulsing = false;
let isTextInputVisible = true;
let turnedOn = false;
let isWindowsRegistered = async () => {
  return await window.api.makeSshTunnel(1);
};

document.addEventListener("DOMContentLoaded", function () {
  //! timer
  const imageContainer = document.querySelector(".image-container");

  imageContainer.addEventListener("click", function () {
    imageContainer.classList.toggle("clicked");
  });
  const timer = document.querySelector(".timer");
  let isClicked = false;
  let intervalId;

  imageContainer.addEventListener("click", function () {
    if (!isClicked) {
      isClicked = true;
      timer.style.opacity = 1;
      timer.style.pointerEvents = "auto";
      startTimer();
    } else {
      isClicked = false;
      timer.style.opacity = 0;
      timer.style.pointerEvents = "none";
      clearInterval(intervalId);
    }
  });

  function startTimer() {
    let seconds = 0;
    intervalId = setInterval(function () {
      seconds++;
      const formattedTime = formatTime(seconds);
      timer.textContent = formattedTime;
    }, 1000);
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  }

  function padZero(number) {
    return number.toString().padStart(2, "0");
  }

  // code for overlay of the setting:
  const overlay = document.querySelector(".overlay");
  const second_setting = document.getElementById("setone");

  let SettingClicked = false;
  second_setting.addEventListener("click", function () {
    if (SettingClicked == false) {
      overlay.classList.add("active");
      SettingClicked = true;
    } else if (SettingClicked == true) {
      overlay.classList.remove("active");
      SettingClicked = false;
    }
  });

  // ? JS STYLE FUNCTIONS
  const exitBtn = document.getElementById("exit-btn");
  const minimizeBtn = document.getElementById("minimize-btn");
  const maximizeBtn = document.getElementById("maximize-btn");
  const btn1 = document.getElementById("btn1");
  // const root = document.documentElement;
  // const browserBtn = document.getElementById("browserBTN");
  // const btnText = document.getElementById("btn-text");
  // const ipInp = document.querySelector(".ip");
  // const portInp = document.querySelector(".port");
  // const usernameInp = document.querySelector(".username");
  // const passwordInp = document.querySelector(".pass");
  // const currentColor = getComputedStyle(root).getPropertyValue("--btn-color");

  // ! NAVIGATION BTN
  document.getElementsByClassName("switch")[0].click();

  exitBtn.addEventListener("click", function () {
    window.WindowInteractApi.close();
  });

  minimizeBtn.addEventListener("click", function () {
    window.WindowInteractApi.min();
  });

  maximizeBtn.addEventListener("click", function () {
    window.WindowInteractApi.max();
  });
  // ! NAVIGATION BTN

  // ? BROWSER BTN
  // browserBtn.addEventListener("click", function () {
  //   window.api.openBrowser();
  // });

  btn1.addEventListener("click", function () {
    if (turnedOn == false) {
      turnedOn = true;

      window.api.makeSshTunnel(1);
      // window.api.credentials(
      //   ipInp.value,
      //   portInp.value,
      //   usernameInp.value,
      //   passwordInp.value
      // );
    } else {
      window.api.makeSshTunnel(0);
      turnedOn = false;
    }
  });
});
