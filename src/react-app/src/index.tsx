import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Main initialization function for Salesforce LWC
function init(container: HTMLElement) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  try {
    const root = createRoot(container);
    root.render(React.createElement(App));
    return { status: 'success', root };
    
  } catch (error) {
    console.error('Error initializing React app:', error);
    
    // Fallback to simple div
    try {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.innerHTML = `
        <div style="padding: 20px; border: 2px solid red; background: #ffe0e0;">
          <h3>Assistant UI Error</h3>
          <p>Error: ${error?.message || 'Unknown error'}</p>
        </div>
      `;
      container.innerHTML = '';
      container.appendChild(fallbackDiv);
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
    }
    
    throw error;
  }
}

// Export as default for webpack UMD
const AssistantUI = {
  init,
  version: '5.1.0-complete-chat-ui',
  timestamp: Date.now(),
  debug: () => console.log('AssistantUI v5.1.0-complete-chat-ui is loaded and available')
};

// Immediately make it available globally
if (typeof window !== 'undefined') {
  (window as any).AssistantUI = AssistantUI;
  console.log('AssistantUI attached to window object');
}

// For webpack UMD export
export default AssistantUI;