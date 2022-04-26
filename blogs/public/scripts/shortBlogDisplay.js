function shortBlogDisplay() {
    var blogBodies = document.getElementsByClassName('blog-body');

    for(i=0; i<blogBodies.length; ++i) {
        var text = blogBodies[i].innerHTML;
        var shortBody = "";
        var newLength = Math.floor(Math.random() * 500) + 250;
            for(y=0; y<newLength; ++y) {
                shortBody += text[y];
            }
            shortBody += "....";
        blogBodies[i].innerHTML = shortBody;
    }
}

shortBlogDisplay(); //calls funciton on page load