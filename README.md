# Puppeteer Summary

Puppeteer is a Node.js library for browser automation via the DevTools Protocol, useful for tasks like web scraping and automated testing. It excels in handling dynamic content and JavaScript-heavy websites.

## Key Features
- Headless browser automation
- User interaction simulation (Button Clicks)
- Screenshot capture and PDF generation
- Effective handling of dynamic content and AJAX request
- Thymeleaf HTML Rendering (Jsoup and BeautifulSoup4)

## Requirements
- `node`
- `pg` (Can be removed)
- `typeorm`: lombok like boilerplater, and also a object relational mapper 
- `tsx`: typescript for typing and annotations (experimental feature)
- `nodemon`: used for hot reloading
- `express`: restful

## Quick Start
1. Generate package-lock.json with npx npm init -y
2. Generate tsconfig.json with tsc --init
3. Install Puppeteer with npx npm install puppeteer
4. Install TypeORM with npx npm install typeorm
5. Install reflect-metadata with npx npm install reflect-metadata
6. Ignore node_modules in .gitignore
7. Run npx ts-node ./src/index.ts

### Todo
- [x] `to do`: modal asynchronous open timeout
- [x] `to do`: modal asynchronous close timeout
- [x] `to do`: inspect attributes of members
- [x] `to do`: inspect titles on breadcrumbs 
- [x] `to do`: inspect roles of member 
- [x] `to do`: inspect classification of programs
- [x] `to do`: assign value to it's correct key
- [x] `to do`: collect program members
- [x] `to do`: collect program keywords
- [x] `to do`: attach id of url to program, for future inspections
- [x] `to do`: member image source/hyperlink
- [x] `to do`: member images are optional
- [x] `to do`: program addresses are optional
- [x] `to do`: classes to entities 
- [x] `to do`: refactor everything from javascript to typescript 
- [x] `to do`: save to database
- [x] `to do`: verify for persisted data before saving, in order to avoid duplicates.

### Ideas Assemble
- Youtube Shorts similar Main Page
- Random Base64 Image Placeholder [Hyperlink](https://picsum.photos/500/300?blur=10)
- Recommendations (Item-based, User-based, Content-based, Region-based)
- Interactions System
- Achievements System (Interactions, Time-use, Personal-profile)

### Queries

1. Delete table's lines
```sql
-- delete from program;
-- delete from keyword;
-- delete from address;
-- delete from member;
-- delete from program_member;
-- delete from program_address;
-- delete from program_keyword;
-- delete from program where program."hyperlink" = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74584';

-- SELECTION ON TABLES
select * from program;
select * from keyword;
select * from address;
select * from member;
select * from program_keyword;
select * from program_address;
select * from program_member;

-- FETCH KEYWORDS OF PROJECT
select "keywordName" from program, keyword, program_keyword
where program."programId" = program_keyword."programId"
and keyword."keywordId" = program_keyword."keywordId"
and program."programId" = 'id';

-- FETCH ADDRESSES OF PROJECT
select "city" from program, address, program_address
where program."programId" = program_address."programId"
and address."addressId" = program_address."addressId"
and program."programId" = 'id';

-- FETCH MEMBERS OF PROJECT
select "name" from program, member, program_member
where program."programId" = program_member."programId"
and member."memberId" = program_member."memberId"
and program."programId" = 'id';

-- SUBQUERY FOR THE LATEST INSERTED
SELECT *
FROM program
WHERE program."programId" = (SELECT MAX("programId") FROM program);

-- SOLVING PROBLEMS
select "hyperlink" from program where program."programId" = 8673;
select * from program where program."hyperlink" = 'https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=62591';
select * from program;
select * from member;
select count("programId") from program;
select count("memberId") from member;
```

### Notes
1. Sometimes members repeat, unreasonably
- In "https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74535" the username and membeRole repeats for "ANTHONIO GABRIEL SARAIVA DOS SANTOS" 
- Since there are members with the same 'name' and 'membeRole', it cant repeat in database
- This is not our error, but of the portal admin.

2. Sometimes there are 'regions' in 'keyword' (We cant do much about it)
- (Campus) https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74097
- (Wow) https://portal.ufsm.br/projetos/publico/projetos/view.html?idProjeto=74080
