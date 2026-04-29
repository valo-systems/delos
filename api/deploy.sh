#!/bin/bash
set -e

VERSION="v$(date +%Y%m%d-%H%M%S)"
JAR="target/api-0.0.1-SNAPSHOT.jar"
BUCKET="delos-eb-deployments"
S3_KEY="api-${VERSION}.jar"

echo "Building API..."
mvn clean package -DskipTests

echo "Uploading to S3..."
aws s3 cp $JAR s3://${BUCKET}/${S3_KEY} --region us-east-1

echo "Creating EB application version ${VERSION}..."
aws elasticbeanstalk create-application-version \
  --application-name delos-api \
  --version-label "${VERSION}" \
  --source-bundle S3Bucket=${BUCKET},S3Key=${S3_KEY} \
  --region us-east-1

echo "Deploying to delos-api-prod..."
aws elasticbeanstalk update-environment \
  --environment-name delos-api-prod \
  --version-label "${VERSION}" \
  --region us-east-1

echo "Deployed ${VERSION}!"
