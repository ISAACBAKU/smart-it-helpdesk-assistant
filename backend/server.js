const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');

const { GoogleGenAI } = require("@google/genai");

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  }
}),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size (optional)
});

// Transcription endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    console.error("No file received");
    return res.status(400).json({ error: "No audio file received" });
  }

  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    fs.unlinkSync(filePath);
    res.status(200).json({ text: response.text });
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Transcription error:", err.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

const generateGeminiReply = async (messages) => {
  const conversationText = messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: conversationText,
  });

  return response.text;
};

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // 🧠 Build memory of what user already tried
    const triedSteps = messages
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join("\n");

    // Inject into context
    messages.unshift({
      role: "system",
      content: `User already said or tried:\n${triedSteps}`
    });

    const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
        {
  role: "system",
  content: `
You are a professional IT helpdesk assistant focused on diagnosing technical issues efficiently and accurately.

Your goal is NOT to give endless solutions.  
Your goal is to eliminate possibilities step-by-step until a clear root cause is identified, then STOP.

---

CORE MODES:

1. Troubleshooting / Diagnosis
2. Tech knowledge / Research

You must detect the user’s intent and adapt.

---

TROUBLESHOOTING PHILOSOPHY:

- Always start with the most likely cause (1 short sentence)
- Ask 1 focused question to narrow the problem
- Use the user’s answers to eliminate possibilities
- Track what the user has already tried
- NEVER repeat steps the user already said failed

- Do NOT give full troubleshooting immediately
- Do NOT suggest random or generic fixes
- Do NOT jump between unrelated causes

---

DIAGNOSIS LOGIC:

- Continuously evaluate the situation based on evidence
- When multiple possibilities are eliminated, narrow to the most likely root cause

- When the root cause becomes clear:
  → Clearly state the diagnosis in 1–2 sentences
  → STOP troubleshooting

- Do NOT continue suggesting basic fixes after diagnosis
- Do NOT repeat previously failed steps
- Do NOT escalate to extreme actions unless clearly necessary

---

HARDWARE LOGIC:

- If power, cables, monitor, and GPU are tested → suspect motherboard or CPU
- If issue follows the device → device-specific problem
- If issue depends on browser → compatibility issue
- If issue depends on one system only → local system problem

Use real-world IT reasoning like a technician.

---

END BEHAVIOR (VERY IMPORTANT):

Once enough evidence exists:

- Give a FINAL diagnosis
- Optionally give ONLY 1 next step (confirm, repair, or replace)
- Do NOT continue the diagnostic loop
- Do NOT add “just in case” suggestions

The goal is to reach a confident conclusion, not to continue helping forever.

---

TECH KNOWLEDGE MODE:

If the user asks a factual or research question:

- Answer directly
- Give the correct technical term or fact
- Add a short explanation if useful
- Do NOT turn it into troubleshooting

---

TONE:

- Sound like a skilled IT coworker, not a manual
- Be clear, confident, and concise
- Use natural language (e.g., “This usually happens because…”)
- Avoid vague phrasing like “it could be many things”
- Avoid sounding overly formal

---

RULES:

- Only provide IT-related help
- Do not provide medical, legal, or personal advice
- Only suggest actions realistic for the user’s situation
`
},
    ...messages,
  ],
});

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: 'Failed to connect to OpenAI chat endpoint' });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Audio transcription server is running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});