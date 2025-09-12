# Rapid_API-Generator

A collection of examples demonstrating secure API key management for RapidAPI access in both Python and Node.js.

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
├── Dockerfile.node      # Docker configuration for Node.js
├── Dockerfile.python    # Docker configuration for Python
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI/CD pipeline configuration
└── README.md           # This file
```

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
# Ensure you have a .env file with your RAPIDAPI_KEY
cp .env.example .env
# Edit .env with your actual API key

# Run Node.js example
npm run docker:run:node

# Run Python example
npm run docker:run:python
```

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
- `NODE_ENV`: Set to `production` for optimized performance
- `RAPIDAPI_HOST`: Override if using a different API host

### Security Considerations for Deployment

- Never expose your `.env` file in production
- Use separate API keys for development, staging, and production
- Consider using container orchestration (Kubernetes, Docker Swarm) for scalability
- Implement proper logging and monitoring in production environments

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