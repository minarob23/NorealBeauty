import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const sourceDir = './server';
const targetDir = './functions/src';

function copyRecursiveSync(src: string, dest: string) {
  const exists = existsSync(src);
  const stats = exists && statSync(src);
  const isDirectory = exists && stats && stats.isDirectory();
  
  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    copyFileSync(src, dest);
  }
}

// Function to fix import paths in files
function fixImportPaths(filePath: string) {
  let content = readFileSync(filePath, 'utf-8');
  // Replace @shared/schema with ./schema
  content = content.replace(/from ["']@shared\/schema["']/g, 'from "./schema"');
  // Replace @shared imports with ./shared
  content = content.replace(/from ["']@shared\//g, 'from "./');
  writeFileSync(filePath, content, 'utf-8');
}

// Copy server files to functions/src
console.log('Copying server files to functions/src...');

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
  const dest = join(targetDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    fixImportPaths(dest);
    console.log(`✓ Copied and fixed ${file}`);
  }
});

// Copy shared schema
const sharedSrc = './shared/schema.ts';
const sharedDest = './functions/src/schema.ts';
if (existsSync(sharedSrc)) {
  copyFileSync(sharedSrc, sharedDest);
  console.log('✓ Copied schema.ts');
}

console.log('✓ Server files copied successfully');
