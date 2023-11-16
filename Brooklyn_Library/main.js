const map = L.map('map').setView([40.7128, -74.0060], 12); // Brooklyn coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentMarker = null;

// JSON data 
fetch('../data/BK_Library.json')
.then(response => response.json())
    .then(locationsData => {
        // Populate the sidebar with branch names and information
        const sidebar = document.getElementById('sidebar');
        locationsData.locations.forEach(location => {
            const name = location.data.title;
            const address = location.data.address;
            const hours = location.data.hours;
            const website = location.data.path;

            const listItem = document.createElement('li');
            listItem.textContent = name;
            listItem.addEventListener('click', () => {
                if (currentMarker) {
                    map.removeLayer(currentMarker);
                }
                const position = location.data.position.split(', ');
                currentMarker = L.marker([parseFloat(position[0]), parseFloat(position[1])]).addTo(map);
                currentMarker.bindPopup(`<b>${name}</b><br>${address}<br>${hours}<br><a href="${website}" target="_blank">Visit Website</a>`).openPopup();
            });
            sidebar.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });