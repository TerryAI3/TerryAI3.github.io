const fs = require('fs');
const path = require('path');

const rootDir = '/root/.openclaw/workspace/website-maintenance';

console.log("--- [agent-geek] Website Code Audit Starting ---");

// 1. Check for hardcoded "undefined" in assets
const assetsDir = path.join(rootDir, 'assets');
if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');
            const undefinedCount = (content.match(/undefined\/app-auth/g) || []).length;
            if (undefinedCount > 0) {
                console.log(`[ISSUE] Found ${undefinedCount} instances of "undefined/app-auth" in ${file}`);
            } else {
                console.log(`[OK] No "undefined/app-auth" found in ${file}`);
            }
            
            // Check for void 0 which might be transpiled undefined
            const voidZeroCount = (content.match(/void 0/g) || []).length;
            console.log(`[INFO] Found ${voidZeroCount} instances of "void 0" in ${file} (standard minification)`);
        }
    });
}

// 2. Check HTML files for resource paths
const htmlFiles = ['index.html', 'about.html', 'contact.html', 'products.html'];
htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for 404-prone absolute paths that might not work on GitHub Pages subpaths
        // (Though zuodii.com is a root domain, it's good to check)
        const absoluteScripts = (content.match(/src="\/assets\//g) || []).length;
        console.log(`[INFO] Found ${absoluteScripts} absolute asset paths in ${file}`);
        
        // Check for broken image placeholders
        const imgTags = content.match(/<img [^>]*src="([^"]+)"/g) || [];
        imgTags.forEach(tag => {
            const src = tag.match(/src="([^"]+)"/)[1];
            if (src.includes('placeholder') || src.includes('via.placeholder')) {
                console.log(`[NOTICE] ${file} uses placeholder image: ${src}`);
            }
        });
    }
});

// 3. Performance Audit: Large Images
const imagesDir = path.join(rootDir, 'images');
function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            results.push({path: file, size: stat.size});
        }
    });
    return results;
}

if (fs.existsSync(imagesDir)) {
    const allImages = walkDir(imagesDir);
    const largeImages = allImages.filter(img => img.size > 500 * 1024); // > 500KB
    if (largeImages.length > 0) {
        console.log(`[PERF] Found ${largeImages.length} images larger than 500KB:`);
        largeImages.forEach(img => {
            console.log(`  - ${path.relative(rootDir, img.path)} (${(img.size/1024).toFixed(2)} KB)`);
        });
    } else {
        console.log("[OK] No images > 500KB found.");
    }
}

console.log("--- Audit Complete ---");
