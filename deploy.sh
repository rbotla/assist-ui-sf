#!/bin/bash

# Deployment script for Assistant UI Salesforce App

echo "🚀 Starting Assistant UI deployment..."

# Step 1: Build React App
echo "📦 Building React app..."
cd src/react-app
npm run build
cd ../..

# Step 2: Deploy to Salesforce
echo "⬆️ Deploying to Salesforce..."

# Create scratch org (optional - for development)
# sfdx force:org:create -f config/project-scratch-def.json -d 7 -s -a assistant-ui-scratch

# Deploy to connected org
sfdx force:source:deploy -p force-app/main/default

# Step 3: Open the org
echo "🌐 Opening Salesforce org..."
sfdx force:org:open

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Navigate to App Launcher -> Assistant UI Demo"
echo "2. Or add the assistantUI Lightning Web Component to any Lightning page"
echo "3. Test the conversational interface"
echo ""
echo "🛠️ Development workflow:"
echo "• Make changes to React app in src/react-app/"
echo "• Run 'npm run build' in src/react-app/ to rebuild"
echo "• Run 'sfdx force:source:deploy -p force-app/main/default/staticresources' to deploy changes"