const SERVER_NAME = "simple-scraper";
const SERVER_PORT = 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const links = [];
const redditLinks = [];
const nonRedditLinks = [];

app.get("/", (req, res) => {
  res.json("Hello World, from simple-scraper!");
});

app.get("/test-route", (req, res) => {
  axios.get("https://www.reddit.com").then((response) => {
    const html = response.data;

    const $ = cheerio.load(html);

    $("a", html).each(function () {
      const text = $(this)
        .text()
        .replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
        .replace(/\s+/g, " ") // collapase multiple spaces to one
        .trim(); // remove leading/trailing spaces.
      const href = $(this).attr("href");

      if (href === "#" || href.match(/[./]reddit.com/i)) {
        redditLinks.push({
          text,
          href,
        });
      } else {
        nonRedditLinks.push({
          text,
          href,
        });
      }
    });

    res.json({
      redditLinks,
      nonRedditLinks,
    });
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`${SERVER_NAME} running on ${SERVER_PORT}`);
});
