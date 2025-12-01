import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const sourceDir = './server';
const targetDir = './functions/src';
const distDir = './dist';

// First, build the server to JavaScript
console.log('Building server to JavaScript...');
execSync('npm run build', { stdio: 'inherit' });

// Ensure functions/src directory exists
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Copy built server file
console.log('Copying built server files...');
const serverBundle = join(distDir, 'index.cjs');
if (existsSync(serverBundle)) {
  // Read the bundle and extract the server code
  // Since we need individual files, we'll copy the source files and convert them
  
  const serverFiles = [
    'auth.ts',
    'db.ts',
    'email.ts',
    'routes.ts',
    'storage.ts',
    'adminMiddleware.ts',
  ];

  serverFiles.forEach(file => {
    const src = join(sourceDir, file);
    const dest = join(targetDir, file.replace('.ts', '.js'));
    if (existsSync(src)) {
      let content = readFileSync(src, 'utf-8');
      
      // Basic TypeScript to JavaScript conversion
      // Remove type annotations (simple patterns)
      content = content.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(\s*=)/g, ' =');
      content = content.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(\s*\))/g, ')');
      content = content.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(\s*;)/g, ';');
      content = content.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(\s*,)/g, ',');
      content = content.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(\s*\{)/g, ' {');
      
      // Convert imports from ESM to CommonJS
      content = content.replace(/import\s+(.+?)\s+from\s+["'](.+?)["'];?/g, (match, imports, path) => {
        if (imports.includes('{')) {
          // Named imports
          return `const ${imports} = require("${path}");`;
        } else if (imports.includes('* as')) {
          // Namespace import
          const name = imports.replace('* as ', '').trim();
          return `const ${name} = require("${path}");`;
        } else {
          // Default import
          return `const ${imports} = require("${path}");`;
        }
      });
      
    // Convert exports
    content = content.replace(/export\s+const\s+/g, 'exports.');
    content = content.replace(/export\s+function\s+(\w+)/g, 'function $1'); 
    content = content.replace(/export\s+\{(.+?)\};?/g, (match, exports) => {
      const names = exports.split(',').map((n: string) => n.trim());
      return names.map((name: string) => `exports.${name} = ${name};`).join('\n');
    });      // Fix import paths
      content = content.replace(/@shared\/schema/g, './schema');
      content = content.replace(/from ["']\.\/(.+?)\.ts["']/g, 'from "./$1.js"');
      
      writeFileSync(dest, content, 'utf-8');
      console.log(`✓ Converted and copied ${file}`);
    }
  });

  // Copy schema
  const sharedSrc = './shared/schema.ts';
  const sharedDest = join(targetDir, 'schema.js');
  if (existsSync(sharedSrc)) {
    let content = readFileSync(sharedSrc, 'utf-8');
    
    // Convert schema file
    content = content.replace(/import\s+(.+?)\s+from\s+["'](.+?)["'];?/g, (match, imports, path) => {
      if (imports.includes('{')) {
        return `const ${imports} = require("${path}");`;
      } else if (imports.includes('* as')) {
        const name = imports.replace('* as ', '').trim();
        return `const ${name} = require("${path}");`;
      } else {
        return `const ${imports} = require("${path}");`;
      }
    });
    
    content = content.replace(/export\s+const\s+/g, 'exports.');
    content = content.replace(/export\s+type\s+.+?;/g, ''); // Remove type exports
    
    writeFileSync(sharedDest, content, 'utf-8');
    console.log('✓ Converted and copied schema.js');
  }
}

console.log('✓ Build completed successfully');
