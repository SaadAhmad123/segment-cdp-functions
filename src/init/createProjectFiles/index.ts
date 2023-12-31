import path from 'path';
import {
    checkOrCreateDir,
    readFileContentSync,
    writeOrAppendToFile,
    writeToFileIfNotExists,
} from '../../common';
import { ConfigType } from '../../common/types';
import sampleIndex from './sample.index';
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
                    moduleResolution: 'NodeNext',
                    declaration: false, // Generates corresponding '.d.ts' file
                    outDir: `./${config.directories.build}`,
                    strict: true, // Enables strict type checking
                    esModuleInterop: true, // Enables CommonJS/AMD/UMD module interop
                    skipLibCheck: true, // Skip type checking of all declaration files
                    forceConsistentCasingInFileNames: true,
                },
                include: [
                    `./${config.directories.source}/**/*.ts`,
                    `./${config.directories.source}/globals.d.ts`,
                ],
                exclude: [
                    'node_modules', // your existing exclude pattern
                    '**/*.spec.ts', // this line will exclude all .spec.ts files
                    `./${config.directories.source}/globals.ts`,
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
                name: 'my-segment-function',
                version: '1.0.0',
                description: config.description,
                main: `./${config.directories.source}/index.ts`,
                scripts: {
                    dev: `npx ts-node ./${config.directories.source}/index.ts`,
                    build: 'npx rollup --config && npx segment-cdp-functions build',
                    deploy: 'npx rollup --config && npx segment-cdp-functions deploy',
                    'add.setting': 'npx segment-cdp-functions add.setting',
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
        ['node_modules', config.directories.build, '.env'].join('\n'),
    );
}

export function dotEnv(config: ConfigType) {
    writeOrAppendToFile(
        path.join(process.cwd(), '.env'),
        ['SEGMENT_TOKEN=<SEGMENT_TOKEN__FUNCTION_ADMIN_PERMISSIONS>'].join('\n'),
    );
}

export function rollupConfig(config: ConfigType) {
    const content = `// rollup.config.js
var typescript = require('@rollup/plugin-typescript');
module.exports = {
  input: '${config.directories.source}/index.ts',
  output: {
    file: './${config.directories.build}/index.js',
    format: 'cjs'
  },
  plugins: [typescript()]
};`;
    writeToFileIfNotExists(path.join(process.cwd(), 'rollup.config.js'), content);
}

export function srcIndex(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/index.ts`),
        sampleIndex,
    );
}

export function srcSlack(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/slack.ts`),
        sampleSlack,
    );
}

export function srcGlobals(config: ConfigType) {
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/globals.d.ts`),
        sampleGlobalsTypes,
    );
    writeToFileIfNotExists(
        path.join(process.cwd(), `${config.directories.source}/globals.ts`),
        sampleGlobals,
    );
}

export function srcUtils(config: ConfigType) {
    const utilsPath = [process.cwd(), config.directories.source, 'utils'];
    checkOrCreateDir(path.join(...utilsPath));
    writeToFileIfNotExists(path.join(...[...utilsPath, 'index.ts']), '');
    writeToFileIfNotExists(
        path.join(...[...utilsPath, 'errors.ts']),
        `
export function retryError(message: string): Error {
    try {
        // @ts-ignore
        return new RetryError(message)
    }
    catch {
        return new Error(${'`[RetryError] ${ message }`'})
    }
}

export function eventNotSupportedError(message: string): Error {
    try {
        // @ts-ignore
        return new EventNotSupported(message)
    }
    catch {
        return new Error(${'`[EventNotSupported] ${ message }`'})
    }
}
    `,
    );
}

export function src(config: ConfigType) {
    srcIndex(config);
    srcSlack(config);
    //srcGlobals(config)
    srcUtils(config);
}
