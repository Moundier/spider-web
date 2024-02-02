# Puppeteer Documentation Summary

Puppeteer is a powerful Node.js library offering a high-level API for controlling headless or full browsers via the DevTools Protocol. It is valuable for tasks like web scraping, automated testing, screenshot capture, PDF generation, and user interaction simulation.

## Why Puppeteer?

Puppeteer is particularly effective when dealing with websites heavily reliant on JavaScript frameworks (e.g., jQuery, AJAX, Thymeleaf) for dynamic content rendering. It stands out by efficiently handling dynamic content and accurately retrieving rendered data. I tested Jsoup and Bsoup, and both turned out really bad.
Now I see, that it's said that each language has its strenghts. Shout-out, dear javascript! 

## Features:
- Headless browser automation
- Simulating user interactions
- Capturing screenshots and generating PDFs
- Navigating through pages
- Effective handling of dynamic content and AJAX requests

## Requirements:
- A basic computer
- Installation of `node.js`

## Scaffold:

- Generate `package-lock.json` with `npx npm init -y`
- Generate `package-lock.json` and `./node_modules` with `npx npm install puppeteer`
- Ignore `node_modules` with `git rm -r --cached node_modules/`
- Run `node index.js`

```plaintext
Ema, ema, ema. Cada um com seus problema.
```

### Pseudo Todo code 

- [] Click all buttons of current page
- [] If buttons are null (ended)
- [] See if there is more tabs (more buttons, more participants)
- [] If so click
- [] Else fetch new loaded buttons and repeat until tabs end and buttons end
