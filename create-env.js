
// create-env.js
const fs = require('fs');

// This script generates the env.js file from environment variables
// provided by the hosting platform (like Vercel).
const envContent = `
// This file is auto-generated during the build process
// and should not be committed to version control.

export const TOGETHER_API_KEY = "${process.env.TOGETHER_API_KEY || ''}";
`;

try {
  fs.writeFileSync('./env.js', envContent);
  console.log('Successfully created env.js from environment variables.');
} catch (err) {
  console.error('Failed to create env.js:', err);
  process.exit(1); // Exit with an error code
}