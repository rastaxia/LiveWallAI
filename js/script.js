// Client side code
// Get the input elements
const mainName = document.querySelector("#mainCharacter");
const local = document.querySelector("#location");
const world = document.querySelector("#magicWorld");
const start = document.querySelector("#startStory");
let keywords = [];

// Add a submit event listener to the form
start.addEventListener("click", function () {
  const formData = {
    mainCharacter: mainName.value,
    location: local.value,
    magicWorld: world.value,
  };

  fetch("http://localhost:3000/create-fairy-tale.html", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Handle the response from the server if needed
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// // Define the behavior when a message is received from the Server-Sent Events stream
// eventSource.onmessage = function (event) {
//   const newData = event.data.replace("data:" + /(?:\r\n|\r|\n)/g, "");
//   const data = JSON.parse(newData);
//   const content = data.choices[0].delta.content;

//   let totalContent = (outputDiv.innerHTML + content)
//     .replace(/\\n|([^.]|^)\n([^.]|$)|\n+|(?!\.)\n(?!\.)/g, (_, a, b, c) =>
//       a ? "<br/>" : c ? "<br/>" : ""
//     )
//     .replace(/['"{}}]/g, "")
//     .replace("undefined", "")
//     .replace(/(foto1)|(Foto1)/g, "<img id='photo1' src='./img1.jpg' alt='' >")
//     .replace(/(foto2)|(Foto2)/g, "<img id='photo2' src='./img2.jpg' alt='' >")
//     .replace(
//       /(foto3)|(Foto3)/g,
//       "<img id='photo3' src='./img3.jpg' alt='' >"
//     );
//   outputDiv.innerHTML = totalContent;

//   // Extracting keywords from the content
//   const keywordsMatch = totalContent.match(/Keywords: (.+?)\./i);
//   let extractedKeywords = [];
//   if (keywordsMatch && keywordsMatch.length > 1) {
//     extractedKeywords = keywordsMatch[1].split(", ");
//   }

//   // Ensure only three keywords are considered
//   const finalKeywords = extractedKeywords.slice(0, 3).map((keyword) =>
//     keyword
//       .split("<br>")[0]
//       .replace(/<[^>]*>/g, "")
//       .trim()
//   );

//   // Store the final keywords for later use
//   keywords = finalKeywords;
// };

// // Define the behavior when an error occurs with the EventSource connection
// eventSource.onerror = function (error) {
//   console.error("EventSource failed:", error);
//   eventSource.close();
// };
