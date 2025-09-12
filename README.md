# Rapid_API-Generator

A web-based tool for generating secure API client code instantly from any API endpoint. Features both a modern web interface and command-line examples for Python and Node.js.

## 🆕 NEW: Notion API Debugging Tools

**Having trouble with Notion API connections?** This repository now includes comprehensive debugging tools specifically designed to resolve Notion API key rejection and connection issues after implementing serverless backends.

### 🔧 Quick Debugging
```bash
# Install dependencies
npm install

# Run Notion API diagnostic
npm run debug:notion [database-id]

# Start Notion API backend proxy
npm run start:notion-backend

# Open notion_api_debugger_web.html for web interface
```

**[📖 Complete Notion API Debugging Guide](NOTION_API_GUIDE.md)**

---

## 🌐 Web Interface

Visit the **[Live Web Generator](https://jcotebcs.github.io/Rapid_API-Generator)** to instantly generate API client code:

### Features
- **🎯 Simple Form Interface**: Enter API URL, select HTTP method, customize headers
- **🔧 Multi-Language Support**: Generate both Python and Node.js client code
- **📋 Copy & Download**: Easily copy code to clipboard or download as files
- **🛡️ Security Best Practices**: Built-in environment variable management
- **✨ Modern UI**: Clean, responsive design with tabbed code output
- **🚀 Real-time Generation**: Instant code generation with live preview
- **🔍 NEW: Notion API Debugging**: Comprehensive tools for Notion API troubleshooting

### How to Use
1. Enter your API endpoint URL
2. Select HTTP method (GET, POST, PUT, DELETE, PATCH)
3. Customize API name and RapidAPI host (optional)
4. Add additional headers in JSON format (optional)
5. Click "Generate API Code"
6. Copy or download the generated Python/Node.js code
7. Use the provided .env template for secure API key management

## 🚀 Quick Start

### Prerequisites

- Python 3.7+ (for Python example)
- Node.js 14+ (for Node.js example)
- A RapidAPI account and API key (for RapidAPI examples)
- A Notion integration (for Notion API debugging)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jcotebcs/Rapid_API-Generator.git
   cd Rapid_API-Generator
   ```

2. **Create your environment file**
   ```bash
   cp .env.example .env
   # Or for Notion API:
   cp .env.example.notion .env
   ```

3. **Add your API keys to the `.env` file**
   ```env
   RAPIDAPI_KEY=your_actual_rapidapi_key_here
   NOTION_API_KEY=secret_your_notion_key_here
   ```

   ⚠️ **Important**: Never commit your `.env` file to version control! It's already added to `.gitignore` for your security.

## 🐍 Python Example

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run the Python Example
```bash
python rapidapi_example.py
```

The Python example uses:
- `requests` library for HTTP requests
- `python-dotenv` for loading environment variables from `.env` file

## 🟢 Node.js Examples

### Install Dependencies
```bash
npm install
```

### Run Examples
```bash
# Run RapidAPI example
npm start

# Run Notion API debugger
npm run debug:notion

# Start Notion API backend proxy
npm run start:notion-backend
```

The Node.js examples use:
- `axios` library for HTTP requests
- `dotenv` for loading environment variables from `.env` file
- `express` and `cors` for the backend proxy server

## 📁 Project Structure

```
Rapid_API-Generator/
├── .env.example              # Template for environment variables
├── .env.example.notion       # Notion-specific environment template
├── .gitignore               # Git ignore rules (includes .env)
├── requirements.txt         # Python dependencies
├── package.json             # Node.js dependencies
├── rapidapi_example.py      # Python example script
├── rapidapi_example.js      # Node.js example script
├── notion_api_debugger.js   # Notion API debugging CLI tool
├── notion_api_backend.js    # Notion API backend proxy server
├── notion_api_debugger_web.html # Web-based Notion API debugger
├── NOTION_API_GUIDE.md      # Comprehensive Notion API debugging guide
├── Dockerfile.node          # Docker configuration for Node.js
├── Dockerfile.python        # Docker configuration for Python
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline configuration
└── README.md               # This file
```

## 🔍 Notion API Debugging Features

### Comprehensive Diagnostic Tools
- **Environment Variable Validation**: Verify API keys are properly set
- **Database Access Testing**: Check permissions and database connectivity
- **Backend Proxy Server**: Solve CORS issues with secure proxy
- **Web Interface**: User-friendly debugging with guided troubleshooting
- **CLI Tools**: Command-line diagnostic capabilities

### Common Issues Addressed
- ✅ API key rejection after backend implementation
- ✅ CORS issues with client-side calls
- ✅ Database permission and sharing problems
- ✅ Environment variable configuration issues
- ✅ Integration authentication failures

## 🚀 Deployment

### Docker Deployment

Both examples can be containerized using Docker for consistent deployment across environments.

#### Building Docker Images

```bash
# Build Node.js image
npm run docker:build:node

# Build Python image  
npm run docker:build:python

# Build both images
npm run docker:build
```

#### Running with Docker

```bash
# Ensure you have a .env file with your API keys
cp .env.example .env
# Edit .env with your actual API keys

# Run Node.js example
npm run docker:run:node

# Run Python example
npm run docker:run:python
```

### Serverless Deployment (Notion API Backend)

The Notion API backend is designed for serverless deployment on platforms like:

- **Vercel**: Deploy with `vercel --env-file .env`
- **Railway**: Push to connected repository
- **Render**: Deploy as web service
- **Netlify Functions**: Use as serverless function
- **AWS Lambda**: Deploy with serverless framework

### Manual Docker Commands

```bash
# Build images manually
docker build -f Dockerfile.node -t rapid-api-generator-node:latest .
docker build -f Dockerfile.python -t rapid-api-generator-python:latest .

# Run containers manually
docker run --rm --env-file .env rapid-api-generator-node:latest
docker run --rm --env-file .env rapid-api-generator-python:latest
```

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- **Lints and tests** both Node.js and Python code on every push and pull request
- **Builds Docker images** to ensure containerization works correctly
- **Deploys to GitHub Pages** on successful builds to the main branch

The pipeline runs automatically and ensures code quality and deployment readiness.

### Environment Variables for Production

For production deployments, ensure you set the following environment variables:

- `RAPIDAPI_KEY`: Your production RapidAPI key
- `NOTION_API_KEY`: Your production Notion integration key
- `NODE_ENV`: Set to `production` for optimized performance
- `RAPIDAPI_HOST`: Override if using a different API host

### Security Considerations for Deployment

- Never expose your `.env` file in production
- Use separate API keys for development, staging, and production
- Consider using container orchestration (Kubernetes, Docker Swarm) for scalability
- Implement proper logging and monitoring in production environments

## 🔧 Customization

Both example scripts are templates that demonstrate secure API key management. To use them with actual API endpoints:

1. Replace the `url` variable with your specific API endpoint
2. Update the API host headers with the correct host for your API
3. Modify the request parameters as needed for your specific API

For Notion API integration:
1. Create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Share your database with the integration
3. Use the debugging tools to verify connection

## 🔒 Security Best Practices

- ✅ Store API keys in environment variables (`.env` file)
- ✅ Add `.env` to `.gitignore` to prevent accidental commits
- ✅ Use `.env.example` as a template for other developers
- ✅ Never hardcode API keys in your source code
- ✅ Use different API keys for development, staging, and production
- ✅ Use backend proxy servers to avoid exposing keys in frontend
- ✅ Implement proper error handling and logging

## 📚 Learn More

- [RapidAPI Documentation](https://docs.rapidapi.com/)
- [Notion API Documentation](https://developers.notion.com/)
- [Python Requests Documentation](https://requests.readthedocs.io/)
- [Axios Documentation](https://axios-http.com/)
- [Python-dotenv Documentation](https://pypi.org/project/python-dotenv/)
- [Node.js dotenv Documentation](https://www.npmjs.com/package/dotenv)

## 🤝 Contributing

Feel free to submit issues and pull requests to improve these examples! Contributions are especially welcome for:

- Additional API integrations
- Enhanced debugging tools
- Improved error handling
- Documentation improvements
- Security enhancements