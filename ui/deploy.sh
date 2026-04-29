#!/bin/bash
set -e

echo "Building UI..."

# Move dynamic routes out (static export workaround)
mv src/app/order/\[id\] /tmp/delos-order-id-backup 2>/dev/null || true
mv src/app/api /tmp/delos-api-backup 2>/dev/null || true

# Build
npm run build
BUILD_EXIT=$?

# Restore
mv /tmp/delos-order-id-backup src/app/order/\[id\] 2>/dev/null || true
mv /tmp/delos-api-backup src/app/api 2>/dev/null || true

if [ $BUILD_EXIT -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

echo "Syncing to S3..."
aws s3 sync out/ s3://delos-lounge-website/ \
  --region af-south-1 \
  --delete \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable"

aws s3 sync out/ s3://delos-lounge-website/ \
  --region af-south-1 \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html; charset=utf-8"

echo "Invalidating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id E2LH36Y7GBUMP7 \
  --paths "/*"

echo "Done!"
