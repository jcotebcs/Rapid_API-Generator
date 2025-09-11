#!/usr/bin/env node

const { create_or_update_file, demo } = require('./index.js');
const fs = require('fs');

function showHelp() {
    console.log(`
🚀 RapidAPI Generator - File Creation Tool

Usage:
  rapid-api-gen [command] [options]

Commands:
  demo                    Run the interactive demo
  create <file> <content> Create or update a file with confirmation
  help                    Show this help message

Options:
  --force                 Skip confirmation prompt
  --content-file <path>   Read content from a file instead of command line

Examples:
  rapid-api-gen demo
  rapid-api-gen create api.js "console.log('Hello API');"
  rapid-api-gen create api.js --content-file template.js
  rapid-api-gen create api.js "console.log('test');" --force

The tool will always ask "Are you sure you wish to execute the 'create_or_update_file' tool?"
before performing any file operations (unless --force is used).
`);
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
        showHelp();
        return;
    }

    const command = args[0];

    if (command === 'demo') {
        await demo();
        return;
    }

    if (command === 'create') {
        if (args.length < 3) {
            console.error('❌ Error: create command requires a file path and content');
            console.log('Usage: rapid-api-gen create <file> <content>');
            console.log('   or: rapid-api-gen create <file> --content-file <path>');
            process.exit(1);
        }

        const filePath = args[1];
        const force = args.includes('--force');
        let content;

        const contentFileIndex = args.indexOf('--content-file');
        if (contentFileIndex !== -1 && contentFileIndex + 1 < args.length) {
            const contentFile = args[contentFileIndex + 1];
            if (!fs.existsSync(contentFile)) {
                console.error(`❌ Error: Content file not found: ${contentFile}`);
                process.exit(1);
            }
            content = fs.readFileSync(contentFile, 'utf8');
        } else {
            content = args[2] || '';
        }

        const success = await create_or_update_file(filePath, content, force);
        process.exit(success ? 0 : 1);
    }

    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "rapid-api-gen help" for usage information.');
    process.exit(1);
}

main().catch((error) => {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
});