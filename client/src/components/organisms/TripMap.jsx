import { useEffect, useRef, useState } from "react";
import { CompassIcon } from "../../lib/icons.jsx";
import { googleMapsEmbedUrl, loadGoogleMaps } from "../../lib/googleMaps.js";
import styles from "./TripMap.module.css";

const FEATURED_PLACES = [
  { name: "Holy Rosary Parish", address: "Santo Rosario, Angeles City", lat: 15.1455, lng: 120.5881 },
  { name: "Clark Museum", address: "Clark Freeport Zone, Pampanga", lat: 15.1857, lng: 120.5454 },
  { name: "Marquee Mall", address: "Pulung Maragul, Angeles City", lat: 15.1696, lng: 120.5881 },
  { name: "Nayong Pilipino sa Clark", address: "Clark Freeport Zone, Pampanga", lat: 15.1752, lng: 120.5265 },
];

/**
 * TripMap — organism
 * Props: destinations
 */
export default function TripMap({ destinations, onAddDestination }) {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const clickListenerRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!mapElement.current) return undefined;

    let disposed = false;
    let map;
    let markers = [];

    loadGoogleMaps()
      .then(async (maps) => {
        if (disposed) return;
        map = new maps.Map(mapElement.current, {
          center: { lat: 15.145, lng: 120.588 },
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });
        mapRef.current = map;

        const geocoder = new maps.Geocoder();
        clickListenerRef.current = map.addListener("click", ({ latLng }) => {
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status !== "OK" || !results?.[0]) return;
            const result = results[0];
            setSelectedPlace({
              name: result.address_components?.find((component) => component.types.includes("point_of_interest"))?.long_name || result.formatted_address.split(",")[0],
              address: result.formatted_address,
              location: latLng,
            });
            if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
            selectedMarkerRef.current = new maps.Marker({
              map,
              position: latLng,
              title: "Selected destination",
              animation: maps.Animation.DROP,
            });
          });
        });
        const placesToShow = destinations.length ? destinations.slice(0, 20) : FEATURED_PLACES;
        const locations = await Promise.all(
          placesToShow.map((destination) => {
            if (Number.isFinite(destination.lat) && Number.isFinite(destination.lng)) {
              return Promise.resolve({ destination, location: new maps.LatLng(destination.lat, destination.lng) });
            }
            return new Promise((resolve) => {
              geocoder.geocode(
                { address: `${destination.name}, Angeles City, Pampanga, Philippines` },
                (results, status) => resolve(status === "OK" && results[0] ? { destination, location: results[0].geometry.location } : null),
              );
            });
          }),
        );
        if (disposed) return;

        const bounds = new maps.LatLngBounds();
        locations.filter(Boolean).forEach(({ destination, location }) => {
          const status = destination.status || (destination.done ? "done" : "next");
          const marker = new maps.Marker({
            map,
            position: location,
            title: `${destination.name} (${status.toUpperCase()})`,
            label: {
              text: destinations.length ? destination.name : `★ ${destination.name}`,
              color: "#203238",
              fontWeight: "700",
              fontSize: "12px",
              className: "trip-map-label",
            },
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 13,
              fillColor: status === "done" ? "#4d9953" : status === "otw" ? "#d95e43" : "#d99a31",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
          markers.push(marker);
          bounds.extend(location);
        });
        if (locations.filter(Boolean).length > 1) map.fitBounds(bounds, 60);
      })
      .catch((error) => {
        if (!disposed) setMapError(error.message);
      });

    return () => {
      disposed = true;
      if (clickListenerRef.current && window.google?.maps?.event) window.google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
      mapRef.current = null;
      if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [destinations]);

  return (
    <div className={styles.card}>
      <div className={`${styles.canvas} ${mapError ? styles.fallback : ""}`} ref={mapElement}>
        {mapError ? (
          <div className={styles.embedFallback}>
            <iframe
              title="Google Maps preview for Angeles City"
              src={googleMapsEmbedUrl("Angeles City, Pampanga")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : null}
        {!mapError && <div className={styles.mapHint}>{destinations.length ? "N Next · O OTW · D Done" : "Featured places in Angeles City"}</div>}
        {destinations.length === 0 && (
          <div className={styles.featuredList}>
            <strong>Start with a famous place</strong>
            {FEATURED_PLACES.map((place) => (
              <button key={place.name} type="button" onClick={() => onAddDestination?.({ ...place, notes: place.address })}>
                <span>{place.name}</span><small>{place.address}</small>
              </button>
            ))}
          </div>
        )}
        {selectedPlace && !mapError && (
          <div className={styles.selectedPlace}>
            <div>
              <strong>{selectedPlace.name}</strong>
              <span>{selectedPlace.address}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const coordinates = selectedPlace.location.toJSON();
                onAddDestination?.({
                  name: selectedPlace.name,
                  notes: selectedPlace.address,
                  address: selectedPlace.address,
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                });
                setSelectedPlace(null);
                if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
              }}
            >
              Add to destinations
            </button>
            <button type="button" className={styles.dismiss} onClick={() => setSelectedPlace(null)} aria-label="Dismiss selected place">
              ×
            </button>
          </div>
        )}
      </div>
      <div className={styles.mapDetails}>
        <div className={styles.footer}>
          <strong>{destinations.length ? "Your map plan" : "Start your map plan"}</strong>
          <span>{destinations.length ? `${destinations.length} place${destinations.length === 1 ? "" : "s"} saved` : "Famous places are ready to add"}</span>
        </div>
        {destinations.length > 0 ? (
          <>
            <div className={styles.mapStats}>
              <span><b>{destinations.filter((d) => (d.status || (d.done ? "done" : "next")) === "next").length}</b> Next</span>
              <span><b>{destinations.filter((d) => (d.status || "next") === "otw").length}</b> OTW</span>
              <span><b>{destinations.filter((d) => (d.status || (d.done ? "done" : "next")) === "done").length}</b> Done</span>
            </div>
            <div className={styles.upcomingList}>
              <span className={styles.detailsLabel}>Up next</span>
              {destinations.filter((d) => (d.status || (d.done ? "done" : "next")) !== "done").slice(0, 3).map((destination) => (
                <div key={destination.id} className={styles.upcomingItem}>
                  <span className={styles.upcomingDot} />
                  <span>{destination.name}</span>
                </div>
              ))}
              {!destinations.some((d) => (d.status || (d.done ? "done" : "next")) !== "done") && <span className={styles.allDone}>Every place is complete.</span>}
            </div>
          </>
        ) : (
          <p className={styles.mapTip}>Choose a famous place from the map or add a destination to start planning your route.</p>
        )}
      </div>
    </div>
  );
}
