# Assistant UI - Salesforce Deployment Guide

This project demonstrates a conversational UI built with React using the assistant-ui framework, integrated into Salesforce as a Lightning Web Component.

## Architecture

- **Frontend**: React app with assistant-ui framework
- **Backend**: Salesforce Apex REST controller with mock RAG responses
- **Integration**: Lightning Web Component wrapper
- **Static Resource**: Webpack-bundled React app

## Prerequisites

1. Salesforce CLI installed
2. Node.js and npm installed
3. Authenticated Salesforce org

## Quick Deployment

```bash
# Run the automated deployment script
./deploy.sh
```

## Manual Deployment Steps

### 1. Build the React App

```bash
cd src/react-app
npm install
npm run build
cd ../..
```

### 2. Deploy to Salesforce

```bash
# Deploy all components
sfdx force:source:deploy -p force-app/main/default

# Or deploy individually:
sfdx force:source:deploy -p force-app/main/default/classes
sfdx force:source:deploy -p force-app/main/default/staticresources
sfdx force:source:deploy -p force-app/main/default/lwc
sfdx force:source:deploy -p force-app/main/default/aura
```

### 3. Test the Application

1. Open Salesforce org: `sfdx force:org:open`
2. Navigate to App Launcher → "Assistant UI Demo"
3. Or add the `assistantUI` component to any Lightning page

## Components

### Apex Classes

- **AssistantController**: REST endpoint providing mock RAG responses

### Lightning Web Components

- **assistantUI**: Main component wrapping the React app

### Static Resources

- **assistantui**: Bundled React application with assistant-ui

### Aura Applications

- **AssistantUIApp**: Demo application for testing

## Development Workflow

1. Make changes to React app in `src/react-app/`
2. Build: `cd src/react-app && npm run build`
3. Deploy: `sfdx force:source:deploy -p force-app/main/default/staticresources`
4. Refresh your Lightning page to see changes

## Mock RAG Responses

The AssistantController provides intelligent responses based on keywords:

- **Greetings**: "hello", "hi"
- **Products**: "product", "service"
- **Pricing**: "pricing", "cost"
- **Support**: "support", "help"
- **Integration**: "integration", "api"
- **Features**: "feature", "capability"

## Customization

### Adding Real RAG Integration

Replace the mock responses in `AssistantController.cls` with actual API calls to your RAG backend:

```apex
// Replace this method with real API integration
private static String generateMockResponse(String userMessage) {
    // Call your actual RAG API here
    return callExternalRAGAPI(userMessage);
}
```

### Styling

Modify the CSS in:
- `src/react-app/src/App.css` for React components
- `force-app/main/default/lwc/assistantUI/assistantUI.css` for LWC wrapper

### Security

For production deployment:
1. Enable proper CORS settings
2. Implement authentication for external APIs
3. Add input validation and sanitization
4. Configure CSP (Content Security Policy) headers

## Troubleshooting

### Common Issues

1. **Component not loading**: Check browser console for JavaScript errors
2. **API calls failing**: Verify AssistantController deployment and permissions
3. **Styling issues**: Ensure static resource is properly deployed
4. **CSP violations**: Configure Lightning CSP to allow external CDN resources

### Debug Commands

```bash
# Check deployment status
sfdx force:source:status

# View logs
sfdx force:apex:log:tail

# Validate without deploying
sfdx force:source:deploy -p force-app/main/default --checkonly
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Review Salesforce debug logs
3. Verify all components are properly deployed
4. Test with the Aura demo application first