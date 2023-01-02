const puppeteer = require('puppeteer');
const express = require('express');
const {body,query,validationResult}=require('express-validator');
const nodemailer=require("nodemailer");
const fs = require('fs')
require('dotenv').config({path:"D:/Screenshot/.env"})
app = express();

bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 
app.use(express.static("/Screenshot"))

app.post('/screenshot',
body("url").exists().isLength({min:1}).withMessage("Check url"),
body("username").exists().isLength({min:1}).withMessage("Check username"),
body("password").exists().isLength({min:1}).withMessage("Check Password"),
body("personnumber").exists().isLength({min:1}).withMessage("Check personnumber")
,(async (req,res)=> {

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };
        const errors=validationResult(req).formatWith(errorFormatter)
        if(!errors.isEmpty()){
          return res.status(422).json({errors:errors.array()})
        }
        let payperiod=""
        let startdate=""
        let enddate=""
        let headless=true
	let description=""
	let email=""
        if(req.body.Payperiod!=null){
          payperiod=req.body.Payperiod
        }
        if(req.body.startdate!=null){
          startdate=req.body.startdate.replaceAll("/","")
        }
        if(req.body.enddate!=null){
          enddate=req.body.enddate.replaceAll("/","")
        }
        if(req.body.headless!=null){
          headerless=req.body.headless
        }
	if(req.body.description!=null){
	  description=req.body.description
	}
	if(req.body.email!=null){
	email=req.body.email
	}

        console.log(payperiod)
        console.log(email)
        const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless:req.body.headless
      });
      const url=req.body.url+"/timekeeping#/timecard"
    
      try{
        const page = await browser.newPage();
        await page.goto(url,{waitUntill:'networkidle2'});
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
        await page.waitForTimeout(3000)
        await page.waitForSelector("#employeeInformationWrapper > div.emp-nav-list > div.emp-nav-id")
        const element=await page.$('#employeeInformationWrapper > div.emp-nav-list > div.emp-nav-id')
        const personnumber=await page.evaluate(el => el.textContent, element)
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
        await page.waitForSelector("#_timeFrame")
        const element1=await page.$('#_timeFrame')
        const spanname=await page.evaluate(el => el.textContent, element1)
        const span=spanname.replaceAll("/","-")
        const filename=personnumber+" "+description+" "+span+".png"
        console.log(filename)
        await page.waitForTimeout(3000)
        await page.waitForSelector("#tile_tile_7 > span")
        await page.click('#tile_tile_7 > span')
        await page.waitForTimeout(4000)
        await page.screenshot({path:"./Screenshots/"+filename});
        await page.waitForTimeout(3000)
        await page.click('#hamburgerMenu > span')
        await page.waitForTimeout(3000)
        await page.click('#profileSignOut_button')
        await browser.close(); // <-- close browser after everything is done*/
        if( email!=""){
            transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
            user:"mailtesting5656@gmail.com",
            pass:"ecguicfgiwxoyqwu"
            },
            tls:{
            rejectUnauthorized:false,
            }
            });
            
            let mailOptions={
            from:"mailtesting5656@gmail.com",
            to:req.body.email || "venkateshm2406@gmail.com",
            subject:"Testing Result of "+description || personnumber,
            attachments:[
            {filename:filename || "pic.png",path:"./Screenshots/"+filename || "./Screenshots/pic.png"}
            ]
            };
            transporter.sendMail(mailOptions,function(err,success){
            if(err){
               console.log(err)
            }else{
               console.log("Email is Sent")
            }
            })
        }
      res.status(200).download(filename,{ root: './Screenshots' })
    }catch(err){
      await browser.close()
      res.status(500).send(err)
    }
    }))

    app.get('/screenshot',
    query("url").exists().isLength({min:1}).withMessage('Check URL'),
    query("username").exists().isLength({min:1}).withMessage('Check Username'),
    query("password").exists().isLength({min:1}).withMessage('Check Password'),
    query("personnumber").exists().isLength({min:1}).withMessage('Check Person Number'),

    
    (async (req,res)=> {

      const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return `${location}[${param}]: ${msg}`;
      };
            const errors=validationResult(req).formatWith(errorFormatter)
            if(!errors.isEmpty()){
              return res.status(422).json({errors:errors.array()})
            }
      
      let payperiod=""
      let startdate=""
      let enddate=""
      let headerless=true
      if(req.query.Payperiod!=null){
        payperiod=parseInt(req.query.Payperiod)
      }
      if(req.query.startdate!=null){
        startdate=req.query.startdate.replaceAll("/","")
      }
      if(req.query.enddate!=null){
        enddate=req.query.enddate.replaceAll("/","")
      }
      if(req.query.headless!=null){
        headerless=req.query.headless
      }
      console.log(payperiod)
      const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless:false
    });
    if(isNaN(payperiod)){
      payperiod=""
    }
    const url=req.query.url+"/timekeeping#/timecard"
    try{
      const page = await browser.newPage();
      await page.goto(url,{waitUntill:'networkidle2'});
      await page.setViewport({width:1200, height:1000});
      await page.waitForSelector('#idToken1')
      await page.waitForSelector('#wrapper')
      await page.type('#idToken1',req.query.username,{delay:100})
      await page.type('#idToken2',req.query.password,{delay:100})
      await page.waitForTimeout(1000)
      await page.click('#loginButton_0')
      await page.waitForNetworkIdle({idleTime:3000})
      await page.waitForSelector('#combo_toggleBtn > i')
      await page.click('#combo_toggleBtn > i')
      await page.waitForTimeout(3000)
      await page.click('#combo_searchbox')
      await page.type('#combo_searchbox',req.query.personnumber);
      await page.waitForTimeout(3000)
      await page.click("#combo_li0 > a")
      await page.waitForTimeout(3000)
      await page.waitForSelector("#employeeInformationWrapper > div.emp-nav-list > div.emp-nav-id")
        const element=await page.$('#employeeInformationWrapper > div.emp-nav-list > div.emp-nav-id')
        const personnumber=await page.evaluate(el => el.textContent, element)
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
        await page.waitForSelector("#_timeFrame")
        const element1=await page.$('#_timeFrame')
        const spanname=await page.evaluate(el => el.textContent, element1)
        const span=spanname.replaceAll("/","-")
        const filename=personnumber+" "+span+".png"
        console.log(filename)
        await page.waitForTimeout(3000)
        await page.waitForSelector("#tile_tile_7 > span")
        await page.click('#tile_tile_7 > span')
        await page.waitForTimeout(4000)
        await page.screenshot({path:"./Screenshots/"+filename});
        await page.waitForTimeout(3000)
        await page.click('#hamburgerMenu > span')
        await page.waitForTimeout(3000)
        await page.click('#profileSignOut_button')
        await browser.close(); // <-- close browser after everything is done*/
      res.status(200).download(filename,{ root: './Screenshots' })
    }catch(err){
      await browser.close()
      res.status(500).send(err)
    }
    }))

    app.post('/send', (req, res) => {
    transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
    user:"mailtesting5656@gmail.com",
    pass:"ecguicfgiwxoyqwu"
    },
    tls:{
    rejectUnauthorized:false,
    }
    });
    attachmentlist={}
    
    let mailOptions={
    from:"mailtesting5656@gmail.com",
    to:req.body.email,
    subject:"Testing Result",
    attachments:[
    {filename:req.body.filename,path:"/Screenshots/"+req.body.filename}
    ]
    };
    
    transporter.sendMail(mailOptions,function(err,success){
    if(err){
    console.log(err)
    res.status(500).json("Something went wrong")
    }else{
      res.status(200).json("Email is Sent")
    console.log("Email is Sent")
    }
    })
  })

  app.get('/filelist',(req,res)=>{
    let filelist=""
    try{    
    fs.readdirSync("./Screenshots").forEach(file => {
	    let  timediff="";
	    fs.stat("./Screenshots/"+file,(error,stats)=>{
	if(error){
	     console.log(error);
	     return
	}else{
		var date1=new Date()
		var date2=new Date(stats.birthtime)
		var diff=date1.getTime()-date2.getTime()
		var mins=Math.round(diff/60000)
		timediff="Created "+String(mins)+" minutes ago"
		if(mins>60){
	    	     timediff="Created "+String(Math.round(mins/60,1).toFixed(1))+" hours ago"
			if(Math.round(mins/60,1).toFixed(1)>16){
			      timediff="Created "+String((Math.round(Math.round(diff/60000),1)/1440).toFixed(1))+" days ago"
			}
		}
	}
	    })
		    filelist+=file+" "+timediff+"\n"
    
      
    });
    res.status(200).send(filelist)
  }catch{
    res.status(500).json(err)
  }

  })

  app.get('/filelist/:id',(req,res)=>{
    let filelist=""
    //console.log(req.params.id)
    try{

    fs.readdirSync("./Screenshots").filter(file => file.startsWith(req.params.id)).forEach(file => {
      filelist+=file+"\n"
      
    });
    //console.log(filelist)
    res.status(200).send(filelist)
  }catch{
    res.status(500).json(err)
  }

  })


  app.listen(process.env.PORT_NUMBER || 8080, () => {
        console.log('ResponsesToFile App is listening now! Send them requests my way!');
        console.log(`Data is being stored at location:`);
      });
