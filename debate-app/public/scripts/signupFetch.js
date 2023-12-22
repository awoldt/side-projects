var partySelection;

async function createAcct() {
  var postData = {}; //body to be sent to server
  var emailInput = document.getElementsByClassName("form-control")[0].value;
  var usernameInput = document.getElementsByClassName("form-control")[1].value;
  var passwordInput = document.getElementsByClassName("form-control")[2].value;
  var passwordConfrimInput =
    document.getElementsByClassName("form-control")[3].value;

  btn.remove();
  replaceBtn.remove();
  document
    .getElementById("create-div")
    .insertBefore(spinner, document.getElementById("home-link"));

  postData.email = emailInput;
  postData.username = usernameInput;
  postData.password = passwordInput;
  postData.password2 = passwordConfrimInput;
  postData.party = partySelection;

  fetch("/fetch/signup", {
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
      var alertDiv = document.createElement("div");
      if (x.status != "ok") {
        alertDiv.setAttribute("class", "alert alert-danger mt-2");
        alertDiv.innerHTML = x.msg;
      } else {
        alertDiv.setAttribute("class", "alert alert-success mt-2");
        alertDiv.innerHTML = x.msg;
      }

      document
        .getElementsByClassName("container")[0]
        .insertBefore(alertDiv, document.getElementsByTagName("h4")[0]);
      setTimeout(() => {
        document.getElementsByClassName("alert")[0].remove();
        if (x.status == "ok") {
          window.location.assign("/");
        }
      }, 3500);
    });
}

function validateInputs() {
  var missing = false; //defaults to false, turns true if missing input is detected on submit
  var passwordInput = document.getElementsByClassName("form-control")[2].value;
  var passwordConfrimInput =
    document.getElementsByClassName("form-control")[3].value;

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

  //makes sure user has selected political party
  if (partySelection == undefined) {
    missing = true;
    var alertDiv = document.createElement("div");
    alertDiv.setAttribute("class", "alert alert-info");
    alertDiv.style.marginTop = "10px";
    alertDiv.innerHTML =
      "Please select a political party you most identify with";

    document
      .getElementsByClassName("container")[0]
      .insertBefore(alertDiv, document.getElementsByTagName("h4")[0]);
    setTimeout(() => {
      document.getElementsByClassName("alert")[0].remove();
    }, 5000);
  } else {
    missing = false;
  }

  if (missing == false) {
    //check to see if passwords match
    if (passwordInput != passwordConfrimInput) {
      alert("Passwords do not match");
    } else {
      if (passwordInput.length < 6) {
        alert("Password not long enough");
      } else {
        createAcct();
      }
    }
  }
}

var btn = document.getElementById("create-btn");
btn.addEventListener("click", validateInputs);
var spinner = document.createElement("div");
spinner.setAttribute("class", "spinner-border text-primary");
spinner.style.marginTop = "25px";
spinner.style.marginRight = "10px";
var replaceBtn = document.createElement("div");
replaceBtn.setAttribute("class", "btn btn-primary");
replaceBtn.style.marginRight = "10px";
replaceBtn.innerHTML = "Create";
replaceBtn.addEventListener("click", validateInputs);
