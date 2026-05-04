import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { FaPaperPlane, FaMicrophone, FaBars } from 'react-icons/fa';

const ChatBox = ({ toggleSidebar, darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const messagesEndRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateReply = async (conversation) => {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await res.json();
    return data.reply;
  };

  const handleSend = async () => {
    if (audioBlob) {
      try {
        const formData = new FormData();
        formData.append(
          'audio',
          new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
        );

        const res = await fetch('http://localhost:3001/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.text) throw new Error(data.error || 'No transcription');

        const userMessage = { role: 'user', content: data.text.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        const reply = await generateReply(updatedMessages);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I couldn’t understand the voice message.' },
        ]);
      } finally {
        setAudioBlob(null);
        setAudioURL(null);
      }
      return;
    }

    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const reply = await generateReply(updatedMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Unable to connect to AI. Please try again later.' },
      ]);
    }
  };

  const handleMicClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
    setInput('');
    setAudioBlob(null);
    setAudioURL(null);
  };

  const burgerLineColor = darkMode ? 'white' : 'black';
  return (
    <div className="chat-container h-full flex flex-col overflow-hidden px-6 py-3 bg-transparent dark:bg-transparent relative">
      <div className="shrink-0 relative h-14 mb-2 flex items-center px-6">
        <div className="w-12 flex justify-start">
  <button
    onClick={toggleSidebar}
    aria-label="Toggle sidebar"
    type="button"
    className="h-10 w-10 flex items-center justify-center appearance-none bg-transparent border-0 p-0 shadow-none outline-none"
    style={{ background: 'transparent', border: 'none', padding: 0 }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '5px',
        alignItems: 'center',
        
      }}
    >
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '2px',
          backgroundColor: burgerLineColor,
          borderRadius: '999px',
        }}
      />
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '2px',
         backgroundColor: burgerLineColor, 
          borderRadius: '999px',
        }}
      />
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '2px',
          backgroundColor: burgerLineColor,  
          borderRadius: '999px',
        }}
      />
    </div>
  </button>
</div>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-zinc-400 whitespace-nowrap">
            Smart IT Helpdesk Assistant
          </h1>
        </div>

        <div className="w-20 flex justify-end">
          <button
            onClick={handleClear}
            className="clear-chat-btn"
          >
            Clear
          </button>
        </div>
      </div>

        <div className="chat-scroll-area flex-1 min-h-0 overflow-y-auto p-2 rounded transition-colors duration-300">
          <div className="messages-column">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-container ${msg.role}`}
              >
                <MessageBubble role={msg.role} text={msg.content} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="input-area-fixed">
          {isRecording && <div className="recording-indicator">Recording...</div>}

          <div className="input-group">
            <div className="input-wrapper">
              {audioURL ? (
                <audio controls src={audioURL} className="audio-preview" />
              ) : (
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={!!audioBlob}
                />
              )}
            </div>

            <div className="button-group">
              <button className="send-button" onClick={handleSend}>
                <FaPaperPlane />
              </button>

              <button
                className={`mic-button ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? handleStopRecording : handleMicClick}
              >
                {isRecording ? '⏹' : <FaMicrophone />}
              </button>
              
            </div>
          </div>
        </div>
    </div>
  );
};

export default ChatBox;