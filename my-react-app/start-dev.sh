#!/bin/bash

# Script to start both frontend and backend servers

echo "🚀 Starting development servers..."
echo ""

# Check if backend node_modules exists
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

# Check if frontend node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Start backend in background
echo "🔧 Starting backend server on port 4000..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Check if backend is running
if curl -s http://localhost:4000/health > /dev/null; then
  echo "✅ Backend server is running!"
else
  echo "⚠️  Backend server may not be running. Check the logs above."
fi

# Start frontend
echo "🎨 Starting frontend dev server..."
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM

npm run dev

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
