// runs when the page loads
document.addEventListener("DOMContentLoaded", function() {
    // urls for getting stuff
    const racesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=";
    const resultsURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season="
    const qualifyingURL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season="
    // get the dropdown thing
    const season = document.querySelector("#season");
    
    // hide the spinner 
    document.querySelector("#loader1").style.display = "none";
    // make the default option in dropdown
    let placeholder = document.createElement("option");
    placeholder.selected = true;
    placeholder.disabled = true;
    placeholder.textContent = "Select a season";
    season.appendChild(placeholder);
    // these are the seasons we have
    let uniqueSeason = [2020,2021,2022,2023];

    uniqueSeason.forEach(u => {
        const option = document.createElement("option");
        option.textContent = u;
        option.value = u;
        season.appendChild(option);
    })
     // when someone picks a season
    season.addEventListener("change", e => {
        listRaces(e, season);
        document.querySelector("#loader1").style.display = "block";// show loading spinner
        // check if we already got this stuff saved
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

                document.querySelector("#loader1").style.display = "none";
            })
        }
        else { // if it exists, grab data from localStorage
            resultData = JSON.parse(localStorage.getItem("results" + e.target.value)); 
            qualifyingData = JSON.parse(localStorage.getItem("qualifying" + e.target.value)); 
            racesData = JSON.parse(localStorage.getItem("races" + e.target.value));
            displayRaces(racesData, resultData, qualifyingData);
            document.querySelector("#loader1").style.display = "none";
        }
    })
});

// gets all the data we need
function getSeasonData(season, racesAPI, resultsAPI, qualifyingAPI) {
     // make 3 promises for the different api calls
    let racesPromise = fetch(racesAPI + season.target.value).then(response => response.json());
    let resultsPromise = fetch(resultsAPI + season.target.value).then(response => response.json());
    let qualifyingPromise = fetch(qualifyingAPI + season.target.value).then(response => response.json());

    return Promise.all([racesPromise,resultsPromise,qualifyingPromise]);// wait for everything
}


// shows races
function displayRaces(races, results, qualifying) {
    displayData(races, results, qualifying);
}
// shows all the races in a season
function displayData(races, results, qualifying) {
    let sorted = races.sort((a, b) => roundComparator(a.round, b.round));// put them in order
    sorted.forEach(r => {
        displaySingleRace(r, results, qualifying);
    });
}

// shows who won and the rest
function displayResults(results, race) {
    const top3 = [];
    const test = results.filter(r => race.target.racename === r.race.name);
    const first = test.find(a => a.position === 1); // winner
    const second = test.find(b => b.position === 2); //2nd place
    const third = test.find(c => c.position === 3); //3rd place

    top3.push(first);
    top3.push(second);
    top3.push(third);
    
    displayTop3(top3);// show the podium

    test.forEach(r => {
        displaySingleResult(r,results); // show everyone else
    });
}

// shows qualifying times
function displayQualifying(qualifying, race) {
    const filtered = qualifying.filter(q => race.target.racename === q.race.name) // get right race
    filtered.forEach(q => {
        displaySingleQualifying(q, qualifying); // show qualifying stuff
    });
}

// makes the podium display
function displayTop3(top3) {
    const rowtop3 = document.querySelector('.row .top3');
    const medals = ['gold', 'silver', 'bronze']; // colors for the boxes
    
    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.classList.add('col-md-4');

        const div2 = document.createElement('div');
        div2.classList.add('border', 'p-3', 'text-center', `${medals[i]}`);

        const h4 = document.createElement('h4');
        const h1 = document.createElement('h1');

        h4.innerHTML = `${top3[i].driver.forename} <br> ${top3[i].driver.surname}`;
        h1.textContent = `${top3[i].position}st`;

        // fix the st nd rd stuff
        if(i==1){
            h1.textContent = `${top3[i].position}nd`;
        }
        if(i==2){
            h1.textContent = `${top3[i].position}rd`;
        }
        // put it all together
        div2.appendChild(h4);
        div2.appendChild(h1);
        div.appendChild(div2);
        rowtop3.appendChild(div);
    }

    
}

// displays information for a single race row in the table
function displaySingleRace(race, results, qualifying) {
     // get reference to the table body
    const tbody = document.querySelector(".table tbody");
     // create table row elements
    const tr = document.createElement("tr");
    const roundtd = document.createElement("td");
    const nametd = document.createElement("td");
    const buttontd = document.createElement("td");
    const button = document.createElement("button");
    // set up the Results button
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
    button.id = race.circuit.id;

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

// shows results in a table
function displaySingleResult(result, results) {
    // make a bunch of table stuff
    const tbody = document.querySelector(".resulttable tbody");
    const tr = document.createElement("tr");

     // more table cells
    const postd = document.createElement("td");
    const nametd = document.createElement("td");
    const constructortd = document.createElement("td");
    const roundtd = document.createElement("td");
    const lapstd = document.createElement("td");
    const pointstd = document.createElement("td");

    // put all the info in
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

    // stick it all in the table
    tr.appendChild(postd);
    tr.appendChild(nametd);
    tr.appendChild(constructortd);
    tr.appendChild(roundtd);
    tr.appendChild(lapstd);
    tr.appendChild(pointstd);

    tbody.appendChild(tr);

    // when someone clicks on a driver name
    nametd.addEventListener("click", (e) => {
          // get more info about the driver
        fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=" + e.target.ref)
        .then(response => {
            if (response.ok) {
               return response.json();
            }
            else {
               return Promise.reject({// if something breaks
                  status: response.status,
                  statusText: response.statusText
               })
            }
         })
         .then(data => {
            showModal(// pop up window
                `${data.forename} ${data.surname}`,
               driverModalContent(data), data, result.race.year, results 
            ); 
         })
    });
    // when someone clicks on a team name
    constructortd.addEventListener("click", constructorModalContent(result.constructor.ref, result.race.year, result));
}

// makes the popup window show up
function showModal(title, content, object, season, raceResults) {
     // get the popup stuff ready
    const modal = document.querySelector("#infoModal");
    const modalTitle = document.querySelector("#modalTitle");
    const modalContent = document.querySelector("#modalContent");

    modalTitle.textContent = title;
    modalContent.innerHTML = content;

    // if its about a team
    if (modalTitle.textContent === "Constructor Details") {
        const divTable = document.createElement("div");
        divTable.classList.add("table-responsive-vertical");

        const resultsTable = document.createElement("table");
        resultsTable.classList.add("race-results",'table-sm', 'mt-3','table');

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
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${result.round}</td>
                    <td>${result.name}</td>
                    <td>${result.forename} ${result.surname}</td>
                    <td>${result.positionOrder || "N/A"}</td>
                `;
                resultsTable.appendChild(row);
                divTable.appendChild(resultsTable);
        });

        modalContent.appendChild(divTable);
    }
       // if its about a driver
    if (modalTitle.textContent === `${object.forename} ${object.surname}`) {
        let sorted = raceResults.sort((a, b) => a.race.round - b.race.round);  // put races in order

        const divTable = document.createElement("div");
        divTable.classList.add("table-responsive-vertical");

        const resultsTable = document.createElement("table");
        resultsTable.classList.add("race-results", 'table-sm', 'mt-3','table' );

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
        sorted.forEach(result => {
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
                    row.innerHTML += `<td>-</td>`;
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

    //When outside of modal --> close modal
    window.onclick = e =>{
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
}

// Displays qualifying result row in table 
function displaySingleQualifying(qualifying, qualifyingData) {
    
     // Get table body element
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
     // Set qualifying times, "-" if not available
    q1td.textContent = qualifying.q1;
    q2td.textContent = qualifying.q2 || "-";
    q3td.textContent = qualifying.q3 || "-";

    trHead.appendChild(postd);
    trHead.appendChild(nametd);
    trHead.appendChild(constructortd);
    trHead.appendChild(q1td);
    trHead.appendChild(q2td);
    trHead.appendChild(q3td);

    tbody.appendChild(trHead);
    // Driver name click handler
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
                    driverModalContent(data), data, qualifying.race.year, qualifyingData 
                ); 
             })
            
    });
    // Constructor click handler
    constructortd.addEventListener("click", constructorModalContent(qualifying.constructor.ref,qualifying.race.year,qualifying));

}
// gets info about a team when you click on it
function constructorModalContent(constructorRef,year,raceData){
    return () => {
        // get team info
        fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref=" + constructorRef)
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
             // get more team results
            fetch ("https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?ref=" + constructorRef + "&season=" + year)
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
                    <p><strong>URL:</strong><a href=${data.url}>${data.url}</a></p>
                    `, raceData, year , constructorHistory
                );
             })
        })

    }

}
// makes the html for driver popup
function driverModalContent(driver){
    return ` <div class="container-fluid">
                        <div class="row">
                            <!-- Image Column -->
                            <div class="col-md-4">
                            <img src="https://placehold.co/300x300" alt="place holder" class="img-fluid"> 
                            </div>
                    <!-- Details Column -->
                            <div class="col-md-6">
                            <div class="driver-details">
                                <p><strong>Driver ID:</strong> <span>${driver.driverId}</span></p>
                                <p><strong>Date of Birth:</strong> <span>${driver.dob}</span></p>
                                <p><strong>Nationality:</strong> <span>${driver.nationality}</span></p>
                                <p><strong>URL:</strong> <a href=${driver.url}>${driver.url}</a></p>
                            </div>
                            </div>
                          </div>
                     </div>`;
}
// Creates a table listing races for a selected season
function listRaces(e, season) {
    // Remove existing season info
        let seasonParagraph = document.querySelector(".leftside p");
        let raceCaption = document.querySelector(".leftside h4");
        raceCaption.innerHTML = e.target.value + " Races";
        raceCaption.classList.add('text-center')
        seasonParagraph.remove();
        season.remove();
     // Create new table structure
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
// Creates qualifying results table header and structure
function qualifyingHeaderTable(qualifying, event) {
    // Create container elements
    const divTableContainer = document.createElement('div');
    divTableContainer.classList.add('table-container', 'mainhubTable');
    
    const divColumn = document.createElement('div')
    divColumn.classList.add('col');

    const qualifyingTitle = document.createElement('h5')
    qualifyingTitle.textContent = "Qualifying";

    divColumn.append(qualifyingTitle);
     // Add title
    const qualifyingTable = document.createElement('table')
    qualifyingTable.classList.add('table', 'table-sm', 'qualifytable');
     // Create header elements
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const posthd = document.createElement("th");
    const namehd = document.createElement("th");
    const constructorhd = document.createElement("th");
    const q1hd = document.createElement("th");
    const q2hd = document.createElement("th");
    const q3hd = document.createElement("th");

    const tbody = document.createElement("tbody");
    // Set header text
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
     // Add table to page
    const resultsDiv = document.querySelector("div .col-md-8");
    resultsDiv.appendChild(divTableContainer); 
      // Add click handlers for sorting
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
// Creates race results table header and structure
function resultsHeaderTable(results, event) {
      // Get container and create elements
    const divTableContainer = document.querySelector('.mainhubTable');
    const divColumn = document.createElement('div')
    divColumn.classList.add('col');

    // Add title
    const resultsTitle = document.createElement('h5')
    resultsTitle.textContent = "Results";

    const top3row = document.createElement('div');
    top3row.classList.add('row', 'top3');

    
    divColumn.append(resultsTitle);
    divColumn.append(top3row);
     // Create table structure
    const resultTable = document.createElement('table')
    resultTable.classList.add('table', 'table-sm', 'mt-3', 'resulttable');
      // Create header elements
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const posthd = document.createElement("th");
    const namehd = document.createElement("th");
    const constructorhd = document.createElement("th");
    const round = document.createElement("th");
    const laps = document.createElement("th");
    const points = document.createElement("th");

    const tbody = document.createElement("tbody");
    // Set header text
    posthd.textContent = "Pos";
    namehd.textContent = "Name";
    constructorhd.textContent = "Const";
    round.textContent = "Rd";
    laps.textContent = "Laps";
    points.textContent = "Pts";

    trHead.style.cursor = "pointer";
     // Assemble table structure
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
    // Add table to page
    const resultsDiv = document.querySelector("div .col-md-8");
    resultsDiv.appendChild(divTableContainer); 
    // Add click handlers for sorting
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
// Creates or updates the header section with race data
function headerRaceData(e, results, qualifying) {
    if (!document.querySelector(".row .rightside")) {
        // Create new header if it doesn't exist
        const row = document.querySelector(".row");
        const divmain = document.createElement("div");
        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const strong1 = document.createElement("strong");
         // Set content and styles
        divmain.classList.add("col-md-8", "text-center", "rightside");
        h4.textContent = "Results for " + e.target.value + " " + e.target.racename;

        strong.textContent = e.target.racename + ", " + e.target.round + ", " + e.target.value + ", " + e.target.date + ", " + e.target.url + ", ";
        strong1.textContent = e.target.circuit;
        strong1.classList.add('clickable');
        // Assemble structure
        p.appendChild(strong);
        p.appendChild(strong1);
        divmain.appendChild(h4);
        divmain.appendChild(p);
        row.appendChild(divmain);
        // display table and headers for table corresponding to qualifying AND results.
        qualifyingHeaderTable(qualifying, e);
        resultsHeaderTable(results, e);
        strong1.addEventListener("click", circuitModalContent(e));
    }
    else {
        // Update existing header
        const divmain = document.querySelector(".rightside");
        divmain.replaceChildren();

        const row = document.querySelector(".row");

        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        const strong1 = document.createElement("strong");
        // Set content and styles
        divmain.classList.add("col-md-8", "text-center", "rightside");
        h4.textContent = "Results for " + e.target.value + " " + e.target.racename;
        strong.textContent = e.target.racename + ", " + e.target.round + ", " + e.target.value + ", " + e.target.date + ", " + e.target.url + ", ";
        strong1.textContent = e.target.circuit;
        strong1.classList.add('clickable');
        // Assemble structure
        p.appendChild(strong);
        p.appendChild(strong1);
        divmain.appendChild(h4);
        divmain.appendChild(p);
        row.appendChild(divmain);
        // display table and headers for table corresponding to qualifying AND.
        qualifyingHeaderTable(qualifying, e);
        resultsHeaderTable(results, e);
        strong1.addEventListener("click", circuitModalContent(e));
    }
}
// Fetches and displays circuit details in a modal
function circuitModalContent(e){
    return () =>{
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
                <p><strong>URL:</strong><a href=${data.url}>${data.url}</a></p>
                      </div>
                 </div>
                `, e
            );
        })
    }
}
// handles empty qualifying times
function timestampComparator(first, second) {
    if (first === "") {
        first = "z";
    }
    if (second === "") {
        second = "z";
    }
    return first.localeCompare(second);
}
// compares round numbers
function roundComparator(first, second) {
    return first - second;
}
// all the sorting functions for different columns
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

