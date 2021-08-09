const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const app = express()
app.use(cors());
app.use(express.json({
  type: ['application.json']
}));

const port = process.env.PORT || 5501;

  
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


const KEY = process.env.REACT_APP_API_KEY;
let baseUrl = `https://api.openweathermap.org/data/2.5/weather?`;
let apiKey =`&appid=${KEY}`;
let units = '&units=imperial';
let searchLoc, apiLoc, apiUrl;


// Recieves POST from client, cleans input of special characters and passes result to GET request.
// Allows for potential upgrade to different Openweather API which requires
// coordinates or location code. In that case, this function would search a JSON file using
// the string input and return the unique location code for the search.
app.post('/search-loc', (req, res) => {
  console.log(req.body.loc)
  if (req.body.loc) {
      let locChrFilter = req.body.loc.toLowerCase().replace(/[^a-zA-Z -,]/g, "");
      console.log(locChrFilter)
    searchLoc = locChrFilter;
      res.json("Location Recieved")
  } else {
      res.json("Location NOT Recieved")
  }
});

// Accepts cleaned input, accesses OpenWeather Current Weather API, and returns result
// to the client.
app.get('/weather', (req, res) => {
    if(searchLoc) {
        apiLoc = `q=${searchLoc}`;
        apiUrl = baseUrl + apiLoc + apiKey + units;

        axios.get(apiUrl)
            .then(response => {
                // console.log(response.data.cod)
                console.log(response.data)
                res.json(response.data);
            })
            .catch(error => {
                if (error.response) {
                  // Request made and server responded
                  console.log('Response error: data', error.response.data);
                  console.log('Response error: status', error.response.status);
                  console.log('Response error: headers', error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  console.log('Request error', error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error other', error.message);
                }

                res.json({ cod: '404', message: 'city not found' })
            });
    } else {
        res.json("Invalid Location")
    }
})
