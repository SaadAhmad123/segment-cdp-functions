import prompt from 'prompt';
import fs from 'fs';
import path from 'path';

export default function init() {
    prompt.start();

    const schema = {
        properties: {
            sourceDir: {
                description: 'What is your source directory? <default:src>',
                default: 'src',
                message: 'Invalid directory path',
                required: true,
                conform: (value: string) => {
                    if (!fs.existsSync(value)) {
                        try {
                            fs.mkdirSync(value, { recursive: true });
                            console.log(`Directory did not exist, so I created it for you.`);
                            return true;
                        } catch (error) {
                            console.error(`Failed to create directory. Please check permissions and try again.`);
                            return false;
                        }
                    }
                    return true;
                }
            }
        }
    };

    prompt.get(schema, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Selected source directory: ${result.sourceDir}`);
    });
}
