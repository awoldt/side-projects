async function signin() {
  var postData = {}; //body to be sent to server
  var emailInput = document.getElementsByClassName("form-control")[0].value;
  var passwordInput = document.getElementsByClassName("form-control")[1].value;


  btn.remove();
  replaceBtn.remove();
  document
    .getElementById("create-div")
    .insertBefore(spinner, document.getElementById("home-link"));
  postData.email = emailInput;
  postData.password = passwordInput;
  postData.redirectHref = document.referrer;

  fetch("/fetch/signin", {
    method: "post",
    body: JSON.stringify(postData),
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((data) => {
      return data.json();
    })
    .then((x) => {
      spinner.remove();
      document
        .getElementById("create-div")
        .insertBefore(replaceBtn, document.getElementById("home-link"));
      var alert = document.createElement("div");
      if (x.status != "ok") {
        alert.setAttribute("class", "alert alert-danger mt-2");
        alert.innerHTML = x.msg;
      } else {
        window.location.assign(x.redirect);
      }
    });
}

function validateInputs() {
  var missing = false;

  //checks for missing inputs
  for (i = 0; i < document.getElementsByClassName("form-control").length; ++i) {
    if (document.getElementsByClassName("form-control")[i].value == "") {
      document.getElementsByClassName("form-control")[i].style.border =
        "1px solid #dc3545";
      missing = true;
    } else {
      continue;
    }
  }

  if (missing == false) {
    signin();
  }
}

var btn = document.getElementById('signin-btn');
btn.addEventListener("click", validateInputs);
var spinner = document.createElement("div");
spinner.setAttribute("class", "spinner-border text-primary");
spinner.style.marginTop = "25px";
spinner.style.marginRight = "10px";
var replaceBtn = document.createElement("div");
replaceBtn.setAttribute("class", "btn btn-primary");
replaceBtn.style.marginRight = "10px";
replaceBtn.innerHTML = "Sign in";
replaceBtn.addEventListener("click", validateInputs);
