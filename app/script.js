// * SSH CONNECTION FUNCTION
let connection_status = async (num) => {
  return await window.api.makeSshTunnel(1);
};

document.addEventListener("DOMContentLoaded", function () {
  const browserBtn = document.getElementById("browse");
  const run = document.getElementById("run");

  // STYLE MOUSE
  run.style.cursor = "pointer";

  const styleSheet = document.styleSheets[0];
  const rule = `.btn:nth-child(1)::before, .btn:nth-child(1)::after`;
  const Rule = rule.trim();
  const myStyles =
    "0 0 5px var(--btn-color), 0 0 15px var(--btn-color), 0 0 30px var(--btn-color),0 0 60px var(--btn-color)";

  // Find the :root rule that contains the --btn-color custom property
  let elementRules;
  for (let i = 0; i < styleSheet.cssRules.length; i++) {
    let cssR = styleSheet.cssRules[i].selectorText.trim();
    if (cssR == Rule) {
      elementRules = styleSheet.cssRules[i];
      break;
    }
  }

  // Define a function to toggle the box-shadow property
  function toggleBoxShadow() {
    const currentBoxShadow = elementRules.style.getPropertyValue("box-shadow");
    if (currentBoxShadow == myStyles) {
      elementRules.style.removeProperty("box-shadow");
    } else {
      elementRules.style.setProperty("box-shadow", myStyles);
    }
  }

  setInterval(toggleBoxShadow, 500);

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

  run.addEventListener("click", async () => {
    const btnText = document.getElementById("btn-text");
    let btnInner = btnText.innerHTML;
    if (btnInner == "Connect") {
      btnText.innerHTML = "Disconnect";
      run.style.cursor = "progress";

      console.log("(making sshtunnel)");

      let st;
      connection_status().then((huh) => {
        console.log("bro said: ", huh);
        st = huh;
      });
        
        
    } else {
      btnText.innerHTML = "Connect";
      run.style.cursor = "pointer";
    }

    const root = document.documentElement;
    const currentColor = getComputedStyle(root).getPropertyValue("--btn-color");
    if (currentColor == "#50ff1f") {
      root.style.setProperty("--btn-color", "#f12222");
    } else {
      root.style.setProperty("--btn-color", "#50ff1f");
    }

    browserBtn.addEventListener("click", function () {
      window.api.openBrowser();
    });
  });
});
