import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToProcess = ['src/components', 'src/pages', 'src/contexts', 'src/hooks'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // Skip ui components that are just simple exports or already have use client
  if (!content.includes('"use client"') && !content.includes("'use client'")) {
    // Only add use client if the file uses React features or is a component
    if (content.includes('from "react"') || content.includes('from \'react\'') || content.match(/export (default )?(function|const|let|var)/) || filePath.includes('Context')) {
      content = '"use client";\n\n' + content;
    }
  }

  // react-router-dom replacements
  if (content.includes('react-router-dom')) {
    // Replace Link import
    content = content.replace(/import\s*\{\s*([^}]*)Link([^}]*)\s*\}\s*from\s*['"]react-router-dom['"]/g, (match, p1, p2) => {
      let otherImports = (p1 + p2).split(',').map(s => s.trim()).filter(s => s && s !== 'Link').join(', ');
      let res = `import Link from "next/link";`;
      if (otherImports) {
        res += `\nimport { ${otherImports} } from "react-router-dom";`;
      }
      return res;
    });

    // Replace other imports like useNavigate, useLocation
    content = content.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]react-router-dom['"]/g, (match, p1) => {
      let imports = p1.split(',').map(s => s.trim()).filter(s => s);
      let nextNavImports = [];
      let nextNavigationImports = [];
      let remainingImports = [];
      
      for (let imp of imports) {
        if (imp === 'useNavigate') {
          nextNavigationImports.push('useRouter');
        } else if (imp === 'useLocation') {
          nextNavigationImports.push('usePathname');
        } else {
          remainingImports.push(imp);
        }
      }
      
      let res = '';
      if (nextNavigationImports.length > 0) {
        res += `import { ${nextNavigationImports.join(', ')} } from "next/navigation";\n`;
      }
      if (remainingImports.length > 0) {
        res += `import { ${remainingImports.join(', ')} } from "react-router-dom";\n`;
      }
      return res.trim();
    });
  }

  // Replace <Link to= with <Link href=
  content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');
  
  // Replace useNavigate usage
  content = content.replace(/const\s+(\w+)\s*=\s*useNavigate\(\)/g, 'const $1 = useRouter()');
  // Replace useLocation usage
  content = content.replace(/const\s+(\w+)\s*=\s*useLocation\(\)/g, 'const pathname = usePathname()');
  
  // Replace location.pathname with pathname
  content = content.replace(/location\.pathname/g, 'pathname');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

dirsToProcess.forEach(dir => {
  walkDir(path.join(__dirname, dir));
});
