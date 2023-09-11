const puppeteer = require("puppeteer");
const fs = require("fs");

// Function to scrape car data for a single page
async function scrapeCarData(page, pageIndex, carDataArray) {
  const carListingElements = await page.$$eval(
    ".analytics-seg-info",
    (elements) => {
      return elements.map((element) => {
        return {
          make: element.getAttribute("data-seg-make"),
          model: element.getAttribute("data-seg-model"),
          year: parseInt(element.getAttribute("data-seg-year")),
          price: parseFloat(element.getAttribute("data-seg-price")),
        };
      });
    }
  );

  // Log the extracted car data
  for (let index = 0; index < carListingElements.length; index++) {
    console.log(
      `Page ${pageIndex} - Car #${index + 1}:`,
      carListingElements[index]
    );
  }

  // Push the carData objects into the carDataArray
  carDataArray.push(...carListingElements);
}

// Determine the total number of pages (replace this with the actual logic)
const totalPages = 5; // Change this to the number of pages you want to scrape
const carDataArray = []; // Array to store car data

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
    const pageUrl = `https://www.turners.co.nz/Cars/Used-Cars-for-Sale/?sortorder=7&pagesize=20&pageno=${pageIndex}&issearchsimilar=true`;
    await page.goto(pageUrl);

    // Wait for the car listing elements to load
    await page.waitForSelector(".analytics-seg-info");

    await scrapeCarData(page, pageIndex, carDataArray);
  }

  await browser.close();

  // Write the carDataArray to a JSON file
  const jsonFileName = "car_data30.json";
  fs.writeFileSync(jsonFileName, JSON.stringify(carDataArray, null, 2));
  console.log(`Scraped data saved to ${jsonFileName}`);
})();
