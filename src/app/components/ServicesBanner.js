"use client";
import { useEffect, useMemo, useRef, useState } from "react";
// Import useRouter for navigation in Next.js
import { useRouter } from "next/navigation";

// 1. Create an array of service objects with their names and links
const ALL_SERVICES_DATA = [
  { name: "App Development", link: "/services/DIGITAL-DEVELOPMENT/app-development" },
  { name: "Brand Development", link: "/services/DIGITAL-DEVELOPMENT/brand-development" },
  { name: "Graphic Design", link:"/services/DIGITAL-DEVELOPMENT/graphic-design" },
  { name: "Logo Development", link: "/services/DIGITAL-DEVELOPMENT/logo-development" },
  { name: "Online Store Development",   link: "/services/DIGITAL-DEVELOPMENT/online-store-development" },
 
];

export default function ServicesBanner() {
  const router = useRouter(); // Initialize the router
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Update results to filter the array of objects
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_SERVICES_DATA;
    // Filter by the 'name' property of the service objects
    return ALL_SERVICES_DATA.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  // Adjust useEffect dependencies and usage based on new 'results' structure
  useEffect(() => {
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, Math.max(results.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        // Pass the service object to selectItem
        if (results.length > 0) selectItem(results[highlight] || results[0]);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, results, highlight]); // Dependencies updated

  // The function now accepts a service object
  function selectItem(service) {
    // 1. Set the input query to the service name
    setQuery(service.name);
    // 2. Close the dropdown
    setOpen(false);
    // 3. Navigate to the service's link
    router.push(service.link);
    
    // Optional: Focus the input after selection (for better UX)
    inputRef.current?.focus();
  }

  return (
    <section className="w-full bg-black text-white flex flex-col items-center justify-center py-32">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
        Get help at the speed of zip!
      </h1>

      <div ref={wrapperRef} className="relative w-[320px] md:w-[450px]" aria-expanded={open}>
        <div className="flex bg-white rounded-full overflow-hidden shadow">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlight(0);
            }}
            onFocus={() => setOpen(true)}
            placeholder="What do you need help with?"
            className="flex-1 px-4 py-3 text-black focus:outline-none"
            aria-autocomplete="list"
            aria-controls="services-listbox"
            aria-activedescendant={open ? `option-${highlight}` : undefined}
          />
          <button
            className="bg-yellow-500 px-6 flex items-center justify-center"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle services list" // Changed label for clarity
          >
            🔍
          </button>
        </div>

        {open && (
          <ul
            id="services-listbox"
            role="listbox"
            className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-white/10 bg-white text-black shadow-lg"
          >
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500 select-none">
                No matches. Try another term.
              </li>
            )}
            {results.map((service, idx) => (
              <li
                key={service.name} // Use name as key
                id={`option-${idx}`}
                role="option"
                aria-selected={idx === highlight}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  // Pass the service object to selectItem
                  selectItem(service);
                }}
                className={`cursor-pointer px-4 py-3 text-sm ${
                  idx === highlight ? "bg-gray-100" : "bg-white"
                }`}
              >
                {service.name} {/* Display the service name */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}