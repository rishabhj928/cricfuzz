require('dotenv').config()
let express = require("express"),
    app = express(),
    PORT = process.env.PORT || 5000,
    path = require('path'),
    cricapi = require('cricapi'),
    bodyparser = require('body-parser'),
    request = require('request')

app.use( bodyparser.json() );       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static('./public'))

var key = process.env.API_KEY
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + 'index.html'))
})
app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/public/contact.html'))
})
app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/public/about.html'))
})

app.get('/api/matches', (req, res) => {
    let url = `https://api.cricapi.com/v1/matches?apikey=${key}`
    request(url, { json: true }, (err, resp, body) => {
        if (body.status == "failure") {
            delete body.apikey
            return res.json({
                status: 500,
                msg: body,
                matches: [],
            })
        }
        let data = body.data.filter(match => {
            return match.matchStarted
        })

        let newData = data.map((element, index) => {
            return new Promise((resolve, reject) => {
                let requrl = `https://api.cricapi.com/v1/match_info?apikey=${key}&offset=0&id=${element.id}`
                request(requrl, { json: true }, (err, resp, body) => {
                    element.matchData = body.data
                    resolve(element);
                })
            });
        })
        Promise.all(newData).then(data => {
            res.json({
                status: 200,
                matches: data
            })
        })
    })
})

app.get('*', (req, res) => {
    res.status(404)
    res.json({
        error: 1,
        msg: 'Invalid api endpopint.'
    })
})

app.listen(PORT, err => {
    if (err) return console.log(err)
    console.log(`server running at ${PORT}`)
})
