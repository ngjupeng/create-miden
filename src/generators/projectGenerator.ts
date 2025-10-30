import * as fs from 'fs-extra';
import * as path from 'path';
import { UI } from '../utils/UI';
import { TemplateManager } from './templateManager';
import { GitManager } from './gitManager';
import { TemplateVersion } from '../shared/constants';

export interface ProjectOptions {
  typescript: boolean;
  tailwind: boolean;
  eslint: boolean;
  prettier: boolean;
  git: boolean;
}

export class ProjectGenerator {
  private templateManager: TemplateManager;
  private gitManager: GitManager;

  constructor() {
    this.templateManager = new TemplateManager();
    this.gitManager = new GitManager();
  }

  async createProject(
    projectName: string,
    version: TemplateVersion = TemplateVersion.STABLE
  ): Promise<void> {
    const projectPath = path.resolve(process.cwd(), projectName);

    try {
      if (await fs.pathExists(projectPath)) {
        throw new Error(`Directory ${projectName} already exists`);
      }

      UI.startSpinner('Creating project structure...');

      await fs.ensureDir(projectPath);

      await this.templateManager.generateProject(projectPath, version);

      UI.stopSpinner(true, 'Project structure created');

      UI.startSpinner('Initializing Git repository...');
      await this.gitManager.initializeRepository(projectPath);
      UI.stopSpinner(true, 'Git repository initialized');
    } catch (error) {
      UI.stopSpinner(false, 'Failed to create project');

      if (await fs.pathExists(projectPath)) {
        await fs.remove(projectPath);
      }

      throw error;
    }
  }
}
