S3_BUCKET=l33t-timer.keksipurkki.net

start:
	php -S 0.0.0.0:8080 -t public_html

javascript:
	npm run watch

provision:
	aws s3api head-bucket --bucket $(S3_BUCKET) || aws s3api create-bucket --bucket $(S3_BUCKET) --acl public-read --region eu-north-1 --create-bucket-configuration LocationConstraint=eu-north-1
	aws s3 website s3://$(S3_BUCKET) --index-document index.html

deploy:
	aws s3 sync public_html s3://$(S3_BUCKET) --acl public-read

