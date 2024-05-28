const fileInput = document.querySelector('input');
const table = document.querySelector('table');
const bibSort = document.querySelector('#bibSort')
const rankSort = document.querySelector('#rankSort')
const exportCSVBtn = document.querySelector('#exportCSV')

let athletesArray = []
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

const exportCSVFile = (athletesArray) => {
    let CSVArray = [['Rank', 'Full Name', 'Finish Time', 'Country Code']];
    for (let athlete of athletesArray) {
        let rowArray = [athlete['rank'], athlete['fullName'], athlete['finishTime'], athlete['countryCode']]
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
        for (const [key, value] of Object.entries(athlete)) {
            let data = document.createElement('td');
            data.textContent = value;
            row.appendChild(data)
        }
        table.appendChild(row)
    }
}

const clearTable = () => {
    const childElementCount = table.childElementCount-1
    for (let i=0; i < childElementCount; i++) {
        table.removeChild(table.lastChild);
    }
}

fileInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.readAsText(fileInput.files[0]);
    reader.addEventListener('load', () => {
        const raceResult = JSON.parse((reader.result).toString());
        athletesArray = createAthletesArray(raceResult['results']['athletes']);
        displayAthletes(athletesArray)
    })
})

bibSort.addEventListener('click', () => {
    clearTable()
    athletesArray.sort((a,b) => a.bib.localeCompare(b.bib));
    displayAthletes(athletesArray)
})

rankSort.addEventListener('click', () => {
    clearTable();
    athletesArray.sort((a,b) => a.rank - b.rank);
    displayAthletes(athletesArray)
})

exportCSVBtn.addEventListener('click', () => {
    exportCSVFile(athletesArray)
})