# Rapid_API-Generator

A collection of examples demonstrating secure API key management for RapidAPI access in both Python and Node.js, plus an interactive web-based testing interface.

## 🌐 Interactive Web Interface

**Try it live: [RapidAPI Generator on GitHub Pages](https://jcotebcs.github.io/Rapid_API-Generator/)**

The project includes a beautiful, interactive web interface that allows you to:
- 🔑 Securely input your RapidAPI key (stored only in browser memory)
- 🎯 Test various RapidAPI endpoints with pre-configured examples
- 📊 View formatted API responses with syntax highlighting
- ⚡ Support for GET, POST, PUT, and DELETE requests
- 📱 Fully responsive design that works on all devices

![RapidAPI Generator Interface](https://github.com/user-attachments/assets/f199a3b2-9fe3-4ba4-a384-3656965cf55d)

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
├── docs/                  # GitHub Pages front-end (deployed automatically)
│   ├── index.html        # Interactive web interface
│   ├── css/
│   │   └── styles.css    # Professional styling with animations
│   └── js/
│       └── app.js        # Client-side API testing functionality
├── .env.example          # Template for environment variables
├── .gitignore           # Git ignore rules (includes .env)
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
├── rapidapi_example.py  # Python example script
├── rapidapi_example.js  # Node.js example script
└── README.md           # This file
```

## 🔧 Customization

### Using the Web Interface

1. **Visit the GitHub Pages site**: https://jcotebcs.github.io/Rapid_API-Generator/
2. **Enter your RapidAPI key** (never shared or stored permanently)
3. **Choose from pre-configured API examples** or add your custom endpoint
4. **Test API calls** and view formatted responses

### Pre-configured API Examples

The web interface includes several ready-to-test APIs:
- 🌤️ **Weather API**: Get current weather data for any city
- 💭 **Random Quotes API**: Fetch inspirational quotes
- 😄 **Dad Jokes API**: Get random dad jokes
- 🧠 **Trivia Questions API**: Access trivia questions by category
- 💱 **Currency Exchange API**: Convert between currencies

### Using the Command Line Examples

Both example scripts are templates that demonstrate secure API key management. To use them with actual RapidAPI endpoints:

1. Replace the `url` variable with your specific RapidAPI endpoint
2. Update the `X-RapidAPI-Host` header with the correct host for your API
3. Modify the request parameters as needed for your specific API

### GitHub Pages Deployment

This repository is automatically deployed to GitHub Pages from the `docs/` folder. To set up GitHub Pages for your own fork:

1. Go to your repository **Settings**
2. Scroll down to **Pages** section
3. Set **Source** to "Deploy from a branch"
4. Select **Branch**: `main` and **Folder**: `/docs`
5. Click **Save**

Your site will be available at: `https://yourusername.github.io/Rapid_API-Generator/`

## 🔒 Security Best Practices

- ✅ Store API keys in environment variables (`.env` file) for command-line use
- ✅ Use the web interface for safe browser-based testing (keys stored only in memory)
- ✅ Add `.env` to `.gitignore` to prevent accidental commits
- ✅ Use `.env.example` as a template for other developers
- ✅ Never hardcode API keys in your source code
- ✅ Use different API keys for development, staging, and production
- ⚠️ **Never share your API keys publicly or commit them to repositories**

### Web Interface Security

The interactive web interface follows security best practices:
- API keys are stored only in browser memory (not localStorage or cookies)
- Keys are automatically cleared when you close the browser tab
- All API requests are made directly from your browser to RapidAPI (no intermediate servers)
- HTTPS is enforced when deployed on GitHub Pages

## 📚 Learn More

- [RapidAPI Documentation](https://docs.rapidapi.com/)
- [Python Requests Documentation](https://requests.readthedocs.io/)
- [Axios Documentation](https://axios-http.com/)
- [Python-dotenv Documentation](https://pypi.org/project/python-dotenv/)
- [Node.js dotenv Documentation](https://www.npmjs.com/package/dotenv)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 🤝 Contributing

Feel free to submit issues and pull requests to improve these examples!

### Development

To run the web interface locally:

```bash
# Clone the repository
git clone https://github.com/jcotebcs/Rapid_API-Generator.git
cd Rapid_API-Generator

# Serve the docs folder locally
cd docs
python3 -m http.server 8000

# Visit http://localhost:8000 in your browser
```