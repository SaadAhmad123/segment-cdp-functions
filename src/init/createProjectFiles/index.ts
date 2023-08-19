import path from 'path';
import { readFileContentSync, writeOrAppendToFile, writeToFileIfNotExists } from '../../common';
import { ConfigType } from '../../common/types'

export function babelRc() {
    writeToFileIfNotExists(
        path.join(process.cwd(), '.babelrc'),
        JSON.stringify(
            {
                presets: ['@babel/preset-env', '@babel/preset-typescript'],
                plugins: ['@babel/plugin-transform-modules-commonjs'],
            },
            null,
            2,
        ),
    );
}

export function tsConfig(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), 'tsconfig.json'),
        JSON.stringify(
            {
                compilerOptions: {
                    target: 'ES6', // Target ECMAScript version
                    module: 'commonjs', // Module system
                    declaration: true, // Generates corresponding '.d.ts' file
                    outDir: `./${config.directories.transpiled}`,
                    strict: true, // Enables strict type checking
                    esModuleInterop: true, // Enables CommonJS/AMD/UMD module interop
                    skipLibCheck: true, // Skip type checking of all declaration files
                    forceConsistentCasingInFileNames: true,
                    resolveJsonModule: true,
                },
                include: [`./${config.directories.source}/**/*.ts`],
                exclude: [
                    'node_modules', // your existing exclude pattern
                    '**/*.spec.ts', // this line will exclude all .spec.ts files
                    `./${config.directories.source}/globals.ts`
                ],
            },
            null,
            2,
        ),
    );
}

export function packageJson(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), 'package.json'),
        JSON.stringify(
            {
                name: config.name,
                version: '1.0.0',
                description: config.description,
                main: `./${config.directories.build}/index.ts`,
                scripts: {
                    compile:
                        config.transpiler === 'TypeScript'
                            ? `npx tsc && npx babel ./${config.directories.transpiled} --out-dir ./${config.directories.build}`
                            : `npx babel ./${config.directories.source} --out-dir ./${config.directories.build}`,
                    dev: `npx ts-node ./${config.directories.source}/index.ts`,
                    rollup: 'npm run compile && npx rollup --config',
                },
                keywords: [],
                author: 'segment-cdp-developer',
                license: 'MIT',
                devDependencies: {},
            },
            null,
            2,
        ),
    );
}

export function gitIgnore(config: ConfigType) {
    writeOrAppendToFile(
        path.join(process.cwd(), '.gitignore'),
        [
            'node_modules',
            config.directories.build,
            config.directories.transpiled,
            config.directories.bundle,
        ].join('\n'),
    );
}

export function rollupConfig(config: ConfigType) {
    const content = `var commonjs = require('@rollup/plugin-commonjs');
module.exports = {
  input: './${config.directories.build}/index.js',
  output: {
    file: './${config.directories.bundle}/index.js',
    format: 'cjs',
    sourcemap: false // optional if you want source maps
  },
  plugins: [commonjs()]
};`;
    writeToFileIfNotExists(
        path.join(process.cwd(), 'rollup.config.js'),
        content
    );
}

export function srcIndex(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/index.ts`),
        readFileContentSync("./sample.index.ts.txt")
    )
}

export function srcSlack(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/slack.ts`),
        readFileContentSync("./sample.slack.ts.txt")
    )
}

export function srcGlobals(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/globals.d.ts`),
        readFileContentSync("./sample.globals.d.ts.txt")
    )
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/globals.ts`),
        readFileContentSync("./sample.globals.ts.txt")
    )
}

export function src(config: ConfigType) {
    srcIndex(config)
    srcSlack(config)
    srcGlobals(config)
}