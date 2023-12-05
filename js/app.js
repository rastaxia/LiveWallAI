// Import required modules
const express = require("express");
const OpenAI = require("openai");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();
// Create an instance of the OpenAI class
const openai = new OpenAI();

// Create an Express application
const app = express();
let generated = false;

// Define the port to listen on, using the specified port or defaulting to 3000
const port = process.env.PORT || 3000;

// Serve the HTML file
app.use(express.static(path.join(__dirname, "../")));

// Parse incoming JSON data
app.use(bodyParser.json());

//Data handeling
app.post("/create-fairy-tale.html", async (req, res) => {
  // gets data from client
  const { name, local, world } = req.body;
  try {
    // creates the story
    const chat = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          (variabel 1), (variabel 2), (variabel 3) controleer in elke denkbare context of deze variabelen aanstootgevend, obsceen, seksueel, racistisch of gewelddadig zijn voor kinderen.
          Als de variabelen kindvriendelijk zijn, schrijf dan een fantasieverhaal in het NEDERLANDS waar de hoofdpersonage ${name} heet. Dit verhaal moet een hero's journey hebben; De hoofdpersoon leefde in een ${local} 
          houd rekening met dat de wereld ${world} bevat. 
          Geef het verhaal ook een titel De titel moet altijd boven het verhaal staan onder de keywords. Het verhaal moet minimaal 2000 woorden bevatten. Je hoeft niet te vermelden of het verhaal kindvriendelijk is;
          je kunt direct met het verhaal beginnen. Als dit niet het geval is, genereer dan alleen de woorden NIET KINDVRIENDELIJK. Genereer ook 3 keywords; laat de keywords slechts 1 woord lang zijn.
          Deze keywords moeten gebruikt kunnen worden om 1 foto per keyword te zoeken die goed bij het verhaal past. Beschrijf de keywords als eerste bovenaan het verhaal voordat de titel wordt genoemd;
          DOE HET ALTIJD ALS VOLGT: Keywords: keyword1, keyword2, keyword3.!!!! er hoeft geen comma , na de laatste keyword. De keywords moeten geen namen zijn van de karakters.
          Je hoeft niet te vermelden wat het doel van het verhaal was ook hoef je niet te zeggen story:. Maak de keywords in het ENGELS!!. Het vehraal zelf moet in het NEDERLANDS zijn.
          Zet ook op drie verschillende plekken in het verhaal waar een foto moet doe dit door te zeggen foto1 foto2 foto3 het verhaal mag dus maar 3 fotos hebbne. Zet de output in een JSON formaat.`,
        },
        {
          role: "user",
          content: `Variabel 1 = ${name} ; Variabel 2 = ${local} ; Variabel 3 = ${world}`,
        },
      ],
      model: "gpt-4-1106-preview",
      temperature: 0.6,
      stream: true,
      response_format: { type: "json_object" },
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    for await (const chunk of chat) {
      // only writes the chunks that are not empty or undefined
      if (
        chunk.choices[0].delta.content !== undefined &&
        chunk.choices[0].delta.content !== null
      ) {
        res.write(chunk.choices[0].delta.content);
      }
      // stops the stream
      if (chunk.choices[0].finish_reason === "stop") {
        res.end();
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/random", async (req, res) => {
  const random = await openai.answers.create({
    messages: [
      {
        role: "system",
        content: `Schrijf een fantasieverhaal in het NEDERLANDS die 2000 woorden lang is dit verhaal moet een hero's journy hebben en 3 keywords bevatten. De keywords moeten 1 woord lang zijn. en moet gebruikt kunnen wordn om fotos te vinden`,
      },
    ],
    model: "gpt-4-1106-preview",
    temperature: 0.6,
    stream: true,
    response_format: { type: "json_object" },
    presence_penalty: 0,
    frequency_penalty: 0,
  });
});

// Image generation
app.post("/imgGenerate", async (req, res) => {
  // gets data from client
  const { keywords } = req.body;

  // checks if the images are already generated
  if (!generated) {
    generated = true;
    // use dall-e-3 for better quality
    const img1 = await openai.images.generate({
      model: "dall-e-2",
      prompt: `generate me a fantasy image of ${keywords[0]}`,
      n: 1,
      size: "256x256",
    });
    const img2 = await openai.images.generate({
      model: "dall-e-2",
      prompt: `generate me a fantasy image of ${keywords[1]}`,
      n: 1,
      size: "256x256",
    });
    const img3 = await openai.images.generate({
      model: "dall-e-2",
      prompt: `generate me a fantasy image of ${keywords[2]}`,
      n: 1,
      size: "256x256",
    });
    // sends the images to the client
    res.json({
      img1: img1.data[0].url,
      img2: img2.data[0].url,
      img3: img3.data[0].url,
    });
  }
});

// Start the Express application, listening on the specified port
app.listen(port, () => {
  console.log(`Visit http://localhost:${port}`);
});
