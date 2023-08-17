import prompt from 'prompt';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { writeOrAppendToFile, writeToFileIfNotExists } from '../common';

export default function init() {
  prompt.start();

  const schema = {
    properties: {
      projectType: {
        description:
          'Do you want to use JavaScript or TypeScript? <default: TypeScript>',
        default: 'TypeScript',
        pattern: /JavaScript|TypeScript/,
        message: 'Invalid option. Choose between JavaScript or TypeScript',
        required: true,
      },
      sourceDir: {
        description: 'Where will the code reside? <default: src>',
        default: 'src',
        message: 'Invalid directory path',
        required: true,
        conform: checkOrCreateDir,
      },
      functionName: {
        description:
          'What is the name of your function? <default: my-segment-destination-function>',
        default: 'my-segment-destination-function',
        required: true,
      },
      functionType: {
        description:
          'What is the type of your segment function (only Destination available at the moment)? <default: Destination>',
        pattern: /Destination/,
        message:
          'Invalid option. Only Destination option available at the moment',
        default: 'Destination',
        required: true,
      },
      settingsFile: {
        description:
          'Name of the settings file (this defines the setting/ config of the the segment function)? <default: segment.config.json>',
        default: 'segment.config.json',
        required: true,
      },
      transpiledCodeDir: {
        description: 'Where will the transpiled code reside? <default: .dist>',
        default: '.dist',
        message: 'Invalid directory path',
        required: true,
        conform: checkOrCreateDir,
      },
      buildDir: {
        description: 'Where will the final build reside? <default: .build>',
        default: '.build',
        message: 'Invalid directory path',
        required: true,
        conform: checkOrCreateDir,
      },
      bundleDir: {
        description: 'Where will the final bundle reside? <default: .bundle>',
        default: '.bundle',
        message: 'Invalid directory path',
        required: true,
        conform: checkOrCreateDir,
      },
    },
  };

  prompt.get(schema, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    const config = {
      name: result.functionName,
      description: 'A custom segment function',
      type: result.functionType,
      transpiler: result.projectType,
      directories: {
        source: result.sourceDir,
        transpiled: result.transpiledCodeDir,
        build: result.buildDir,
        bundle: result.bundleDir,
      },
      segment: {
        settings: [],
      },
    };

    writeToFileIfNotExists(
      path.join(process.cwd(), result.settingsFile as string),
      JSON.stringify(config, null, 2),
    );

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

    writeToFileIfNotExists(
      path.join(process.cwd(), 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES5', // Target ECMAScript version
            module: 'commonjs', // Module system
            declaration: true, // Generates corresponding '.d.ts' file
            outDir: `./${result.transpiledCodeDir}`,
            strict: true, // Enables strict type checking
            esModuleInterop: true, // Enables CommonJS/AMD/UMD module interop
            skipLibCheck: true, // Skip type checking of all declaration files
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
          },
          include: [`./${result.sourceDir}/**/*.ts`],
          exclude: [
            'node_modules', // your existing exclude pattern
            '**/*.spec.ts', // this line will exclude all .spec.ts files
          ],
        },
        null,
        2,
      ),
    );

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

    // For .gitignore
    writeOrAppendToFile(
      path.join(process.cwd(), '.gitignore'),
      `${config.directories.build}\n${config.directories.transpiled}\nnode_modules`,
    );

    writeToFileIfNotExists(
      path.join(process.cwd(), 'rollup.config.js'),
      `var commonjs = require('@rollup/plugin-commonjs');

export default {
  input: './${config.directories.build}/index.js',
  output: {
    file: './${config.directories.bundle}/index.js',
    format: 'cjs',
    sourcemap: true // optional if you want source maps
  },
  plugins: [commonjs()]
};`,
    );

    console.log('Configuration saved successfully!');

    try {
      if (result.projectType === 'TypeScript') {
        execSync(
          'npm install typescript ts-node segment-cdp-functions --save-dev',
          {
            stdio: 'inherit',
          },
        );
      }
      execSync(
        'npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-typescript @babel/plugin-transform-modules-commonjs @rollup/plugin-commonjs rollup',
        { stdio: 'inherit' },
      );
      execSync('git init', {
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('Failed to install packages:', (error as Error).message);
      return;
    }

    console.log('Project initialised successfully!');
  });
}

function checkOrCreateDir(value: string) {
  if (!fs.existsSync(value)) {
    try {
      fs.mkdirSync(value, { recursive: true });
      console.log(`Directory did not exist, so I created it for you.`);
      return true;
    } catch (error) {
      console.error(
        `Failed to create directory. Please check permissions and try again.`,
      );
      return false;
    }
  }
  return true;
}
