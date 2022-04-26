//removes alert message after 3000 seconds
const alertMessage = document.getElementById('alert-message');
if(alertMessage.innerHTML == "") {
    document.getElementById('alert-div').remove();
} else {
    setTimeout(() => {
        document.getElementById('alert-div').remove();
    }, 3000);
}
