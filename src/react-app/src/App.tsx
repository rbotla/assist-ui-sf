import React from 'react';
import './App.css';
import { 
  AssistantRuntimeProvider,
  useLocalRuntime,
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive
} from '@assistant-ui/react';

// Create a tool for Salesforce Apex integration
const salesforceApexTool = {
  description: 'Call Salesforce Apex backend',
  parameters: {
    type: 'object',
    properties: {
      message: { type: 'string' }
    },
    required: ['message']
  },
  execute: async ({ message }: { message: string }) => {
    try {
      const response = await fetch('/services/apexrest/assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          conversationId: 'salesforce-session' 
        })
      });
      
      const result = await response.json();
      return result.message || 'I apologize, but I encountered an error processing your request.';
      
    } catch (error) {
      return `I'm sorry, I encountered an error: ${error.message}`;
    }
  }
};

const Message = () => (
  <MessagePrimitive.Root>
    <MessagePrimitive.Content />
  </MessagePrimitive.Root>
);

const App: React.FC = () => {
  const runtime = useLocalRuntime({
    initialMessages: [
      { role: "assistant", content: [{ type: "text", text: "Hello! I'm your Salesforce assistant. How can I help you today?" }] }
    ],
    tools: [salesforceApexTool]
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThreadPrimitive.Root>
          <ThreadPrimitive.Viewport style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            <ThreadPrimitive.Messages components={{ Message }} />
          </ThreadPrimitive.Viewport>
          
          <div style={{ borderTop: '1px solid #ccc', padding: '16px' }}>
            <ComposerPrimitive.Root>
              <ComposerPrimitive.Input 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  marginRight: '8px'
                }} 
                placeholder="Type your message..."
              />
              <ComposerPrimitive.Send 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#0176d3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Send
              </ComposerPrimitive.Send>
            </ComposerPrimitive.Root>
          </div>
        </ThreadPrimitive.Root>
      </div>
    </AssistantRuntimeProvider>
  );
};

export default App;