TripList helps users plan trips around Angeles City, Pampanga. This system was made for tourists so they can navigate thru angeles city well or anyone who is not familiar in angeles city.

Install these 
Node.js 20 or newer
npm
PostgreSQL 17
Git
Google Maps API key

to clone the project do this:
git clone https://github.com/HAU-6APSI/TripList.git
cd TripList

Install client dependencies - 
cd client
npm install

Install server dependencies - 
cd ../server
npm install

Environment variables
Create client/.env:
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_restricted_google_maps_key

Create server/.env:
DATABASE_URL=postgres://user:password@localhost:5432/triplist
PORT=4000

To run it open a terminal then run 
cd client
npm run dev, then open the link

Features and Usage
TripList helps users plan trips around Angeles City, Pampanga.

Main features:

Create a trip
Add destinations
Set destination status to Next, OTW, or Done
View destinations on Google Maps
Add a destination from the map
Start Google Maps directions
Add activities
Get local suggestions for sisig, coffee, restaurants, breakfast, desserts, and nightlife
Add trip notes
Save trip data in the browser
Main user flow
Open the app.
Create a trip or open the starter trip.
Add destinations.
Set each destination status.
Add activities.
Write notes.
Open the map to view destinations.
Click Start to get directions.

<img width="1161" height="584" alt="image" src="https://github.com/user-attachments/assets/9dd3f218-e79e-426b-b25d-49848c951050" />

Known Issues and Next Steps
The client currently uses browser storage in demo mode.
The client is not fully connected to the Express API yet.
PostgreSQL still needs full testing.
Google Maps needs a restricted API key for all live features.
GitHub Pages must be enabled before the live website works.
The app should be tested on a phone.
The API should be connected before the final submission.
Next steps:

Enable GitHub Pages.
Connect the client to the API.
Test PostgreSQL.
Add final screenshots.
Test the public website.
Update the README with the final live link.
