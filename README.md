Opuis (website name)
Developer Social Media App -> Users post their repo projects as a showcase
website offers various catagories for users to sort through for specific posts

APIs
Github REST API
YouTube API
Gemeni API

### Backend library usage

Package Role in Production
helmet Sets HTTP security headers to protect against common web vulnerabilities (XSS, clickjacking).
cors Controls which external domains are allowed to make requests to your API.
dotenv Loads configuration secrets (API keys, DB URLs, ports) from a .env file into process.env.
zod Validates incoming request bodies, query parameters, and environment variables at runtime.
pino High-speed structured JSON logger (replaces console.log so logs can be parsed by Datadog or CloudWatch).
tsx Runs TypeScript files directly in development with fast watch mode (tsx watch src/server.ts).
