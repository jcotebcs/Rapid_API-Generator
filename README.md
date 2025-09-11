# RapidAPI Generator - VS Code Extension

🚀 **A comprehensive VS Code extension for seamless RapidAPI integration with CodeLLM/Copilot support.**

Generate TypeScript API clients, explore APIs, and accelerate your development workflow with automated code generation, live previews, and intelligent type inference.

![RapidAPI Generator](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visual-studio-code)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![RapidAPI](https://img.shields.io/badge/RapidAPI-Integration-orange)

## ✨ Features

### 🔥 Core Functionality
- **🎯 One-Click API Integration** - Generate complete API clients from RapidAPI URLs
- **🔄 OpenAPI Support** - Parse OpenAPI/Swagger specifications automatically
- **📝 TypeScript Generation** - Auto-generate typed interfaces and client code
- **👀 Live Preview Panel** - Interactive code preview with copy/insert capabilities
- **🌲 API Explorer** - Browse and discover APIs directly in VS Code
- **⚡ Environment Setup** - Automated `.env` and `.gitignore` management

### 🛠 Advanced Features
- **📋 Multiple Language Support** - Generate code in JavaScript, TypeScript, Python, and cURL
- **🔍 Intelligent Code Completion** - Enhanced IntelliSense for API endpoints
- **📊 Request/Response Preview** - See expected data structures before implementation
- **🔐 Secure Key Management** - Safe handling of API credentials
- **🎨 Custom Templates** - Extensible code generation templates
- **📱 Responsive UI** - Clean, VS Code-native interface

## 🚀 Quick Start

### Installation

#### Method 1: VS Code Marketplace (Recommended)
```bash
# Install from command line
code --install-extension rapidapi-generator

# Or search "RapidAPI Generator" in VS Code Extensions
```

#### Method 2: NPX Quick Install
```bash
# One-command setup with project scaffolding
npx create-rapidapi-extension

# Follow the interactive setup wizard
```

#### Method 3: Manual Installation
1. Download the latest `.vsix` from [releases](https://github.com/jcotebcs/Rapid_API-Generator/releases)
2. Install: `code --install-extension rapidapi-generator-x.x.x.vsix`

### Initial Setup

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Run**: `RapidAPI: Setup Environment`
3. **Follow the setup wizard** - Configure API keys and preferences
4. **Start generating!** 🎉

## 📖 Usage Guide

### 🎯 Generate API Client from RapidAPI

1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Select**: `RapidAPI: Generate Endpoint`
3. **Enter RapidAPI URL**: e.g., `https://rapidapi.com/weatherapi/api/weatherapi-com/`
4. **Watch the magic happen** ✨

The extension will:
- ✅ Parse the OpenAPI specification
- ✅ Generate TypeScript interfaces
- ✅ Create a complete API client
- ✅ Set up environment variables
- ✅ Add IntelliSense support

### 🔍 Using the API Explorer

1. **Open VS Code Explorer panel**
2. **Find "RapidAPI Explorer"** section
3. **Browse categories**:
   - 📁 Generated APIs (your created clients)
   - 🌐 RapidAPI Hub (discover new APIs)
   - 🕒 Recent (recently used APIs)

### 🖥 Live Preview Panel

1. **Open Command Palette** (`Ctrl+Shift+P`)
2. **Select**: `RapidAPI: Open Preview`
3. **Use the interactive interface**:
   - 🎛 Configure API parameters
   - 👀 Preview generated code
   - 📋 Copy or insert code directly
   - 💾 Save to files

## 🔧 Configuration

### Extension Settings

Configure the extension via VS Code settings:

```json
{
  "rapidapi.apiKey": "your-rapidapi-key",
  "rapidapi.outputDirectory": "./src/api",
  "rapidapi.autoGenerateTypes": true,
  "rapidapi.debug": false
}
```

### Environment Variables

Create a `.env` file in your project root:

```env
# RapidAPI Configuration
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=your_rapidapi_host_here

# Extension Configuration
RAPIDAPI_OUTPUT_DIR=./src/api
RAPIDAPI_AUTO_GENERATE_TYPES=true
RAPIDAPI_DEBUG=false
```

## 📁 Generated Code Structure

The extension creates a clean, organized structure:

```
src/
└── api/
    ├── index.ts              # Main exports
    ├── types.ts              # Generated TypeScript types
    ├── weatherApiClient.ts   # Example generated client
    └── newsApiClient.ts      # Another example client
```

### Example Generated Client

```typescript
// weatherApiClient.ts
import { RapidApiClient } from '../rapidapiClient';

export class WeatherApiClient {
    private client: RapidApiClient;

    constructor() {
        this.client = new RapidApiClient();
    }

    async getCurrentWeather(q: string, days?: number): Promise<WeatherResponse> {
        const options = {
            method: 'GET',
            url: '/v1/current.json',
            params: { q, days },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        return this.client.request(options);
    }
}
```

## 🤖 CodeLLM/Copilot Integration

The extension is optimized for AI-powered development:

### 🧠 Enhanced IntelliSense
- **Smart completions** for API endpoints
- **Type-aware suggestions** based on OpenAPI schemas
- **Auto-import** for generated types and clients

### 🎯 AI-Friendly Code Generation
- **Clean, readable code** that AI tools understand
- **Comprehensive JSDoc comments** for better AI context
- **Consistent patterns** that improve AI suggestions

### 💡 Usage with GitHub Copilot

1. **Generate API client** using this extension
2. **Start typing** API-related code
3. **Copilot will suggest** completions based on your generated types
4. **Accept suggestions** with `Tab` for lightning-fast development

Example AI-enhanced workflow:
```typescript
// Type this comment:
// Get weather for New York

// Copilot will suggest:
const weather = await weatherApi.getCurrentWeather('New York');
console.log(`Current temperature: ${weather.current.temp_c}°C`);
```

## 🛠 Development

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/jcotebcs/Rapid_API-Generator.git
cd Rapid_API-Generator

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in development mode
# Press F5 in VS Code to start debugging
```

### Building the Extension

```bash
# Compile and package
npm run compile
npm run package

# This creates rapidapi-generator-x.x.x.vsix
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📚 API Reference

### Commands

| Command | Description |
|---------|-------------|
| `rapidapi.generateEndpoint` | Generate API client from URL |
| `rapidapi.setupEnvironment` | Set up project environment |
| `rapidapi.openPreview` | Open live preview panel |
| `rapidapi.refreshApiExplorer` | Refresh API explorer |
| `rapidapi.insertApiCall` | Insert API call at cursor |
| `rapidapi.copyApiCall` | Copy API call to clipboard |

### Configuration Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `rapidapi.apiKey` | string | `""` | Your RapidAPI key |
| `rapidapi.autoGenerateTypes` | boolean | `true` | Auto-generate TypeScript types |
| `rapidapi.outputDirectory` | string | `"./src/api"` | Output directory for generated files |
| `rapidapi.debug` | boolean | `false` | Enable debug logging |

## 🔗 Examples & Templates

### Weather API Example

```typescript
import { WeatherApiClient } from './src/api/weatherApiClient';

const weatherApi = new WeatherApiClient();

// Get current weather
const weather = await weatherApi.getCurrentWeather('London');
console.log(`Temperature: ${weather.current.temp_c}°C`);

// Get forecast
const forecast = await weatherApi.getForecast('London', 7);
forecast.forecast.forecastday.forEach(day => {
    console.log(`${day.date}: ${day.day.condition.text}`);
});
```

### News API Example

```typescript
import { NewsApiClient } from './src/api/newsApiClient';

const newsApi = new NewsApiClient();

// Get latest headlines
const headlines = await newsApi.getLatestHeadlines({
    country: 'us',
    category: 'technology'
});

headlines.articles.forEach(article => {
    console.log(`${article.title} - ${article.source.name}`);
});
```

## 🚀 Deployment

### CI/CD Pipeline

The project includes automated CI/CD with GitHub Actions:

- ✅ **Automated testing** on Node.js 16, 18, 20
- ✅ **TypeScript compilation** validation
- ✅ **Extension packaging** for releases
- ✅ **Marketplace publishing** (with secrets configured)
- ✅ **NPX installer** distribution

### Publishing to Marketplace

1. **Configure secrets** in GitHub repository:
   - `VSCE_TOKEN` - VS Code Marketplace token
   - `NPM_TOKEN` - NPM publishing token

2. **Create a release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **GitHub Actions will**:
   - Build and test the extension
   - Package the VSIX file
   - Publish to VS Code Marketplace
   - Publish NPX installer to NPM

## 🤝 Support & Community

### Getting Help

- **📖 Documentation**: [Full documentation](https://github.com/jcotebcs/Rapid_API-Generator#readme)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/jcotebcs/Rapid_API-Generator/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/jcotebcs/Rapid_API-Generator/discussions)
- **📺 Video Tutorials**: Coming soon!

### Resources

- **🌐 RapidAPI Hub**: [Browse APIs](https://rapidapi.com/)
- **📘 VS Code API**: [Extension Development Guide](https://code.visualstudio.com/api)
- **📗 TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **RapidAPI** for providing an amazing API marketplace
- **VS Code team** for the excellent extension APIs
- **TypeScript team** for making JavaScript development a joy
- **All contributors** who help make this project better

---

**Made with ❤️ by the RapidAPI community**

**⭐ Star this repository if you find it helpful!**