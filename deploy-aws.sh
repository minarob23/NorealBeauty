#!/bin/bash

# AWS Deployment Script for NoReal Beauty Backend
# This script helps deploy the backend to AWS Elastic Beanstalk

echo "🚀 NoReal Beauty - AWS Backend Deployment Script"
echo "================================================"
echo ""

# Check if EB CLI is installed
if ! command -v eb &> /dev/null
then
    echo "❌ EB CLI is not installed."
    echo "📦 Install it with: pip install awsebcli --upgrade --user"
    exit 1
fi

echo "✅ EB CLI is installed"
echo ""

# Check if this is first time setup
if [ ! -f ".elasticbeanstalk/config.yml" ]; then
    echo "🔧 First time setup detected"
    echo "Running: eb init"
    echo ""
    eb init
    
    echo ""
    echo "✅ Elastic Beanstalk initialized"
    echo ""
    echo "📝 Next, create an environment:"
    echo "   eb create norealbeauty-api-env --single"
    echo ""
    read -p "Create environment now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        eb create norealbeauty-api-env --single
    else
        echo "⚠️  Remember to create environment later with:"
        echo "   eb create norealbeauty-api-env --single"
        exit 0
    fi
fi

# Check for required environment variables
echo "🔑 Checking environment variables..."
echo ""

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set"
    read -p "Enter DATABASE_URL (Neon PostgreSQL connection string): " db_url
    export DATABASE_URL=$db_url
fi

if [ -z "$SESSION_SECRET" ]; then
    echo "⚠️  SESSION_SECRET not set"
    read -p "Enter SESSION_SECRET (min 32 characters): " session_secret
    export SESSION_SECRET=$session_secret
fi

# Set environment variables on EB
echo ""
echo "📤 Setting environment variables on AWS..."
eb setenv \
  DATABASE_URL="$DATABASE_URL" \
  SESSION_SECRET="$SESSION_SECRET" \
  NODE_ENV="production" \
  RESEND_API_KEY="${RESEND_API_KEY:-}" \
  FROM_EMAIL="${FROM_EMAIL:-noreply@norealbeauty.com}" \
  GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-}" \
  GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:-}"

echo "✅ Environment variables set"
echo ""

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed"
echo ""

# Deploy to EB
echo "🚀 Deploying to AWS Elastic Beanstalk..."
eb deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Opening application..."
    eb open
    echo ""
    echo "📊 Check status with: eb status"
    echo "📋 View logs with: eb logs"
else
    echo ""
    echo "❌ Deployment failed"
    echo "📋 Check logs with: eb logs"
    exit 1
fi
