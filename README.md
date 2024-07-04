
# Parser of [list.in.ua](https://list.in.ua/) website

## What is it do?
  
  This project parsing info of companies from website and saving in .csv file
  
  Parsing info of:
  - title
  - catalog
  - description
  - information
  - website
  - social medias
  - phone number
  - services
  - city
  - address
  - coordinates 

Array of cities to parse:
```js
const  cities  = ['Львів', 'Івано-Франківськ'];	
```

Array of tags to filter parse info:
```js
const  tags  = ['Курси', 'Курс', '...'];
```
  
## Example:

| Title | Catalog | Description | Information | WebSite | Social Medias | Phone | Services | City | Address | Coordinates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Auto-repair | cars | Repering cars and mechanic service | auto-repair | http://auto-repair.com/ | https://instagram.com/auto-repair, https://facebook.com/auto-repair, auto-repair@mail.com | +380 66 501 75-41 | cars, repeirs, auto, mechanic | Kiev | str. Voksalna, 15 | 23°58'47.1 N 49°48'14.7 E |
|...|...|...|...|...|...|...|...|...|...|...|

<hr />
This is open source project.
In this project using:

- [puppeteer](https://pptr.dev/)
- [csv-writer](https://github.com/ryu1kn/csv-writer)




  
