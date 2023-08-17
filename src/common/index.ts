import fs from 'fs';

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
