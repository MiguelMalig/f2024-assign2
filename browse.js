document.addEventListener("DOMContentLoaded", function() {
    const racesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=";
    const resultsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
    const qualifyingURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="

    const season = document.querySelector("#season");
    
    console.log(season);

    let placeholder = document.createElement("option");
    placeholder.selected = true;
    placeholder.disabled = true;
    placeholder.textContent = "Select a season";
    season.appendChild(placeholder);
    
    let uniqueSeason = [2020,2021,2022,2023];

    uniqueSeason.forEach(u => {
        const option = document.createElement("option");
        option.textContent = u;
        option.value = u;
        season.appendChild(option);
    })

    season.addEventListener("change", e => {
        listRaces(e, season);

        let resultData = localStorage.getItem("results" + e.target.value);
        let qualifyingData = localStorage.getItem("qualifying" + e.target.value); 
        let data = localStorage.getItem("races" + e.target.value); 
        if (!data) { // if localStorage doesn't exist
            getSeasonData(e, racesURL, resultsURL, qualifyingURL).then(data => {
                console.log(data);
                resultData = data[1];
                qualifyingData = data[2];
                racesData = data[0];
                console.log(racesData);
                displayData(racesData, resultData, qualifyingData);

                localStorage.setItem("races" + e.target.value, JSON.stringify(data[0])); 
                localStorage.setItem("results" + e.target.value, JSON.stringify(data[1])); 
                localStorage.setItem("qualifying" + e.target.value, JSON.stringify(data[2])); 
            })
        }
        else { // if it exists, grab data from localStorage
            resultData = JSON.parse(localStorage.getItem("results" + e.target.value)); 
            qualifyingData = JSON.parse(localStorage.getItem("qualifying" + e.target.value)); 
            racesData = JSON.parse(localStorage.getItem("races" + e.target.value));
            displayRaces(racesData, resultData, qualifyingData);
        }
    })
});
function getSeasonData(season, racesAPI, resultsAPI, qualifyingAPI) {
    let racesPromise = fetch(racesAPI + season.target.value).then(response => response.json());
    let resultsPromise = fetch(resultsAPI + season.target.value).then(response => response.json());
    let qualifyingPromise = fetch(qualifyingAPI + season.target.value).then(response => response.json());

    return Promise.all([racesPromise,resultsPromise,qualifyingPromise]);
}
function displayRaces(races, results, qualifying) {
    displayData(races, results, qualifying);
}
function displayData(races, results, qualifying) {
    races.forEach(r => {
        displaySingleRace(r, results, qualifying);
    });
}
function displayResults(results, race) {
    results.forEach(r => {
        if (race.target.racename === r.race.name) {
            displaySingleResult(r);
        }
    });
}
function displayQualifying(qualifying, race) {
    // need to sort this qualifying Array by position.
    qualifying.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q);
        }
    });
}
function displaySingleRace(race, results, qualifying) {
    const tbody = document.querySelector(".table tbody");
    const tr = document.createElement("tr");
    const roundtd = document.createElement("td");
    const nametd = document.createElement("td");
    const buttontd = document.createElement("td");
    const button = document.createElement("button");
    button.classList.add("btn", "btn-sm", "btn-outline-primary");
    button.textContent = "Results";
    button.value = race.year;
    button.racename = race.name;
    button.round = race.round;
    button.circuit = race.circuit.name;
    button.date = race.date;
    button.url = race.url;
    roundtd.textContent = race.round;
    nametd.textContent = race.name;

    buttontd.appendChild(button);

    tr.appendChild(roundtd);
    tr.appendChild(nametd);
    tr.appendChild(buttontd);
    tbody.appendChild(tr);
    button.addEventListener("click", (e) => {
        headerRaceData(e, results, qualifying);
        
        displayResults(results, e);
        displayQualifying(qualifying, e);
    })
}
function displaySingleResult(result) {
    const tbody = document.querySelector(".resulttable tbody");
    const tr = document.createElement("tr");

    const postd = document.createElement("td");
    const nametd = document.createElement("td");
    const constructortd = document.createElement("td");
    const roundtd = document.createElement("td");
    const lapstd = document.createElement("td");
    const pointstd = document.createElement("td");

    postd.textContent = result.position;
    nametd.textContent = result.driver.forename + " " + result.driver.surname;
    constructortd.textContent = result.constructor.name;
    roundtd.textContent = result.race.round;
    lapstd.textContent = result.laps;
    pointstd.textContent = result.points;

    tr.appendChild(postd);
    tr.appendChild(nametd);
    tr.appendChild(constructortd);
    tr.appendChild(roundtd);
    tr.appendChild(lapstd);
    tr.appendChild(pointstd);

    tbody.appendChild(tr);
    // result.addEventListener("click", (e) => {
        
    // })
}
function displaySingleQualifying(qualifying) {
    const tbody = document.querySelector(".qualifytable tbody");
    const trHead = document.createElement('tr');

    const postd = document.createElement("td");
    const nametd = document.createElement("td");
    const constructortd = document.createElement("td");
    const q1td = document.createElement("td");
    const q2td = document.createElement("td");
    const q3td = document.createElement("td");

    postd.textContent = qualifying.position;
    nametd.textContent = qualifying.driver.forename + " " + qualifying.driver.surname;
    constructortd.textContent = qualifying.constructor.name;
    q1td.textContent = qualifying.q1;
    q2td.textContent = qualifying.q2;
    q3td.textContent = qualifying.q3;

    trHead.appendChild(postd);
    trHead.appendChild(nametd);
    trHead.appendChild(constructortd);
    trHead.appendChild(q1td);
    trHead.appendChild(q2td);
    trHead.appendChild(q3td);

    tbody.appendChild(trHead);
    // qualifying.addEventListener("click", (e) => {
        
    // })

}
function listRaces(e, season) {
    let seasonParagraph = document.querySelector(".leftside p");
        let raceCaption = document.querySelector(".leftside h4");
        raceCaption.innerHTML = e.target.value + " Races";
        seasonParagraph.remove();
        season.remove();

        let raceTable = document.querySelector(".leftside");
        const table = document.createElement("table");
        table.classList.add("table", "table-sm");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const raceth1 = document.createElement("th");
        const raceth2 = document.createElement("th");
        const raceth3 = document.createElement("th");

        raceth1.textContent = "Round";
        raceth2.textContent = "Name";
        raceth3.textContent = "";

        headerRow.appendChild(raceth1);
        headerRow.appendChild(raceth2);
        headerRow.appendChild(raceth3);
        // Set the headers of the table.
        thead.appendChild(headerRow);

        const tbody = document.createElement("tbody");

 
        table.appendChild(thead);
        table.appendChild(tbody);
        raceTable.appendChild(table);
}
function qualifyingHeaderTable(qualifying, event) {
    const divTableContainer = document.createElement('div');
    divTableContainer.classList.add('table-container', 'mainhubTable');
    
    const divColumn = document.createElement('div')
    divColumn.classList.add('col');

    const qualifyingTitle = document.createElement('h5')
    qualifyingTitle.textContent = "Qualifying";

    divColumn.append(qualifyingTitle);

    const qualifyingTable = document.createElement('table')
    qualifyingTable.classList.add('table', 'table-sm', 'qualifytable');

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const posthd = document.createElement("th");
    const namehd = document.createElement("th");
    const constructorhd = document.createElement("th");
    const q1hd = document.createElement("th");
    const q2hd = document.createElement("th");
    const q3hd = document.createElement("th");

    const tbody = document.createElement("tbody");

    posthd.textContent = "Pos";
    namehd.textContent = "Name";
    constructorhd.textContent = "Const";
    q1hd.textContent = "Q1";
    q2hd.textContent = "Q2";
    q3hd.textContent = "Q3";


    trHead.appendChild(posthd);
    trHead.appendChild(namehd);
    trHead.appendChild(constructorhd);
    trHead.appendChild(q1hd);
    trHead.appendChild(q2hd);
    trHead.appendChild(q3hd);

    thead.appendChild(trHead);
    qualifyingTable.appendChild(thead);
    qualifyingTable.appendChild(tbody);

    divColumn.appendChild(qualifyingTable);
    divTableContainer.appendChild(divColumn);

    const resultsDiv = document.querySelector("div .col-md-8");
    resultsDiv.appendChild(divTableContainer); 

    trHead.addEventListener("click", (e) => {
        console.log(e);
        if (e.target.textContent === "Name") {
            const tbody = document.querySelector(".qualifytable tbody");
            tbody.replaceChildren();
            sortByName(qualifying, event);

        }
    });
}
function resultsHeaderTable() {
    const divTableContainer = document.querySelector('.mainhubTable');

    const divColumn = document.createElement('div')
    divColumn.classList.add('col');

    const resultsTitle = document.createElement('h5')
    resultsTitle.textContent = "Results";

    divColumn.append(resultsTitle);

    const resultTable = document.createElement('table')
    resultTable.classList.add('table', 'table-sm', 'mt-3', 'resulttable');

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const posthd = document.createElement("th");
    const namehd = document.createElement("th");
    const constructorhd = document.createElement("th");
    const round = document.createElement("th");
    const laps = document.createElement("th");
    const points = document.createElement("th");

    const tbody = document.createElement("tbody");

    posthd.textContent = "Pos";
    namehd.textContent = "Name";
    constructorhd.textContent = "Const";
    round.textContent = "Rd";
    laps.textContent = "Laps";
    points.textContent = "Pts";

    trHead.appendChild(posthd);
    trHead.appendChild(namehd);
    trHead.appendChild(constructorhd);
    trHead.appendChild(round);
    trHead.appendChild(laps);
    trHead.appendChild(points);

    thead.appendChild(trHead);
    resultTable.appendChild(thead);
    resultTable.appendChild(tbody);

    divColumn.appendChild(resultTable);
    divTableContainer.appendChild(divColumn);

    const resultsDiv = document.querySelector("div .col-md-8");
    resultsDiv.appendChild(divTableContainer); 
}
function headerRaceData(e, results, qualifying) {
    if (!document.querySelector(".row .rightside")) {
        console.log(document.querySelector(".row .rightside"));
        console.log("if invoke");
        const row = document.querySelector(".row");

        const divmain = document.createElement("div");
        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const strong = document.createElement("strong");

        divmain.classList.add("col-md-8", "text-center", "rightside");
        h4.textContent = "Results for " + e.target.value + " " + e.target.racename;
        strong.textContent = e.target.racename + ", " + e.target.round + ", " + e.target.value + ", " + e.target.circuit + ", " + e.target.date + ", " + e.target.url;
        p.appendChild(strong);

        divmain.appendChild(h4);
        divmain.appendChild(p);
        row.appendChild(divmain);
        // display table and headers for table corresponding to qualifying.
        qualifyingHeaderTable(qualifying, e);
        resultsHeaderTable();

    }
    else {
        console.log("Else invoke");
        const divmain = document.querySelector(".rightside");
        divmain.replaceChildren();

        const row = document.querySelector(".row");

        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const strong = document.createElement("strong");

        divmain.classList.add("col-md-8", "text-center", "rightside");
        h4.textContent = "Results for " + e.target.value + " " + e.target.racename;
        strong.textContent = e.target.racename + ", " + e.target.round + ", " + e.target.value + ", " + e.target.circuit + ", " + e.target.date + ", " + e.target.url;
        p.appendChild(strong);

        divmain.appendChild(h4);
        divmain.appendChild(p);
        row.appendChild(divmain);
        // display table and headers for table corresponding to qualifying.
        qualifyingHeaderTable(qualifying);
        resultsHeaderTable();
    }
}
function sortByName(qualifying, race) {
    
    qualifying.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q);
        }
    });
}