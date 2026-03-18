const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../src/config');
const themePath = path.join(configDir, 'theme.ts');
const themeAltPath = path.join(configDir, 'theme-alt.ts');
const brandPath = path.join(configDir, 'brand.ts');
const brandAltPath = path.join(configDir, 'brand-alt.ts');

function swapFiles(file1, file2) {
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
        console.error(`Error: Cannot find files to swap in ${configDir}`);
        return;
    }

    // Read contents
    const content1 = fs.readFileSync(file1, 'utf8');
    const content2 = fs.readFileSync(file2, 'utf8');

    // Write back swapped contents
    fs.writeFileSync(file1, content2);
    fs.writeFileSync(file2, content1);

    // Also swap the export names inside the files so that TypeScript doesn't complain
    const newContent1 = fs.readFileSync(file1, 'utf8')
        .replace(/altThemeConfig/g, 'TEMP_THEME')
        .replace(/themeConfig/g, 'altThemeConfig')
        .replace(/TEMP_THEME/g, 'themeConfig')
        .replace(/altBrandConfig/g, 'TEMP_BRAND')
        .replace(/brandConfig/g, 'altBrandConfig')
        .replace(/TEMP_BRAND/g, 'brandConfig');

    const newContent2 = fs.readFileSync(file2, 'utf8')
        .replace(/themeConfig/g, 'TEMP_THEME')
        .replace(/altThemeConfig/g, 'themeConfig')
        .replace(/TEMP_THEME/g, 'altThemeConfig')
        .replace(/brandConfig/g, 'TEMP_BRAND')
        .replace(/altBrandConfig/g, 'brandConfig')
        .replace(/TEMP_BRAND/g, 'altBrandConfig');

    fs.writeFileSync(file1, newContent1);
    fs.writeFileSync(file2, newContent2);

    console.log(`SUCCESS: Swapped contents of ${path.basename(file1)} and ${path.basename(file2)}`);
}

console.log('Starting theme and brand swap...');
swapFiles(themePath, themeAltPath);
swapFiles(brandPath, brandAltPath);
console.log('Complete! Restart your development server (if running) to see the new active theme.');
