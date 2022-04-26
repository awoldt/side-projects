const leaveCommentbtn = document.getElementById("comment-btn");
const commentDiv = document.getElementById("comment-div");
var spinner = document.createElement("div");
spinner.setAttribute("class", "spinner-border text-danger");
spinner.style.marginTop = "25px";
spinner.style.marginRight = "10px";
var postCommentBtn = document.createElement("div");
postCommentBtn.setAttribute("class", "btn btn-danger");
postCommentBtn.innerHTML = "Post comment";

leaveCommentbtn.addEventListener("click", () => {
  leaveCommentbtn.remove();
  var commentTextarea = document.createElement("textarea");
  commentTextarea.setAttribute("class", "form-control");
  commentTextarea.style.height = "200px";
  commentTextarea.style.marginBottom = "20px";

  commentDiv.appendChild(commentTextarea);
  commentDiv.appendChild(postCommentBtn);

  postCommentBtn.addEventListener("click", () => {
    postCommentBtn.remove();
    commentDiv.appendChild(spinner);

    var comment_txt = commentTextarea.value;

    var postObj = {};
    postObj.comment = comment_txt;

    fetch("/fetch/leaveComment", {
      method: "post",
      body: JSON.stringify(postObj),
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((x) => {
        return x.json();
      })
      .then((data) => {
        if (data.status != "ok") {
          spinner.remove();
          commentDiv.appendChild(postCommentBtn);
          alert("could not leave comment");
        } else {
          //create new comment to display after successful comment post
          var returnedCommentDiv = document.createElement("div");
          returnedCommentDiv.style.backgroundColor = "#f2f2f2";
          returnedCommentDiv.style.marginBottom = "12px";
          returnedCommentDiv.style.borderRadius = "10px";
          returnedCommentDiv.style.padding = "10px";
          var usernameCommentHref = document.createElement("a");
          usernameCommentHref.href = data.commentData.author_profile_link;
          usernameCommentHref.innerHTML =
            data.commentData.author_profile_username;
          var commentTextData = document.createElement("span");
          commentTextData.innerHTML = data.commentData.comment_txt;
          var lineBreak = document.createElement("br");

          returnedCommentDiv.appendChild(usernameCommentHref);
          returnedCommentDiv.appendChild(lineBreak);
          returnedCommentDiv.appendChild(commentTextData);
          document
            .getElementById("comment-hr")
            .parentNode.insertBefore(
              returnedCommentDiv,
              document.getElementById("comment-hr").nextSibling
            );
          //update the number of comments after successful comment is posted
          var updateNumOfComments = Number(
            document.getElementById("num-of-comments").innerHTML
          );
          updateNumOfComments += 1;
          document.getElementById("num-of-comments").innerHTML =
            updateNumOfComments;

          spinner.remove();
          commentTextarea.remove();
        }
      });
  });
});
