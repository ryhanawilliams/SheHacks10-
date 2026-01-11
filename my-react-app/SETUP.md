# Setup Instructions

## Quick Start

To fix the "failed to fetch" error, you need to run both the frontend and backend servers.

### Option 1: Use the startup script (Recommended)

```bash
cd my-react-app
./start-dev.sh
```

This will:
- Install dependencies if needed
- Start the backend server on port 4000
- Start the frontend dev server
- Check if the backend is running

### Option 2: Manual startup

**Terminal 1 - Backend:**
```bash
cd my-react-app/backend
npm install  # Only needed first time
npm start
```

You should see: `Backend on 0.0.0.0:4000`

**Terminal 2 - Frontend:**
```bash
cd my-react-app
npm install  # Only needed first time
npm run dev
```

## Environment Variables (Optional)

If you're using the OpenRouter API for image analysis, create a `.env` file in the `backend` directory:

```bash
OPENROUTER_API_KEY=your_api_key_here
PUBLIC_BASE_URL=http://localhost:5173
```

## Troubleshooting

### "Failed to fetch" error
- Make sure the backend server is running on port 4000
- Check that port 4000 is not being used by another application
- Verify the Vite dev server is running (it proxies requests to the backend)

### Backend won't start
- Make sure you're in the `backend` directory
- Run `npm install` in the backend directory
- Check that Node.js is installed: `node --version`

### Frontend won't start
- Make sure you're in the `my-react-app` directory
- Run `npm install` in the my-react-app directory
- Check that Node.js is installed: `node --version`

## Testing the Backend

You can test if the backend is running by visiting:
- http://localhost:4000/health

This should return: `{"ok":true,"port":4000,"time":...}`
