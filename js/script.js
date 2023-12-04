// Get references to HTML elements using their IDs
let nameInput = document.querySelector("#mainCharacter");
const locationInput = document.querySelector("#location");
const worldInput = document.querySelector("#magicWorld");
const start = document.querySelector("#startStory");
const random = document.querySelector("#randomButton");
const outputDiv = document.querySelector("#output");
let keywords = [];

random.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("random button clicked");
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
        body: JSON.stringify({ name, local, world }),
      });

      const responseData = await response.json();
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  }
});
