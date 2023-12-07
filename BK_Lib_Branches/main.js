const map = L.map('map').setView([40.7128, -74.0060], 12); // Brooklyn coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentMarker = null;

// Let's create an array to store markers for all branches
const branchMarkers = [];

// Function to generate a random light color
function getRandomLightColor() {
    const r = Math.floor(Math.random() * 156 + 100); // Random red value between 100 and 255
    const g = Math.floor(Math.random() * 156 + 100); // Random green value between 100 and 255
    const b = Math.floor(Math.random() * 156 + 100); // Random blue value between 100 and 255
    return `rgb(${r},${g},${b})`;
}
// // Let's calculate luminance of the background color
function isDarkColor(color) {
    // Calculate luminance based on RGB values
    const rgb = parseInt(color.slice(1), 16); // Convert to decimal
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Let's calculate luminance using the formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Determine if the color is dark (use a threshold like 0.5)
    return luminance <= 0.5;
}

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

            // Apply a random light background color
            branchContainer.style.backgroundColor = getRandomLightColor();

            // Add the dark class to the container if the background is dark
            if (isDarkColor(branchContainer.style.backgroundColor)) {
                branchContainer.classList.add('dark');
            }

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
            nameElement.style.cursor = 'pointer'; // Change cursor style
            nameElement.style.textDecoration = 'underline'; // Add underline
            nameElement.title = 'Click on it'; // Add tooltip
           
            nameElement.addEventListener('click', () => {
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

   