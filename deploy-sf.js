const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function deploy() {
  const accessToken = '00DgL000007oG2t!AQEAQBIogRx4wFO3xeUibw.4UtAg6aEw6x0w6lmyyE7HTL8DeYkdm52rfSthPb0RyNb.bthD.gc7iAZ7zCab8k_YkQ98yDhw';
  const instanceUrl = 'https://orgfarm-3d5066f638-dev-ed.develop.my.salesforce.com';
  
  // Read the static resource file
  const filePath = path.join(__dirname, 'force-app/main/default/staticresources/assistantui_nextjs.js');
  const fileContent = fs.readFileSync(filePath);
  
  // First, check if the static resource exists
  const queryResponse = await fetch(`${instanceUrl}/services/data/v60.0/query?q=SELECT Id FROM StaticResource WHERE Name='assistantui_nextjs'`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const queryData = await queryResponse.json();
  
  if (queryData.totalSize > 0) {
    // Update existing
    const resourceId = queryData.records[0].Id;
    const form = new FormData();
    form.append('Body', fileContent, 'assistantui_nextjs.js');
    
    const response = await fetch(`${instanceUrl}/services/data/v60.0/sobjects/StaticResource/${resourceId}/Body`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...form.getHeaders()
      },
      body: form
    });
    
    console.log('Update response:', response.status);
  } else {
    // Create new
    const response = await fetch(`${instanceUrl}/services/data/v60.0/sobjects/StaticResource`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Name: 'assistantui_nextjs',
        ContentType: 'application/javascript',
        CacheControl: 'Public',
        Body: Buffer.from(fileContent).toString('base64')
      })
    });
    
    const data = await response.json();
    console.log('Create response:', data);
  }
  
  console.log('Static resource deployed successfully!');
}

deploy().catch(console.error);