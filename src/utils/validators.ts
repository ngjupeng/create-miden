import validateNpmPackageName from 'validate-npm-package-name';

export function validateProjectName(name: string): boolean {
  const result = validateNpmPackageName(name);
  return result.validForNewPackages;
}

export function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function validateTemplate(template: string): boolean {
  const validTemplates = ['nextjs-miden', 'reserve'];
  return validTemplates.includes(template);
}

export function validateDirectoryName(name: string): boolean {
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return false;
  }

  // Check for reserved names (Windows)
  const reservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ];

  if (reservedNames.includes(name.toUpperCase())) {
    return false;
  }

  return true;
}
