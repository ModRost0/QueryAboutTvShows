const express = require("express")
const path = require('path')
const axios = require('axios')
const methodOverride = require('method-override')
const { Z_DATA_ERROR } = require("zlib")
const { render } = require("ejs")
let app = express()
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

let titleMain = []
let data = {
    Data: 1,
    popular: 2,
    upcomen: 3,
    mainTitle: 1,
    reqObj: {},
    rating: 1,
    savRating: {},
    hasChanged: true,
    fav: []
}


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZGI4YzI5MDg3YzljYTJhMGNjZWMzYjljZTE4OTViNCIsIm5iZiI6MTcxOTQxMzczMC4xNDY2NjEsInN1YiI6IjY2NzdjZDMxNjQ0YzIzM2YzMjIzNDM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.psixHV8tFQC0Il7aBOZlugwMrC57pzCx3gbinWIH1oA'
    }
};
// const test = async()=>{
//     let x = await axios('https://api.themoviedb.org/3/movie/242101/images',options)
//      console.log(x)
// }
let tvApiSearch = async (title) => {
    try {
        let apiRes = await axios(`https://api.tvmaze.com/search/shows?q=${title}`);
        data = { Data: apiRes.data };
    } catch (error) {

    }
}
const tvPopularShows = async () => {
    try {
        let popRes = await axios(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`, options);
        console.log(popRes)
        data = { popular: popRes.data.results }
    } catch (error) {

    }
}
let imgTofetch = 0
const upcommingShows = async () => {
    try {
        let upcomeRes = await axios('https://api.themoviedb.org/3/movie/upcoming?&language=en-US&page=1', options);
        data = { upcomen: upcomeRes.data.results }
        console.log(data.upcomen)
    } catch (error) {
        console.log(error)
    }
}
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


app.get('/home', (req, res) => {
    res.render('home/index', '')
})
app.get('/', (req, res) => {
    res.redirect('home')
})
app.get('/home/topmovies', async (req, res) => {
    try {
        await tvPopularShows()
        // await imageFetcher()
        // await test()
        const source = {
            data: data.popular,
            // img:data.img
        }
        console.log(data.popular)
        // console.log(source.img)
        res.render('home/topmovies', { source })
    } catch (error) {
        console.log(error)
    }
})
app.post('/home/results', async (req, res) => {
    let title = req.body.search
    titleMain.push(title)

    try {
        await tvApiSearch(titleMain[0])

        res.redirect('/home/results')
    }
    catch (e) {
        console.log(e)
    }
})
app.get('/home/results', (req, res) => {

    const source = {
        title: titleMain[0],
        searches: data.Data
    };
    res.render('home/results', { source });
    titleMain.pop();
})
app.get('/home/upcommingmovies', async (req, res) => {
    try {
        await upcommingShows();
        const source = {
            title: data.upcomen
        }
        res.render('home/latest', { source })
    } catch (error) {
        console.log(error)
    }

})
app.get('/home/results/:movieName', (req, res) => {
    const movieName = req.params.movieName;
    console.log('Movie Name:', movieName);
    let newData = {}; 
    const foundMovie = data.Data.find(e => e.show.name === movieName);
    let query = data.rating
    if (!foundMovie) {
        console.log('Movie not found');
        return;
    }
    console.log(foundMovie.show.rating)
    data.reqObj = { show: foundMovie.show };

    if (data.rating == 1) {
        if (foundMovie.show.rating.average > 5) {
            data.reqObj.show.rating.average = Math.floor((data.reqObj.show.rating.average - 5) * 10) / 10;
            console.log(data.reqObj.show.rating)
        } else {
            console.log('Rating not greater than 5');
        }
    }else if (data.rating) {
        data.reqObj.show.rating.average = data.rating;
    }

    newData.dataObj = data.reqObj;
    res.render('home/details', { newData });
});

app.get('/home/results/:name/edit', (req, res) => {
    let name = req.params.name
    res.render('home/patch', { name })
})
app.patch('/home/results/:movieName', (req, res) => {
    console.log(req.body)
    let { rating } = req.body
    let movieName = req.params.movieName
    data.rating = rating
    console.log(rating)
    // data.reqObj.show.rating.average = rating
    res.redirect(`/home/results/${movieName}`)
})

app.listen(3000, (req, res) => {
    console.log("listeneing on port 3000")
})