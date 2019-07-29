const express = require('express');
const axios = require('axios');
const router = express.Router();
const nfl_data_api_url = 'http://delivery.chalk247.com/team_list/NFL.JSON?api_key=74db8efa2a6db279393b433d97c2bc843f8e32b0';



/* GET ALL NFL TEAMS. */
router.get('/', function (req, res, next) {

    axios.get(nfl_data_api_url)
        .then(response => {
            let responseData = response.data.results.data.team;
            res.status(200).json(responseData);
        })
        .catch(error => {
            res.status(error.status).json(error);
        });
});


/* GET DATA COLUMNS. */
router.get('/datacolumns', function (req, res) {

    axios.get(nfl_data_api_url)
        .then(response => {
            let responseData = response.data.results.columns;
            res.status(200).json(responseData);
        })
        .catch(error => {
            res.status(error.status).json(error);
        });
});

/* Redirect to "/" route if no match_string is provided*/
router.get('/filter/:datacolumn', async function (req, res, next) {
    res.redirect(`../../`);
});

/* FILTER NFL TEAMS. */
router.get('/filter/:datacolumn/:match_string', async function (req, res, next) {
    let response;
    let teams;
    let filterColumn = req.params.datacolumn;
    let filterString = req.params.match_string;

    try {
        response = await axios.get(nfl_data_api_url);
    } catch (error) {
        console.error(error.data);
        return 0;
    }
    teams = response.data.results.data.team;
    filteredTeams = teams.filter(team => team[filterColumn].toLowerCase().includes(filterString.toLowerCase()));
    
    if (filteredTeams.length === 0) {
        res.status(404).json({});
        return 0;
    }

    res.status(200).json(filteredTeams);
});

module.exports = router;
