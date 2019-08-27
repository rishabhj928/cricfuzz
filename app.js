require('dotenv').config()
let express = require("express"),
    app = express(),
    PORT = process.env.PORT,
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
    res.sendFile(path.resolve(__dirname + '/public/index.html'))
})

app.get('/api/matches', (req, res) => {
    let url = `http://cricapi.com/api/matches?apikey=${key}`
    request(url, { json: true }, (err, resp, body) => {
        if (err) return res.json({
            error: 1,
            msg: err,
        })
        let data = body.matches.filter(match => {
            return match.matchStarted
        })

        let newData = data.map((element, index) => {
            return new Promise((resolve, reject) => {
                let requrl = `http://cricapi.com/api/cricketScore?apikey=${key}&unique_id=${element.unique_id}`
                request(requrl, { json: true }, (err, resp, body) => {
                    element.score = body.score
                    element.stat = body.stat
                    resolve(element);
                })
            });
        })
        Promise.all(newData).then(data => {
            res.json({
                error: 0,
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