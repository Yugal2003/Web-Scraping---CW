const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');

const url = 'https://www.amazon.com/s?k=phone&page=2&crid=18EUYBSP7O1SQ&qid=1702535235&sprefix=phon%2Caps%2C280&ref=sr_pg_2';

const scrapeData = async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const MobileData = [];

    $('div[data-component-type="s-search-result"]').each((index, element) => {
      const Name = $(element).find('h2 a span').text().trim();
      const Price = $(element).find('a-price-whole').text().trim();
      const Rating = $(element).find('a-icon a-icon-star-small a-star-small-4 aok-align-bottom span').text().trim();

      MobileData.push({
        Name,
        Price,
        Rating
      });
    });

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(MobileData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Tech Mobile');
    xlsx.writeFile(workbook, 'tech_mobile.xlsx');

    console.log('Data saved to tech_mobile.xlsx');
  } catch (error) {
    console.error('Error:', error);
  }
};

scrapeData();