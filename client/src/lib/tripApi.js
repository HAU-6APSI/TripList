const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // Keep the HTTP status when the API response is not JSON.
    }
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

export const getTrips = () => request("/api/trips");
export const getTrip = (id) => request(`/api/trips/${id}`);
export const createTrip = (values) => request("/api/trips", { method: "POST", body: JSON.stringify(values) });
export const updateTrip = (id, patch) => request(`/api/trips/${id}`, { method: "PUT", body: JSON.stringify(patch) });
export const deleteTrip = (id) => request(`/api/trips/${id}`, { method: "DELETE" });
export const addDestination = (tripId, values) => request(`/api/trips/${tripId}/destinations`, { method: "POST", body: JSON.stringify(values) });
export const toggleDestination = (tripId, destId) => request(`/api/trips/${tripId}/destinations/${destId}`, { method: "PATCH", body: JSON.stringify({ toggle: true }) });
export const updateDestinationStatus = (tripId, destId, status) => request(`/api/trips/${tripId}/destinations/${destId}`, { method: "PATCH", body: JSON.stringify({ status }) });
export const removeDestination = (tripId, destId) => request(`/api/trips/${tripId}/destinations/${destId}`, { method: "DELETE" });
export const addActivity = (tripId, values) => request(`/api/trips/${tripId}/activities`, { method: "POST", body: JSON.stringify(values) });
export const toggleActivity = (tripId, actId) => request(`/api/trips/${tripId}/activities/${actId}`, { method: "PATCH", body: JSON.stringify({ toggle: true }) });
export const removeActivity = (tripId, actId) => request(`/api/trips/${tripId}/activities/${actId}`, { method: "DELETE" });
export const updateNotes = (tripId, notes) => updateTrip(tripId, { notes });
