
$.get('/api/matches').done(data => {
    $('#h').hide()
    if (data.status == 500) {
        let outerDiv = document.createElement('div'),
            cardHeader = document.createElement('div'),
            cardBody = document.createElement('div')
        $(outerDiv).addClass('col-sm-8 card outerDiv bg-danger text-white')
        $(cardHeader).addClass('card-header headerDiv text-white bg-danger').html(`${data.msg.status}`)
        $(cardBody).addClass('card-body text-white').html(`<pre class="m-0 text-white">${JSON.stringify(data.msg, null, 2)}</pre>`)
        let results = $('#matches .row')
        $(outerDiv).append(cardHeader).append(cardBody).appendTo(results)
    }
    if (data.status == 200) {
        let matches = data.matches
        matches.forEach(match => {
            let outerDiv = document.createElement('div'),
                cardHeader = document.createElement('div'),
                cardBody = document.createElement('div')
            $(outerDiv).addClass('col-sm-8 card outerDiv')

            $(cardHeader).addClass('card-header headerDiv text').html(`${match.name}`)
            if (match.matchType.matchWinner != undefined) {
                $(cardHeader).append(` &nbsp;&nbsp;&nbsp;&nbsp; Winner: ${matches.matchType.matchWinner}`)
            }
            
            let score = ""
            match.score.forEach(sc => {
                score += `${sc.inning}: ${sc.r}-${sc.w} (${sc.o}), `
            });
            score = score.slice(0, -2)

            $(cardBody).addClass('card-body text').
                html(`
                    Match Type: ${match.matchType} <br> 
                    Status: ${match.status} <br>
                    Date: ${match.date} <br> 
                    Venue: ${match.venue} <br>
                    Score:  ${score} <br>

                `)
            let results = $('#matches .row')
            $(outerDiv).append(cardHeader).append(cardBody).appendTo(results)
        });
    }
})