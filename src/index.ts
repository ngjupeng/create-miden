#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { CreateCommand } from './commands/create';
import { VersionCommand } from './commands/version';
import { HelpCommand } from './commands/help';

const program = new Command();

const banner = figlet.textSync('create-miden', {
  font: 'Small',
  horizontalLayout: 'fitted',
  verticalLayout: 'default',
});

console.log(
  boxen(
    gradient.rainbow.multiline(banner) +
      '\n' +
      chalk.white.bold('Create Miden projects with ease!') +
      '\n' +
      chalk.gray('A CLI tool for spinning up Miden + Next.js projects'),
    {
      padding: 1,
      margin: { top: 0, bottom: 0, left: 1, right: 1 },
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a',
    }
  )
);

if (!process.argv.slice(2).length) {
  const { CreateCommand } = require('./commands/create');
  const createCommand = new CreateCommand();
  createCommand.execute();
} else {
  // Parse commands normally
  program
    .name('create-miden')
    .description('A CLI tool to quickly spin up Miden projects with Next.js')
    .version('1.0.0', '-v, --version', 'display version number')
    .addCommand(new CreateCommand())
    .addCommand(new VersionCommand())
    .addCommand(new HelpCommand())
    .parse();
}
