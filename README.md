# Rapid API Generator

A tool for generating RapidAPI integration code with confirmation prompts for file operations.

## Features

- **Safe File Operations**: Always asks for confirmation before creating or updating files
- **Interactive CLI**: Command-line interface for easy usage
- **Force Mode**: Skip confirmations when needed with `--force` flag
- **Directory Creation**: Automatically creates nested directories as needed
- **File Content Options**: Accept content directly or from files

## Installation

```bash
npm install
```

## Usage

### Interactive Confirmation

The tool will always display a confirmation prompt like this:

```
📝 File Operation Request:
   Action: CREATE
   Path: api.js
   New content size: 150 bytes

Are you sure you wish to execute the "create_or_update_file" tool? (y/N):
```

### CLI Commands

```bash
# Show help
node cli.js help

# Run interactive demo
node cli.js demo

# Create a new file (with confirmation)
node cli.js create api.js "console.log('Hello API');"

# Create file from template (with confirmation)  
node cli.js create api.js --content-file template.js

# Force create without confirmation
node cli.js create api.js "console.log('Hello API');" --force
```

### Programmatic Usage

```javascript
const { create_or_update_file } = require('./index.js');

// With confirmation prompt
await create_or_update_file('api.js', 'console.log("Hello");');

// Skip confirmation
await create_or_update_file('api.js', 'console.log("Hello");', true);
```

## API Reference

### `create_or_update_file(filePath, content, force = false)`

Creates or updates a file with user confirmation.

**Parameters:**
- `filePath` (string): Path to the file to create or update
- `content` (string): Content to write to the file  
- `force` (boolean): Skip confirmation if true

**Returns:** Promise<boolean> - True if file was created/updated, false if cancelled

### `askConfirmation(message)`

Shows a confirmation prompt to the user.

**Parameters:**
- `message` (string): The question to ask

**Returns:** Promise<boolean> - True if user confirms, false otherwise

## Examples

### Basic File Creation
```bash
node cli.js create hello.js "console.log('Hello World');"
```

### RapidAPI Integration Example
```bash
node cli.js create rapidapi-client.js --content-file examples/rapidapi-template.js
```

### Batch Operations with Force
```bash
node cli.js create config.json '{"apiKey": "your-key"}' --force
node cli.js create .env 'RAPIDAPI_KEY=your-key-here' --force
```

## Testing

Run the test suite:

```bash
npm test
```

## Safety Features

- **Confirmation Required**: By default, all file operations require user confirmation
- **File Info Display**: Shows file size, modification date for existing files
- **Directory Creation**: Safely creates parent directories when needed
- **Error Handling**: Graceful error handling with descriptive messages