# create-miden

A CLI tool to quickly spin up Miden projects with Next.js, Miden WebClient and Miden Wallet Adapter

## Highlight

- No need manual setup from scratch
- Prepared with common functionalities

## Prerequisites

Before using `create-miden`, make sure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **pnpm** (recommended package manager)

### Installing Prerequisites

```bash
# Install Node.js (if not already installed)
# Visit https://nodejs.org/ and download the LTS version

# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version  # Should be 16.0.0 or higher
pnpm --version  # Should show pnpm version
```

## 🚀 Quick Start

```bash
npx create-miden
```

## Project Structure

After creating a project, you'll get:

```
my-app/
├── src/
│   ├── app/                 # Next.js app directory (if using Next.js)
│   ├── components/          # React components
│   └── ...
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Publishing

```bash
npm run build

npm publish
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.
