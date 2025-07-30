import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// For local development
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(App));
} else {
  console.error('Root container not found');
}