# Delos — Final AWS + Manual Steps

These steps must be completed manually before the API goes live.

## AWS Setup (run once)

### 1. Create DynamoDB tables in us-east-1
```bash
for table in delos-orders delos-reservations delos-enquiries; do
  aws dynamodb create-table \
    --table-name $table \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
done

aws dynamodb create-table \
  --table-name delos-users \
  --attribute-definitions AttributeName=username,AttributeType=S \
  --key-schema AttributeName=username,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 2. Generate JWT secret (min 32 chars)
```bash
openssl rand -base64 48
# Copy output — use as JWT_SECRET in EB environment
```

### 3. Create Elastic Beanstalk application
```bash
aws elasticbeanstalk create-application \
  --application-name delos-api \
  --description "Delos Lounge & Dining API" \
  --region us-east-1
```

### 4. Create EB environment (t3.micro, Corretto 21)
```bash
aws elasticbeanstalk create-environment \
  --application-name delos-api \
  --environment-name delos-api-prod \
  --solution-stack-name "64bit Amazon Linux 2023 v4.9.0 running Corretto 21" \
  --option-settings \
    "Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t3.micro" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=SPRING_PROFILES_ACTIVE,Value=prod" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=DYNAMODB_REGION,Value=us-east-1" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ORDERS_TABLE,Value=delos-orders" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=RESERVATIONS_TABLE,Value=delos-reservations" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ENQUIRIES_TABLE,Value=delos-enquiries" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=USERS_TABLE,Value=delos-users" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=REPLACE_WITH_GENERATED_SECRET" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ALLOWED_ORIGINS,Value=https://www.deloslounge.co.za,https://d1t1afsdwlqzlq.cloudfront.net" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ADMIN_USERNAME,Value=admin" \
    "Namespace=aws:elasticbeanstalk:application:environment,OptionName=ADMIN_PASSWORD,Value=DelosAdmin2026!" \
  --region us-east-1
```

### 5. Attach DynamoDB policy to EB EC2 role
```bash
aws iam put-role-policy \
  --role-name aws-elasticbeanstalk-ec2-role \
  --policy-name delos-dynamodb-access \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem","dynamodb:PutItem","dynamodb:UpdateItem","dynamodb:Scan","dynamodb:Query"],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-orders",
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-reservations",
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-enquiries",
        "arn:aws:dynamodb:us-east-1:861870144419:table/delos-users"
      ]
    }]
  }'
```

### 6. Create S3 bucket for EB deployments
```bash
aws s3 mb s3://delos-eb-deployments --region us-east-1
```

### 7. Deploy API
```bash
cd api && ./deploy.sh
```

### 8. Create CloudFront distribution in front of EB
- Origin: the EB environment CNAME (shown after step 4 completes)
- Allow methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- Cache policy: CachingDisabled (API responses must not be cached)
- Note the CloudFront domain — this becomes NEXT_PUBLIC_API_URL

### 9. Update UI env and redeploy
```bash
# Edit ui/.env.production — set NEXT_PUBLIC_API_URL to the CloudFront domain from step 8
cd ui && ./deploy.sh
```

## DNS (when ready for production)
- Point `api.deloslounge.co.za` CNAME to the API CloudFront distribution
- Point `www.deloslounge.co.za` CNAME to the existing UI CloudFront distribution (E2LH36Y7GBUMP7)

## First login
- URL: https://d1t1afsdwlqzlq.cloudfront.net/admin/login
- Username: `admin`
- Password: `DelosAdmin2026!`
- Change the password immediately in the EB environment variables after first login.
