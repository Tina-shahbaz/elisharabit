"use client";
import React, { useEffect, useRef } from "react";

// Initial center point (Fallback agar user location na ho)
const DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }; // Los Angeles ka example

export default function TaskerMap({ taskers, centerLocation }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    
    // Tasker locations jo map par markers banenge
    const taskerLocations = taskers
        .filter(t => t.location?.lat && t.location?.lng)
        .map(t => ({
            lat: t.location.lat,
            lng: t.location.lng,
            name: t.firstName + " " + t.lastName,
            hourlyRate: t.hourlyRate,
            // 🛑 IMPORTANT: Yeh fields aapki mock data/API mein honi chahiye
            email: t.email, 
            phone: t.phone 
        }));

    useEffect(() => {
        // Check if Google Maps API is loaded
        if (!window.google) {
             console.error("Google Maps API not loaded. Check script loading in AutocompleteInput or main layout.");
             return;
        }

        const loader = window.google.maps.importLibrary("maps");
        const markerLoader = window.google.maps.importLibrary("marker");

        Promise.all([loader, markerLoader]).then(([maps, markers]) => {
            const center = centerLocation || DEFAULT_CENTER;

            // 1. Map Initialize karna
            const map = new maps.Map(mapRef.current, {
                center: center,
                zoom: 12, // Initial zoom level
                mapId: "TASKER_MAP_ID", // Optional: Custom map style ID
                disableDefaultUI: true,
            });
            mapInstanceRef.current = map;

            // 2. User/Job Location Marker (Bara ya alag color ka)
            new markers.AdvancedMarkerElement({
                map,
                position: center,
                content: createMarkerContent('Your Location', 'blue', '🏠'), 
                title: "Your Task Location"
            });
            
            // 3. Tasker Markers add karna
            taskerLocations.forEach(tasker => {
                const marker = new markers.AdvancedMarkerElement({
                    map,
                    position: { lat: tasker.lat, lng: tasker.lng },
                    content: createMarkerContent(`$${tasker.hourlyRate}/hr`, 'green', '👤'),
                    title: tasker.name
                });

                // 4. Info Window (Details dikhane ke liye)
                const infoWindow = new maps.InfoWindow({
                    content: `
                        <div style="color:black; padding: 5px;">
                            <strong>${tasker.name}</strong><br>
                            Rate: $${tasker.hourlyRate}/hr<br>
                            Email: <a href="mailto:${tasker.email}">${tasker.email}</a><br>
                            Phone: <a href="tel:${tasker.phone}">${tasker.phone}</a>
                        </div>
                    `,
                });

                marker.addListener("click", () => {
                    infoWindow.open({
                        anchor: marker,
                        map,
                    });
                });
            });

            // 5. Map Bounds adjust karna taaki saare markers fit ho jayen
            if (taskerLocations.length > 0) {
                 const bounds = new maps.LatLngBounds();
                 bounds.extend(center); // User location
                 taskerLocations.forEach(t => bounds.extend(t));
                 map.fitBounds(bounds);
            }

        }).catch(error => {
            console.error("Error loading Google Maps libraries:", error);
        });

    }, [taskers, centerLocation]); // centerLocation change hone par map update hoga

    // Custom Marker Content Function
    const createMarkerContent = (text, color, icon) => {
        const div = document.createElement('div');
        div.className = `p-1 px-2 rounded-full border border-white text-xs font-bold whitespace-nowrap shadow-md ${color === 'blue' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`;
        div.textContent = text;
        return div;
    };

    return (
        <div 
            ref={mapRef} 
            // Map ka size control karna
            style={{ width: '100%', height: '500px', borderRadius: '8px' }} 
        />
    );
}