# Rapid_API-Generator

A web-based tool for generating secure API client code instantly from any API endpoint. Features both a modern web interface and command-line examples for Python and Node.js.

## 🌐 Web Interface

Visit the **[Live Web Generator](https://jcotebcs.github.io/Rapid_API-Generator)** to instantly generate API client code:

### Features
- **🎯 Simple Form Interface**: Enter API URL, select HTTP method, customize headers
- **🔧 Multi-Language Support**: Generate both Python and Node.js client code
- **📋 Copy & Download**: Easily copy code to clipboard or download as files
- **🛡️ Security Best Practices**: Built-in environment variable management
- **✨ Modern UI**: Clean, responsive design with tabbed code output
- **🚀 Real-time Generation**: Instant code generation with live preview

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
- A RapidAPI account and API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jcotebcs/Rapid_API-Generator.git
   cd Rapid_API-Generator
   ```

2. **Create your environment file**
   ```bash
   cp .env.example .env
   ```

3. **Add your RapidAPI key to the `.env` file**
   ```env
   RAPIDAPI_KEY=your_actual_rapidapi_key_here
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

## 🟢 Node.js Example

### Install Dependencies
```bash
npm install
```

### Run the Node.js Example
```bash
npm start
# or
node rapidapi_example.js
```

The Node.js example uses:
- `axios` library for HTTP requests
- `dotenv` for loading environment variables from `.env` file

## 📁 Project Structure

```
Rapid_API-Generator/
├── .env.example          # Template for environment variables
├── .gitignore           # Git ignore rules (includes .env)
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
├── rapidapi_example.py  # Python example script
├── rapidapi_example.js  # Node.js example script
└── README.md           # This file
```

## 🔧 Customization

Both example scripts are templates that demonstrate secure API key management. To use them with actual RapidAPI endpoints:

1. Replace the `url` variable with your specific RapidAPI endpoint
2. Update the `X-RapidAPI-Host` header with the correct host for your API
3. Modify the request parameters as needed for your specific API

## 🔒 Security Best Practices

- ✅ Store API keys in environment variables (`.env` file)
- ✅ Add `.env` to `.gitignore` to prevent accidental commits
- ✅ Use `.env.example` as a template for other developers
- ✅ Never hardcode API keys in your source code
- ✅ Use different API keys for development, staging, and production

## 📚 Learn More

- [RapidAPI Documentation](https://docs.rapidapi.com/)
- [Python Requests Documentation](https://requests.readthedocs.io/)
- [Axios Documentation](https://axios-http.com/)
- [Python-dotenv Documentation](https://pypi.org/project/python-dotenv/)
- [Node.js dotenv Documentation](https://www.npmjs.com/package/dotenv)

## 🤝 Contributing

Feel free to submit issues and pull requests to improve these examples!