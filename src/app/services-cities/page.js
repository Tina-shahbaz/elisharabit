"use client";

import React from "react";

const locations = {
  Alabama: ["Huntsville"],
  Arizona: ["Chandler", "Phoenix", "Scottsdale", "Tempe", "Tucson"],
  Arkansas: ["Bentonville"],
  California: [
    "Alameda", "Berkeley", "Burbank", "Chula Vista", "Fresno", "Hillsborough",
    "Los Angeles", "Menlo Park", "Mountain View", "Newport Beach", "Oakland",
    "Orange County", "Palo Alto", "Pasadena", "Redwood City", "Sacramento",
    "San Diego", "San Francisco", "San Jose", "Santa Monica", "Venice Beach",
    "West Hollywood"
  ],
  Colorado: ["Denver"],
  Connecticut: ["Bridgeport", "Fairfield", "New Haven"],
  "District of Columbia": ["Washington DC"],
  Florida: [
    "Fort Lauderdale", "Fort Myers", "Jacksonville", "Miami",
    "Naples", "Orlando", "Tampa"
  ],
  Georgia: ["Atlanta", "Columbus", "Savannah"],
  Hawaii: ["Honolulu"],
  Idaho: ["Boise"],
  Illinois: [
    "Arlington Heights", "Aurora", "Chicago", "Cicero", "Evanston",
    "Hoffman Estates", "Oak Lawn", "Schaumburg"
  ],
  Indiana: ["Bloomington", "Indianapolis"],
  Iowa: ["Des Moines"],
  Kansas: ["Wichita"],
  Louisiana: ["Baton Rouge", "New Orleans"],
  Maryland: ["Baltimore"],
  Massachusetts: ["Boston"],
  Michigan: ["Ann Arbor", "Detroit", "Grand Rapids"],
  Minnesota: ["Minneapolis", "St. Paul"],
  Missouri: ["Kansas City", "Springfield", "St. Louis"],
  Nebraska: ["Omaha"],
  Nevada: ["Las Vegas", "Reno"],
  "New Jersey": [
    "Atlantic City", "Jersey City", "Montclair", "Newark",
    "Princeton", "Toms River"
  ],
  "New York": [
    "Albany", "Bronx", "Brooklyn", "Manhattan",
    "Queens", "Staten Island", "Yonkers"
  ],
  "North Carolina": ["Charlotte", "Durham", "Greensboro", "Raleigh"],
  Ohio: ["Cleveland", "Columbus", "Cincinnati"],
  Oklahoma: ["Oklahoma City", "Tulsa"],
  Oregon: ["Eugene", "Portland"],
  Pennsylvania: ["Philadelphia", "Pittsburgh"],
  "South Carolina": ["Charleston", "Columbia", "Greenville"],
  Tennessee: ["Chattanooga", "Memphis", "Nashville"],
  Texas: ["Austin", "Dallas", "Fort Worth", "Houston", "San Antonio"],
  Utah: ["Salt Lake City"],
  Virginia: ["Norfolk", "Richmond"],
  Washington: ["Seattle", "Spokane"],
  Wisconsin: ["Green Bay", "Madison", "Milwaukee"],
  "Other Countries": [
    "Canada", "Germany", "Spain", "France", "United Kingdom", "Italy", "Portugal"
  ],
};

export default function ServicesCitiesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Background header image */}
      <div className="w-full h-[250px] bg-[url('/city-bg.jpg')] bg-cover bg-center"></div>

      {/* Cities section */}
      <div className="max-w-7xl w-full mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-10">
          Find us in these cities
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm text-left">
          {Object.entries(locations).map(([state, cities]) => (
            <div key={state}>
              <h2 className="font-semibold text-green-800 mb-2">{state}</h2>
              <ul className="space-y-1 text-green-600">
                {cities.map((city) => (
                  <li
                    key={city}
                    className="hover:underline hover:text-green-700 cursor-pointer"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom info section */}
      <div className="bg-gray-50 border-t border-gray-200 py-10 text-center">
        <h2 className="text-gray-800 font-semibold mb-3">How it works</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-3xl mx-auto text-gray-700 text-sm">
          <div className="flex items-start gap-2">
            <span className="bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
              1
            </span>
            <p>Choose a Tasker by price, skills, and reviews.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
              2
            </span>
            <p>Schedule a Tasker as early as today.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
              3
            </span>
            <p>Chat, pay, tip, and review all in one place.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
