const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'js');
const filesToBundle = ['main.js', 'accordion.js', 'animations.js'];

let bundledCode = '';

filesToBundle.forEach(file => {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    bundledCode += content + '\n\n';
});

fs.writeFileSync(path.join(srcDir, 'bundle.min.js'), bundledCode, 'utf8');
console.log('Successfully bundled js files.');
