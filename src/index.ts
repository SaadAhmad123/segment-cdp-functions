#!/usr/bin/env node

import { Command } from 'commander';
import init from './init';
import path from 'path';
import log from './common/log';
import { addSetting } from './addSetting';
import { build } from './build';
import { deploy } from './deploy';

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
  .command('add.setting')
  .description('Add a setting variable to the Segment Function')
  .action(() => {
    try {
      addSetting();
    } catch (error) {
      log.error('Failed add setting:', (error as Error).message);
    }
  });

program
  .command('build')
  .description('Build the project for Segment deployment')
  .action(() => {
    try {
      build();
    } catch (error) {
      log.error('Failed build:', (error as Error).message);
    }
  });

program
  .command('deploy')
  .description('Deploy the project for Segment deployment')
  .action(() => {
    try {
      deploy()
    } catch (error) {
      log.error('Failed deploy:', (error as Error).message);
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
