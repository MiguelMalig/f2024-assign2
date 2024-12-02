document.addEventListener("DOMContentLoaded", function() {
    const racesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=";
    const resultsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
    const qualifyingURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="
    const season = document.querySelector("#season");
    

    season.addEventListener("change", e => {
        let resultData = localStorage.getItem("results");
        let qualifyingData = localStorage.getItem("qualifying"); 
        let data = localStorage.getItem("races"); 
        if (!data) {
            getSeasonData().then(data => {
                resultData = data[1];
                qualifyingData = data[2];
                racesData = data[0];
                displayData(racesData, resultData, qualifyingData);

                localStorage.setItem("races", JSON.stringify(data[0])); 
                localStorage.setItem("results", JSON.stringify(data[1])); 
                localStorage.SetItem("qualifying", JSON.stringify(data[2])); 
            })
        }
        else {
            resultData = JSON.parse(localStorage("results")); 
            qualifyingData = JSON.parse(localStorage("qualifying")); 
            racesData = JSON.parse(localStorage("races"));
            displayData(racesData, resultData, qualifyingData);
        }
    })
});
function getSeasonData(season) {
    let racesPromise = fetch(racesAPI + season).then(response => response.json());
    let resultsPromise = fetch(resultsAPI + season).then(response => response.json());
    let qualifyingPromise = fetch(qualifyingAPI + season).then(response => response.json());
    return Promise.all(racesPromise,resultsPromise,qualifyingPromise)
}
function displayData(races, results, qualifying) {
    displayRaces(races);
    displayResults(results);
    displayQualifying(qualifying);
}
function displayRaces(races) {
    races.forEach(r => {
        
    });
}
function displayResults(results) {
    results.forEach(r => {

    });
}
function displayQualifying(qualifying) {
    qualifying.forEach(q => {

    });
}
function displaySingleRace(race) {
    const tr = document.createElement("tr");
    const roundtd = document.createElement("td");
    const nametd = document.createElement("td");
    roundtd.textContent = race.round;
    nametd.textContent = race.name;
    tr.appendChild(roundtd);
    tr.appendChild(nametd);
    race.addEventListener("click", (e) => {
        
    })
}
function displaySingleResult(result) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    result.addEventListener("click", (e) => {
        
    })
}
function displaySingleQualifying(qualifying) {
    const tr = document.createElement("tr");
    const postd = document.createElement("td");
    const nametd = document.createElement("td");
    qualifying.addEventListener("click", (e) => {
        
    })
}