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
  const timer = document.querySelector(".timer");
  let isClicked = false;
  let intervalId;


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
  const btn1 = document.getElementById("btn1");
  const validation = document.getElementById("vorod");
  const ip = document.getElementById("ip");
  const port = document.getElementById("port");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const warn = document.getElementById("warning-msg");
  const errorBox = document.getElementById("error-msg");
  const errorMsg = document.getElementById("es-circle");
  const radio1 = document.getElementById("radio1");
  const radio2 = document.getElementById("radio2");
  const version = document.getElementById("version");
  const ClosinUpdate = document.getElementById("close-button");
  const RestartUpdate = document.getElementById("restart-button");
  const notification = document.getElementById("notification");
  const imageContainer = document.querySelector(".image-container");
  const coonectMSG = document.getElementById("connect");

  const ipRegex =
    /^(([01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}([01]?\d{1,2}|2[0-4]\d|25[0-5])$/;
  // ! NAVIGATION BTN

  exitBtn.addEventListener("click", function () {
    window.WindowInteractApi.close();
  });

  minimizeBtn.addEventListener("click", function () {
    window.WindowInteractApi.min();
  });

  // ! NAVIGATION BTN
  radio1.disabled = true;
  radio2.disabled = true;
  //* loading saved data (if exists)
  window.api.LoadCredentials().then((data) => {
    if (data != false) {
      ip.value = data.host;
      port.value = data.port;
      username.value = data.username;
      password.value = data.password;
    }
  });

  //* loading saved data (if exists)

  // ? BROWSER BTN
  // browserBtn.addEventListener("click", function () {
  //   window.api.openBrowser();
  // });
  radio1.addEventListener("click", () => {
    window.api.makeSshTunnel(1);
  });
  radio2.addEventListener("click", () => {
    window.api.makeSshTunnel(0);
    // opening browser

    window.api.openBrowser();
  });

  btn1.addEventListener("click", function () {
    window.api.LoadCredentials().then((data) => {
      if (data == false) {
        console.log("data is not entered")
      } else {
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
        imageContainer.classList.toggle("clicked");
        if (turnedOn == false) {
          turnedOn = true;
          coonectMSG.innerHTML = "Connected!";
          radio1.disabled = false;
          radio2.disabled = false;
        } else {
          turnedOn = false;
          coonectMSG.innerHTML = "Connect Now";
          radio1.disabled = true;
          radio2.disabled = true;

          // switching the radio bottoms if one of them were on
          radio1.checked = false;
          radio2.checked = false;
          window.api.makeSshTunnel(0);
        }
      }
    })
    
  });

  //? validating user data
  validation.addEventListener("click", () => {
    switch (true) {
      case ip.value === "" ||
        port.value === "" ||
        username.value === "" ||
        password.value === "":
        errorBox.classList.add("active");
        setTimeout(() => {
          errorBox.classList.remove("active");
        }, 6000);
        break;
      case !ipRegex.test(ip.value):
        errorMsg.innerHTML = "آیپی وارد شده معتبر نیست";
        errorBox.classList.add("active");
        setTimeout(() => {
          errorBox.classList.remove("active");
        }, 6000);
        break;
      default:
        validation.innerHTML = "اطلاعات ثبت شد";
        warn.classList.add("active");
        setTimeout(() => {
          validation.innerHTML = "ورود";
          warn.classList.remove("active");
        }, 6000);
        window.api.credentials(
          ip.value.trim(),
          Number(port.value.trim()),
          username.value.trim(),
          password.value.trim()
        );
        break;
    }
  });
  //? validating user data

  //* copy paste using click right
  ip.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    navigator.clipboard.readText().then(function (copiedText) {
      ip.value = copiedText;
    });
  });

  port.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    navigator.clipboard.readText().then(function (copiedText) {
      port.value = copiedText;
    });
  });

  username.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    navigator.clipboard.readText().then(function (copiedText) {
      username.value = copiedText;
    });
  });

  password.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    navigator.clipboard.readText().then(function (copiedText) {
      password.value = copiedText;
    });
  });
  //* copy paste using click right

  // ? VERSION
  let VERSION = async () => {
    return await window.WindowInteractApi.ver();
  };
  VERSION().then((value) => {
    version.innerHTML = "v" + value;
  });

  // * UPDATING THE APP
  ClosinUpdate.addEventListener("click", () => {
    notification.classList.add("hidden");
  })

  RestartUpdate.addEventListener("click", () => {
    window.WindowInteractApi.restart();
  })

  version.addEventListener("click", () => {
    window.WindowInteractApi.openURLInBrowser('https://github.com/jexroid/group')
  })
});
