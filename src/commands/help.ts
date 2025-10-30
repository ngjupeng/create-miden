import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';

export class HelpCommand extends Command {
  constructor() {
    super('help');
    this.description('Show detailed help information').action(
      this.execute.bind(this)
    );
  }

  execute() {
    const helpText = `
${chalk.cyan.bold('create-miden')} - A CLI tool to quickly spin up Miden projects with Next.js

${chalk.yellow.bold('USAGE:')}
  npx create-miden

${chalk.yellow.bold('VERSIONS:')}
  ${chalk.green('stable')}          Stable version (Recommended)
  ${chalk.blue('next')}             Next version (Latest features)
`;

    console.log(
      boxen(helpText, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#1a1a1a',
      })
    );
  }
}
