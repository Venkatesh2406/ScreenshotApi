const puppeteer = require('puppeteer');
const express = require('express'),
app = express();
bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 
app.use(express.static("D:/Screenshot"+'/public'))
app.post('/write',(async (req,res)=> {
        let payperiod=""
        let startdate=""
        let enddate=""
        let headerless=true
        if(req.body.Payperiod!=null){
          payperiod=req.body.Payperiod
        }
        if(req.body.startdate!=null){
          startdate=req.body.startdate.replace("/","")
        }
        if(req.body.enddate!=null){
          enddate=req.body.enddate.replace("/","")
        }
        if(req.body.headless!=null){
          headerless=req.body.headless
        }
        console.log(payperiod)
        const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless:req.body.headless
      });
        const page = await browser.newPage();
        await page.goto(req.body.url,{waitUntill:'networkidle2'});
        await page.setViewport({width:1200, height:1000});
        await page.waitForSelector('#idToken1')
        await page.waitForSelector('#wrapper')
        await page.type('#idToken1',req.body.username,{delay:100})
        await page.type('#idToken2',req.body.password,{delay:100})
        await page.waitForTimeout(1000)
        await page.click('#loginButton_0')
        await page.waitForNetworkIdle({idleTime:3000})
        await page.waitForSelector('#combo_toggleBtn > i')
        await page.click('#combo_toggleBtn > i')
        await page.waitForTimeout(3000)
        await page.click('#combo_searchbox')
        await page.type('#combo_searchbox',req.body.personnumber);
        await page.waitForTimeout(3000)
        await page.click("#combo_li0 > a")
        await page.waitForTimeout(2000)
        if(payperiod===0 && startdate===null && enddate===null){
          await page.click('#_timeFrames_dropdownMenu > span.timeframe.btn-link > button')
          await page.waitForTimeout(3000)
          await page.click('#_timeFrames_expandable > div.timeframe-period > div.mid-content > div > ul > li:nth-child(1) > span')
          await page.waitForSelector('#tile_tile_7 > span')
        }
        if(payperiod===2 && startdate===null && enddate===null){
          await page.click('#_timeFrames_dropdownMenu > span.timeframe.btn-link > button')
          await page.waitForTimeout(3000)
          await page.click('#_timeFrames_expandable > div.timeframe-period > div.mid-content > div > ul > li:nth-child(3)')
        }
        if(startdate && enddate && payperiod===""){
          await page.click('#_timeFrames_dropdownMenu > span.timeframe.btn-link > button')
          await page.waitForTimeout(3000)
          await page.click('#_timeFrames_expandable > div.timeframe-period > div.fixed-footer > div > button')
          await page.click('#startDateTimeInput')
          await page.waitForTimeout(1000)
          await page.type('#startDateTimeInput',startdate)
          await page.click('#endDateTimeInput')
          await page.waitForTimeout(1000)
          await page.type('#endDateTimeInput',enddate)
          await page.waitForTimeout(2000)
          await page.click('#tfsApplyButton > span')
          await page.waitForNetworkIdle({idleTime:5000})
      }
      if(payperiod!=null && startdate!=null && enddate!=null){
        if(payperiod===0){
          await page.click('#_timeFrames_dropdownMenu > span.timeframe.btn-link > button')
          await page.waitForTimeout(3000)
          await page.click('#_timeFrames_expandable > div.timeframe-period > div.mid-content > div > ul > li:nth-child(1) > span')
          //await page.waitForSelector('#tile_tile_7 > span')
        }
        if(payperiod===2){
          await page.click('#_timeFrames_dropdownMenu > span.timeframe.btn-link > button')
          await page.waitForTimeout(3000)
          await page.click('#_timeFrames_expandable > div.timeframe-period > div.mid-content > div > ul > li:nth-child(3)')
        }
      }
        await page.waitForTimeout(3000)
        await page.waitForSelector("#tile_tile_7 > span")
        await page.click('#tile_tile_7 > span')
        await page.waitForTimeout(4000)
        await page.screenshot({path:"./pic.png"});
        await page.waitForTimeout(3000)
        await page.click('#hamburgerMenu > span')
        await page.waitForTimeout(3000)
        await page.click('#profileSignOut_button')
        await browser.close(); // <-- close browser after everything is done*/
      res.download('pic.png',{ root: '.' })
    }))

    
    app.listen(3000, () => {
        console.log('ResponsesToFile App is listening now! Send them requests my way!');
        console.log(`Data is being stored at location:`);
      });