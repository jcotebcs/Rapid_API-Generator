# ⚡ RapidAPI Generator Web Application

Convert any API URL into production-ready TypeScript code instantly! 

**🌐 Live Demo:** [https://jcotebcs.github.io/Rapid_API-Generator](https://jcotebcs.github.io/Rapid_API-Generator)

## ✨ Features

- **🔗 Universal API Support**: Works with any API URL, OpenAPI specs, or RapidAPI marketplace links
- **⚡ Instant Generation**: Get complete TypeScript client code in seconds
- **📦 Production Ready**: Generates types, client, examples, package.json, and documentation
- **🎯 Zero Setup**: No installation required - works directly in your browser
- **📱 Mobile Friendly**: Responsive design works on any device
- **📁 Easy Download**: Get all files instantly or coming soon: push to GitHub

## 🚀 What It Generates

### Complete TypeScript Project Structure:
```
generated-api-client/
├── types.ts          # TypeScript interface definitions
├── client.ts         # Full-featured API client with error handling
├── examples.ts       # Usage examples and demos
├── package.json      # Project configuration and dependencies
└── README.md         # Complete documentation
```

### Generated Client Features:
- ✅ Full TypeScript support with proper types
- ✅ Axios-based HTTP client with error handling and interceptors
- ✅ Automatic error handling and response mapping
- ✅ Support for all HTTP methods (GET, POST, PUT, DELETE, etc.)
- ✅ Query parameters, path parameters, and request bodies
- ✅ Response type safety and validation

## 🎯 How to Use

1. **Visit the Web App**: [https://jcotebcs.github.io/Rapid_API-Generator](https://jcotebcs.github.io/Rapid_API-Generator)
2. **Paste Your API URL**: Any OpenAPI spec URL, API documentation, or endpoint
3. **Generate Code**: Click the generate button and wait a few seconds
4. **Download Files**: Get all generated files instantly
5. **Use in Your Project**: Import and use the generated client immediately

### Supported URL Types:
- OpenAPI/Swagger specification URLs (`.json`, `.yaml`)
- RapidAPI marketplace URLs  
- API documentation URLs
- Direct API endpoints (we'll try to find the spec)

## 💻 Example Usage

After generating and downloading the code:

```typescript
import { ExampleApiClient } from './client';

// Initialize the client
const client = new ExampleApiClient({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key-here'
});

// Use the generated methods
try {
  const response = await client.getData({ id: '123' });
  console.log('API Response:', response.data);
} catch (error) {
  console.error('API Error:', error.message);
}
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
# Clone the repository
git clone https://github.com/jcotebcs/Rapid_API-Generator.git
cd Rapid_API-Generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run ESLint

## 🌐 Deployment

This application is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. **Builds** the React application with Vite
2. **Type checks** all TypeScript code
3. **Deploys** to GitHub Pages on every push to main branch

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern gradients and animations
- **HTTP Client**: Axios for API requests
- **Deployment**: GitHub Pages + GitHub Actions

## 🎨 Design Features

- **Modern UI**: Glass-morphism design with gradients
- **Responsive**: Works perfectly on mobile and desktop
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized build with code splitting
- **User Experience**: Loading states, error handling, and success feedback

## 📈 Perfect For

- **Bot Projects**: Generate API clients for Discord/Telegram bots
- **Web Applications**: Add API integration to React/Vue/Angular apps
- **Mobile Apps**: TypeScript clients work great with React Native
- **Backend Services**: Use generated types in Node.js projects
- **Rapid Prototyping**: Quickly integrate any API into your project

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the developer community to simplify API integration
- Inspired by the need for rapid prototyping and development
- Designed to work with any API, not just RapidAPI marketplace

---

**⚡ Turn any API into working TypeScript code in seconds!**