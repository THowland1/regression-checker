# Regression checker

## Summary
Pick a URL, check it at regular intervals to see if it's appearance has changed

## Usage
Configure
- a URL
- interval of checks
- email to be contacted on when things go wrong

You will get an email when things go wrong

## Roadmap

### 1. Code POC
Prove that I can detect when an image has changed
- [ ] Take a screenshot with playwright
- [ ] Compare it with another

### 2. Deployment POC
Prove that this process can run in the cloud at intervals
- [ ] Read/Write images to a service (s3 bucket?)
- [ ] Put a CRON job in the cloud
- [ ] Read config of a DB (mongoDB cloud?)


## Maybe in the future
- [ ] Slack bot integration
- [ ] Use queueing
- [ ] Nice UI for seeing
- [ ] Nice UI for configuring
  - [ ] Accounts


