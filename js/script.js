// Get references to HTML elements using their IDs
let nameInput = document.querySelector("#mainCharacter");
const locationInput = document.querySelector("#location");
const worldInput = document.querySelector("#magicWorld");
const start = document.querySelector("#startStory");
const random = document.querySelector("#randomButton");
const outputDiv = document.querySelector("#output");
const listen = document.querySelector("#listenBtn");
let called = false;
let keywords = [];
//put story in array
let story = "";

// set width of input with placeholder
let input = document.querySelectorAll("input");
for (i = 0; i < input.length; i++) {
  input[i].setAttribute("size", input[i].getAttribute("placeholder").length);
}

// random story generation
random.addEventListener("click", async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  // hides the random button and the start button and shows the listen button
  random.style.display = "none";
  start.style.display = "none";
  listen.style.display = "block";
  listen.disabled = true;
  try {
    const randomStory = await fetch("/random", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const reader = randomStory.body.getReader();
    return new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              console.log("complete");
              listen.disabled = false;
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            // decodes the data
            value = new TextDecoder().decode(value);
            // replaces everything that is not a period and a new line with a break
            let totalContent = (outputDiv.innerHTML + value)
              .replace(
                /\\n|([^.]|^)\n([^.]|$)|\n+|(?!\.)\n(?!\.)/g,
                (_, a, b, c) => (a ? "<br/>" : c ? "<br/>" : "")
              )
              // replaces all the unwanted characters
              .replace(/['"{}}]/g, "")
              // sometimes returns some undefined values
              .replace("undefined", "")
              // replaces the photos with images elements
              .replace(
                /(foto1)|(Foto1)/g,
                "<img id='photo1' src='#' alt='Photo 1' >"
              )
              .replace(
                /(foto2)|(Foto2)/g,
                "<img id='photo2' src='#' alt='Photo 2' >"
              )
              .replace(
                /(foto3)|(Foto3)/g,
                "<img id='photo3' src='#' alt='Photo 3' >"
              );
            // sets the innerHTML of the output div to the new content
            outputDiv.innerHTML = totalContent;
            story = totalContent;

            // Extracting keywords from the content
            const keywordsMatch = totalContent.match(/Keywords: (.+?)\./i);
            let extractedKeywords = [];
            if (keywordsMatch && keywordsMatch.length > 1) {
              extractedKeywords = keywordsMatch[1].split(", ");
            }

            // Ensure only three keywords are considered
            const finalKeywords = extractedKeywords.slice(0, 3).map((keyword) =>
              keyword
                .split("<br>")[0]
                .replace(/<[^>]*>/g, "")
                .trim()
            );

            // Store the final keywords for later use
            keywords = finalKeywords;
            if (keywords.length === 3) {
              if (!called) {
                called = true;
                imgGenerate();
              }
            }
            push();
          });
        }
        push();
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// story generation
start.addEventListener("click", async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // hides the random button and the start button and shows the listen button
  random.style.display = "none";
  start.style.display = "none";
  listen.style.display = "block";
  listen.disabled = true;
  // Get the values entered by the user for name and writing style
  const name = nameInput.value;
  const local = locationInput.value;
  const world = worldInput.value;

  if (!name || !local || !world) {
    alert("please fill in all fields");
    return;
  } else {
    // Create a new EventSource to establish a connection for Server-Sent Events
    try {
      const response = await fetch("/create-fairy-tale.html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, local, world, keywords }),
      });
      //gets data from server
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then(({ done, value }) => {
              // If there is no more data to read
              if (done) {
                listen.disabled = false;
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // decodes the data
              value = new TextDecoder().decode(value);
              // replaces everything that is not a period and a new line with a break
              let totalContent = (outputDiv.innerHTML + value)
                .replace(
                  /\\n|([^.]|^)\n([^.]|$)|\n+|(?!\.)\n(?!\.)/g,
                  (_, a, b, c) => (a ? "<br/>" : c ? "<br/>" : "")
                )
                // replaces all the unwanted characters
                .replace(/['"{}}]/g, "")
                // sometimes returns some undefined values
                .replace("undefined", "")
                // replaces the photos with images elements
                .replace(
                  /(foto1)|(Foto1)/g,
                  "<img id='photo1' src='#' alt='Photo 1' >"
                )
                .replace(
                  /(foto2)|(Foto2)/g,
                  "<img id='photo2' src='#' alt='Photo 2' >"
                )
                .replace(
                  /(foto3)|(Foto3)/g,
                  "<img id='photo3' src='#' alt='Photo 3' >"
                );
              // sets the innerHTML of the output div to the new content
              outputDiv.innerHTML = totalContent;
              story = outputDiv.innerHTML;

              // Extracting keywords from the content
              const keywordsMatch = totalContent.match(/Keywords: (.+?)\./i);
              let extractedKeywords = [];
              if (keywordsMatch && keywordsMatch.length > 1) {
                extractedKeywords = keywordsMatch[1].split(", ");
              }

              // Ensure only three keywords are considered
              const finalKeywords = extractedKeywords
                .slice(0, 3)
                .map((keyword) =>
                  keyword
                    .split("<br>")[0]
                    .replace(/<[^>]*>/g, "")
                    .trim()
                );

              // Store the final keywords for later use
              keywords = finalKeywords;
              if (keywords.length === 3) {
                if (!called) {
                  called = true;
                  imgGenerate();
                }
              }
              push();
            });
          }
          push();
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
});

// img gen request
async function imgGenerate() {
  const img = await fetch("/imgGenerate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keywords }),
  });
  const imgData = await img.json();
  let photo1_polling = setInterval(() => {
    if (document.querySelector("img#photo1") !== null) {
      document.querySelector("img#photo1").src = imgData.img1;
      clearInterval(photo1_polling);
    }
  }, 1000);
  let photo2_polling = setInterval(() => {
    if (document.querySelector("img#photo2") !== null) {
      document.querySelector("img#photo2").src = imgData.img2;
      clearInterval(photo2_polling);
    }
  }, 1000);
  let photo3_polling = setInterval(() => {
    if (document.querySelector("img#photo3") !== null) {
      document.querySelector("img#photo3").src = imgData.img3;
      clearInterval(photo3_polling);
    }
  }, 1000);
}

// settings bar
// change fontsize in pop up
let text = document.querySelector("#output"); // selected paragraph to change fontsize
let textFontSize = 22; // Start number of fontsize. Is the same as p fontsize

const increaseBtn = document.getElementById("increasefontSize");
const decreaseBtn = document.getElementById("decreasefontSize"); // get id of buttons change fontsize

increaseBtn.addEventListener("click", () => {
  textFontSize += 1; // fontsize +1
  text.style.fontSize = `${textFontSize}px`;
  document.getElementsByName("fontSize")[0].placeholder =
    text.style.fontSize = `${textFontSize}`; // fontsize shown in placeholder
});

decreaseBtn.addEventListener("click", () => {
  textFontSize -= 1; // fontsize -1
  text.style.fontSize = `${textFontSize}px`;
  document.getElementsByName("fontSize")[0].placeholder =
    text.style.fontSize = `${textFontSize}`; // fontsize shown in placeholder
});

// Change line-height
text = document.querySelector("#output"); // selected paragraph to change fontsize

let textLineheight = 1;

const increaseLine = document.getElementById("increaselineHeight");
const decreaseLine = document.getElementById("decreaselineHeight"); // get id of buttons change lineheight

increaseLine.addEventListener("click", () => {
  textLineheight += 0.5; // lineheight +1
  text.style.lineHeight = `${textLineheight}`;
  document.getElementsByName("lineHeight")[0].placeholder =
    text.style.lineHeight = `${textLineheight}`; // lineheight shown in placeholder
});
decreaseLine.addEventListener("click", () => {
  textLineheight -= 0.5; // lineheight -1
  text.style.lineHeight = `${textLineheight}`;
  document.getElementsByName("lineHeight")[0].placeholder =
    text.style.lineHeight = `${textLineheight}`; // lineheight shown in placeholder
});

// Convert HTML to PDF
downloadBtn = document.getElementById("download");
downloadBtn.addEventListener("click", getChoicePDF);
function convertToPDF() {
  let pdfFile = document.getElementById("output"); // select text in HTML to convert to PDF
  html2pdf(pdfFile); // convert html to pdf
}

// Pop-up window to save PDF
function getChoicePDF() {
  if (confirm("Wilt U het verhaal opslaan?")) {
    convertToPDF();
  } else {
    alert("Verhaal niet opgeslagen");
  }
}

// Text to speech
// tts not yet working
// Text to speech generation Elevenlabs
const options = {
  method: "POST", // send data to server
  headers: {
    "xi-api-key": "ffdcbccb0c111a5e2b188c0ab6a21422",
    "Content-Type": "application/json",
  },
  body: `{"text":${story},"voice_settings":{"similarity_boost":1,"stability":1}}`,
};

function playAudio() {
  fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB",
    options
  ) // make HTTP request to server for certain voice
    .then((response) => response.blob()) // response of server
    .then((audioBlob) => {
      const audioUrl = URL.createObjectURL(audioBlob); // creates an audio url for audio data
      const audioElement = new Audio(audioUrl); // creates audio source to run
      audioElement.play(); // Play audio with selected voice
    })
    .catch((err) => console.error(err));
}

const playBtn = document.getElementById("listenBtn");
playBtn.addEventListener("click", function () {
  playAudio();
});
