const fs = require('fs');
const files = [
  'src/pages/superadmin/StudentList.tsx',
  'src/pages/superadmin/Groups.tsx',
  'src/pages/superadmin/Dashboard.tsx',
  'src/pages/superadmin/Students.tsx',
  'src/pages/superadmin/Reports.tsx',
  'src/components/ui/StudentTable.tsx',
  'src/components/ui/GlobalSearch.tsx',
  'src/pages/admin/Dashboard.tsx',
  'src/pages/commandant/Students.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\.totalScore/g, '.scores.finalScore');
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
