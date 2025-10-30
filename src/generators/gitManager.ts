import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

const execAsync = promisify(exec);

export class GitManager {
  async initializeRepository(projectPath: string): Promise<void> {
    try {
      process.chdir(projectPath);

      await this.runCommand('git init');

      await this.runCommand('git add .');
      await this.runCommand(
        'git commit -m "Initial commit: Miden project setup"'
      );
    } catch (error) {
      throw new Error(
        `Failed to initialize Git repository: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async runCommand(command: string): Promise<void> {
    try {
      const { stdout, stderr } = await execAsync(command);
      if (stderr && !stderr.includes('warning')) {
        console.warn(stderr);
      }
    } catch (error) {
      throw new Error(
        `Git command failed: ${command}\n${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
