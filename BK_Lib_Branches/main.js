const map = L.map('map').setView([40.7128, -74.0060], 12); // Brooklyn coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentMarker = null;

// Let's create an array to store markers for all branches
const branchMarkers = [];

// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const today = new Date().getDay();

// Create an array of day names to match the JSON data
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// JSON data 
fetch('../data/lib-branches.json')
.then(response => response.json())
    .then(locationsData => {
        // Populate the sidebar with branch names and information
        const branchList = document.getElementById('branch-list');
        locationsData.locations.forEach(location => {
            const name = location.data.title;
            const address = location.data.address;
            const phone = location.data.phone;
            const website = location.data.path;

            // Get the hours for the current day
            const currentDay = dayNames[today];
            const hours = location.data[currentDay];

            // Create a container for each branch with name, hours, and phone
            const branchContainer = document.createElement('li');
            branchContainer.classList.add('branch-container');

            // Add a custom data attribute for the website
            branchContainer.dataset.website = website;

            // Create elements for displaying branch details
            const nameElement = document.createElement('h3');
            nameElement.textContent = name;

            const hoursElement = document.createElement('p');
            hoursElement.textContent = `Hours: ${hours}`;

            const addressElement = document.createElement('p');
            addressElement.textContent = `Address: ${address}`;

            const phoneElement = document.createElement('p');
            phoneElement.textContent = `Phone: ${phone}`;

            // Append elements to the container
            branchContainer.appendChild(nameElement);
            branchContainer.appendChild(hoursElement);
            branchContainer.appendChild(addressElement);
            branchContainer.appendChild(phoneElement);

            // Add a click event listener to handle displaying branch details on the map
            branchContainer.addEventListener('click', () => {
                if (currentMarker) {
                    map.removeLayer(currentMarker);
                }
                const position = location.data.position.split(', ');
                currentMarker = L.marker([parseFloat(position[0]), parseFloat(position[1])]).addTo(map);
                currentMarker.bindPopup(`<b>${name}</b><br>${address}<br>${hours}<br><a href="${website}" target="_blank">Visit Website</a>`).openPopup();
            });

            // Append the branch container to the branch list
            branchList.appendChild(branchContainer);


        // Create a marker for each branch and add it to the map
        const branchMarker = L.marker(location.data.position.split(', ').map(parseFloat));
        branchMarker.bindPopup(`<b>${name}</b><br>${address}<br>${hours}<br><a href="${website}" target="_blank">Visit Website</a>`);
        branchMarkers.push(branchMarker);
        branchMarker.addTo(map);
    });

    })
    .catch(error => {
        console.error('Error loading JSON data:', error);

    });