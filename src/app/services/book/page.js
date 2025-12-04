"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import TaskerMap from "./Taskermap";

// AutocompleteInput (Google Places)
function AutocompleteInput({ value, onSelect, onChange, placeholder, className }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        if (!window.google) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        if (inputRef.current && window.google) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["address"],
              componentRestrictions: { country: "us" },
              fields: ["formatted_address", "address_components", "geometry"],
            }
          );

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) onSelect(place);
          });
        }
      } catch (error) {
        console.error("Error loading Google Places:", error);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full text-black placeholder-gray-400 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
    />
  );
}

// Booking modal
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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Book {tasker.firstName || "Tasker"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>

          <button type="submit" disabled={processing} className="w-full rounded-full bg-black px-4 py-2 text-white disabled:opacity-60">
            {processing ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Tasker card — improved responsive design
function TaskerCard({ u, onSelect }) {
  const hourlyRate = u.hourlyRate || 45.0;
  const ratingValue = u.rating || 5.0;
  const reviewCount = u.reviewsCount || 2;

  const taskStats = {
    primaryTasks: 1263,
    primaryTaskType: "Furniture Assembly",
    totalTasks: 1642,
    overallTaskType: "Assembly",
  };

  const sampleReview = {
    clientName: "pamela s.",
    date: "Fri, Oct 17",
    comment: "Great service, communication, and attention to detail.",
  };

  return (
    <article className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent((u.firstName || "") + " " + (u.lastName || ""))}`}
              alt={`${u.firstName || ""} ${u.lastName || ""}`}
              className="h-28 w-28 rounded-full object-cover border-2 border-gray-100"
            />

            {u.isVerified && (
              <span className="absolute -bottom-1 right-0 inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow">✓ Verified</span>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-bold text-black">{(u.firstName || "") + " " + (u.lastName || "")}</h4>

              <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1 font-semibold text-yellow-500">✰ <span className="text-black">{ratingValue.toFixed(1)}</span></span>
                <span className="text-gray-400">·</span>
                <span>{reviewCount} reviews</span>
              </div>

              <p className="mt-3 text-sm text-gray-600">{u.bio || "Reliable, professional, and detail-oriented. I finish work on time and ensure customer satisfaction."}</p>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold">${hourlyRate.toFixed(2)}/hr</div>
              <button onClick={() => onSelect(u)} className="mt-4 w-full rounded-full bg-black px-4 py-2 text-sm text-white">Select & Continue</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="rounded-md bg-gray-50 p-2">{taskStats.primaryTasks} {taskStats.primaryTaskType}</div>
            <div className="rounded-md bg-gray-50 p-2">{taskStats.totalTasks} {taskStats.overallTaskType} overall</div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {Array.isArray(u.skills) && u.skills.length > 0 ? (
                u.skills.slice(0, 6).map((s, i) => (
                  <span key={i} className="whitespace-nowrap rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700">{typeof s === 'string' ? s : s.name}</span>
                ))
              ) : (
                <span className="text-sm text-gray-400">No skills listed</span>
              )}
            </div>

            {u.availabilityTiming && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Starts: {u.availabilityTiming.startWork === 'in_one_week' ? 'In 1 Week' : u.availabilityTiming.startWork}</span>
                {u.availabilityTiming.preferredTime?.map((t, i) => <span key={i} className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">{t}</span>)}
                {u.availabilityTiming.availableDays?.slice(0,3).map((d, idx) => <span key={idx} className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">{d.slice(0,3)}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// Filters Sidebar — improved styling + sticky on large screens
function FiltersSidebar({ serviceName, taskerCount, filters, onFilterChange }) {
  const timeSlots = [
    { value: "morning", label: "Morning (8am - 12pm)" },
    { value: "afternoon", label: "Afternoon (12pm - 5pm)" },
    { value: "evening", label: "Evening (5pm - 9:30pm)" },
  ];

  const daysOfWeek = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
  ];

  const startWorkOptions = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "in_one_week", label: "Within a Week" },
  ];

  return (
    <aside className="w-full md:w-80">
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-green-800">Service</h4>
          <p className="mt-1 text-sm text-gray-700">{serviceName}</p>
          <p className="mt-1 text-xs text-gray-400">{taskerCount} taskers available</p>
        </div>

        <div className="mb-4">
          <h5 className="mb-2 text-sm font-semibold">Start Work</h5>
          <div className="flex flex-col gap-2">
            {startWorkOptions.map((o) => (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input type="radio" name="startWork" checked={filters.startWork === o.value} onChange={() => onFilterChange('startWork', o.value)} className="h-4 w-4" />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h5 className="mb-2 text-sm font-semibold">Time of Day</h5>
          <div className="flex flex-col gap-2">
            {timeSlots.map((t) => (
              <label key={t.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={filters.preferredTime.includes(t.value)} onChange={(e) => {
                  if (e.target.checked) onFilterChange('preferredTime', [...filters.preferredTime, t.value]);
                  else onFilterChange('preferredTime', filters.preferredTime.filter(x => x !== t.value));
                }} className="h-4 w-4" />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h5 className="mb-2 text-sm font-semibold">Available Days</h5>
          <div className="grid grid-cols-3 gap-2">
            {daysOfWeek.map((d) => (
              <label key={d.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={filters.availableDays.includes(d.value)} onChange={(e) => {
                  if (e.target.checked) onFilterChange('availableDays', [...filters.availableDays, d.value]);
                  else onFilterChange('availableDays', filters.availableDays.filter(x => x !== d.value));
                }} className="h-4 w-4" />
                <span className="text-xs">{d.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h5 className="mb-2 text-sm font-semibold">Price</h5>
          <div className="text-xs text-gray-500">Avg: <span className="font-semibold">$134.17/hr</span></div>
          <div className="mt-2 flex gap-2">
            <input type="range" min="10" max="150" className="w-full" />
          </div>
        </div>

        <div className="mt-2">
          {(filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) && (
            <button onClick={() => onFilterChange('clear', null)} className="w-full rounded-full border border-red-100 px-3 py-2 text-sm text-red-600">Clear Filters</button>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-400">All Taskers undergo ID and background checks. <span className="underline">Learn more</span></p>
      </div>
    </aside>
  );
}

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
    } else return decodeURIComponent(lastSegment.replace(/-/g, " "));
  };

  const serviceName = getServiceName();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ service: serviceName, location: "", unit: "", taskSize: "", vehicle: "", details: "", locationGeometry: null });
  const [filters, setFilters] = useState({ startWork: "", preferredTime: [], availableDays: [] });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({ startWork: "", preferredTime: [], availableDays: [] });
    } else setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleLocationSelect = (place) => {
    if (place && place.geometry?.location) {
      let streetNumber = '';
      let route = '';
      place.address_components.forEach(component => {
        if (component.types.includes('street_number')) streetNumber = component.long_name;
        if (component.types.includes('route')) route = component.long_name;
      });
      const fullStreet = streetNumber && route ? `${streetNumber} ${route}` : place.formatted_address;
      setForm(prev => ({ ...prev, location: fullStreet, locationGeometry: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } }));
    }
  };

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
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [step]);

  const visibleUsers = useMemo(() => {
    const list = usersData?.users || [];
    if (serviceName === "General Service" || serviceName === "Service") return list;
    let filtered = list.filter(tasker => {
      if (!tasker.skills || tasker.skills.length === 0) return false;
      const hasService = tasker.skills.some(skill => {
        const skillName = typeof skill === 'string' ? skill.toLowerCase() : skill.name?.toLowerCase();
        const currentService = serviceName.toLowerCase();
        return (skillName === currentService || skillName.includes(currentService) || currentService.includes(skillName) || skillName.replace(/\s+/g, '') === currentService.replace(/\s+/g, ''));
      });
      return hasService;
    });

    if (filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) {
      filtered = filtered.filter(tasker => {
        const availability = tasker.availabilityTiming;
        if (!availability) return false;
        let matches = true;
        if (filters.startWork && availability.startWork !== filters.startWork) matches = false;
        if (filters.preferredTime.length > 0) {
          const hasMatchingTime = filters.preferredTime.some(time => availability.preferredTime?.includes(time));
          if (!hasMatchingTime) matches = false;
        }
        if (filters.availableDays.length > 0) {
          const hasMatchingDay = filters.availableDays.some(day => availability.availableDays?.includes(day));
          if (!hasMatchingDay) matches = false;
        }
        return matches;
      });
    }

    return filtered;
  }, [usersData, serviceName, filters]);

  return (
    <div className="w-full px-4 md:px-10 pb-12">
      <div className="mx-auto max-w-7xl pt-8">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold">Book {serviceName}</h1>
          <p className="mt-2 text-sm text-gray-600">{serviceName !== "General Service" && serviceName !== "Service" ? `Available taskers for ${serviceName}` : "Browse all available taskers"}</p>
        </header>

        {step <= 3 && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your task location</h2>
                {step > 1 && <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline">✏️ Edit</button>}
              </div>

              {step === 1 && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <AutocompleteInput value={form.location} onSelect={handleLocationSelect} onChange={(value) => setForm(prev => ({ ...prev, location: value, locationGeometry: null }))} placeholder="Start typing your address..." />
                    {!form.locationGeometry && form.location.length > 0 && <p className="mt-2 text-sm text-red-500">Please select an address from the Google dropdown.</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit or Apartment Number</label>
                    <input type="text" name="unit" value={form.unit} onChange={handleChange} placeholder="Unit, Apt #, Suite, etc." className="w-full rounded-lg border border-gray-200 px-4 py-3" />
                  </div>

                  <div className="flex justify-center">
                    <button type="button" onClick={() => { if (form.locationGeometry) setStep(4); else alert("Please select a valid address from the Google dropdown results."); }} disabled={!form.locationGeometry} className={`rounded-full px-6 py-2 font-semibold ${form.locationGeometry ? 'bg-black text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                      See Taskers & Prices
                    </button>
                  </div>
                </>
              )}

              {step > 1 && <p className="mt-2 text-sm text-gray-600">{form.location}{form.unit ? `, ${form.unit}` : ""}</p>}
            </div>
          </form>
        )}

        {step === 4 && (
          <section className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Taskers Near You Map</h2>
              <p className="mt-1 text-sm text-gray-500">Showing taskers around the selected address</p>

              <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl border border-gray-100">
                <TaskerMap taskers={visibleUsers} centerLocation={form.locationGeometry} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
              <FiltersSidebar serviceName={serviceName} taskerCount={visibleUsers.length} filters={filters} onFilterChange={handleFilterChange} />

              <main>
                {loading && <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">Loading taskers…</div>}
                {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">{error}</div>}

                {!loading && !error && (
                  <>
                    {visibleUsers.length === 0 ? (
                      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
                        <p className="text-gray-500">No taskers found for <strong>{serviceName}</strong>{(filters.startWork || filters.preferredTime.length > 0 || filters.availableDays.length > 0) ? ' with the current filters' : ''}.</p>
                        <p className="mt-2 text-sm text-gray-400">Try adjusting your filters or select a different service.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {visibleUsers.map(u => <TaskerCard key={u._id || u.id} u={u} onSelect={setSelectedTasker} />)}
                      </div>
                    )}
                  </>
                )}
              </main>
            </div>
          </section>
        )}

        <BookingPopup tasker={selectedTasker} onClose={() => setSelectedTasker(null)} />
      </div>
    </div>
  );
}
