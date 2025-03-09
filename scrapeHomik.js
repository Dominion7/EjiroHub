const puppeteer = require('puppeteer');

module.exports = async function scrapeHomikGlobal() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.homikglobal.com/', { waitUntil: 'networkidle2' });

  const products = await page.evaluate(() => {
    const productElements = document.querySelectorAll('.product'); // Adjust selector
    return Array.from(productElements).map(el => {
      const name = el.querySelector('.product-title')?.innerText || 'Unknown';
      const description = el.querySelector('.description')?.innerText || 'No description';
      const image = el.querySelector('img')?.src || '';
      const category = el.closest('.category-section')?.querySelector('h2')?.innerText || 'Uncategorized';
      const variants = Array.from(el.querySelectorAll('.variant-option')).map(v => ({
        color: v.querySelector('.color')?.innerText || 'Default',
        size: v.querySelector('.size')?.innerText || 'One Size',
        price: Math.round(parseFloat(v.querySelector('.price')?.innerText?.replace(/[^0-9.]/g, '') || 0) * 1.35),
        stock: parseInt(v.querySelector('.stock')?.innerText) || 10,
        images: [v.querySelector('img')?.src || image]
      }));
      return { name, description, images: [image], variants: variants.length ? variants : [{ color: 'Default', size: 'One Size', price: 0, stock: 10, images: [image] }], category, supplier: 'homikglobal' };
    });
  });

  await browser.close();
  return products;
};