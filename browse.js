document.addEventListener("DOMContentLoaded", function() {
    const racesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=";
    const resultsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
    const qualifyingURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="
    const season = document.querySelector("#season");
    

    season.addEventListener("change", e => {
        let racesAPI = racesURL + e.target.value;
        let resultsAPI = resultsURL + e.target.value;
        let qualifyingAPI = qualifyingURL + e.target.value;

        let racesPromise = fetch(racesAPI).then(response => response.json());
        let resultsPromise = fetch(resultsAPI).then(response => response.json());
        let qualifyingPromise = fetch(qualifyingAPI).then(response => response.json());

        Promise.all(racesPromise ,resultsPromise , qualifyingPromise)
        .then(resolves => {
            const races = resolves[0];
            const results = resolves[1];
            const qualifying = resolves[2];
            

        })
    })
});

function displayData(races, results, qualifying) {

}
function displayRaces(races) {
    races.forEach(r => {
        
    });
}
function displaySingleRace(race) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    race,addEventListener("click", (e) => {
        
    })
}