aws cloudformation deploy \
  --template-file ./cloudformation.yaml \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
      OauthToken=f7903b24ab92fadb39efa5495c81008c33edaf51 \
      Repository=https://github.com/cmeans/emo-bingo \
      Domain=amplifyapp.com \
  --stack-name emoBingoApp \

