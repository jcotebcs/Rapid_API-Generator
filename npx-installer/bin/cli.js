#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const fetch = require('node-fetch');
const { execSync } = require('child_process');

const EXTENSION_NAME = 'rapidapi-generator';
const GITHUB_REPO = 'jcotebcs/Rapid_API-Generator';

async function main() {
    console.log(chalk.blue.bold('\n🚀 RapidAPI Extension Installer\n'));
    
    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'installType',
                message: 'How would you like to install the RapidAPI extension?',
                choices: [
                    { name: '📦 Download and install latest VSIX', value: 'vsix' },
                    { name: '🛍️  Install from VS Code Marketplace', value: 'marketplace' },
                    { name: '⚡ Quick setup with project scaffolding', value: 'scaffold' },
                    { name: '❓ Show installation instructions only', value: 'instructions' }
                ]
            }
        ]);

        switch (answers.installType) {
            case 'vsix':
                await installFromVSIX();
                break;
            case 'marketplace':
                await installFromMarketplace();
                break;
            case 'scaffold':
                await scaffoldProject();
                break;
            case 'instructions':
                showInstructions();
                break;
        }

    } catch (error) {
        console.error(chalk.red('❌ Installation failed:'), error.message);
        process.exit(1);
    }
}

async function installFromVSIX() {
    const spinner = ora('Downloading latest VSIX file...').start();
    
    try {
        // Get latest release from GitHub
        const releaseResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        const release = await releaseResponse.json();
        
        if (!release.assets || release.assets.length === 0) {
            throw new Error('No VSIX file found in latest release');
        }

        const vsixAsset = release.assets.find(asset => asset.name.endsWith('.vsix'));
        if (!vsixAsset) {
            throw new Error('No VSIX file found in latest release');
        }

        spinner.text = `Downloading ${vsixAsset.name}...`;
        
        // Download VSIX file
        const vsixResponse = await fetch(vsixAsset.browser_download_url);
        const vsixBuffer = await vsixResponse.buffer();
        
        const tempPath = path.join(process.cwd(), vsixAsset.name);
        await fs.writeFile(tempPath, vsixBuffer);
        
        spinner.text = 'Installing extension...';
        
        // Install using VS Code CLI
        execSync(`code --install-extension "${tempPath}"`, { stdio: 'pipe' });
        
        // Clean up temp file
        await fs.remove(tempPath);
        
        spinner.succeed(chalk.green('✅ Extension installed successfully!'));
        
        console.log(chalk.yellow('\n📋 Next steps:'));
        console.log('1. Restart VS Code');
        console.log('2. Open Command Palette (Ctrl+Shift+P)');
        console.log('3. Run "RapidAPI: Setup Environment"');
        
    } catch (error) {
        spinner.fail('Failed to install from VSIX');
        throw error;
    }
}

async function installFromMarketplace() {
    const spinner = ora('Installing from VS Code Marketplace...').start();
    
    try {
        execSync(`code --install-extension ${EXTENSION_NAME}`, { stdio: 'pipe' });
        spinner.succeed(chalk.green('✅ Extension installed from marketplace!'));
        
        console.log(chalk.yellow('\n📋 Next steps:'));
        console.log('1. Restart VS Code');
        console.log('2. Open Command Palette (Ctrl+Shift+P)');
        console.log('3. Run "RapidAPI: Setup Environment"');
        
    } catch (error) {
        spinner.fail('Failed to install from marketplace');
        
        console.log(chalk.yellow('\n💡 Alternative installation methods:'));
        console.log('1. Open VS Code');
        console.log('2. Go to Extensions view (Ctrl+Shift+X)');
        console.log(`3. Search for "${EXTENSION_NAME}"`);
        console.log('4. Click Install');
        
        throw error;
    }
}

async function scaffoldProject() {
    console.log(chalk.cyan('\n🏗️  Project Scaffolding\n'));
    
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            default: 'my-rapidapi-project',
            validate: input => input.trim().length > 0 || 'Project name is required'
        },
        {
            type: 'input',
            name: 'projectDescription',
            message: 'Project description:',
            default: 'RapidAPI integration project'
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Choose your framework:',
            choices: [
                { name: 'Node.js + TypeScript', value: 'node-ts' },
                { name: 'Node.js + JavaScript', value: 'node-js' },
                { name: 'React + TypeScript', value: 'react-ts' },
                { name: 'Vue.js + TypeScript', value: 'vue-ts' },
                { name: 'Express.js API', value: 'express' }
            ]
        },
        {
            type: 'confirm',
            name: 'installDeps',
            message: 'Install dependencies automatically?',
            default: true
        }
    ]);

    const projectPath = path.join(process.cwd(), answers.projectName);
    
    if (await fs.pathExists(projectPath)) {
        const overwrite = await inquirer.prompt([{
            type: 'confirm',
            name: 'overwrite',
            message: `Directory ${answers.projectName} already exists. Overwrite?`,
            default: false
        }]);
        
        if (!overwrite.overwrite) {
            console.log(chalk.yellow('Installation cancelled.'));
            return;
        }
        
        await fs.remove(projectPath);
    }

    const spinner = ora('Creating project structure...').start();
    
    try {
        // Create project directory
        await fs.ensureDir(projectPath);
        
        // Generate project files based on framework
        await generateProjectFiles(projectPath, answers);
        
        if (answers.installDeps) {
            spinner.text = 'Installing dependencies...';
            execSync('npm install', { cwd: projectPath, stdio: 'pipe' });
        }
        
        // Try to install the VS Code extension
        try {
            spinner.text = 'Installing VS Code extension...';
            await installFromVSIX();
        } catch (error) {
            spinner.warn('Project created, but VS Code extension installation failed');
            console.log(chalk.yellow('You can install the extension manually later.'));
        }
        
        spinner.succeed(chalk.green(`✅ Project "${answers.projectName}" created successfully!`));
        
        console.log(chalk.yellow('\n📋 Next steps:'));
        console.log(`1. cd ${answers.projectName}`);
        console.log('2. code .');
        console.log('3. Open Command Palette (Ctrl+Shift+P)');
        console.log('4. Run "RapidAPI: Setup Environment"');
        
    } catch (error) {
        spinner.fail('Failed to create project');
        throw error;
    }
}

async function generateProjectFiles(projectPath, config) {
    const templates = {
        'package.json': generatePackageJson(config),
        '.env.example': generateEnvExample(),
        '.gitignore': generateGitignore(),
        'README.md': generateReadme(config),
        'src/index.ts': generateIndexFile(config),
        'src/api/types.ts': generateTypesFile(),
        'tsconfig.json': generateTsConfig()
    };

    for (const [filePath, content] of Object.entries(templates)) {
        const fullPath = path.join(projectPath, filePath);
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, content);
    }
}

function generatePackageJson(config) {
    return JSON.stringify({
        name: config.projectName,
        version: "1.0.0",
        description: config.projectDescription,
        main: "dist/index.js",
        scripts: {
            build: "tsc",
            start: "node dist/index.js",
            dev: "ts-node src/index.ts",
            test: "echo \\"Error: no test specified\\" && exit 1"
        },
        dependencies: {
            axios: "^1.6.0",
            dotenv: "^16.3.1"
        },
        devDependencies: {
            "@types/node": "^20.0.0",
            typescript: "^5.0.0",
            "ts-node": "^10.9.0"
        },
        keywords: ["rapidapi", "api", "integration"],
        author: "",
        license: "MIT"
    }, null, 2);
}

function generateEnvExample() {
    return `# RapidAPI Configuration
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=your_rapidapi_host_here

# Application Configuration
NODE_ENV=development
PORT=3000
`;
}

function generateGitignore() {
    return `node_modules/
dist/
.env
.env.local
.env.production
*.log
.DS_Store
Thumbs.db
coverage/
.nyc_output/
`;
}

function generateReadme(config) {
    return `# ${config.projectName}

${config.projectDescription}

## Setup

1. Copy \`.env.example\` to \`.env\` and fill in your RapidAPI credentials
2. Install dependencies: \`npm install\`
3. Build the project: \`npm run build\`
4. Start the application: \`npm start\`

## Development

- Run in development mode: \`npm run dev\`
- Use the RapidAPI VS Code extension for easier API integration

## RapidAPI Integration

This project is set up to work with the RapidAPI VS Code extension. Use the extension to:

- Generate API client code
- Test endpoints
- Manage environment variables
- Browse available APIs

## Documentation

- [RapidAPI Extension Documentation](https://github.com/jcotebcs/Rapid_API-Generator#readme)
- [RapidAPI Hub](https://rapidapi.com/)
`;
}

function generateIndexFile(config) {
    return `import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

async function main() {
    console.log('🚀 ${config.projectName} starting...');
    
    // Example RapidAPI call
    try {
        const response = await axios.get('https://api.example.com/test', {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API Response:', response.data);
    } catch (error) {
        console.error('API Error:', error.message);
    }
}

main().catch(console.error);
`;
}

function generateTypesFile() {
    return `// Generated types for RapidAPI integration

export interface RapidApiResponse<T = any> {
    success: boolean;
    data: T;
    error?: string;
}

export interface ApiHeaders {
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
    'Content-Type'?: string;
}

export interface ApiConfig {
    baseURL: string;
    timeout?: number;
    headers: ApiHeaders;
}

// Add your API-specific types here
`;
}

function generateTsConfig() {
    return JSON.stringify({
        compilerOptions: {
            target: "ES2020",
            module: "commonjs",
            lib: ["ES2020"],
            outDir: "./dist",
            rootDir: "./src",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            declaration: true,
            sourceMap: true
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist"]
    }, null, 2);
}

function showInstructions() {
    console.log(chalk.cyan('\n📖 Installation Instructions\n'));
    
    console.log(chalk.yellow('Method 1: VS Code Marketplace'));
    console.log('1. Open VS Code');
    console.log('2. Go to Extensions view (Ctrl+Shift+X)');
    console.log(`3. Search for "${EXTENSION_NAME}"`);
    console.log('4. Click Install\n');
    
    console.log(chalk.yellow('Method 2: Command Line'));
    console.log(`code --install-extension ${EXTENSION_NAME}\n`);
    
    console.log(chalk.yellow('Method 3: Download VSIX'));
    console.log(`1. Go to https://github.com/${GITHUB_REPO}/releases`);
    console.log('2. Download the latest .vsix file');
    console.log('3. Install using: code --install-extension downloaded-file.vsix\n');
    
    console.log(chalk.yellow('After installation:'));
    console.log('1. Restart VS Code');
    console.log('2. Open Command Palette (Ctrl+Shift+P)');
    console.log('3. Run "RapidAPI: Setup Environment"');
    console.log('4. Follow the setup wizard\n');
    
    console.log(chalk.green('🔗 Useful Links:'));
    console.log(`📚 Documentation: https://github.com/${GITHUB_REPO}#readme`);
    console.log('🌐 RapidAPI Hub: https://rapidapi.com/');
    console.log(`🐛 Report Issues: https://github.com/${GITHUB_REPO}/issues`);
}

// Run the CLI
main();