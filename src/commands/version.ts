import { Command } from 'commander';
import chalk from 'chalk';

export class VersionCommand extends Command {
  constructor() {
    super('version');
    this.description('Show version information').action(
      this.execute.bind(this)
    );
  }

  execute() {
    const packageJson = require('../../package.json');

    console.log(chalk.cyan.bold('create-miden'));
    console.log(chalk.gray(`Version: ${packageJson.version}`));
    console.log(chalk.gray(`Node: ${process.version}`));
    console.log(chalk.gray(`Platform: ${process.platform} ${process.arch}`));
  }
}
