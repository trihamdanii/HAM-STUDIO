#!/bin/bash
# Run this after first deployment to set up the database
# Make sure DATABASE_URL is set in your environment

echo "🚀 Running database migrations..."
npx prisma migrate deploy

echo "✅ Generating Prisma client..."
npx prisma generate

echo "🎉 Database setup complete!"
