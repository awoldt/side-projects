const pageLinks = document.getElementsByClassName('pages');
var currentPage = 1; //default 
var container = document.getElementsByClassName('container')[0];

function removeDisplayedBlogs() {
    var linksOnPage = document.getElementsByClassName('blog-links');
    var x = linksOnPage.length; //how many blogs are on the page
    for(i=0; i<x; ++i) {
        linksOnPage[0].remove();
    }
}

function fetchPage() {
    var page = this.innerText; //page user requests
    if(page == currentPage) {
        //do nothing, already viewing page requested
    } else {
        removeDisplayedBlogs();
        currentPage = page;

        fetch('/pages/' + page)
            .then((result) => {
                return result.json()
            })
            .then((data) => {
                for(i=0; i<data.blogs.length; ++i) {
                    var blogLink = document.createElement('a');
                    blogLink.setAttribute('href', '/blogs/' + data.blogs[i]._id);
                    blogLink.setAttribute('class', 'blog-links');
                    var blogTitle = document.createElement('h3');
                    blogTitle.setAttribute('class', 'blog-titles');
                    blogTitle.innerHTML = data.blogs[i].title;
                    var blogUsername = document.createElement('p');
                    blogUsername.setAttribute('class', 'blog-usernames text-secondary');
                    blogUsername.innerHTML = 'Posted by ' + data.blogs[i].username + ' on ' + data.blogs[i].postedOn;
                    
                    var blogBodyDiv = document.createElement('div');
                    var blogBody = document.createElement('p');
                    blogBodyDiv.appendChild(blogBody);
                    blogBody.setAttribute('class', 'blog-body');
                    blogBody.innerHTML = data.blogs[i].body;

                    blogLink.appendChild(blogTitle);
                    blogLink.appendChild(blogUsername);
                    blogLink.appendChild(blogBodyDiv);

                    container.appendChild(blogLink);
                }
                var pagesDiv = document.getElementById('pages-div');
                container.insertBefore(pagesDiv, blogLink[0]);
                shortBlogDisplay();
            })
    }    
}

//adds fetch funciton to all page links
for(i=0; i<pageLinks.length; ++i) {
    pageLinks[i].addEventListener('click', fetchPage);
}
