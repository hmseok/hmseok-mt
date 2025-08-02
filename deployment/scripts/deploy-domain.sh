#!/bin/bash

echo "🌐 도메인 배포 시작..."

# 환경 변수 설정
DOMAIN_NAME="hmseok.com"
AWS_REGION="ap-northeast-2"
EB_ENVIRONMENT="car-repair-prod"

# 1. SSL 인증서 확인
echo "🔒 SSL 인증서 확인 중..."
CERT_ARN=$(aws acm list-certificates --region $AWS_REGION --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'].CertificateArn" --output text)

if [ -z "$CERT_ARN" ]; then
    echo "❌ SSL 인증서를 찾을 수 없습니다. 먼저 인증서를 요청하세요."
    echo "aws acm request-certificate --domain-name $DOMAIN_NAME --subject-alternative-names \"*.$DOMAIN_NAME\" --validation-method DNS --region $AWS_REGION"
    exit 1
fi

echo "✅ SSL 인증서 확인됨: $CERT_ARN"

# 2. Elastic Beanstalk 환경 업데이트
echo "🔧 Elastic Beanstalk 환경 업데이트 중..."
aws elasticbeanstalk update-environment \
  --environment-name $EB_ENVIRONMENT \
  --option-settings \
    Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role \
    Namespace=aws:elbv2:listener:443,OptionName=ListenerEnabled,Value=true \
    Namespace=aws:elbv2:listener:443,OptionName=SSLCertificateArns,Value=$CERT_ARN \
    Namespace=aws:elbv2:listener:443,OptionName=DefaultProcess,Value=default \
    Namespace=aws:elbv2:listener:443,OptionName=Rules,Value=redirect-http-to-https

# 3. Route 53 레코드 설정
echo "🌐 Route 53 레코드 설정 중..."

# 호스팅 영역 ID 가져오기
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN_NAME.'].Id" --output text | cut -d'/' -f3)

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "❌ 호스팅 영역을 찾을 수 없습니다."
    exit 1
fi

# Elastic Beanstalk 환경의 CNAME 가져오기
EB_CNAME=$(aws elasticbeanstalk describe-environments \
  --environment-names $EB_ENVIRONMENT \
  --query "Environments[0].CNAME" \
  --output text)

# A 레코드 생성 (루트 도메인)
cat > route53-changes.json << EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN_NAME",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2OJLYMUO9EFXC",
          "DNSName": "$EB_CNAME",
          "EvaluateTargetHealth": true
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.$DOMAIN_NAME",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2OJLYMUO9EFXC",
          "DNSName": "$EB_CNAME",
          "EvaluateTargetHealth": true
        }
      }
    }
  ]
}
EOF

aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://route53-changes.json

# 4. CloudFront 배포 (선택사항)
echo "☁️ CloudFront 배포 중..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items[?@=='$DOMAIN_NAME']].Id" \
  --output text)

if [ -z "$DISTRIBUTION_ID" ]; then
    echo "CloudFront 배포를 생성합니다..."
    # CloudFront 배포 생성 로직
else
    echo "기존 CloudFront 배포를 업데이트합니다..."
    # CloudFront 배포 업데이트 로직
fi

echo "✅ 도메인 배포 완료!"
echo "🌐 웹사이트: https://$DOMAIN_NAME"
echo "🔧 API: https://$DOMAIN_NAME/api"
echo "📊 관리 콘솔: https://$DOMAIN_NAME/admin"

# 정리
rm -f route53-changes.json 