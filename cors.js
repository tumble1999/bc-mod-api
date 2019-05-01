const express = require("express");
const puppeteer = require("puppeteer");
const absolutify = require("absolutify");

var router = express.Router();

function getHostName(url) {
    var nohttp = url.replace('http://','').replace('https://','');
    var http = url.replace(nohttp,'');
    var hostname = http + nohttp.split(/[/?#]/)[0];
    return hostname;
}


router.use((req,res,next)=>{
    res.type("html");
    next();
});

router.use(async (req,res)=>{
    var url = req.path.substr(1);
    console.log("URL:",url);
    if(!url) {
        res.end();
        res.send("No URL provided");
        return;
    }
    try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${url}`);
    var document = await page.evaluate(()=>document.documentElement.outerHTML);
    document = absolutify(document,`/cors/${getHostName(url)}`);

    res.send(document);
    } catch(e) {
        res.end();
        res.send("No URL provided" + e);
        return;
    }
});



module.exports = router;