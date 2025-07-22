const puppeteer = require('puppeteer-core');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    const query = process.argv.slice(2).join(' ');
    console.log(`Searching Twitter for: ${query}`);

    const rawCookies = process.env.TWITTER_COOKIES;
    if (!rawCookies) {
        console.error("Missing TWITTER_COOKIES in .env");
        process.exit(1);
    }

    let cookies;
    try {
        cookies = JSON.parse(rawCookies);
    } catch (err) {
        console.error("Failed to parse cookies:", err);
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Users\\besan\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    );
    await page.setCookie(...cookies);

    const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(query)}&f=live`;
    console.log(`Opening: ${searchUrl}`);

    try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForSelector('article', { timeout: 15000 });

        // Scroll to load more tweets
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await new Promise(resolve => setTimeout(resolve, 2000));

        }

        // Scrape tweets
        const tweets = await page.evaluate((query) => {
            const results = [];

            const articles = document.querySelectorAll('article');

            articles.forEach(article => {
                const textNode = article.querySelector('div[lang]');
                const anchor = article.querySelector('a[href*="/status/"]');

                if (!textNode || !anchor) return;

                const text = textNode.innerText.replace(/\s+/g, ' ').trim();
                const href = anchor.getAttribute('href');

                const tweetIdMatch = href.match(/status\/(\d+)/);
                const usernameMatch = href.match(/\/([a-zA-Z0-9_]+)\/status/);

                const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
                const username = usernameMatch ? usernameMatch[1] : null;
                const url = username && tweetId ? `https://x.com/${username}/status/${tweetId}` : null;

                // Try to detect if it's blue verified (uses aria-label)
                //const verified = !!article.querySelector('svg[aria-label="Verified account"]');

                results.push({
                    text,
                    tweetId,
                    username,
                    url,
                    //verified,
                    query
                });
            });

            return results;
        }, query);

        console.log(`Found ${tweets.length} tweets`);
        console.log(JSON.stringify(tweets)); // n8n output

        fs.writeFileSync('output.json', JSON.stringify(tweets, null, 2));
    } catch (err) {
        console.error("Error while scraping:", err);
    } finally {
        await browser.close();
    }
})();
