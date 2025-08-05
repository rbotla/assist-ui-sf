import React from 'react';
import { 
  AssistantRuntimeProvider, 
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  useLocalRuntime
} from '@assistant-ui/react';

interface SalesforceAssistantProps {
  sessionId?: string;
}

// Mock adapter for assistant-ui
const createSalesforceAdapter = (sessionId: string) => ({
  async run({ messages }) {
    const lastMessage = messages[messages.length - 1];
    
    try {
      // Call Salesforce Apex REST endpoint
      const response = await fetch('/services/apexrest/assistant/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: lastMessage.content,
          conversationId: sessionId
        })
      });

      const result = await response.json();
      
      if (result?.success) {
        return {
          content: [{ type: 'text', text: result?.message || 'Response received' }]
        };
      } else {
        throw new Error(result?.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error calling Salesforce assistant:', error);
      return {
        content: [{ 
          type: 'text', 
          text: 'Sorry, I encountered an error while processing your request. Please try again.' 
        }]
      };
    }
  }
});

const SalesforceAssistant: React.FC<SalesforceAssistantProps> = ({ 
  sessionId = 'default' 
}) => {
  const adapter = React.useMemo(() => createSalesforceAdapter(sessionId), [sessionId]);
  const runtime = useLocalRuntime(adapter);

  return (
    <div className="salesforce-assistant-container">
      <div className="assistant-header">
        <h2>AI Assistant</h2>
        <p>Ask me anything about our products, services, or support!</p>
      </div>
      
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="assistant-thread-container">
          <ThreadPrimitive.Root>
            <ThreadPrimitive.Viewport>
              <ThreadPrimitive.Messages>
                <MessagePrimitive.Root>
                  <MessagePrimitive.Content />
                </MessagePrimitive.Root>
              </ThreadPrimitive.Messages>
            </ThreadPrimitive.Viewport>
            <ComposerPrimitive.Root>
              <ComposerPrimitive.Input 
                placeholder="Type your message..."
                autoFocus 
              />
              <ComposerPrimitive.Send />
            </ComposerPrimitive.Root>
          </ThreadPrimitive.Root>
        </div>
      </AssistantRuntimeProvider>
    </div>
  );
};

export default SalesforceAssistant;