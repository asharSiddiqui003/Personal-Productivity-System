const fs = require('fs');
const content = fs.readFileSync('/Users/asharslaptop/Projects/Task Manager /frontend/task-manager/src/Next7D.jsx', 'utf8');
let open = 0;
let close = 0;
for (let char of content) {
    if (char === '{') open++;
    if (char === '}') close++;
}
console.log(`Open: ${open}, Close: ${close}`);
