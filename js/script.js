let turns = [];
let segments = ["red", "blue", "green", "yellow"];
let go = 0;
let score=0;
let speed = 1500;
let seqRunning = false;
let hard = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playSound(soundName) {
    switch (soundName) {
        case "red":
            sndRed.play();
            break;
        case "blue":
            sndBlue.play();
            break;
        case "green":
            sndGreen.play();
            break;
        case "yellow":
            sndYellow.play();
            break;
        case "applause":
            sndApplause.play();
            break;
        case "aww":
            sndAww.play();
            break;
    }
}

async function newTurn() {
    seqRunning = true;
    let a = Math.floor(Math.random() * 4);
    turns.push(a);
    for(let i in turns) {
        await sleep(speed);
        playTurn(turns[i]);
    }
    seqRunning = false;
}

async function playTurn(segment) {
    
    playSound(segments[segment]);
    
    $("#" + segments[segment]).css("background-color", segments[segment]);
    
    await sleep(speed/2);
    $("#" + segments[segment]).removeAttr("style");
    await sleep(speed/2);
}

async function endGame() {
    playSound("aww");
    flashLights(3);

}
    
async function flashLights(repeat) {
    for (let n=0; n < repeat; n++) {
        for (let i=0; i<4; i++) {
            $("#" + segments[i]).css("background-color", segments[i]);
        }
        await sleep(speed/2);
        for (let i=0; i<4; i++) {
            $("#" + segments[i]).removeAttr("style");
        }
        await sleep(speed/2);
    }
}

function newGame() {
    playSound("red");
    playSound("blue");
    playSound("yellow");
    playSound("green");
    go = 0;
    score = 0;
    $("#score").text(score);
    speed = hard ? 750 : 1500;
    turns = [];
    newTurn();
}

async function changeDifficulty() {
    
    playSound("applause");
    
    if (hard) {
        speed = 750;
    } else {
        speed = 1500;
    }
    await sleep(speed);
    newGame();
    
}

let sndRed = new Audio("sounds/0.wav");
let sndBlue = new Audio("sounds/1.wav");
let sndGreen = new Audio("sounds/2.wav");
let sndYellow = new Audio("sounds/3.wav");
let sndApplause = new Audio("sounds/applause.wav");
let sndAww = new Audio("sounds/aww.wav");
sndApplause.load();
sndAww.load();
sndRed.load();
sndBlue.load();
sndGreen.load();
sndYellow.load();

$(document).ready(function() {
    
    if($(window).width() < 400) {
        alert("Rotate your device for the best experience.");
    }
    
    $("button").click(function() {
        if(!seqRunning) {
            let segment = $(this).attr("id");
            $("#" + segment).css("background-color", segment);
            $("#" + segment).css("border", "1px inset white");
            let segmentNum = segments.indexOf(segment);
            playSound(segment);
    
            if (segmentNum == turns[go]) {
                go++;
                setTimeout(function() {
                    $("#" + segment).removeAttr("style");
                }, 200);
            } else {
                endGame();
            }
            
            if(go == turns.length) {
                if (score % 5 == 0 && score <= 15) {
                    speed -= speed/6;
                }
                go = 0;
                score++
                $("#score").text(score);
                newTurn();
            }
        }
    });
    
    $('.switch-button').click(function(){
         $(this).toggleClass("switchOn");
         hard = !hard;
         changeDifficulty();
    });
    
    newGame();

})