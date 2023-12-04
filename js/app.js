// Import required modules
const express = require("express");
const OpenAI = require("openai");
const path = require("path");
const bodyParser = require("body-parser"); // Add this line

// Set the OpenAI API key as an environment variable
process.env.OPENAI_API_KEY = "no leak";

// Create an instance of the OpenAI class
const openai = new OpenAI();

// Create an Express application
const app = express();

// Define the port to listen on, using the specified port or defaulting to 3000
const port = process.env.PORT || 3000;

// Serve the HTML file
app.use(express.static(path.join(__dirname, "../")));

// Parse incoming JSON data
app.use(bodyParser.json());

//Data handeling
app.post("/create-fairy-tale.html", async (req, res) => {
  const { name, local, world } = req.body;
  try {
    const chat = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `tell me a story using name ${name}, local ${local}, world ${world} put it in a JSON format the story must be 2 lines long`,
        },
        {
          role: "user",
          content: "Once upon a time",
        },
      ],
      model: "gpt-3.5-turbo-1106",
      temperature: 0.6,
      stream: true,
      response_format: { type: "json_object" },
    });

    for await (const chunk of chat) {
      res.json(chunk.choices[0].delta.content);
    }
  } catch (err) {
    console.log(err);
  }
});

// Start the Express application, listening on the specified port
app.listen(port, () => {
  console.log(`Visit http://localhost:${port}`);
});
