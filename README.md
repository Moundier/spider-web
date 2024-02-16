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
- `typeorm`: not only boilerplate (lombok), but also database persistence object relational mapper 
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
- [x] `to do`: save to database
- [x] `to do`: verify for persisted data before saving, in order to avoid duplicates.

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
-- delete from program;
-- delete from keyword;
-- delete from address;
-- delete from member;
-- delete from program_member;
-- delete from program_address;
-- delete from program_keyword;
```

2. Selection on tables
```sql
select * from program;
select * from keyword;
select * from address;
select * from member;

select * from program_keyword;
select * from program_address;
select * from program_member;
```

3. Get all keywords linked to project id
```sql
select "keywordName" from program, keyword, program_keyword
where program."programId" = program_keyword."programId"
and keyword."keywordId" = program_keyword."keywordId"
and program."programId" = 'id';
```

4. Get all addresses linked to project id
```sql
select "city" from program, address, program_address
where program."programId" = program_address."programId"
and address."addressId" = program_address."addressId"
and program."programId" = 'id';
```

5. Get all members linked to project id
```sql
select "name" from program, member, program_member
where program."programId" = program_member."programId"
and member."memberId" = program_member."memberId"
and program."programId" = 'id';
```

6. Drop all sequences

```sql
DROP SEQUENCE address_addressId_seq;
DROP SEQUENCE keyword_keywordId_seq; 
DROP SEQUENCE member_memberId_seq;
DROP SEQUENCE program_address_id_seq;
DROP SEQUENCE program_keyword_id_seq;
DROP SEQUENCE program_member_id_seq;
DROP SEQUENCE program_programId_seq;
```