document.getElementById('current-btn').addEventListener('click', getCurrentLocation);
document.getElementById('location-select').addEventListener('change', handleLocationChange);
document.getElementById('search-box').addEventListener('input', handleLocationSearch);

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchSunriseSunset(latitude, longitude);
        }, showError);
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

function handleLocationChange(event) {
    const selectedValue = event.target.value;
    if (selectedValue) {
        const [latitude, longitude] = selectedValue.split(',');
        fetchSunriseSunset(latitude, longitude);
    }
}

function handleLocationSearch(event) {
    const query = event.target.value;
    fetch(`https://geocode.maps.co/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchSunriseSunset(lat, lon);
            } else {
                showError("Location not found.");
            }
        }).catch(() => showError("Error fetching location data."));
}

function fetchSunriseSunset(latitude, longitude) {
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            let date = new Date();
            date.setDate(date.getDate() + i);
            fetchDataForDate(latitude, longitude, date.toISOString().split('T')[0], i);
        }, i * 500);
    }
}

function fetchDataForDate(latitude, longitude, date, dayIndex) {
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                updateUI(data.results, dayIndex, date, latitude, longitude);
            } else {
                showError("Error fetching data.");
            }
        })
        .catch(() => showError("Error fetching data."));
}

function updateUI(data, dayIndex, date) {
    let tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    let newRow = tableBody.insertRow(tableBody.rows.length);

    let cellDate = newRow.insertCell(0);
    cellDate.innerHTML = date;

    let cellSunrise = newRow.insertCell(1);
    cellSunrise.innerHTML = data.sunrise;

    let cellSunset = newRow.insertCell(2);
    cellSunset.innerHTML = data.sunset;

    let cellDawn = newRow.insertCell(3);
    cellDawn.innerHTML = data.dawn;


    let cellDayLength = newRow.insertCell(4);
    cellDayLength.innerHTML = data.day_length;

    let cellSolarNoon = newRow.insertCell(5);
    cellSolarNoon.innerHTML = data.solar_noon;

    let cellTimezone = newRow.insertCell(6);
    cellTimezone.innerHTML = data.timezone;  // Accessing timezone directly from the data object
}


function showError(error) {
    const display = document.getElementById('data-display');
    display.innerText = error;
}
