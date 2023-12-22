
function addLike() {
  var svgSpan = document.getElementById("svg-span");

  fetch("/fetch/addLike", {
    method: "post",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((x) => {
      return x.json();
    })
    .then((likeData) => {
      if (likeData.status == "ok") {
        var icon = document.getElementById("svg-span-icon");
        var numOfLikes = document.getElementById("num-of-discussion-likes");

        if (likeData.likeBtnType == "filled") {
          icon.remove();
          //replace icon with colored fill svg (red if republican, blue if democrat)
          var newIcon = document.createElement("img");
          var newSvgSpan = document.createElement("span");
          newSvgSpan.setAttribute("id", "svg-span-icon");
          newIcon.setAttribute("class", "img-fluid");
          likeData.color == "red"
            ? newIcon.setAttribute(
                "src",
                "/imgs/icons/republican/hand-thumbs-up-fill.svg"
              )
            : newIcon.setAttribute(
                "src",
                "/imgs/icons/democrat/hand-thumbs-up-fill.svg"
              );
          newSvgSpan.appendChild(newIcon);
          svgSpan.appendChild(newSvgSpan);
          numOfLikes.innerHTML = " (" + likeData.numOflikes + ")";
        } else {
          icon.remove();
          //replace icon with colored fill svg (red if republican, blue if democrat)
          var newIcon = document.createElement("img");
          var newSvgSpan = document.createElement("span");
          newSvgSpan.setAttribute("id", "svg-span-icon");
          newIcon.setAttribute("class", "img-fluid");
          likeData.color == "red"
            ? newIcon.setAttribute(
                "src",
                "/imgs/icons/republican/hand-thumbs-up.svg"
              )
            : newIcon.setAttribute(
                "src",
                "/imgs/icons/democrat/hand-thumbs-up.svg"
              );
          newSvgSpan.appendChild(newIcon);
          svgSpan.appendChild(newSvgSpan);
          numOfLikes.innerHTML = " (" + likeData.numOflikes + ")";
        }
      }

    });
}

var likeBtn = document.getElementById("like-btn");
likeBtn.addEventListener("click", addLike);
