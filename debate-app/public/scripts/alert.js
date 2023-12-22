function customAlert(msg, type) {
    var alertDiv = document.createElement('div');
    alertDiv.setAttribute('class', type);
    alertDiv.innerHTML = msg;

    document.getElementsByClassName('container')[0].insertBefore(alertDiv, document.getElementsByTagName('h4')[0]);
    setTimeout(() => {
        document.getElementsByClassName('alert')[0].remove();
        if(x.status == 'ok') {
          window.location.assign('/');
        }
    }, 3500);
}
