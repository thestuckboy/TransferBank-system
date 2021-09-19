const keyInput = document.getElementById('key');
const showKeyButton = document.getElementById('showButton');
const eyeIcon = document.getElementById('eyeIcon');


showKeyButton.addEventListener('click', showKey);

function showKey(){
    if (keyInput.type === "password") {
        keyInput.type = "text";
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }else {
        keyInput.type = "password";
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}