document.addEventListener("DOMContentLoaded", function () {
    var welcomeMessage = document.getElementById("welcomeMessage");
    var overlay = document.querySelector(".overlay");

    setTimeout(function () {
        welcomeMessage.style.display = "block";
        overlay.style.display = "block";
    }, 500);

    overlay.addEventListener("click", function () {
        welcomeMessage.style.display = "none";
        overlay.style.display = "none";
    });
})

function closeWelcomeMessage() {
    var welcomeMessage = document.getElementById("welcomeMessage");
    var overlay = document.getElementById("overlay");
    welcomeMessage.style.display = "none";
    overlay.style.display = "none";
}
