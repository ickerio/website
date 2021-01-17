const fs = require('fs');

const postcss = require('postcss');
const esbuild = require('esbuild');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

/* Makeshift task runner */

const options = {
    src: 'src/',
    dest: 'build/'
};

const source = fs.readdirSync(options.src);
let totalTime = 0;

const tasks = [
    { name: 'Build CSS', func: buildCSS },
    { name: 'Build JS', func: buildJs },
    { name: 'Move static files', func: moveStatic },
]

tasks.forEach(task => {
    process.stdout.write(`Task: ${task.name}`); 
    const time = Date.now();
    task.func();
    const timeTaken = Date.now() - time;
    process.stdout.write(` - ${timeTaken}ms\n`); 
    totalTime += timeTaken;
});

console.log(`${tasks.length} tasks completed in ${totalTime}ms`);

function buildCSS() {
    const pcss = postcss([autoprefixer, tailwindcss]);
    source.filter(el => /\.css$/.test(el))
        .forEach(style => {
            const src = `${options.src}${style}`;
            const dest = `${options.dest}${style}`;
            const data = fs.readFileSync(src);
            pcss.process(data, { from: src, to: dest })
                .then(result => fs.writeFile(dest, result.css, () => true));
        });
}
function buildJs() {
    esbuild.buildSync({
        entryPoints: source.filter(el => /\.js$/.test(el)).map(f => options.src + f),
        bundle: true,
        minify: true,
        outfile: `${options.dest}/index.js`,
    });
};

function moveStatic() {
    source.filter(el => /^(.(?!.*\.css$|.*\.js))*$/.test(el))
        .forEach(file => fs.copyFileSync(`${options.src}${file}`, `${options.dest}${file}`));
};