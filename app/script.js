document.addEventListener("DOMContentLoaded", function () {
    // Getting the stylesheet
    // const styleSheet = document.styleSheets[0];

    // const myStyles = `
    // 0 0 5px var(--btn-color), 0 0 15px var(--btn-color), 0 0 30px var(--btn-color),
    //     0 0 60px var(--btn-color);`;

    // // Find the :root rule that contains the --btn-color custom property
    // let elementRules;
    // for (let i = 0; i < styleSheet.cssRules.length; i++) {
    //     if (styleSheet.cssRules[i].selectorText === 'child(1)::after') {
    //         elementRules = styleSheet.cssRules[i];
    //     }
    // }

    // // Define a function to toggle the --btn-color property between green and blue
    // function toggleBtnColor() {
    //     const currentColor = elementRules.style.getPropertyValue('box-shadow');
    //     if (currentColor.trim() === myStyles.trim()) {
    //         elementRules.style.setProperty('box-shadow', myStyles);
    //     } else {
    //         elementRules.style.setProperty('box-shadow', '');
    //     }
    // }

    // // Call the toggleBtnColor function every one second
    // setInterval(toggleBtnColor, 1000);

    const styleSheet = document.styleSheets[0];

    const rule = `.btn:nth-child(1)::before, .btn:nth-child(1)::after`
    const Rule = rule.trim();
    const myStyles = "0 0 5px var(--btn-color), 0 0 15px var(--btn-color), 0 0 30px var(--btn-color),0 0 60px var(--btn-color)"


    // Find the :root rule that contains the --btn-color custom property
    let elementRules;
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        let cssR = (styleSheet.cssRules[i].selectorText).trim()
        console.log(cssR)
        if (cssR == Rule) {
            elementRules = styleSheet.cssRules[i];
            break;
        }
    }

    // Define a function to toggle the box-shadow property
    function toggleBoxShadow() {
        const currentBoxShadow = elementRules.style.getPropertyValue('box-shadow');
        if (currentBoxShadow == myStyles) {
            elementRules.style.removeProperty('box-shadow');
        } else {
            elementRules.style.setProperty('box-shadow', myStyles);
        }
    }

    // Call the toggleBoxShadow function every one second
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

    const run = document.getElementById("run");
    run.addEventListener("click", async () => {
        
        await window.api.makeSshTunnel(1);


        let status = connectionStatus().then((response) => {
            console.log('script:says', status)
        })
        

        
        async function connectionStatus() {
            while (true) {
                try {
                    status = await window.api.statusSshTunnel(0);
                    break;
                } catch (error) {
                    console.error('Error logging status:', error);
                }
            }
        }
        // async function connectionStatus() {
            
        //     while (true) {
        //         let count = 1;
        //         try {
        //             status = await resualt();
        //             break;
        //         } catch (error) {
        //             console.log(count)
        //             count++
        //         }
        //     }
        //     console.log(status);
        // }

        // async function resualt() {
        //     let status = await window.api.statusSshTunnel(0);
        //     return status;
        // }
    });
});


let clicked = false;