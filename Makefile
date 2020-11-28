S3_BUCKET=l33t-timer.keksipurkki.net
CACHE_CONTROL=public,max-age=31536000,immutable

start:
	python -m http.server --directory=public_html

dev:
	npm run dev

provision:
	aws s3api head-bucket --bucket $(S3_BUCKET) || aws s3api create-bucket --bucket $(S3_BUCKET) --acl public-read --region eu-north-1 --create-bucket-configuration LocationConstraint=eu-north-1
	aws s3 website s3://$(S3_BUCKET) --index-document index.html

deploy:
	aws s3 sync public_html s3://$(S3_BUCKET) --delete --acl public-read
	aws s3 cp s3://$(S3_BUCKET) s3://$(S3_BUCKET) --exclude "*" --include "*.css" --include "*.js" --include "*.png" --include "*.mp3" \
	--recursive --metadata-directive REPLACE --expires 2034-01-01T00:00:00Z --acl public-read --cache-control $(CACHE_CONTROL)
	git commit public_html -m "Deployment on $(shell date)" 

