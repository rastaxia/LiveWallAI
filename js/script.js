// Get references to HTML elements using their IDs
let nameInput = document.querySelector("#mainCharacter");
const locationInput = document.querySelector("#location");
const worldInput = document.querySelector("#magicWorld");
const start = document.querySelector("#startStory");
const random = document.querySelector("#randomButton");
const outputDiv = document.querySelector("#output");
let called = false;
let keywords = [];

random.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("random button clicked");
  fetch("/random", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
});

// Add a submit event listener to the form
start.addEventListener("click", async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

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
                console.log("done", done);
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // Check chunks by logging to the console
              value = new TextDecoder().decode(value);
              let totalContent = (outputDiv.innerHTML + value)
                .replace(
                  /\\n|([^.]|^)\n([^.]|$)|\n+|(?!\.)\n(?!\.)/g,
                  (_, a, b, c) => (a ? "<br/>" : c ? "<br/>" : "")
                )
                .replace(/['"{}}]/g, "")
                .replace("undefined", "")
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
              outputDiv.innerHTML = totalContent;

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
