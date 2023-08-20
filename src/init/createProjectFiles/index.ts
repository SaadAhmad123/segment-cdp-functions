import path from 'path';
import { readFileContentSync, writeOrAppendToFile, writeToFileIfNotExists } from '../../common';
import { ConfigType } from '../../common/types'
import sampleIndex from './sample.index'
import sampleGlobals from './sample.globals';
import sampleGlobalsTypes from './sample.globals.types';
import sampleSlack from './sample.slack';

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
                    target: 'ESNext', // Target ECMAScript version
                    module: 'ESNext', // Module system
                    declaration: true, // Generates corresponding '.d.ts' file
                    outDir: `./${config.directories.build}`,
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
                main: `./${config.directories.source}/index.ts`,
                scripts: {
                    dev: `npx ts-node ./${config.directories.source}/index.ts`,
                    build: 'npm run compile && npx rollup --config',
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
        ].join('\n'),
    );
}

export function rollupConfig(config: ConfigType) {
    const content = `// rollup.config.js
var typescript = require('@rollup/plugin-typescript');
module.exports = {
  input: '${config.directories.source}/index.ts',
  output: {
    dir: './${config.directories.build}',
    format: 'cjs'
  },
  plugins: [typescript()]
};`;
    writeToFileIfNotExists(
        path.join(process.cwd(), 'rollup.config.js'),
        content
    );
}

export function srcIndex(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/index.ts`),
        sampleIndex
    )
}

export function srcSlack(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/slack.ts`),
        sampleSlack
    )
}

export function srcGlobals(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/globals.d.ts`),
        sampleGlobalsTypes
    )
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/globals.ts`),
        sampleGlobals
    )
}

export function src(config: ConfigType) {
    srcIndex(config)
    srcSlack(config)
    srcGlobals(config)
}