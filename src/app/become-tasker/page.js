"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Features from "../components/Features";
import WhatIsTaskRabbit from "../components/WhatIsTaskRabbit";
import GettingStarted from "../components/GettingStarted";
import EmployeeReview from "../components/EmployeeReview";
import FAQAccordion from "../components/FAQAccordion";
import { cities } from "../data/cities"; // ✅ NEW: Cities array
import { services } from "../data/services"; // ✅ NEW: Services array
import { rates } from "../data/rates"; // ✅ NEW: Rates with new structure
import { TaskerSignup } from "../components/auth/TaskerSignup";

export default function BecomeATasker() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState(null);
  const [ShowTS, setShowTS] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);

  // Initialize on component mount
  useEffect(() => {
    if (cities.length > 0) {
      // Set default city
      const defaultCity = cities[0];
      setSelectedCity(defaultCity);
      
      // Get available services for default city
      updateAvailableServices(defaultCity);
    }
  }, []);

  // Update available services when city changes
  const updateAvailableServices = (city) => {
    const cityData = rates.find((r) => r.city === city);
    if (cityData) {
      // Get services that have rates in this city
      const servicesInCity = services.filter(
        service => cityData.services[service] !== undefined
      );
      setAvailableServices(servicesInCity);
      
      // Set first available service as selected
      if (servicesInCity.length > 0) {
        setSelectedCategory(servicesInCity[0]);
      } else {
        setSelectedCategory("");
      }
    } else {
      // If city not in rates, show all services with price 0
      setAvailableServices(services);
      if (services.length > 0) {
        setSelectedCategory(services[0]);
      }
    }
  };

  // Update price whenever city or category changes
  useEffect(() => {
    if (selectedCity && selectedCategory) {
      const cityData = rates.find((r) => r.city === selectedCity);
      if (cityData && cityData.services[selectedCategory] !== undefined) {
        setPrice(cityData.services[selectedCategory]);
      } else {
        // If service not available in this city, show 0
        setPrice(0);
      }
    } else {
      setPrice(null);
    }
  }, [selectedCity, selectedCategory]);

  // Handle city change
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    updateAvailableServices(cityName);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <>
      {ShowTS && <TaskerSignup setShowTS={setShowTS} />}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left Image */}
        <div className="relative hidden md:block">
          <Image src="/Assembly.webp" alt="Tasker" fill className="object-cover" />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-2xl font-bold mb-2">Earn money your way</h1>
          <p className="text-gray-600 mb-6">
            See how much you can make tasking on GoZipply
          </p>

          {/* City Dropdown - Uses cities array */}
          <div className="mb-4">
            <label className="font-bold">Select your city</label>
            <select
              className="mt-2 border rounded-lg p-3 w-full bg-gray-50 font-bold"
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="">-- Select a City --</option>
              {cities.map((city) => (
                <option className="font-bold" key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown - Shows services available in selected city */}
          <div className="mb-4">
            <label className="font-bold">Select category</label>
            <select
              className="mt-2 border rounded-lg p-3 w-full bg-gray-50 font-bold"
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={!selectedCity || availableServices.length === 0}
            >
              {selectedCity ? (
                availableServices.length > 0 ? (
                  availableServices.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))
                ) : (
                  <option value="">No services available in {selectedCity}</option>
                )
              ) : (
                <option value="">Select a city first</option>
              )}
            </select>
            {selectedCity && availableServices.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No services have rates defined for {selectedCity}. Showing all services with $0 rate.
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="text-3xl font-bold mb-6 mt-4">
            {price !== null ? (
              <>
                ${price} <span className="text-lg font-normal">per hour</span>
                {price === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    This service is not yet priced in {selectedCity}
                  </p>
                )}
              </>
            ) : (
              <span className="text-gray-500">Select a city and category</span>
            )}
          </div>

          {/* Button */}
          <a 
            href="/auth/signup"
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg w-full text-center"
          >
            Get started
          </a>

          {/* Sign In link */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-emerald-600 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
      <Features />
      <WhatIsTaskRabbit />
      <GettingStarted />
      <EmployeeReview />
      <FAQAccordion />
    </>
  );
}