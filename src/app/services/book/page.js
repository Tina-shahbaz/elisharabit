"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";

// =================================================================
// 🗺️ GOOGLE PLACES AUTOCOMPLETE COMPONENT
// =================================================================
function AutocompleteInput({ value, onChange, placeholder, className }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        // Load Google Places script
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
          
          // Wait for script to load
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        if (inputRef.current && window.google) {
          // Initialize Autocomplete
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ['address'],
              componentRestrictions: { country: 'us' },
              fields: ['formatted_address', 'address_components', 'geometry']
            }
          );

          // Add place changed listener
          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();
            
            if (place && place.formatted_address) {
              const address = place.formatted_address;
              
              // Extract street number and route (street name)
              let streetNumber = '';
              let route = '';
              
              place.address_components.forEach(component => {
                if (component.types.includes('street_number')) {
                  streetNumber = component.long_name;
                }
                if (component.types.includes('route')) {
                  route = component.long_name;
                }
              });

              const fullStreet = streetNumber && route ? `${streetNumber} ${route}` : address;
              
              // Call parent onChange with the full address
              onChange(fullStreet);
              
              console.log('Selected Place:', {
                fullAddress: address,
                streetAddress: fullStreet,
                components: place.address_components,
                location: place.geometry?.location
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Places:', error);
      }
    };

    initializeAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

// =================================================================
// 🪟 BOOKING POPUP (Modal for Date, Time, Payment)
// =================================================================
function BookingPopup({ tasker, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [card, setCard] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!tasker) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      alert(`✅ Booking confirmed with ${tasker.firstName || "Tasker"}!`);
      setProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-black text-center">
          Book {tasker.firstName || "Tasker"}
        </h2>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-black block mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-black block mb-1">
              Select Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-black block mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="4242 4242 4242 4242"
              maxLength="19"
              required
              className="w-full border rounded-lg px-3 py-2 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-black text-white rounded-full py-2 hover:bg-gray-800 transition"
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}

// =================================================================
// 💰 TASKER CARD COMPONENT
// =================================================================
function TaskerCard({ u, onSelect }) {
  const hourlyRate = u.hourlyRate || 45.00; 
  const ratingValue = u.rating || 5.0; 
  const reviewCount = u.reviewsCount || 2; 

  const taskStats = {
    primaryTasks: 1263,
    primaryTaskType: "Furniture Assembly",
    totalTasks: 1642,
    overallTaskType: "Assembly"
  };

  const sampleReview = {
    clientName: "pamela s.",
    date: "Fri, Oct 17",
    comment: "Great service, communication, and attention to detail."
  };

  return (
    <div className="border rounded-lg bg-white hover:shadow-md transition-shadow p-6">
      <div className="flex gap-6">
        {/* LEFT: Profile Picture */}
        <div className="flex-shrink-0">
          <img
            src={u.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${u.firstName || ""} ${u.lastName || ""}`)}
            alt={`${u.firstName || ""} ${u.lastName || ""}`}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        {/* RIGHT: Content */}
        <div className="flex-1">
          {/* HEADER: Name, Rating, Price */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black mb-2">
                {(u.firstName || "") + " " + (u.lastName || "")}.
              </h1>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500 text-lg">✰</span>
                <span className="text-black font-bold text-lg">{ratingValue.toFixed(1)}</span>
                <span className="text-gray-600">({reviewCount} reviews)</span>
              </div>

              <div className="text-gray-600 text-sm mb-4">
                <span className="font-semibold">©{taskStats.primaryTasks} {taskStats.primaryTaskType} tasks</span>
                <br />
                <span>{taskStats.totalTasks} {taskStats.overallTaskType} tasks overall</span>
              </div>
            </div>

            <div className="text-2xl font-bold text-black text-right">
              ${hourlyRate.toFixed(2)}/hr
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* HOW I CAN HELP SECTION */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-3">How I can help:</h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-3">
                {u.bio || "I am one of the best assemblers in the city. I'm early, efficient, effective and do my thing effortlessly. I'm thorough from the moment I walk in to the moment I walk out and will follow your needs to the letter. Hire me and it will be well worth it."}
              </p>
              {u.bio && u.bio.length > 200 && (
                <button className="text-green-600 hover:text-green-800 font-semibold text-sm">
                  Read More
                </button>
              )}
            </div>
          </div>

          {/* SAMPLE REVIEW */}
          <div className="bg-gray-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="text-sm text-gray-700">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-black">{sampleReview.clientName}</span>
                <span className="text-gray-500 text-xs">{sampleReview.date}</span>
              </div>
              <p className="italic">"{sampleReview.comment}"</p>
            </div>
          </div>

          {/* SKILLS SECTION */}
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-2">Skills & Services:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(u.skills) && u.skills.length > 0 ? (
                <>
                  {u.skills.slice(0, 4).map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-300">
                      {typeof s === 'string' ? s : s.name}
                    </span>
                  ))}
                  {u.skills.length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">+{u.skills.length - 4} more</span>
                  )}
                </>
              ) : (
                <span className="text-gray-500 text-sm">No skills listed</span>
              )}
            </div>
          </div>

          {/* AVAILABILITY BADGES */}
          {u.availabilityTiming && (
            <div className="mb-6">
              <h3 className="font-semibold text-black mb-2">Availability:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm border border-blue-200">
                  Starts: {u.availabilityTiming.startWork === 'in_one_week' ? 'In 1 Week' : u.availabilityTiming.startWork}
                </span>
                
                {u.availabilityTiming.preferredTime?.map((time, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm border border-green-200 capitalize">
                    {time}
                  </span>
                ))}
                
                {u.availabilityTiming.availableDays?.slice(0, 3).map((day, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm border border-purple-200 capitalize">
                    {day.slice(0, 3)}
                  </span>
                ))}
                {u.availabilityTiming.availableDays?.length > 3 && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm border border-gray-300">
                    +{u.availabilityTiming.availableDays.length - 3} more days
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 my-4"></div>

          {/* FOOTER: Verification, Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {u.isVerified && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">
                  Verified
                </span>
              )}
              
              <button 
                onClick={() => window.open(`/profile/${u._id || u.id}`, '_blank')}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline"
              >
                View Profile & Reviews
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => onSelect(u)}
                className="bg-black text-white rounded-full px-6 py-3 hover:bg-gray-800 transition-colors font-semibold"
              >
                Select & Continue
              </button>
              <p className="text-xs text-gray-500 mt-2 max-w-[200px]">
                You can chat with your Tasker, adjust task details, or change task time after booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 🎛️ FILTERS SIDEBAR COMPONENT
// =================================================================
function FiltersSidebar({ serviceName, taskerCount, filters, onFilterChange }) {
  const timeSlots = [
    { value: "morning", label: "Morning (8am - 12pm)" },
    { value: "afternoon", label: "Afternoon (12pm - 5pm)" },
    { value: "evening", label: "Evening (5pm - 9:30pm)" }
  ];

  const daysOfWeek = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" }
  ];

  const startWorkOptions = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "in_one_week", label: "Within a Week" }
  ];

  return (
    <aside className="w-full md:w-[320px] border rounded-lg p-4 bg-gray-50 h-fit">
      {/* Service Info Box */}
      <div className="mb-6 p-3 bg-white border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Service Selected</h3>
        <p className="text-sm text-green-700">{serviceName}</p>
        <p className="text-xs text-green-600 mt-1">{taskerCount} taskers available</p>
      </div>

      {/* START WORK FILTER */}
      <h3 className="font-semibold text-black mb-2">Start Work</h3>
      <div className="space-y-2 mb-4">
        {startWorkOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="startWork"
              checked={filters.startWork === option.value}
              onChange={() => onFilterChange('startWork', option.value)}
              className="cursor-pointer" 
            />
            <span className="text-black">{option.label}</span>
          </label>
        ))}
      </div>
      <hr className="my-3 border-gray-200" />

      {/* TIME OF DAY FILTER */}
      <h3 className="font-semibold text-black mb-2">Time of Day</h3>
      <div className="space-y-2 mb-2">
        {timeSlots.map((time) => (
          <label key={time.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.preferredTime.includes(time.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  onFilterChange('preferredTime', [...filters.preferredTime, time.value]);
                } else {
                  onFilterChange('preferredTime', filters.preferredTime.filter(t => t !== time.value));
                }
              }}
              className="cursor-pointer" 
            />
            <span className="text-black">{time.label}</span>
          </label>
        ))}
      </div>

      {/* AVAILABLE DAYS FILTER */}
      <h3 className="font-semibold text-black mb-2 mt-4">Available Days</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {daysOfWeek.map((day) => (
          <label key={day.value} className="flex items-center gap-1 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.availableDays.includes(day.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  onFilterChange('availableDays', [...filters.availableDays, day.value]);
                } else {
                  onFilterChange('availableDays', filters.availableDays.filter(d => d !== day.value));
                }
              }}
              className="cursor-pointer" 
            />
            <span className="text-black text-xs">{day.label}</span>
          </label>
        ))}
      </div>

      <hr className="my-3 border-gray-200" />

      {/* PRICE FILTER */}
      <h3 className="font-semibold text-black mb-2">Price</h3>
      <div className="mb-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>$10</span><span>$150+</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input type="range" min="10" max="150" step="1" className="w-full cursor-pointer" />
          <input type="range" min="10" max="150" step="1" className="w-full cursor-pointer" />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          The average hourly rate is <span className="font-semibold">$134.17/hr</span>
        </p>
      </div>

      <hr className="my-3 border-gray-200" />

      {/* TASKER TYPE FILTER */}
      <h3 className="font-semibold text-black mb-2">Tasker type</h3>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="cursor-pointer" />
        <span className="text-black">Elite Tasker</span>
      </label>

      {/* CLEAR FILTERS BUTTON */}
      {(filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) && (
        <button
          onClick={() => onFilterChange('clear', null)}
          className="w-full mt-4 text-sm text-red-600 hover:text-red-800 font-semibold border border-red-200 rounded-full py-2 hover:bg-red-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}

      <div className="mt-6">
        <div className="border rounded-lg p-3 bg-white text-xs text-gray-700">
          <p>
            Always have peace of mind. All Taskers undergo ID and criminal background checks.
            <span className="underline cursor-pointer"> Learn More</span>
          </p>
        </div>
      </div>
    </aside>
  );
}

// =================================================================
// 🛒 BOOK NOW PAGE COMPONENT (MAIN COMPONENT)
// =================================================================

export default function BookNow() {
  const { slug } = useParams();
  const slugArray = Array.isArray(slug) ? slug : slug ? [slug] : [];
  
  const getServiceName = () => {
    if (slugArray.length === 0) return "General Service";
    
    const lastSegment = slugArray[slugArray.length - 1];
    
    if (lastSegment === "book" && slugArray.length >= 2) {
      return decodeURIComponent(slugArray[slugArray.length - 2].replace(/-/g, " "));
    } else if (lastSegment.endsWith("-book")) {
      return decodeURIComponent(lastSegment.replace("-book", "").replace(/-/g, " "));
    } else {
      return decodeURIComponent(lastSegment.replace(/-/g, " "));
    }
  };

  const serviceName = getServiceName();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: serviceName,
    location: "",
    unit: "",
    taskSize: "",
    vehicle: "",
    details: "",
  });

  const [filters, setFilters] = useState({
    startWork: "",
    preferredTime: [],
    availableDays: []
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        startWork: "",
        preferredTime: [],
        availableDays: []
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  // --- Tasker Data Fetching Logic ---
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState(null);
  const [error, setError] = useState("");
  const [selectedTasker, setSelectedTasker] = useState(null);

  useEffect(() => {
    if (step !== 4) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/users", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setUsersData(data);
      } catch (err) {
        if (mounted) setError("Failed to load taskers.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [step]);

  // ✅ SERVICE-BASED FILTERING + AVAILABILITY FILTERING
  const visibleUsers = useMemo(() => {
    const list = usersData?.users || [];
    
    if (serviceName === "General Service" || serviceName === "Service") {
      return list;
    }
    
    let filtered = list.filter(tasker => {
      if (!tasker.skills || tasker.skills.length === 0) return false;
      
      const hasService = tasker.skills.some(skill => {
        const skillName = typeof skill === 'string' ? skill.toLowerCase() : skill.name?.toLowerCase();
        const currentService = serviceName.toLowerCase();
        
        return (
          skillName === currentService ||
          skillName.includes(currentService) ||
          currentService.includes(skillName) ||
          skillName.replace(/\s+/g, '') === currentService.replace(/\s+/g, '')
        );
      });
      
      return hasService;
    });

    if (filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) {
      filtered = filtered.filter(tasker => {
        const availability = tasker.availabilityTiming;
        
        if (!availability) return false;

        let matches = true;

        if (filters.startWork && availability.startWork !== filters.startWork) {
          matches = false;
        }

        if (filters.preferredTime.length > 0) {
          const hasMatchingTime = filters.preferredTime.some(time => 
            availability.preferredTime?.includes(time)
          );
          if (!hasMatchingTime) matches = false;
        }

        if (filters.availableDays.length > 0) {
          const hasMatchingDay = filters.availableDays.some(day => 
            availability.availableDays?.includes(day)
          );
          if (!hasMatchingDay) matches = false;
        }

        return matches;
      });
    }

    console.log(`Service: ${serviceName}, Filters: ${JSON.stringify(filters)}, Found: ${filtered.length} taskers`);
    return filtered;
  }, [usersData, serviceName, filters]);

  return (
    <div className="w-full px-6 md:px-16 bg-white rounded-lg pt-8">
      {/* ✅ Service Header Added */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">
          Book {serviceName}
        </h1>
        <p className="text-gray-600 mt-2">
          {serviceName !== "General Service" && serviceName !== "Service" 
            ? `Available taskers for ${serviceName}`
            : "Browse all available taskers"
          }
        </p>
        
        {/* Tasker Count */}
        {step === 4 && usersData && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{visibleUsers.length}</strong> taskers found for <strong>{serviceName}</strong>
              {(filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) && 
                " (with current filters)"
              }
            </p>
          </div>
        )}
      </div>

      {/* ---------- STEPS 1–3 (Form Inputs) ---------- */}
      {step <= 3 && (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* STEP 1 (Location) */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-black">Your task location</h2>
              {step > 1 && (
                <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline">
                  ✏️ Edit
                </button>
              )}
            </div>

            {step === 1 && (
              <>
                {/* Location Input with Google Places Autocomplete */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <AutocompleteInput
                    value={form.location}
                    onChange={(value) => setForm(prev => ({ ...prev, location: value }))}
                    placeholder="Start typing your address..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Unit Input (Manual) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit or Apartment Number
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="Unit, Apt #, Suite, etc."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => form.location && setStep(2)}
                    disabled={!form.location}
                    className={`py-2 px-6 rounded-full transition ${
                      !form.location
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step > 1 && (
              <p className="text-gray-600">
                {form.location}{form.unit ? `, ${form.unit}` : ""}
              </p>
            )}
          </div>

          {/* STEP 2 (Options) */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-black">Task options</h2>
              {step > 2 && (
                <button type="button" onClick={() => setStep(2)} className="text-sm text-gray-500 hover:underline">
                  ✏️ Edit
                </button>
              )}
            </div>

            {step < 2 && <p className="text-gray-400 text-sm">Fill location to unlock</p>}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Task Size */}
                  <div>
                    <p className="font-semibold mb-2 text-black">How big is your task?</p>
                    <div className="space-y-3">
                      {[
                        { size: "Small", desc: "Est. 1 hr" },
                        { size: "Medium", desc: "Est. 2–3 hrs" },
                        { size: "Large", desc: "Est. 4+ hrs" },
                      ].map((option) => (
                        <label
                          key={option.size}
                          className={`flex items-center border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                            form.taskSize === option.size ? "border-black bg-white shadow-sm" : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="taskSize"
                            checked={form.taskSize === option.size}
                            onChange={() => setForm({ ...form, taskSize: option.size })}
                            className="w-5 h-5 mr-3"
                          />
                          <div>
                            <p className="font-semibold text-black">{option.size}</p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <p className="font-semibold mb-2 text-black">Vehicle Requirements</p>
                    <div className="space-y-3">
                      {[
                        { vehicle: "Not needed", desc: "Not needed for task" },
                        { vehicle: "Car", desc: "Task requires a car" },
                        { vehicle: "Truck", desc: "Task requires a truck" },
                      ].map((option) => (
                        <label
                          key={option.vehicle}
                          className={`flex items-center border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                            form.vehicle === option.vehicle ? "border-black bg-white shadow-sm" : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="vehicle"
                            checked={form.vehicle === option.vehicle}
                            onChange={() => setForm({ ...form, vehicle: option.vehicle })}
                            className="w-5 h-5 mr-3"
                          />
                          <div>
                            <p className="font-semibold text-black">{option.vehicle}</p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    disabled={!form.taskSize || !form.vehicle}
                    onClick={() => setStep(3)}
                    className={`py-2 px-6 rounded-full transition ${
                      !form.taskSize || !form.vehicle
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step > 2 && (
              <div className="text-gray-600">
                <p>Selected Task Size: {form.taskSize}</p>
                <p>Vehicle Requirement: {form.vehicle || "None"}</p>
              </div>
            )}
          </div>

          {/* STEP 3 (Details) */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-black">Tell us the details of your task</h2>
              {step > 3 && (
                <button type="button" onClick={() => setStep(3)} className="text-sm text-gray-500 hover:underline">
                  ✏️ Edit
                </button>
              )}
            </div>

            {step < 3 && <p className="text-gray-400 text-sm">Select task size to unlock</p>}

            {step === 3 && (
              <>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 text-black focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={4}
                  placeholder="Describe your task in detail..."
                />
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition"
                  >
                    See Taskers & Prices
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      )}

      {/* ---------- STEP 4 (Tasker Selection) ---------- */}
      {step === 4 && (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 pt-4">
          {/* LEFT: Filters Sidebar */}
          <FiltersSidebar 
            serviceName={serviceName} 
            taskerCount={visibleUsers.length}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* RIGHT: Tasker Results */}
          <main className="flex-1">
            {loading && (
              <div className="border rounded-lg bg-white p-8 text-gray-600 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                Loading taskers…
              </div>
            )}
            {error && (
              <div className="border rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
            )}
            {!loading && !error && (
              <>
                {visibleUsers.length === 0 ? (
                  <div className="border rounded-lg bg-white p-8 text-center">
                    <p className="text-gray-500 mb-4">
                      No taskers found for <strong>{serviceName}</strong>
                      {(filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) && 
                        " with the current filters"
                      }.
                    </p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your filters or select a different service.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {visibleUsers.map((u) => (
                      <TaskerCard key={u._id} u={u} onSelect={setSelectedTasker} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      )}

      {/* 🪟 Popup for Date, Time, Payment */}
      <BookingPopup
        tasker={selectedTasker}
        onClose={() => setSelectedTasker(null)}
      />
    </div>
  );
}