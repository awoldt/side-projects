let bgColors = ["red", "blue", "yellow", "green", "orange", "purple", "black", "pink"];
const htmlCols = document.getElementsByClassName("col-4");

//color that user must click 
let chosenColor;

//users score (tally one to correct and incorrect as user chooses colors)
let correct = 0;
let incorrect = 0;
let score;

//default value when user accesses page
let challengeStart = false;

let time = 60;
let timer;
const countDown = () => {
    document.getElementById("timer").innerHTML = time;
        if(time == -1) {
            document.getElementById("timer").innerHTML = "";
            correct = 0;
            incorrect = 0;
            document.getElementById("score").innerHTML = "";
            addStyle();
            alert("test is over");
            challengeStart = false;
            time = 60;
            clearInterval(timer);
        } else {
            time -= 1;
        }
}

const calcScore = () => {
    score = correct/(correct + incorrect) * 100;

    if(score.toString().length > 5) {
        score = score.toString().slice(0,5);
    }

    document.getElementById("score").innerHTML = "Correct: " + correct + " Incorrect: " + incorrect + " (" + score + "%)";
}

const checkColor = (x) => {
    //if test has started or ongoing
    if(challengeStart == false) {
        challengeStart = true;
        countDown();
        timer = setInterval(countDown, 1000);
    } else {
        //do nothing
    }

    let colorClicked = x.id;
    if(colorClicked != chosenColor) {
        incorrect += 1;
        calcScore();
    } else {
        //re-generates colored boxes
        bgColors = ["red", "blue", "yellow", "green", "orange", "purple", "black", "pink"];
        correct += 1;
        addStyle();
        calcScore();
    }
}

//generates colored boxes on screen
const addStyle = () => {
    for(i=0; i<htmlCols.length; ++i) {
        let x = Math.floor(Math.random() * bgColors.length) + 0;
        let color = bgColors[x];

        htmlCols[i].style.height = "25vh";
        htmlCols[i].style.minHeight = "75px";
        htmlCols[i].style.backgroundColor = color;
        htmlCols[i].style.cursor = "pointer";
        htmlCols[i].setAttribute("id", color);        

        htmlCols[0].style.borderTopLeftRadius = "10px";
        htmlCols[0].style.borderBottomLeftRadius = "10px";
        htmlCols[2].style.borderTopRightRadius = "10px";
        htmlCols[2].style.borderBottomRightRadius = "10px";

        bgColors.splice(x, 1);
    }

    let x = Math.floor(Math.random() * htmlCols.length) + 0;
    chosenColor = htmlCols[x].id;
    document.getElementById("task-prompt").innerHTML = "Select the " + chosenColor + " box";

}

window.onload = () => {
    addStyle();
}