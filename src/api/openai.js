// src/api/openai.js

export const generateReply = async (rawMessages) => {
  console.log('📥 API KEY:', import.meta.env.VITE_OPENAI_API_KEY);

  // ✅ Convert raw messages to OpenAI's format
  const updatedMessages = rawMessages
  .filter(m => typeof m.content === 'string' && m.content.trim() !== '')
  .map(m => ({
    role: m.role || 'user',
    content: m.content,
  }));


  console.log('📤 Sending to backend:', updatedMessages);

  try {
    const response = await fetch('http://localhost:3001/api/chat', {
   method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ messageHistory: updatedMessages }) // wrap it!
});


    const data = await response.json();

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('❌ OpenAI Error:', errorDetails);
      return 'Oops! Something went wrong with the assistant.';
    }

    return data.reply;
  } catch (error) {
    console.error('❌ Network error:', error);
    return 'Unable to connect to AI. Please try again later.';
  }
};
