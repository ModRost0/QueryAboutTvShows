const express = require("express")
const path = require('path')
const axios = require('axios')
let titleMain = []
let data = {}
let app = express()
let tvApiSearch = async(title)=>{
    try {
        let apiRes = await axios(`https://api.tvmaze.com/search/shows?q=${title}`);
        data = {data :apiRes.data};
        } catch (error) {
        console.log(error)
    }
        
    }
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/home',(req,res)=>{
    res.render('home/index','')
})
app.get('/topmovies',(req,res)=>{
    res.render('home/topmovies','')
})
app.post('/home/results',async(req,res)=>{
    let title = req.body.search
    titleMain.push(title)
    console.log(titleMain)
    try{
        await tvApiSearch(titleMain[0])
        
        res.redirect('/home/results')
    }
    catch(e){
        console.log(e)
    }
    
   
})
app.get('/home/results', (req, res) => {
    console.log(data);
    
    const source = {
        title: titleMain[0],
        searches:data.data
    };
    res.render('home/results', {source});
    titleMain.pop();
})

app.listen(3000,(req,res)=>{
    console.log("listeneing on port 3000")
})
