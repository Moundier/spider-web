# Puppeteer Summary

Puppeteer is a Node.js library for browser automation via the DevTools Protocol, useful for tasks like web scraping and automated testing. It excels in handling dynamic content and JavaScript-heavy websites.

## Key Features
- Headless browser automation
- User interaction simulation (Button Clicks)
- Screenshot capture and PDF generation
- Effective handling of dynamic content and AJAX request
- Thymeleaf HTML Rendering (Jsoup and BeautifulSoup4)

## Staged
- to go: compromise
- to go: playwright
- to go: ts-node

## Requirements
- `node`
- `pg`
- `typeorm`: not only boilerplate, but also 
- `tsx`
- `nodemon`: used for hot reloading
- `express`: restful

## Quick Start
1. Generate `package-lock.json` with `npx npm init -y`
2. Install Puppeteer with `npx npm install puppeteer`
3. Ignore `node_modules` in .gitignore
5. Run `npx tsx ./src/index.ts`

### Todo
- [x] to do: modal asynchronous open timeout
- [x] to do: modal asynchronous close timeout
- [x] to do: inspect attributes of members
- [x] to do: inspect titles on breadcrumbs 
- [x] to do: inspect roles of member 
- [x] to do: inspect classification of programs
- [x] to do: assign value to it's correct key
- [x] to do: collect program members
- [x] to do: collect program keywords
- [x] to do: attach id of url to program, for future inspections
- [x] to do: member image source/hyperlink
- [x] to do: member images are optional
- [x] to do: program addresses are optional
- [x] to do: classes to entities 
- [x] to do: save to database
- [ ] to do: dont save whenver it is 'not informed or null data'

- [ ] to do: question: where departaments (individually) are localized?
- [ ] to do: question: remove specific characters from keywords and regions?
- [ ] to do: question: keywords and regions, should be uppercased or lowercased?

### Ideas Assemble
- Youtube Shorts similar Main Page
- Random Base64 Image Placeholder [Hyperlink](https://picsum.photos/500/300?blur=10)
- Recommendations (Item-based, User-based, Content-based, Region-based)
- Interactions System
- Achievements System (Interactions, Time-use, Personal-profile)

### Note
- Sometimes there are 'regions' in 'keyword' 
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74498 
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74291
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74185
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74184
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74097
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74080
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=73572
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74291
- https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74367

### Queries

1. Delete table's lines
```sql
delete from program_keyword;
delete from program;
delete from keywprd;
```

2. Selection on tables
```sql
select * from program_keyword;
select * from program;
select * from keyword;
```

3. Get all keywords linked to project id
```sql
select "keywordName" from program, keyword, program_keyword
where program."programId" = program_keyword."programId"
and keyword."keywordId" = program_keyword."keywordId"
and program."programId" = 3;
```

4. Get all addresses linked to progject id
```sql

select "city" from program, address, program_address
where program."programId" = program_address."programId"
and address."addressId" = program_address."addressId"
and program."programId" = ;
```
