const express = require("express")
const path = require('path')
const axios = require('axios')
let titleMain = []
let data = {}
let app = express()

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer 4db8c29087c9ca2a0ccec3b9ce1895b4'
    }
  };
    // const test = async()=>{
    //     let x = await axios('https://api.themoviedb.org/3/movie/242101/images',options)
    //      console.log(x)
    // }
let tvApiSearch = async (title) => {
    try {
        let apiRes = await axios(`https://api.tvmaze.com/search/shows?q=${title}`);
        data = { data: apiRes.data };
    } catch (error) {
            
    }
}
// const tvPopularShows = async () => {
//     try {
//         let popRes = await axios(``,options);
//         data = { popular: popRes.data.results }
//     } catch (error) {
            
//     }
// }
// let imgTofetch = 0
// const upcommingShows = async () =>{
//     try {
//         let upcomeRes = await axios('https://api.themoviedb.org/3/movie/upcoming?&language=en-US&page=1',options);
//         data = { upcomen: upcomeRes.data.results }
//         console.log(data.upcomen)
//     } catch (error) {
//         console.log(error)
//     }
// }
// const imageFetcher = async () =>{
//     try {
//         console.log(data.popular)
//         test()
//         data.popular.forEach( async e=> {
//                console.log(e.id)
//                imgTofetch = e.id.toString()
//              let imgRes = await axios(`https://api.themoviedb.org/3/movie/${imgTofetch}/images`, options)
//             data = {
//                 img:imgRes 
//             }  
//         })
            
           
//             console.log(imgRes)
//     }
//     catch (error) {
//         // console.log(error)
//     }
// }
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/home', (req, res) => {
    res.render('home/index', '')
})
// app.get('/topmovies', async (req, res) => {
//     try {
//         await tvPopularShows()
//         await imageFetcher()
//         await test()
//         const source = {
//             data: data.popular,
//             img:data.img
//         }
//         // console.log(data.popular)
//         // console.log(source.img)
//         res.render('home/topmovies', { source })
//     } catch (error) {
//         console.log(error)
//     }
// })
app.post('/home/results', async (req, res) => {
    let title = req.body.search
    titleMain.push(title)
    console.log(titleMain)
    try {
        await tvApiSearch(titleMain[0])

        res.redirect('/home/results')
    }
    catch (e) {
        console.log(e)
    }
})

app.get('/home/results', (req, res) => {
    console.log(data);

    const source = {
        title: titleMain[0],
        searches: data.data
    };
    res.render('home/results', { source });
    titleMain.pop();
})
// app.get('/upcommingmovies', async(req, res) => {
//     try {
//         await upcommingShows();
//     const source = {
//         title:data.upcomen
//     }
//     res.render('home/latest',{source})
//     } catch (error) {
//         console.log(error)
//     }
   
// })

app.listen(3000, (req, res) => {
    console.log("listeneing on port 3000")
})