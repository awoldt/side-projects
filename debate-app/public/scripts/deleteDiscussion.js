function deleteDiscussion() {
    var wantToDelete = confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if(wantToDelete == true) {
        
        fetch('/fetch/deleteDiscussion', {
            method: "delete",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
        })
        .then((x) => {
            return x.json();
        })
        .then((x) => {
            window.location.assign('/');
        })
    }
}

var deleteBtn = document.getElementById('delete-btn');
deleteBtn.addEventListener('click', deleteDiscussion);