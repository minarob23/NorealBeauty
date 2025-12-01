const { copyFileSync, mkdirSync, existsSync, writeFileSync } = require('fs');
const { join } = require('path');

const functionsDir = './functions';
const srcDir = join(functionsDir, 'src');

// Ensure directories exist
if (!existsSync(functionsDir)) {
  mkdirSync(functionsDir);
}
if (!existsSync(srcDir)) {
  mkdirSync(srcDir, { recursive: true });
}

console.log('Preparing Firebase Functions...');

// Copy package.json for functions
const functionsPackageJson = {
  name: "functions",
  description: "Cloud Functions for NoReal Beauty",
  engines: {
    node: "18"
  },
  main: "src/index.js",
  dependencies: {
    "express": "^4.21.2",
    "firebase-functions": "^6.1.1",
    "firebase-admin": "^13.0.1",
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.39.1",
    "bcryptjs": "^3.0.3",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "passport-google-oauth20": "^2.0.0",
    "express-session": "^1.18.1",
    "memorystore": "^1.6.7",
    "nodemailer": "^7.0.11",
    "resend": "^6.5.2",
    "ws": "^8.18.0",
    "zod": "^3.24.2",
    "zod-validation-error": "^3.4.0",
    "dotenv": "^17.2.3",
    "drizzle-zod": "^0.7.0",
    "connect-pg-simple": "^10.0.0"
  }
};

writeFileSync(
  join(functionsDir, 'package.json'),
  JSON.stringify(functionsPackageJson, null, 2)
);
console.log('✓ Created functions/package.json');

// Copy .env if it exists
if (existsSync('.env')) {
  copyFileSync('.env', join(functionsDir, '.env'));
  console.log('✓ Copied .env to functions directory');
}

// Copy the index.js file (should already exist)
console.log('✓ Using existing functions/src/index.js');

console.log('\n✓ Firebase Functions prepared successfully!');
console.log('\nNext steps:');
console.log('1. cd functions && npm install');
console.log('2. cd .. && firebase deploy');
