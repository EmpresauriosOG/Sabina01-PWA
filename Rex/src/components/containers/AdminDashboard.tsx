"use client";

import { useState, FormEvent, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

// Helper function to clean tool messages
const cleanToolMessages = (content: string): string => {
  return content
    .split('\n')
    .filter(line => !line.trim().startsWith('Running:'))
    .join('\n')
    .trim();
};

export default function AdminDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/v1/playground/agent/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          agent_id: "mongo-agent",
          stream: true,
          monitor: false,
          user_id: "test-user",
          session_id: sessionId
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulatedContent = '';
      let isDone = false;
      
      while (!isDone) {
        const { done, value } = await reader.read();
        isDone = done;
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        console.log('Received chunk:', chunk); // Debug log
        accumulatedContent += chunk;

        try {
          // Split the chunks and ensure proper JSON formatting
          const chunks = accumulatedContent.split('}{"content"').map((chunk, index) => {
            // Clean up the chunk
            let cleanChunk = chunk.trim();
            
            // Add proper JSON structure
            if (index === 0) {
              if (!cleanChunk.endsWith('}')) cleanChunk += '}';
            } else {
              cleanChunk = '{"content"' + cleanChunk;
              if (!cleanChunk.endsWith('}')) cleanChunk += '}';
            }

            console.log('Processing chunk:', cleanChunk); // Debug log
            return cleanChunk;
          });

          // Process each chunk
          for (const chunk of chunks) {
            try {
              // Verify chunk is valid JSON structure
              if (!chunk.startsWith('{') || !chunk.endsWith('}')) {
                console.log('Skipping invalid JSON chunk:', chunk);
                continue;
              }

              const jsonData = JSON.parse(chunk);
              console.log('Parsed JSON:', jsonData); // Debug log
              
              // Store session_id from the response if we don't have one yet
              if (!sessionId && jsonData.session_id) {
                setSessionId(jsonData.session_id);
              }

              // Only process chunks with content and event type RunResponse
              if (jsonData.content && jsonData.event === 'RunResponse') {
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  
                  // If the last message is from the assistant, update it
                  if (lastMessage?.role === 'assistant') {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: lastMessage.content + jsonData.content }
                    ];
                  }
                  
                  // Otherwise, create a new assistant message
                  return [...prev, {
                    id: Date.now().toString(),
                    content: jsonData.content,
                    role: 'assistant'
                  }];
                });
              }
            } catch (error) {
              console.error('Error parsing individual chunk:', error);
            }
          }
        } catch (error) {
          console.error('Error parsing chunks:', error);
        }

        // Reset accumulated content after processing all complete chunks
        const lastBraceIndex = accumulatedContent.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
          accumulatedContent = accumulatedContent.substring(lastBraceIndex + 1);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'An error occurred while processing your request.',
        role: 'assistant'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col p-4 gap-2 mb-16">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex flex-col gap-2 ${
              message.role === 'assistant' ? 'bg-gray-800' : 'bg-gray-700'
            } p-4 rounded-lg prose prose-invert max-w-none`}
          >
            <ReactMarkdown>
              {message.role === 'assistant' ? cleanToolMessages(message.content) : message.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col fixed bottom-0 w-full border-t border-gray-700"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What can you do?"
          className="w-full p-4 outline-none bg-gray-800 text-white placeholder-gray-400"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}