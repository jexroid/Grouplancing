document.addEventListener("DOMContentLoaded", function () {
    const exitBtn = document.getElementById("exit-btn");
    exitBtn.addEventListener("click", function () {
        window.api.close();
    });

    const minimizeBtn = document.getElementById("minimize-btn");
    minimizeBtn.addEventListener("click", function () {
        window.api.min();
    });

    const maximizeBtn = document.getElementById("maximize-btn");
    maximizeBtn.addEventListener("click", function () {
        window.api.max();
    });

    document.getElementById("run").addEventListener("click", () => {

        window.api.sendMsg();
    });
});