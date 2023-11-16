const map = L.map('map').setView([40.7128, -74.0060], 12); // Brooklyn coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// JSON data 
fetch('../data/BK_Library.json')
.then(response => response.json())
.then(locationsData => {
        locationsData.locations.forEach(location => {
            const position = location.data.position.split(', ');
            const name = location.data.title;
            const address = location.data.address;
            const description = location.data.tags;
            const hours = location.data.hours;
            const contact = location.data.phone;

            L.marker([parseFloat(position[0]), parseFloat(position[1])]).addTo(map)
                .bindPopup(`<b>${name}</b><br>${address}<br>${description}<br>${hours}<br>${contact}`);
        });

        // Function to populate the branch list in the sidebar
function populateBranchList() {
    const branchList = document.getElementById("branch-list");
    
    libraryData.forEach(branch => {
        const listItem = document.createElement("li");
        listItem.textContent = branch.data.title;
        listItem.addEventListener("click", () => displayBranchOnMap(branch));
        branchList.appendChild(listItem);
    });
}

// Function to display branch information on the map and sidebar
function displayBranchOnMap(branch) {
    const branchName = document.getElementById("branch-name");
    const branchAddress = document.getElementById("branch-address");
    const branchHours = document.getElementById("branch-hours");
    const branchWebsite = document.getElementById("branch-website");
    
    branchName.textContent = branch.data.title;
    branchAddress.textContent = branch.data.address;
    branchHours.textContent = branch.data.hours;
    branchWebsite.href = branch.data.path;
    
    // Here, you can use Leaflet to display the branch on the map
    // Use branch.data.position to set the marker position on the map
    // Example: L.marker([latitude, longitude]).addTo(map);
}

// Call the function to populate the branch list when the page loads
populateBranchList();
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });