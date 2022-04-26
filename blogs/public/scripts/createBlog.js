const blogTextArea = document.getElementById('create-blog-textarea');
var indent = 0;

blogTextArea.addEventListener('keydown', (e) => {
    var key = e.key;
    if(key == 'Enter') {
        if(indent == 2) {
            console.log('user cannot indent anymore');
            e.preventDefault();
        } else {
            console.log('user has pressed enter once');
            indent += 1;
            console.log('space has been pressed ' + indent + ' times'); 
        }
    } else {
        if(indent == 0) {
            //do nothing
        } else {
            indent -= 1;
        }
    }
})