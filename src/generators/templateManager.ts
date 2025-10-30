import * as fs from 'fs-extra';
import * as path from 'path';
import { TemplateVersion } from '../shared/constants';

export class TemplateManager {
  async generateProject(
    projectPath: string,
    version: TemplateVersion
  ): Promise<void> {
    let template: string;
    switch (version) {
      case TemplateVersion.STABLE:
        template = 'stable-nextjs-miden';
        break;
      case TemplateVersion.NEXT:
        template = 'latest-nextjs-miden';
        break;
      default:
        throw new Error(`Invalid template version: ${version}`);
    }

    const templatePath = path.join(
      __dirname,
      '../../templates',
      template.toLowerCase()
    );

    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template ${version} not found`);
    }
    await this.copyTemplateFiles(templatePath, projectPath);
  }

  private async copyTemplateFiles(
    templatePath: string,
    projectPath: string
  ): Promise<void> {
    const files = await fs.readdir(templatePath);

    for (const file of files) {
      const srcPath = path.join(templatePath, file);
      const destPath = path.join(projectPath, file);

      if ((await fs.stat(srcPath)).isDirectory()) {
        await fs.copy(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}
