const fileInput = document.querySelector('input');
const table = document.querySelector('table');
const bibSort = document.querySelector('#bibSort')
const rankSort = document.querySelector('#rankSort')
const exportCSVBtn = document.querySelector('#exportCSV')
const raceNameDisplay = document.querySelector('#raceNameDisplay')
const raceDateDisplay = document.querySelector('#raceDateDisplay')
const raceDistanceDisplay = document.querySelector('#raceDistanceDisplay')
const raceGenderDisplay = document.querySelector('#raceGenderDisplay')


let bibSortCount = 0
let rankSortCount = 0
let raceDetails = []
let athletesArray = []

fetch("MarathonResults.json")
    .then(res => res.json())
    .then(data => {
        athletesArray = createAthletesArray(data['results']['athletes'])
        raceDetails = createRaceDetailsArray(data['results'])
        displayRaceDetails(raceDetails)
        displayAthletes(athletesArray)
    })

const createAthletesArray = (results) => {
    let athletes_data = []
    for (const athlete of results) {
        let athlete_data = {}
        athlete_data['rank'] = athlete['rank']
        athlete_data['bib'] = athlete['bibnumber']
        athlete_data['fullName'] = athlete['firstname'] + " " + athlete['surname'].toUpperCase()
        athlete_data['finishTime'] = athlete['raceprogress'] === 'completed' ? athlete['finishtime'] : 'DNF';
        athlete_data['countryCode'] = athlete['flag']
        athletes_data.push(athlete_data)
    }
    return athletes_data
}

const createRaceDetailsArray = (results) => {
    let array = []
    array['raceName'] = results['racename'];
    array['dateTime'] = results['tod'].slice(11,19) + ' on ' + results['tod'].slice(8,10) + '-'
        + results['tod'].slice(5,7) + '-' + results['tod'].slice(0,4)
    array['distance'] = results['racelength'] + ' Miles '
    array['gender'] = results['gender'].charAt(0).toUpperCase() + results['gender'].slice(1)
    return array
}

const exportCSVFile = (athletesArray) => {
    let CSVArray = [['Rank', 'Full Name', 'Finish Time', 'Country Code']];
    for (let athlete of athletesArray) {
        let athleteName = athlete['fullName'].split(' ')[0] + ' ' +
            athlete['fullName'].split(' ')[1].toLowerCase().charAt(0).toUpperCase() + athlete['fullName'].split(' ')[1].toLowerCase().slice(1)
        let rowArray = [athlete['rank'], athleteName, athlete['finishTime'], athlete['countryCode']]
        CSVArray.push(rowArray)
    }
    let csvContent = '';
    CSVArray.forEach(row => {
        csvContent += row.join(',') + '\n'
    })
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,'})
    const objUrl = URL.createObjectURL(blob)
    exportCSVBtn.setAttribute('href', objUrl)
    exportCSVBtn.setAttribute('download', 'race_results.csv')
}

const displayAthletes = (athletes) => {
    for (const athlete of athletes) {
        let row = document.createElement('tr');
        for (const [_, value] of Object.entries(athlete)) {
            let data = document.createElement('td');
            data.textContent = value;
            row.appendChild(data)
        }
        table.appendChild(row)
    }
}

const displayRaceDetails = (raceDetails) => {
    raceNameDisplay.innerText = raceDetails['raceName'];
    raceDateDisplay.innerText = 'Date: ' + raceDetails['dateTime'];
    raceDistanceDisplay.innerText = 'Distance: ' + raceDetails['distance'];
    raceGenderDisplay.innerText = 'Gender: ' + raceDetails['gender'];
}

const clearTable = () => {
    const childElementCount = table.childElementCount-1
    for (let i=0; i < childElementCount; i++) {
        table.removeChild(table.lastChild);
    }
}

fileInput.addEventListener('change', () => {
    clearTable()
    const reader = new FileReader();
    reader.readAsText(fileInput.files[0]);
    reader.addEventListener('load', () => {
        const raceResult = JSON.parse((reader.result).toString());
        athletesArray = createAthletesArray(raceResult['results']['athletes']);
        raceDetails = createRaceDetailsArray(raceResult['results'])
        displayRaceDetails(raceDetails)
        displayAthletes(athletesArray)
    })
})

bibSort.addEventListener('click', () => {
    clearTable()
    if (bibSortCount % 2 === 0) {
        athletesArray.sort((a,b) => b.bib.localeCompare(a.bib));
    }
    else {
        athletesArray.sort((a,b) => a.bib.localeCompare(b.bib));
    }
    bibSortCount ++
    rankSortCount = 1
    displayAthletes(athletesArray)
})

rankSort.addEventListener('click', () => {
    clearTable();
    if (rankSortCount % 2 === 0) {
        athletesArray.sort((a,b) => b.rank - a.rank);
    }
    else {
        athletesArray.sort((a,b) => a.rank - b.rank);
    }
    rankSortCount ++
    bibSortCount = 1
    displayAthletes(athletesArray)
})

exportCSVBtn.addEventListener('click', () => {
    exportCSVFile(athletesArray)
})