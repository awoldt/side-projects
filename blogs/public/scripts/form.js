const inputFields = document.getElementsByClassName('form-control');
const submitBtn = document.getElementById('submit-btn');

//prevents whitespace for all form fields
for(i=0; i<inputFields.length; ++i) {
    inputFields[i].addEventListener('keypress', (e) => {
        var key = e.keyCode;
        //if key is whitespace, prevent it 
        if(key == 32) {
            e.preventDefault();
        }
    })
}

//gives visual feedback for strength of password
function strongPassword(x) {
    var passLength = x.value.length;
    if(passLength == 0) {
        x.style.borderColor = "#ced4da";
    } else {
        if(passLength < 8) {
            x.style.borderColor = "red";
        } else {
            x.style.borderColor = "green";
        }
    }
}

//checks password strength and if both passwords match
submitBtn.addEventListener('click', (e) => {
    if(document.getElementById('pass1').value.length == 0) {
        e.preventDefault();
    } else {
        if(document.getElementById('pass1').value.length < 8) {
            e.preventDefault();
            alert('Password not strong enough');
        } else {
            if(document.getElementById('pass1').value != document.getElementById('pass2').value) {
                e.preventDefault();
                alert('Passwords do not match')
            }
        }
    }
})

