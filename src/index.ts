#!/usr/bin/env node

import { Command } from 'commander';
import init from './init';
import path from 'path';
import log from './common/log';


let packageInfo: Record<string, any>;
try {
  packageInfo = require(path.join(__dirname, '../package.json'));
} catch (error) {
  log.error('Failed to load package.json:', (error as Error).message);
  process.exit(1);
}

const program = new Command();
program.version(packageInfo.version).description(packageInfo.description);

program
  .command('init')
  .description('Initialise the Segment CDP Functions framework')
  .action(() => {
    try {
      init();
    } catch (error) {
      log.error('Failed to initialize:', (error as Error).message);
    }
  });

program
  .command('help')
  .description('Display help information')
  .action(() => program.help());

try {
  program.parse(process.argv);
} catch (error) {
  log.error('Error parsing commands:', (error as Error).message);
  program.outputHelp();
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
