
$.get('/api/matches').done(data => {
    $('#h').hide()
    let matches = data.matches
    matches.forEach(element => {
        let outerDiv = document.createElement('div'),
            cardHeader = document.createElement('div'),
            cardBody = document.createElement('div')
        $(outerDiv).addClass('col-sm-8 card outerDiv')
        $(cardHeader).addClass('card-header headerDiv text').html(`${element['team-1']} Vs. ${element['team-2']} &nbsp;&nbsp;&nbsp;&nbsp;`).append(`Winner: ${element['winner_team']}`)
        $(cardBody).addClass('card-body text').html(`Match Type: ${element.type} <br> Date: ${(element.date.split('T'))[0]} <br>    Score:  ${element.score} <br> ${element.stat} `)
        let results = $('#matches .row')
        $(outerDiv).append(cardHeader).append(cardBody).appendTo(results)
    });
})