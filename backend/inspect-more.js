const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchUrl(res.headers.location));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    ).on("error", reject);
  });
}

async function inspectMore() {
  console.log("1. Inspecting Store Locations (/pages/stores)...");
  const storesHtml = await fetchUrl("https://www.d1store.com.au/pages/stores");
  fs.writeFileSync("stores_page.html", storesHtml);
  console.log("Stores HTML saved, size:", storesHtml.length);

  console.log("\n2. Inspecting Blog Articles (/blogs/news.json or articles)...");
  try {
    const newsJson = await fetchUrl("https://www.d1store.com.au/blogs/news.json");
    console.log("news.json length:", newsJson.length);
  } catch (e) {
    console.log("news.json not direct JSON");
  }

  console.log("\n3. Inspecting all collections across both pages...");
  const page1 = JSON.parse(await fetchUrl("https://www.d1store.com.au/collections.json?limit=250&page=1"));
  const page2 = JSON.parse(await fetchUrl("https://www.d1store.com.au/collections.json?limit=250&page=2"));
  const allCols = [...(page1.collections || []), ...(page2.collections || [])];
  console.log("Total collections:", allCols.length);

  // Filter collections that have images or banners
  const colsWithImages = allCols.filter(c => c.image);
  console.log("Collections with image banners:", colsWithImages.length);
  console.log("Sample banners:", colsWithImages.slice(0, 5).map(c => ({ title: c.title, handle: c.handle, banner: c.image.src })));
}

inspectMore().catch(console.error);
