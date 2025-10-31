import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ProjectGenerator } from '../generators/projectGenerator';
import { UI } from '../utils/UI';
import { validateProjectName } from '../utils/validators';
import { TemplateVersion } from '../shared/constants';

export class CreateCommand extends Command {
  constructor() {
    super('create');
    this.description('Create a new Miden project with Next.js')
      .argument('[project-name]', 'Name of the project')
      .option('-y, --yes', 'Skip prompts and use defaults')
      .action(this.execute.bind(this));
  }

  async execute(projectName?: string, options: any = {}) {
    try {
      const finalProjectName = await this.getProjectName(
        projectName,
        options.yes
      );

      if (!validateProjectName(finalProjectName)) {
        UI.showError(
          'Invalid project name. Please use a valid npm package name.'
        );
        process.exit(1);
      }

      const version = await this.getVersionChoice(options.yes);

      const generator = new ProjectGenerator();
      await generator.createProject(finalProjectName, version);

      UI.showSuccess(finalProjectName);
    } catch (error) {
      UI.showError(
        `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      process.exit(1);
    }
  }

  private async getProjectName(
    projectName?: string,
    skipPrompts = false
  ): Promise<string> {
    if (projectName && !skipPrompts) {
      return projectName;
    }

    if (skipPrompts && projectName) {
      return projectName;
    }

    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: chalk.cyan('What is your project name?'),
        default: 'my-miden-app',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          return (
            validateProjectName(input) ||
            'Invalid project name. Please use a valid npm package name.'
          );
        },
      },
    ]);

    return name;
  }

  private async getVersionChoice(
    skipPrompts = false
  ): Promise<TemplateVersion> {
    if (skipPrompts) {
      return TemplateVersion.STABLE;
    }

    const { version } = await inquirer.prompt([
      {
        type: 'list',
        name: 'version',
        message: chalk.cyan('Choose version:'),
        choices: [
          {
            name: 'Stable (Recommended)',
            value: 'stable',
            short: 'Stable',
          },
          // {
          //   name: 'Next (Latest features)',
          //   value: 'next',
          //   short: 'Next',
          // },
        ],
        default: 'stable',
      },
    ]);

    return version;
  }
}
