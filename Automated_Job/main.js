 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.5,
height = window.innerHeight * 0.5,
margin = { top: 20, bottom: 60, left: 80, right: 60 };

// Create a new array to store the region information for each state
const stateToRegion = {

  Connecticut:"Northeast", Delaware:"Northeast", "District of Columbia":"Northeast", Maine:"Northeast", Maryland:"Northeast",
  Massachusetts:"Northeast", "New Hampshire":"Northeast", "New Jersey":"Northeast", "New York":"Northeast", Pennsylvania:"Northeast",
  "Rhode Island":"Northeast", Vermont:"Northeast", Virginia:"Northeast", "West Virginia":"Northeast"
,
  Alabama:"Southeast", Arkansas:"Southeast", Florida:"Southeast", Georgia:"Southeast", Kentucky:"Southeast", Louisiana:"Southeast",
  Mississippi:"Southeast", "North Carolina":"Southeast", "South Carolina":"Southeast", Tennessee:"Southeast"
,
  Illinois:"Midwest", Indiana:"Midwest", Iowa:"Midwest", Kansas:"Midwest", Michigan:"Midwest", Minnesota:"Midwest", Missouri:"Midwest",
  Nebraska:"Midwest", "North Dakota":"Midwest", Ohio:"Midwest", "South Dakota":"Midwest", Wisconsin:"Midwest"
,
  Arizona:"Southwest", "New Mexico":"Southwest", Oklahoma:"Southwest", Texas:"Southwest",

  Alaska:"West", California:"West", Colorado:"West", Hawaii:"West", Idaho:"West", Montana:"West", Nevada:"West",
  Oregon:"West", Utah:"West", Washington:"West", Wyoming:"West"

};

