# Puppeteer Summary:

Puppeteer is a Node.js library for browser automation via the DevTools Protocol, useful for tasks like web scraping and automated testing. It excels in handling dynamic content and JavaScript-heavy websites.

## Key Features:
- Headless browser automation
- User interaction simulation
- Screenshot capture and PDF generation
- Effective handling of dynamic content and AJAX requests

## Requirements:
- Basic computer
- Node.js installed
- `typeorm`
- `pg`

## Quick Start:
1. Generate `package-lock.json` with `npx npm init -y`
2. Install Puppeteer with `npx npm install puppeteer`
3. Ignore `node_modules` in Git
4. Run `node index.js`

### Pseudo Todo Code:
- Click all buttons on the current page
- If no buttons (ended), check for more tabs
- If more tabs, click and repeat
- Fetch new loaded buttons until all tabs and buttons end


### Todo
- Implement later on tsc-node
- Implement udpated fetched buttons 