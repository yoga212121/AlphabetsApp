let score = 30;
let prevScore = 30;

// Reference to the check button
const checkBtn = document.getElementById("checkbtn");

// Initially disable the check button
checkBtn.disabled = true;

// Event listener for canvas drawing events
document.getElementById("canvas").addEventListener("mousedown", function () {
    // Enable the check button if there's a drawing on the canvas
    checkBtn.disabled = false;
});

var canvas = new handwriting.Canvas(document.getElementById("canvas"), 3);
canvas.setCallBack(function (data, err) {
    console.log(data);
    if (err) throw err;
    else {
        console.log(data);
        let isCorrect = false;
        for (var i = 0; i < data.length; i++) {
            var drawnUpper = data[i].toUpperCase();
            if (drawnUpper === document.getElementById("alphabet").innerHTML) {
                isCorrect = true;
                break; // Exit the loop if a match is found
            }
        }
        if (isCorrect === true) {
            checkBtn.disabled = true;
            document.getElementById("result").innerHTML = "Correct";
            prevScore = score;
            score += 10;

            // Automatically go to next alphabet after 3 seconds
            setTimeout(function() {
                document.getElementById("next-btn").click();
            }, 2000);

        } else {
            checkBtn.disabled = true;
            document.getElementById("result").innerHTML = "Incorrect";
            prevScore = score;
            score -= 10;

            setTimeout(function() {
                document.getElementById("try-again-btn").click();
            }, 2000);
        }

        document.getElementById("score").innerHTML = "Score: " + score;
        // Call UpdateRating function here
        UpdateRating();

        // Disable the check button after clearing the canvas
        checkBtn.disabled = true;
    }
});

function setProperties(index) {
    const emjcontainer = document.querySelector(".emoji-container");
    const emoji = document.querySelector(".emoji");
    const rating = document.querySelector(".rating");
    const rate = document.querySelector("#message");
    const colors = ["#d35e65", "#d3965c", "#cad48a", "#6ed494", "#18c574"];
    const emojis = [
        { text: "Oh-no", url: "svg-emojis/Disappointed.svg" },
        { text: "Bad", url: "svg-emojis/Sad.svg" },
        { text: "Okay", url: "svg-emojis/Smile.svg" },
        { text: "Good", url: "svg-emojis/Beaming_smile.svg" },
        { text: "Great", url: "svg-emojis/love.svg" }
    ];
    const upArrowEmoji = "⬆️";
    const downArrowEmoji = "⬇️";

    emoji.src = emojis[index].url;
    if (score > prevScore) {
        rate.textContent = upArrowEmoji;
        rating.style.transform = "translateY(-50px)"; // Translate upward
    } else if (score < prevScore) {
        rate.textContent = downArrowEmoji;
        rating.style.transform = "translateY(0)"; // Translate to current position
    } else {
        rate.textContent = emojis[index].text;
        rating.style.transform = "translateY(0)"; // Translate to current position
    }

    emjcontainer.style.backgroundColor = colors[index];
}

function UpdateRating() {
    let value = score;
    if (value >= 0 && value < 20) {
        setProperties(0);
    } else if (value >= 20 && value < 40) {
        setProperties(1);
    } else if (value >= 40 && value < 60) {
        setProperties(2);
    } else if (value >= 60 && value < 80) {
        setProperties(3);
    } else if (value >= 80 && value <= 100) {
        setProperties(4);
    }
    if (score < -10) {
        window.location.href = "alphabet_learning.html";
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("canvas");
    const body = document.querySelector('body');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let currentIndex = 0;
    const alphabetDiv = document.getElementById("alphabet");
    const alphabetArray = Array.from({length: 26}, (_, currentIndex) => String.fromCharCode(65 + currentIndex));
    let checkBtn=document.getElementById("checkbtn");

    function displayAlphabet() {
        alphabetDiv.textContent = alphabetArray[currentIndex];
        document.getElementById("result").innerHTML = "";
        // document.querySelector('.smile-emoji').src = "./images/smiley-face-icegif-3.gif";
    }

    displayAlphabet();


    let prevX = null;
    let prevY = null;
    let draw = false;
    // let timeoutId = null;

    // Set initial background color and line width
    let theColor = '';
    let lineW = 5;
    body.style.backgroundColor = "#FFFFFF";
    ctx.lineWidth = lineW;

    
    // Update background color when color picker changes
    var theInput = document.getElementById("favcolor");
    theInput.addEventListener("input", function(){
        theColor = theInput.value;
        body.style.backgroundColor = theColor;
    }, false);

    // Update line width when range input changes
    document.getElementById("ageInputId").oninput = function() {
        lineW = document.getElementById("ageInputId").value;
        document.getElementById("ageOutputId").innerHTML = lineW;
        ctx.lineWidth = lineW;
    };

    // Set stroke color when color option is clicked
    let clrs = document.querySelectorAll(".clr");
    clrs = Array.from(clrs);
    clrs.forEach(clr => {
        clr.addEventListener("click", () => {
            ctx.strokeStyle = clr.dataset.clr;
        });
    });

    // Clear screen when clear button is clicked
    let clearBtn = document.querySelector(".clear");
    clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save canvas as image when save button is clicked
    let saveBtn = document.querySelector(".save");
    saveBtn.addEventListener("click", () => {
        let data = canvas.toDataURL("imag/png");
        let a = document.createElement("a");
        a.href = data;
        a.download = "sketch.png";
        a.click();
    });

    // Handle drawing functionality
    window.addEventListener("mousedown", (e) => {
        draw = true;
        // Clear the previous timeout if exists
        // clearTimeout(timeoutId);
    });
    window.addEventListener("mouseup", (e) => {
        draw = false;
    });

    window.addEventListener("mousemove", (e) => {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let x = (e.clientX - rect.left) * scaleX;
        let y = (e.clientY - rect.top) * scaleY;
        
        if (prevX == null || prevY == null || !draw) {
            prevX = x;
            prevY = y;
            return;
        }

        let currentX = x;
        let currentY = y;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        prevX = currentX;
        prevY = currentY;
    });

    // Handle navigation between alphabet images
    let prevBtn = document.getElementById("prev-btn");
    let nextBtn = document.getElementById("next-btn");
    let tryAgainBtn = document.getElementById("try-again-btn");

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + alphabetArray.length) % alphabetArray.length;
        clearCanvas();
        displayAlphabet(currentIndex)
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % alphabetArray.length;
        clearCanvas();
        displayAlphabet(currentIndex)
    });

    tryAgainBtn.addEventListener("click", () => {
        clearCanvas();
        displayAlphabet(currentIndex)
    });

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    displayAlphabet(currentIndex);
    
    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            currentIndex = (currentIndex - 1 + alphabetArray.length) % alphabetArray.length;
            clearCanvas();
            displayAlphabet(currentIndex);
            document.getElementById("prevBtn").click();
        } else if (event.key === "ArrowRight") {
            currentIndex = (currentIndex + 1) % alphabetArray.length;
            clearCanvas();
            displayAlphabet(currentIndex);
            document.getElementById("nextBtn").click();
        }
        else if (event.key === 'Enter') {
            clearCanvas();
            document.getElementById("checkbtn").click();
        }
    });

    if (window.speechSynthesis) {
        const speechSynthesis = window.speechSynthesis;
      
        function speakAlphabet(index) {
          const alphabet = alphabetArray[index];
          const utterance = new SpeechSynthesisUtterance(alphabet);
      
          const voices = speechSynthesis.getVoices();
          let indianGirlVoice = voices.find(voice => voice.name === "Google हिन्दी");
      
          if (indianGirlVoice) {
            utterance.voice = indianGirlVoice;
          } else {
            console.warn("Indian girl's voice not found. Using default voice.");
            // Optionally set a different voice or language here
          }
      
          speechSynthesis.speak(utterance);
        }
      
        document.getElementById("listen-btn").addEventListener("click", function() {
          speakAlphabet(currentIndex);
        });
      } else {
        console.error("Text-to-Speech not supported by your browser.");
      }
    
    
});
