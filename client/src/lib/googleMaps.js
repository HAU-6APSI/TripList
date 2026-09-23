let mapsPromise;

export function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.maps), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return mapsPromise;
}

export function googleMapsSearchUrl(name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Angeles City, Philippines`)}`;
}

export function googleMapsEmbedUrl(name) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${name}, Angeles City, Philippines`)}&output=embed`;
}

export function googleMapsDirectionsUrl(destination, origin) {
  const target = Number.isFinite(destination.lat) && Number.isFinite(destination.lng)
    ? `${destination.lat},${destination.lng}`
    : `${destination.name}, Angeles City, Pampanga, Philippines`;
  const originParam = origin ? `&origin=${encodeURIComponent(`${origin.lat},${origin.lng}`)}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}${originParam}&travelmode=driving`;
}