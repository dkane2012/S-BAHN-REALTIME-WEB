I'll help you understand how the API works in this project. Let me search through the codebase to find relevant API-related code.


Search files...


Let me explain how the API works in this project. The application interacts with the MVG (Munich Transport Company) API to fetch real-time public transport information. Here are the key components:

1. **API Endpoints**:
   - Stations List: `https://www.mvg.de/.rest/zdm/stations`
   - Departures: `https://www.mvg.de/api/bgw-pt/v3/departures?globalId={station_id}`

2. **Data Structures**:
   - `Station`: Represents a public transport station with properties like:
     - `name`: Station name
     - `place`: City/location
     - `id`: Unique identifier
     - `diva_id`: Another identifier
     - `products`: Available transport types (UBAHN, BUS, TRAM, SBAHN)
     - `latitude`/`longitude`: Geographic coordinates
     - `tariff_zones`: Fare zones

   - `DepartureInfo`: Contains information about upcoming departures:
     - `planned_departure_time`: Scheduled departure time
     - `realtime`: Whether the information is real-time
     - `delay_in_minutes`: Any delays
     - `transport_type`: Type of transport (UBAHN, BUS, etc.)
     - `label`: Line number/name
     - `destination`: Final destination
     - `platform`: Platform number
     - `cancelled`: Whether the departure is cancelled
     - `sev`: Service information

3. **Key Functions**:
   - `get_stations()`: Fetches all stations from the API
     - First tries to read from a local `stations.json` file
     - If file doesn't exist, fetches from API and saves to file
   
   - `get_departures(id)`: Gets real-time departure information for a specific station
     - Takes a station ID as parameter
     - Returns a list of upcoming departures

4. **Caching**:
   - The application caches the stations list in a local `stations.json` file
   - This reduces API calls and improves performance
   - Users can force a refresh by deleting the `stations.json` file

5. **Auto-refresh**:
   - The application automatically refreshes departure information every 60 seconds
   - Users can also manually refresh using the 'r' key

6. **Error Handling**:
   - Uses Rust's `Result` type for error handling
   - Gracefully handles API failures and network issues

The API is designed to be efficient and user-friendly, with features like:
- Local caching to reduce API calls
- Real-time updates
- Comprehensive station and departure information
- Support for different types of public transport (U-Bahn, Bus, Tram, S-Bahn)