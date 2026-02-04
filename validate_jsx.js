import parser from '@babel/parser';
import fs from 'fs';

const code = fs.readFileSync('src/App.jsx', 'utf8');

try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('JSX is valid');
} catch (e) {
  console.error('Error at ' + e.loc.line + ':' + e.loc.column);
  console.error(e.message);
}
