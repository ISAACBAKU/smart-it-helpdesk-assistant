const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
    });

    fs.unlinkSync(filePath); // delete temp file
    res.json({ text: response });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Transcription failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});