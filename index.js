const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ FIXED

const app = express();
const port = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("The day of Love is ongoing");
});

app.post("/generate", async (req, res) => {
    try {
        const { name, tone, length } = req.body;
        if (!name || !tone || !length) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const prompt = `Write a ${length} love letter in a ${tone} tone for ${name}.`;
        const response = await model.generateContent(prompt);

        // Log the entire response to understand its structure
        console.log("Full API Response:", JSON.stringify(response, null, 2));

        // Safely extract text
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Failed to generate text from API response");
        }

        res.json({ letter: text });
    } catch (error) {
        console.error("Error generating love letter:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


app.listen(port, () => {
  console.log(`The day of generating love letters is running on port: ${port}`);
});
