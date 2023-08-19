import fs from 'fs';
import { execSync } from 'child_process';
import log from './log';

export function writeOrAppendToFile(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  } else {
    // Check if content already exists in the file before appending
    const currentContent = fs.readFileSync(filePath, 'utf-8');
    if (!currentContent.includes(content)) {
      fs.appendFileSync(filePath, '\n' + content);
    }
  }
}

export function writeToFileIfNotExists(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
}

export function checkOrCreateDir(value: string) {
  if (!fs.existsSync(value)) {
    try {
      fs.mkdirSync(value, { recursive: true });
      log.log(`Directory did not exist, so I created it for you.`);
      return true;
    } catch (error) {
      log.error(
        `Failed to create directory. Please check permissions and try again.`,
      );
      return false;
    }
  }
  return true;
}

export function runCliCommands(commands: string[]) {
  for (const command of commands) {
    execSync(command, { stdio: 'inherit' });
  }
}

export function readFileContentSync(path: string): string {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    return data;
  } catch (err) {
    throw new Error(`Failed to read file at ${path}: ${(err as Error).message}`);
  }
}