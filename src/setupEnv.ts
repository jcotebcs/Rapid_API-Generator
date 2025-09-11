import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface EnvironmentConfig {
    rapidApiKey?: string;
    rapidApiHost?: string;
    outputDirectory?: string;
    autoGenerateTypes?: boolean;
    debug?: boolean;
}

export async function setupEnvironment(): Promise<void> {
    const workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) {
        throw new Error('No workspace is open. Please open a folder first.');
    }

    try {
        // Create .env file
        await createEnvFile(workspaceRoot);
        
        // Create or update .gitignore
        await updateGitignore(workspaceRoot);
        
        // Create output directory
        await createOutputDirectory(workspaceRoot);
        
        // Update VS Code settings
        await updateVSCodeSettings();
        
        vscode.window.showInformationMessage('Environment setup completed successfully!');
    } catch (error) {
        throw new Error(`Environment setup failed: ${error}`);
    }
}

async function createEnvFile(workspaceRoot: string): Promise<void> {
    const envPath = path.join(workspaceRoot, '.env');
    const envExamplePath = path.join(workspaceRoot, '.env.example');
    
    // Check if .env already exists
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
        const overwrite = await vscode.window.showQuickPick(
            ['Yes', 'No', 'View Current'],
            {
                placeHolder: '.env file already exists. What would you like to do?',
                canPickMany: false
            }
        );
        
        if (overwrite === 'No') {
            return;
        } else if (overwrite === 'View Current') {
            const document = await vscode.workspace.openTextDocument(envPath);
            await vscode.window.showTextDocument(document);
            return;
        }
    }

    // Get RapidAPI key from user
    const rapidApiKey = await vscode.window.showInputBox({
        prompt: 'Enter your RapidAPI key (you can leave this empty and fill it later)',
        placeHolder: 'Your RapidAPI key',
        password: true,
        ignoreFocusOut: true
    });

    // Get RapidAPI host
    const rapidApiHost = await vscode.window.showInputBox({
        prompt: 'Enter the RapidAPI host (optional)',
        placeHolder: 'e.g., api.example.com',
        ignoreFocusOut: true
    });

    const envContent = generateEnvContent({
        rapidApiKey: rapidApiKey || '',
        rapidApiHost: rapidApiHost || '',
        outputDirectory: './src/api',
        autoGenerateTypes: true,
        debug: false
    });

    // Write .env file
    await fs.promises.writeFile(envPath, envContent);
    
    // Create .env.example file (without actual keys)
    const envExampleContent = generateEnvContent({
        rapidApiKey: 'your_rapidapi_key_here',
        rapidApiHost: 'your_rapidapi_host_here',
        outputDirectory: './src/api',
        autoGenerateTypes: true,
        debug: false
    });
    
    await fs.promises.writeFile(envExamplePath, envExampleContent);
    
    console.log(`Created .env file at ${envPath}`);
    console.log(`Created .env.example file at ${envExamplePath}`);
}

function generateEnvContent(config: EnvironmentConfig): string {
    return `# RapidAPI Configuration
# Get your API key from https://rapidapi.com/developer/dashboard
RAPIDAPI_KEY=${config.rapidApiKey || ''}
RAPIDAPI_HOST=${config.rapidApiHost || ''}

# Extension Configuration
RAPIDAPI_OUTPUT_DIR=${config.outputDirectory || './src/api'}
RAPIDAPI_AUTO_GENERATE_TYPES=${config.autoGenerateTypes ? 'true' : 'false'}
RAPIDAPI_DEBUG=${config.debug ? 'true' : 'false'}

# Additional environment variables
NODE_ENV=development
`;
}

async function updateGitignore(workspaceRoot: string): Promise<void> {
    const gitignorePath = path.join(workspaceRoot, '.gitignore');
    
    const requiredEntries = [
        '# Environment variables',
        '.env',
        '.env.local',
        '.env.production',
        '.env.staging',
        '',
        '# RapidAPI Generator',
        'node_modules/',
        'out/',
        'dist/',
        '*.vsix',
        '.vscode-test/',
        '',
        '# Logs',
        'logs/',
        '*.log',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        '',
        '# Runtime data',
        'pids/',
        '*.pid',
        '*.seed',
        '*.pid.lock',
        '',
        '# Coverage directory used by tools like istanbul',
        'coverage/',
        '.nyc_output/',
        '',
        '# Dependency directories',
        'node_modules/',
        'jspm_packages/',
        '',
        '# Optional npm cache directory',
        '.npm',
        '',
        '# Optional REPL history',
        '.node_repl_history',
        '',
        '# Output of \'npm pack\'',
        '*.tgz',
        '',
        '# Yarn Integrity file',
        '.yarn-integrity',
        '',
        '# dotenv environment variables file',
        '.env',
        '.env.test',
        '',
        '# parcel-bundler cache (https://parceljs.org/)',
        '.cache',
        '.parcel-cache',
        '',
        '# next.js build output',
        '.next',
        '',
        '# nuxt.js build output',
        '.nuxt',
        '',
        '# vuepress build output',
        '.vuepress/dist',
        '',
        '# Serverless directories',
        '.serverless',
        '',
        '# FuseBox cache',
        '.fusebox/',
        '',
        '# DynamoDB Local files',
        '.dynamodb/',
        '',
        '# OS generated files',
        '.DS_Store',
        '.DS_Store?',
        '._*',
        '.Spotlight-V100',
        '.Trashes',
        'ehthumbs.db',
        'Thumbs.db'
    ];

    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf8');
    }

    // Check which entries are missing
    const missingEntries = requiredEntries.filter(entry => {
        if (entry === '' || entry.startsWith('#')) {
            return false; // Skip empty lines and comments for this check
        }
        return !gitignoreContent.includes(entry);
    });

    if (missingEntries.length > 0) {
        if (gitignoreContent && !gitignoreContent.endsWith('\n')) {
            gitignoreContent += '\n';
        }
        
        gitignoreContent += '\n# Added by RapidAPI Generator\n';
        gitignoreContent += missingEntries.join('\n');
        gitignoreContent += '\n';
        
        await fs.promises.writeFile(gitignorePath, gitignoreContent);
        console.log(`Updated .gitignore file at ${gitignorePath}`);
    }
}

async function createOutputDirectory(workspaceRoot: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('rapidapi');
    const outputDir = config.get('outputDirectory', './src/api');
    const fullOutputPath = path.join(workspaceRoot, outputDir);
    
    try {
        await fs.promises.mkdir(fullOutputPath, { recursive: true });
        
        // Create index.ts file in output directory
        const indexPath = path.join(fullOutputPath, 'index.ts');
        if (!fs.existsSync(indexPath)) {
            const indexContent = `// Generated API exports
// This file is automatically updated by RapidAPI Generator

export * from './types';
// Additional exports will be added here automatically
`;
            await fs.promises.writeFile(indexPath, indexContent);
        }
        
        // Create types.ts file
        const typesPath = path.join(fullOutputPath, 'types.ts');
        if (!fs.existsSync(typesPath)) {
            const typesContent = `// Generated TypeScript types
// This file contains interfaces generated from OpenAPI schemas

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

export interface RapidApiHeaders {
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
    'Content-Type'?: string;
}

// Additional types will be generated here automatically
`;
            await fs.promises.writeFile(typesPath, typesContent);
        }
        
        console.log(`Created output directory at ${fullOutputPath}`);
    } catch (error) {
        throw new Error(`Failed to create output directory: ${error}`);
    }
}

async function updateVSCodeSettings(): Promise<void> {
    const workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) return;

    const vscodeDir = path.join(workspaceRoot, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');
    
    // Ensure .vscode directory exists
    await fs.promises.mkdir(vscodeDir, { recursive: true });
    
    let settings: any = {};
    
    if (fs.existsSync(settingsPath)) {
        try {
            const settingsContent = await fs.promises.readFile(settingsPath, 'utf8');
            settings = JSON.parse(settingsContent);
        } catch (error) {
            console.warn('Could not parse existing settings.json, creating new one');
        }
    }

    // Add recommended settings for RapidAPI development
    const recommendedSettings = {
        'rapidapi.autoGenerateTypes': true,
        'rapidapi.outputDirectory': './src/api',
        'files.associations': {
            '*.env': 'dotenv',
            '*.env.*': 'dotenv'
        },
        'files.exclude': {
            'node_modules/': true,
            'out/': true,
            '**/*.vsix': true
        },
        'search.exclude': {
            'node_modules/': true,
            'out/': true
        }
    };

    // Merge settings
    Object.assign(settings, recommendedSettings);
    
    await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    console.log(`Updated VS Code settings at ${settingsPath}`);
}

export async function loadEnvironmentVariables(): Promise<EnvironmentConfig> {
    const workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) {
        return {};
    }

    const envPath = path.join(workspaceRoot, '.env');
    
    if (!fs.existsSync(envPath)) {
        return {};
    }

    try {
        const envContent = await fs.promises.readFile(envPath, 'utf8');
        const config: EnvironmentConfig = {};
        
        // Parse .env file
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
                
                switch (key.trim()) {
                    case 'RAPIDAPI_KEY':
                        config.rapidApiKey = value;
                        break;
                    case 'RAPIDAPI_HOST':
                        config.rapidApiHost = value;
                        break;
                    case 'RAPIDAPI_OUTPUT_DIR':
                        config.outputDirectory = value;
                        break;
                    case 'RAPIDAPI_AUTO_GENERATE_TYPES':
                        config.autoGenerateTypes = value.toLowerCase() === 'true';
                        break;
                    case 'RAPIDAPI_DEBUG':
                        config.debug = value.toLowerCase() === 'true';
                        break;
                }
            }
        });
        
        return config;
    } catch (error) {
        console.error('Error loading environment variables:', error);
        return {};
    }
}

export async function validateEnvironment(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    const workspaceRoot = vscode.workspace.rootPath;
    
    if (!workspaceRoot) {
        issues.push('No workspace is open');
        return { valid: false, issues };
    }

    // Check for .env file
    const envPath = path.join(workspaceRoot, '.env');
    if (!fs.existsSync(envPath)) {
        issues.push('.env file not found');
    }

    // Check for .gitignore
    const gitignorePath = path.join(workspaceRoot, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
        issues.push('.gitignore file not found');
    } else {
        const gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf8');
        if (!gitignoreContent.includes('.env')) {
            issues.push('.env not excluded in .gitignore');
        }
    }

    // Check output directory
    const config = vscode.workspace.getConfiguration('rapidapi');
    const outputDir = config.get('outputDirectory', './src/api');
    const fullOutputPath = path.join(workspaceRoot, outputDir);
    if (!fs.existsSync(fullOutputPath)) {
        issues.push(`Output directory ${outputDir} does not exist`);
    }

    // Load and validate environment variables
    const envConfig = await loadEnvironmentVariables();
    if (!envConfig.rapidApiKey) {
        issues.push('RAPIDAPI_KEY not configured');
    }

    return {
        valid: issues.length === 0,
        issues
    };
}

export async function repairEnvironment(): Promise<void> {
    const validation = await validateEnvironment();
    
    if (validation.valid) {
        vscode.window.showInformationMessage('Environment is already properly configured');
        return;
    }

    const repair = await vscode.window.showQuickPick(
        ['Yes', 'No'],
        {
            placeHolder: `Found ${validation.issues.length} issues. Repair automatically?`,
            canPickMany: false
        }
    );

    if (repair === 'Yes') {
        await setupEnvironment();
    }
}