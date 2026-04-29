#!/bin/bash
# Deploy the Delos UI to S3 + CloudFront
# Usage: ./deploy-ui.sh
set -e

UI_DIR="$(dirname "$0")/ui"
S3_BUCKET="delos-lounge-website"
S3_REGION="af-south-1"
CF_DISTRIBUTION="E2LH36Y7GBUMP7"

echo "==> Building UI..."
cd "$UI_DIR"
npm run build

echo "==> Syncing to S3 (s3://${S3_BUCKET})..."
aws s3 sync out/ "s3://${S3_BUCKET}/" \
  --delete \
  --region "$S3_REGION"

echo "==> Invalidating CloudFront (${CF_DISTRIBUTION})..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "==> Invalidation ${INVALIDATION_ID} in progress."
echo "    CloudFront changes typically propagate in 1-3 minutes."
echo ""
echo "==> Done. Live at: https://d1t1afsdwlqzlq.cloudfront.net"
