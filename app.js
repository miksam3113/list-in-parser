const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


async function start(selector) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const data = [];
    const cities = ['Львів', 'Івано-Франківськ', 'Київ'];
    const tags = ['Аніматор', 'Аніматори', 'аніматор', 'аніматори', 'Аніматора', 'аніматора', 'Курси', 'Курс', 'курси', 'курс', 'садок', 'заняття', 'Заняття', 'Квест', 'Квести', 'квести', 'квест', 'гурток', 'гуртки', 'Репетитор', 'Репетитори', 'Гурток', 'Гуртки', 'Репетиторство', 'репетитор', 'репетитори', 'репетиторство', 'Розваги', 'розваги', 'Розвага', 'розвага', 'Розвагу', 'розвагу', 'няня', 'Няня', 'Майстер класи', 'майстер класи', 'Майстер клас', 'майстер клас', 'Розвитку', 'розвитку', 'розвиток', 'Розвиток', 'Садочок', 'садочок', 'Розвиваючий', 'розвиваючий'];

    const csvWriter = createCsvWriter({
        path: './results/result3.csv',
        header: [
            {id: 'title', title: 'Title'},
            {id: 'catalog', title: 'Catalog'},
            {id: 'description', title: 'Description'},
            {id: 'information', title: 'Information'},
            {id: 'website', title: 'WebSite'},
            {id: 'socmeds', title: 'Social Medias'},
            {id: 'phone', title: 'Phone'},
            {id: 'services', title: 'Services'},
            {id: 'city', title: 'City'},
            {id: 'address', title: 'Address'},
            {id: 'coordinates', title: 'Coordinates'},
        ]
    });

    for(let c = 0; c < cities.length-1; c++) {
        await page.goto(`https://list.in.ua/${cities[c]}/-`);

        const divsCount = await page.$$eval('#itemsList > .item-search.row.js-load-business-container', divs => divs.length);
        const pagesCount = await page.$eval('#itemsList > div.search-how-block > div > ul > li:last-child > a', page => page.innerText);

        for(let j = 1; j <= pagesCount; j++) {
            for(let i = 1; i <= divsCount; i++) {
                try {
                    let title = null, desc = null, url = null, phone = null, address = null, mail = null, website = null, socmeds = [], catalog = null;

                    const element = await page.$eval(`#itemsList > div:nth-child(${i})`, el => el.className === "item-search row js-load-business-container");

                    if(element) {
                        title = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-5.col-sm-12.col-xs-12 > h2 > a`, el => el.innerText);
                        url = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-5.col-sm-12.col-xs-12 > h2 > a`, el => el.href);
                        desc = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-5.col-sm-12.col-xs-12 > div.item-search__description`, el => el.innerText);

                        const regEXP = /\/\/([^\/]+)\/([^\/]+)\/\d+\//

                        if(regEXP.test(url)) {
                            catalog = decodeURIComponent(url.match(regEXP)[2]);
                        }

                        const butsCount = await page.$$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div`, divs => divs.length);

                        for(let y = 1; y <= butsCount; y++) {
                            const but = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y})`, el => el.className);

                            if(but === "mobile-hide item-search__line-wrap") {
                                phone = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y})`, el => el.innerText);
                            } else if (but === "item-search__text company-address icon icon-map-new") {
                                address = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div.item-search__text.company-address`, el => el.innerText);
                            } else if (but === "item-search__line-wrap") {
                                const elem = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y})`, el => el.innerText);

                                if(elem) {
                                    const but_el = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y}) > div > a`, el => el ? el.className : "") || "";

                                    if(but_el === "color-black item-search__company-link") {
                                        mail = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y})`, el => el.innerText);
                                        socmeds.push(mail);
                                    } else if(but_el === "color-black item-search__company-link js-store-user-action-statistic") {
                                        const socmedCount = await page.$$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y}) > div`, el => el.length);

                                        for(let k = 1; k <= socmedCount; k++) {
                                            const link = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y}) > div:nth-child(${k})`, el => el.classList);

                                            if(link[3] === "icon-website-new") {
                                                website = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y}) > div:nth-child(${k}) > a`, el => el.href);
                                            } else {
                                                const socmed = await page.$eval(`#itemsList > div:nth-child(${i}) > div.col-md-4.col-sm-12.col-xs-12.item-search__company-info-wrap > div.item-search__company-info > div:nth-child(${y}) > div:nth-child(${k}) > a`, el => el.href);
                                                socmeds.push(socmed);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        data.push({title, url, desc, phone, address, mail, website, socmeds, catalog, city: cities[c]});
                        console.log("company: ", data.length);
                    }
                } catch(e) {
                    console.log(e);
                }

            }
            await page.goto(`https://list.in.ua/${cities[c]}/-/page/${j+1}`);
        }
    }

    const records = [];

    for(let i = 0; i < data.length; i++) {
        try {
            await page.goto(data[i].url, { waitUntil: 'load' }  );

            let script = await page.$eval('body > script:last-child', el => el.innerText || null);

            let coordinates = null;

            if(script !== null) {
                script = JSON.parse(script);

                function convertCoordinate(coord) {
                    let degrees = Math.floor(coord);
                    let minutes = Math.floor((coord - degrees) * 60);
                    let seconds = ((coord - degrees - minutes / 60) * 3600).toFixed(1);
                    return degrees + "°" + minutes + "'" + seconds + '"';
                }

                const latitude = script.geo[0].latitude;
                const longitude = script.geo[0].longitude;

                let latitudeStr = convertCoordinate(latitude);
                let longitudeStr = convertCoordinate(longitude);

                let latitudeDirection = (latitude >= 0) ? "N" : "S";
                let longitudeDirection = (longitude >= 0) ? "E" : "W";

                coordinates = latitudeStr + latitudeDirection + " " + longitudeStr + longitudeDirection;
            }

            const information = await page.$eval('#comp-information > div:nth-child(2) > div > div.text-about-company.js-text-about-company', el => el.innerText);

            await page.waitForSelector('#tagline > div > div > a');

            const servicesCount = await page.$$eval('#tagline > div > div > a', el => el.length);
            const services = [];
            let isServices = false;

            for(let j = 1; j <= servicesCount; j++) {
                const service = await page.$eval(`#tagline > div > div > a:nth-child(${j})`, el => el.innerText);

                for (let s = 0; s < tags.length; s++) {
                    if(tags[s] === service.trim()) {
                        isServices = true;
                    }
                }

                services.push(service.trim());
            }

            if(isServices) {
                records.push({
                    title: data[i].title,
                    catalog: data[i].catalog,
                    description: data[i].desc,
                    information: information,
                    website: data[i].website,
                    socmeds: data[i].socmeds,
                    phone: data[i].phone,
                    services,
                    city: data[i].city,
                    address: data[i].address,
                    coordinates
                });
                console.log(`[${i}] pushed`);
            } else {
		        console.log(`[${i}] not match the tags`);
	        }
        } catch(e) {
            console.log(e);
        }
    }

    await csvWriter.writeRecords(records);

    await browser.close();
}

start();