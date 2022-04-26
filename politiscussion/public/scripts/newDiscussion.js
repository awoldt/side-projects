const topics = document.getElementById("topics");
var selectedTopic = topics.value;


var topicTitle = document.getElementById("topic-title-input");
var topicTextarea = document.getElementById("topic-textarea");

if (selectedTopic != "null") {
  topicTitle.removeAttribute("disabled");
  topicTextarea.removeAttribute("disabled");
} else {
  topicTitle.setAttribute("disabled", "true");
  topicTextarea.setAttribute("disabled", "true");
}



topics.addEventListener("change", (e) => {
  selectedTopic = e.target.value;

  if (selectedTopic != "null") {
    topicTitle.removeAttribute("disabled");
    topicTextarea.removeAttribute("disabled");
  } else {
    topicTitle.setAttribute("disabled", "true");
    topicTextarea.setAttribute("disabled", "true");
  }
});

function postDiscussion() {
  var postData = {}; //body to be sent to server
  postData.topic = selectedTopic;
  postData.title = topicTitle.value;
  postData.text = topicTextarea.value;
  postData.likes = 0;

  //get the innertext of whatever option is selected, get by matching with topics value
  for(i=0; i<topics.length; ++i) {
    topics[i].value == selectedTopic ? postData.cleanName = topics[i].innerText : null;
  } 

  submitBtn.remove();
  replaceBtn.remove();

  document.getElementById("submit-div").appendChild(spinner);

  fetch("/fetch/postDiscussion", {
    method: "post",
    body: JSON.stringify(postData),
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((x) => {
      return x.json();
    })
    .then((data) => {
      if (data.status != "ok") {
        spinner.remove();
        document.getElementById("submit-div").appendChild(replaceBtn);
        var alert = document.createElement("div");
        alert.setAttribute("class", "alert alert-danger mt-2");
        alert.innerHTML = data.msg;

        document
          .getElementsByClassName("container")[0]
          .insertBefore(alert, document.getElementById("topics"));
        setTimeout(() => {
          document.getElementsByClassName("alert")[0].remove();
        }, 3500);
      } else {
        spinner.remove();
        window.location.assign("/");
      }
    });
}

function validateInput() {
  var missing = false;
  if (topicTextarea.value.length == 0 || topicTitle.value.length == 0) {
    alertDiv.innerHTML = "Missing inputs";
    document
      .getElementsByClassName("container")[0]
      .insertBefore(
        alertDiv,
        document.getElementsByClassName("form-select")[0]
      );
    missing = true;
    setTimeout(() => {
      alertDiv.remove();
    }, 2500);
  }

  if (missing != true) {
    if (topicTextarea.value.length < 50) {
      alertDiv.innerHTML = "Discussion must be 50 characters long";
      document
        .getElementsByClassName("container")[0]
        .insertBefore(
          alertDiv,
          document.getElementsByClassName("form-select")[0]
        );

      missing = true;
      setTimeout(() => {
        alertDiv.remove();
      }, 2500);
    } else {
      postDiscussion();
    }
  }
}

var submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", validateInput);
var spinner = document.createElement("div");
spinner.setAttribute("class", "spinner-border text-primary");
spinner.style.marginTop = "25px";
spinner.style.marginRight = "10px";
var replaceBtn = document.createElement("div");
replaceBtn.setAttribute("class", "btn btn-danger");
replaceBtn.style.marginRight = "10px";
replaceBtn.innerHTML = "Create";
replaceBtn.addEventListener("click", validateInput);
var alertDiv = document.createElement("div");
alertDiv.setAttribute("class", "alert alert-danger");
