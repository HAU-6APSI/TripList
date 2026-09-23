import { useEffect, useRef, useState } from "react";
import { CompassIcon } from "../../lib/icons.jsx";
import { googleMapsEmbedUrl, loadGoogleMaps } from "../../lib/googleMaps.js";
import styles from "./TripMap.module.css";

/**
 * TripMap — organism
 * Props: destinations
 */
export default function TripMap({ destinations, onAddDestination }) {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!destinations.length || !mapElement.current) return undefined;

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
        const clickListener = map.addListener("click", ({ latLng }) => {
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
        const locations = await Promise.all(
          destinations.slice(0, 20).map(
            (destination) =>
              new Promise((resolve) => {
                geocoder.geocode(
                  { address: `${destination.name}, Angeles City, Philippines` },
                  (results, status) => resolve(status === "OK" && results[0] ? { destination, location: results[0].geometry.location } : null),
                );
              }),
          ),
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
              text: destination.name,
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
      if (map) maps.event?.removeListener?.(clickListener);
      mapRef.current = null;
      if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [destinations]);

  return (
    <div className={styles.card}>
      <div className={`${styles.canvas} ${mapError ? styles.fallback : ""}`} ref={mapElement}>
        {destinations.length === 0 ? (
          <div className={styles.empty}>
            <CompassIcon size={26} />
            <span>No destinations pinned yet</span>
          </div>
        ) : mapError ? (
          <div className={styles.embedFallback}>
            <iframe
              title={`Google Maps preview for ${destinations[0].name}`}
              src={googleMapsEmbedUrl(destinations[0].name)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : null}
        {destinations.length > 0 && !mapError && (
          <div className={styles.mapHint}>N Next · O OTW · D Done</div>
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
                onAddDestination?.({ name: selectedPlace.name, notes: selectedPlace.address });
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
      <div className={styles.footer}>
        {destinations.length ? `${destinations.length} destination${destinations.length === 1 ? "" : "s"} on this trip` : "Pins appear here once you add destinations"}
      </div>
    </div>
  );
}
