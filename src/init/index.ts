import prompt from 'prompt';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function writeToFileIfNotExists(filePath: string, content: string) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
    }
}

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
                message: 'Invalid option. Only Destination option available at the moment',
                default: 'Destination',
                required: true,
            },
            settingsFile: {
                description:
                    'Name of the settings file (this defines the setting/ config of the the segment function)? <default: function.json>',
                default: 'function.json',
                required: true,
            },
            transpiledCodeDir: {
                description: 'Where will the transpiled code reside? <default: dist>',
                default: 'dist',
                message: 'Invalid directory path',
                required: true,
                conform: checkOrCreateDir,
            },
            buildDir: {
                description: 'Where will the final build reside? <default: build>',
                default: 'build',
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

        // Store the configuration to function.json
        const config = {
            name: result.functionName,
            type: result.functionType,
            transpiler: result.projectType,
            directories: {
                source: result.sourceDir,
                transpiled: result.transpiledCodeDir,
                build: result.buildDir,
            },
            segment: {
                settings: []
            }
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
                        target: 'ESNext',
                        module: 'ESNext',
                        strict: true,
                        esModuleInterop: true,
                        skipLibCheck: true,
                        forceConsistentCasingInFileNames: true,
                        isolatedModules: true,
                        outDir: `./${result.transpiledCodeDir}`,
                    },
                    include: [`./${result.sourceDir}/**/*.ts`],
                },
                null,
                2,
            ),
        );

        console.log('Configuration saved successfully!');

        try {
            if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
                execSync('npm init -y');
            }
        } catch (error) {
            console.error('Failed to init project:', (error as Error).message);
            return;
        }

        try {
            if (result.projectType === 'TypeScript') {
                execSync('npm install typescript ts-node --save-dev', { stdio: "inherit" });
            }
            execSync(
                'npm install --save-dev @babel/cli @babel/preset-env @babel/preset-typescript @babel/plugin-transform-modules-commonjs',
                { stdio: "inherit" }
            );
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
