document.addEventListener("DOMContentLoaded", function() {
    const racesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=";
    const resultsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
    const qualifyingURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="
    const top3 = [];

    const season = document.querySelector("#season");
    
    

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
                
                resultData = data[1];
                qualifyingData = data[2];
                racesData = data[0];
                
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
    let sorted = races.sort((a, b) => roundComparator(a.round, b.round));
    sorted.forEach(r => {
        displaySingleRace(r, results, qualifying);
    });
}
function displayResults(results, race) {
    const top3 = [];
    const test = results.filter(r => race.target.racename === r.race.name);
    top3.push(test[0]);
    top3.push(test[1]);
    top3.push(test[2]);
    
    displayTop3(top3);

    test.forEach(r => {
        // if (race.target.racename === r.race.name) {
        //     displaySingleResult(r,results);
        // }
        displaySingleResult(r,results);
    });
}
function displayQualifying(qualifying, race) {
    // need to sort this qualifying Array by position.
    const filtered = qualifying.filter(q => race.target.racename === q.race.name)
    filtered.forEach(q => {
        // if (race.target.racename === q.race.name) {
        //     displaySingleQualifying(q);
        // }
        displaySingleQualifying(q, qualifying);
    });
}
function displayTop3(top3) {
    const rowtop3 = document.querySelector('.row .top3');
    const medals = ['gold', 'silver', 'bronze'];
    
    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.classList.add('col-md-4');

        const div2 = document.createElement('div');
        div2.classList.add('border', 'p-3', 'text-center', `${medals[i]}`);

        const h4 = document.createElement('h4');
        const h1 = document.createElement('h1');

        h4.innerHTML = `${top3[i].driver.forename} <br> ${top3[i].driver.surname}`;
        h1.textContent = `${top3[i].position}st`;

        if(i==1){
            h1.textContent = `${top3[i].position}nd`;
        }
        if(i==2){
            h1.textContent = `${top3[i].position}rd`;
        }

        div2.appendChild(h4);
        div2.appendChild(h1);
        div.appendChild(div2);
        rowtop3.appendChild(div);
    }

    
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
    button.circuitID = race.circuit.id;
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
//I added the results array.. I'm not sure if its considered good coding LOL
function displaySingleResult(result, results) {
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
    nametd.ref = result.driver.ref;
    nametd.classList.add('clickable');
    constructortd.textContent = result.constructor.name;
    constructortd.classList.add('clickable');
    constructortd.ref = result.constructor.ref;
    constructortd.season = result.race.year;
    roundtd.textContent = result.race.round;
    lapstd.textContent = result.laps;
    pointstd.textContent = result.points;

    //Modal here

    nametd.addEventListener("click", (e) => {
        
        fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=" + e.target.ref)
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                else {
                   return Promise.reject({
                      status: response.status,
                      statusText: response.statusText
                   })
                }
             })
             .then(data => {
                showModal(
                    `${data.forename} ${data.surname}`,
                    `
                   
                     <div class="container-fluid">
                        <div class="row">
                            <!-- Image Column -->
                            <div class="col-md-4">
                            <img src="https://placehold.co/300x300" alt="place holder" class="img-fluid"> 
                            </div>
                    <!-- Details Column -->
                            <div class="col-md-6">
                            <div class="driver-details">
                                <p><strong>Driver ID:</strong> <span>${data.driverId}</span></p>
                                <p><strong>Date of Birth:</strong> <span>${data.dob}</span></p>
                                <p><strong>Nationality:</strong> <span>${data.nationality}</span></p>
                                <p><strong>URL:</strong> <a href=${data.url}</a>${data.url}</p>
                            </div>
                            </div>
                          </div>
                     </div>
                    
                    `, data, result.race.year, results 
                ); 
             })
            
    });

    constructortd.addEventListener("click", (e) => {

        fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref=" + e.target.ref)
        .then(response => {
            if (response.ok) {
               return response.json();
            }
            else {
               return Promise.reject({
                  status: response.status,
                  statusText: response.statusText
               })
            }
         })
        .then(data => {
            fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?ref=" + e.target.ref + "&season=" + result.race.year)
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                else {
                   return Promise.reject({
                      status: response.status,
                      statusText: response.statusText
                   })
                }
             })
             .then(constructorHistory => {
                
                showModal(
                    `Constructor Details`,
                    `
                    <h3>${data.name}</h3>
                    <p><strong>Nationality:</strong> ${data.nationality}</p>
                    <p><strong>URL:</strong> ${data.url}</p>
                    `, result, result.race.year , constructorHistory
                );
             })
        })
    });


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

//Modal funtcion

function showModal(title, content, object, season, raceResults) {
    const modal = document.querySelector("#infoModal");
    const modalTitle = document.querySelector("#modalTitle");
    const modalContent = document.querySelector("#modalContent");

    modalTitle.textContent = title;
    modalContent.innerHTML = content;

    // Add race results.. I incorrectly put the array,
    if (modalTitle.textContent === "Constructor Details") {
        const divTable = document.createElement("div");
        divTable.classList.add("table-responsive-vertical");

        const resultsTable = document.createElement("table");
        resultsTable.classList.add("race-results");

        // Table header
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Round</th>
            <th>Name</th>
            <th>Driver</th>
            <th>Position</th>
        `;
        resultsTable.appendChild(headerRow);
        divTable.appendChild(resultsTable);

        // Table body with results data
        raceResults.forEach(result => {
            // if (result.constructor.ref === object.constructorRef && result.year === season) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${result.round}</td>
                    <td>${result.name}</td>
                    <td>${result.forename} ${result.surname}</td>
                    <td>${result.positionOrder || "N/A"}</td>
                `;
                resultsTable.appendChild(row);
                divTable.appendChild(resultsTable);
            // }
        });

        modalContent.appendChild(divTable);
    }
    
    if (modalTitle.textContent === `${object.forename} ${object.surname}`) {
        const divTable = document.createElement("div");
        divTable.classList.add("table-responsive-vertical");

        const resultsTable = document.createElement("table");
        resultsTable.classList.add("race-results");

        // Table header
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Rnd</th>
            <th>Name</th>
            <th>Pos</th>
            <th>Points</th>
        `;
        resultsTable.appendChild(headerRow);
        divTable.appendChild(resultsTable);

        // Table body with results data
        raceResults.forEach(result => {
            if (result.driver.ref === object.driverRef && result.race.year == season) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${result.race.round}</td>
                    <td>${result.race.name}</td>
                    <td>${result.position}</td>
                `;
                if(result.points) {
                    row.innerHTML += `<td>${result.points}</td>`;
                }
                else {
                    row.innerHTML += `<td>N/A</td>`;
                }
                resultsTable.appendChild(row);
                divTable.appendChild(resultsTable);
            }
        });

        modalContent.appendChild(divTable);
    }

    // Show the modal
    modal.style.display = "block";

    // Close modal functionality
    const closeButton = document.querySelector(".modal .close");
    closeButton.onclick = () => {
        modal.style.display = "none";
    };

    //Big button close at bottom
    const bigCloseButton = document.querySelector(".modal .closeButton");
    bigCloseButton.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = e =>{
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
}


function displaySingleQualifying(qualifying, qualifyingData) {
    

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
    nametd.ref = qualifying.driver.ref;
    nametd.classList.add('clickable');
    constructortd.textContent = qualifying.constructor.name;
    constructortd.classList.add('clickable');
    constructortd.ref = qualifying.constructor.ref;
    constructortd.season = qualifying.race.year;
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

    nametd.addEventListener("click", (e) => {
        
        fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=" + e.target.ref)
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                else {
                   return Promise.reject({
                      status: response.status,
                      statusText: response.statusText
                   })
                }
             })
             .then(data => {
                showModal(
                    `${data.forename} ${data.surname}`,
                    `
                   
                     <div class="container-fluid">
                        <div class="row">
                            <!-- Image Column -->
                            <div class="col-md-4">
                            <img src="https://placehold.co/300x300" alt="place holder" class="img-fluid"> 
                            </div>
                    <!-- Details Column -->
                            <div class="col-md-6">
                            <div class="driver-details">
                                <p><strong>Driver ID:</strong> <span>${data.driverId}</span></p>
                                <p><strong>Date of Birth:</strong> <span>${data.dob}</span></p>
                                <p><strong>Nationality:</strong> <span>${data.nationality}</span></p>
                                <p><strong>URL:</strong> <a href=${data.url}</a>${data.url}</p>
                            </div>
                            </div>
                          </div>
                     </div>
                    
                    `, data, qualifying.race.year, qualifyingData 
                ); 
             })
            
    });

    constructortd.addEventListener("click", (e) => {
        fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref=" + e.target.ref)
        .then(response => {
            if (response.ok) {
               return response.json();
            }
            else {
               return Promise.reject({
                  status: response.status,
                  statusText: response.statusText
               })
            }
         })
        .then(data => {
            fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?ref=" + e.target.ref + "&season=" + qualifying.race.year)
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                else {
                   return Promise.reject({
                      status: response.status,
                      statusText: response.statusText
                   })
                }
             })
             .then(constructorHistory => {
                showModal(
                    `Constructor Details`,
                    `
                    <h3>${data.name}</h3>
                    <p><strong>Nationality:</strong> ${data.nationality}</p>
                    <p><strong>URL:</strong> ${data.url}</p>
                    `, qualifying, qualifying.race.year , constructorHistory
                );
             })
        })
    });
    // qualifying.addEventListener("click", (e) => {
        
    // })

}
function listRaces(e, season) {
    let seasonParagraph = document.querySelector(".leftside p");
        let raceCaption = document.querySelector(".leftside h4");
        raceCaption.innerHTML = e.target.value + " Races";
        raceCaption.classList.add('text-center')
        seasonParagraph.remove();
        season.remove();

        let raceTable = document.querySelector(".leftside");
        const table = document.createElement("table");
        table.classList.add("table", "table-sm","racesTable");

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

    trHead.style.cursor = "pointer";
    
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
        
        if (e.target.textContent === "Name") {
            const tbody = document.querySelector(".qualifytable tbody");
            tbody.replaceChildren();
            sortByName(qualifying, event);
        }
        if (e.target.textContent === "Const") {
            tbody.replaceChildren();
            sortByConst(qualifying, event);
        }
        if (e.target.textContent === "Pos") {
            const tbody = document.querySelector(".qualifytable tbody");
            tbody.replaceChildren();
            sortByPos(qualifying, event);
        }
        if (e.target.textContent === "Q1") {
            const tbody = document.querySelector(".qualifytable tbody");
            tbody.replaceChildren();
            sortByQ1(qualifying, event);
        }
        if (e.target.textContent === "Q2") {
            const tbody = document.querySelector(".qualifytable tbody");
            tbody.replaceChildren();
            sortByQ2(qualifying, event);
        }
        if (e.target.textContent === "Q3") {
            const tbody = document.querySelector(".qualifytable tbody");
            tbody.replaceChildren();
            sortByQ3(qualifying, event);
        }

    });
}
function resultsHeaderTable(results, event) {
    const divTableContainer = document.querySelector('.mainhubTable');

    const divColumn = document.createElement('div')
    divColumn.classList.add('col');

    const resultsTitle = document.createElement('h5')
    resultsTitle.textContent = "Results";

    const top3row = document.createElement('div');
    top3row.classList.add('row', 'top3');

    //i can change order here..
    divColumn.append(resultsTitle);
    divColumn.append(top3row);

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

    trHead.style.cursor = "pointer";

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

    trHead.addEventListener("click", (e) => {
        
        const tbody = document.querySelector(".resulttable tbody");
        if (e.target.textContent === "Name") {
            tbody.replaceChildren();
            sortByNameR(results, event);
        }
        if (e.target.textContent === "Const") {
            tbody.replaceChildren();
            sortByConstR(results, event);
        }
        if (e.target.textContent === "Pos") {
            tbody.replaceChildren();
            sortByPosR(results, event);
        }
        if (e.target.textContent === "Rd") {
            tbody.replaceChildren();
            sortByRd(results, event);
        }
        if (e.target.textContent === "Laps") {
            tbody.replaceChildren();
            sortByLaps(results, event);
        }
        if (e.target.textContent === "Pts") {
            tbody.replaceChildren();
            sortByPts(results, event);
        }

    });
}
function headerRaceData(e, results, qualifying) {
    if (!document.querySelector(".row .rightside")) {
        const row = document.querySelector(".row");

        const divmain = document.createElement("div");
        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const strong1 = document.createElement("strong");
        divmain.classList.add("col-md-8", "text-center", "rightside");
        h4.textContent = "Results for " + e.target.value + " " + e.target.racename;

        strong.textContent = e.target.racename + ", " + e.target.round + ", " + e.target.value + ", " + e.target.date + ", " + e.target.url + ", ";
        strong1.textContent = e.target.circuit;
        strong1.classList.add('clickable');


        p.appendChild(strong);
        p.appendChild(strong1);
        divmain.appendChild(h4);
        divmain.appendChild(p);
        row.appendChild(divmain);
        // display table and headers for table corresponding to qualifying AND results.
        qualifyingHeaderTable(qualifying, e);
        resultsHeaderTable(results, e);
        strong1.addEventListener("click", () => {
            fetch("https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php?id=" + e.target.circuitID)
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                else {
                   return Promise.reject({
                      status: response.status,
                      statusText: response.statusText
                   })
                }
             })
            .then(data => {
                showModal(
                    "Circuit Details",
                    `
                    <div class="container-fluid">
                        <div class="row">
                            <!-- Image Column -->
                            <div class="col-md-4">
                            <img src="https://placehold.co/300x300" alt="place holder" class="img-fluid"> 
                            </div>
                    <!-- Details Column -->
                            <div class="col-md-6">
                                           <h3>${data.name}</h3>
                    <p><strong>Location:</strong> ${data.location}</p>
                    <p><strong>Country:</strong> ${data.country}</p>
                    <p><strong>URL:</strong> ${data.url}</p>
                          </div>
                     </div>
                    `, e
                );
            })
        })
    }
    else {
        
        const divmain = document.querySelector(".rightside");
        divmain.replaceChildren();

        const row = document.querySelector(".row");

        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const strong1 = document.createElement("strong");
        divmain.classList.add("col-md-8", "text-center", "rightside");
        h4.textContent = "Results for " + e.target.value + " " + e.target.racename;
        strong.textContent = e.target.racename + ", " + e.target.round + ", " + e.target.value + ", " + e.target.date + ", " + e.target.url + ", ";
        strong1.textContent = e.target.circuit;
        strong1.classList.add('clickable');
        p.appendChild(strong);
        p.appendChild(strong1);
        divmain.appendChild(h4);
        divmain.appendChild(p);
        row.appendChild(divmain);
        // display table and headers for table corresponding to qualifying AND.
        qualifyingHeaderTable(qualifying, e);
        resultsHeaderTable(results, e);
        strong1.addEventListener("click", () => {
            fetch("https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php?id=" + e.target.circuitID)
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                else {
                   return Promise.reject({
                      status: response.status,
                      statusText: response.statusText
                   })
                }
             })
            .then(data => {
                showModal(
                    "Circuit Details",
                    `
                    <div class="container-fluid">
                        <div class="row">
                            <!-- Image Column -->
                            <div class="col-md-4">
                            <img src="https://placehold.co/300x300" alt="place holder" class="img-fluid"> 
                            </div>
                    <!-- Details Column -->
                            <div class="col-md-6">
                                           <h3>${data.name}</h3>
                    <p><strong>Location:</strong> ${data.location}</p>
                    <p><strong>Country:</strong> ${data.country}</p>
                    <p><strong>URL:</strong> ${data.url}</p>
                          </div>
                     </div>
                    `, e
                );
            })
        })
    }
}
function sortByName(qualifying, race) {
    let sorted = qualifying.sort((a, b) => a.driver.forename.localeCompare(b.driver.forename));
    ;
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q, qualifying);
        }
    });
}
function sortByConst(qualifying,  race) {
    let sorted = qualifying.sort((a, b) => a.constructor.name.localeCompare(b.constructor.name));
    
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q, qualifying);
        }
    });
}
function sortByPos(qualifying, race) {
    let sorted = qualifying.sort((a, b) => a.position - b.position);
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q, qualifying);
        }
    });
}
function sortByQ1(qualifying, race) {
    let sorted = qualifying.sort((a, b) => timestampComparator(a.q1, b.q1));
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q, qualifying);
        }
    });
}
function sortByQ2(qualifying, race) {
    let sorted = qualifying.sort((a, b) => timestampComparator(a.q2, b.q2));
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q, qualifying);
        }
    });
}
function sortByQ3(qualifying, race) {
    let sorted = qualifying.sort((a, b) => timestampComparator(a.q3, b.q3));
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleQualifying(q, qualifying);
        }
    });
}
function timestampComparator(first, second) {
    if (first === "") {
        first = "z";
    }
    if (second === "") {
        second = "z";
    }
    return first.localeCompare(second);
}
function roundComparator(first, second) {
    return first - second;
}
function sortByNameR(results, race) {
    let sorted = results.sort((a, b) => a.driver.forename.localeCompare(b.driver.forename));
    
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleResult(q, results);
        }
    });
}
function sortByConstR(results,  race) {
    let sorted = results.sort((a, b) => a.constructor.name.localeCompare(b.constructor.name));
    
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleResult(q, results);
        }
    });
}
function sortByPosR(results, race) {
    let sorted = results.sort((a, b) => a.position - b.position);
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleResult(q, results);;
        }
    });
}
function sortByRd(results, race) {
    let sorted = results.sort((a, b) => a.race.round - b.race.round);
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleResult(q, results);
        }
    });
}
function sortByLaps(results, race) {
    let sorted = results.sort((a, b) => a.laps - b.laps);
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleResult(q, results);
        }
    });
}
function sortByPts(results, race) {
    let sorted = results.sort((a, b) => a.points - b.points);
    sorted.forEach(q => {
        if (race.target.racename === q.race.name) {
            displaySingleResult(q, results);
        }
    });
}

