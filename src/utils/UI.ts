import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import boxen from 'boxen';

export class UI {
  private static spinner: Ora | null = null;

  static showInfo(message: string) {
    console.log(chalk.blue('ℹ'), message);
  }

  static showSuccess(projectName: string) {
    const successMessage = `
${chalk.green.bold('Project created successfully!')}

${chalk.cyan('Next steps:')}
  ${chalk.gray('1.')} ${chalk.yellow('cd')} ${chalk.yellow(projectName)}
  ${chalk.gray('2.')} ${chalk.yellow('pnpm install')}
  ${chalk.gray('3.')} ${chalk.yellow('pnpm run dev')}

${'Happy coding!'}
`;

    console.log(
      boxen(successMessage, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        backgroundColor: '#1a1a1a',
      })
    );
  }

  static showError(message: string) {
    console.log('\n');
    console.log(
      boxen(chalk.red.bold('❌ Error: ') + message, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'red',
        backgroundColor: '#1a1a1a',
      })
    );
  }

  static showWarning(message: string) {
    console.log(chalk.yellow('⚠️'), message);
  }

  static startSpinner(message: string) {
    this.spinner = ora({
      text: message,
      spinner: 'dots',
      color: 'cyan',
    }).start();
  }

  static updateSpinner(message: string) {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  static stopSpinner(success = true, message?: string) {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(message || 'Done!');
      } else {
        this.spinner.fail(message || 'Failed!');
      }
      this.spinner = null;
    }
  }

  static showProgress(current: number, total: number, message: string) {
    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);

    console.log(
      `\r${chalk.cyan('Progress:')} ${progressBar} ${percentage}% - ${message}`
    );
  }

  private static createProgressBar(percentage: number, length = 20): string {
    const filled = Math.round((percentage / 100) * length);
    const empty = length - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }
}
