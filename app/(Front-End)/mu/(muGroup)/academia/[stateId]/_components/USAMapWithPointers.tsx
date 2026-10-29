"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// import { hospitalData, universityData } from "@/public/staticData";
import MapPopup from "@/components/reusable/MapPopup";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const hospitalIcon = new L.Icon({
  // Hospital Building Icon
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448513.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const universityIcon = new L.Icon({
  // University Location Icon
  iconUrl: "https://cdn-icons-png.flaticon.com/512/16344/16344440.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const residentialIcon = new L.Icon({
  // Residential Area Icon
  iconUrl: "https://cdn-icons-png.flaticon.com/512/17573/17573474.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const LocationFocus = ({
  location,
  zoomLevel,
}: {
  location?: number[];
  zoomLevel: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!location || location.length < 2) {
      return;
    }

    const [latitude, longitude] = location;
    const targetZoom = Math.max(zoomLevel, 12);

    map.setView([latitude, longitude], targetZoom, { animate: true });
  }, [location, zoomLevel, map]);

  return null;
};

// Component that geocodes area name and draws its border outline
const AreaHighlighter = ({
  areaName,
  zoomLevel,
  onComplete,
  suppressMove,
}: {
  areaName: string;
  zoomLevel: number;
  onComplete?: () => void;
  suppressMove?: boolean;
}) => {
  const map = useMap();
  const [highlightLayer, setHighlightLayer] = useState<L.Layer | null>(null);

  useEffect(() => {
    if (!areaName) {
      onComplete?.();
      return;
    }

    const geocodeArea = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(areaName)}&format=json&limit=1&polygon_geojson=1`,
        );
        const data = await response.json();

        if (data && data[0]) {
          const { lat, lon, boundingbox, geojson } = data[0];

          if (highlightLayer) map.removeLayer(highlightLayer);

          let boundaryLayer: L.Layer | null = null;

          // 1. Draw the layer
          if (
            geojson &&
            (geojson.type === "Polygon" || geojson.type === "MultiPolygon")
          ) {
            boundaryLayer = L.geoJSON(geojson, {
              style: { color: "#ff7800", weight: 3, fill: false, opacity: 0.8 },
            }).addTo(map);
          } else {
            const bounds = L.latLngBounds(
              [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
              [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])],
            );
            boundaryLayer = L.rectangle(bounds, {
              color: "#ff7800",
              weight: 3,
              fill: false,
            }).addTo(map);
          }

          setHighlightLayer(boundaryLayer);

          // If suppressMove is set, just draw the outline and notify immediately.
          if (suppressMove) {
            onComplete?.();
          } else {
            // 2. Setup "Move End" listener
            // This ensures we notify only AFTER the zoom animation finishes
            map.once("moveend", () => {
              onComplete?.();
            });

            // 3. Trigger the move/zoom
            if (zoomLevel) {
              map.setView([parseFloat(lat), parseFloat(lon)], zoomLevel, {
                animate: true,
              });
            } else {
              const bounds = L.latLngBounds(
                [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
                [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])],
              );
              map.fitBounds(bounds, { animate: true });
            }
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        onComplete?.(); // Notify even on error so loader stops
      }
    };

    geocodeArea();

    return () => {
      if (highlightLayer) {
        map.removeLayer(highlightLayer);
      }
    };
  }, [areaName, zoomLevel, map, suppressMove, onComplete]);

  return null;
};

// Main Map Component accepting props
interface LeafLetMapProps {
  areaName?: string;
  zoomLevel?: number;
  onFinishZoom?: () => void;
  data: any;
  location?: number[];
}

const USAMapWithPointers = ({
  areaName,
  zoomLevel,
  onFinishZoom,
  data,
  location,
}: LeafLetMapProps) => {
  return (
    <MapContainer
      center={[location?.[0] || 39.8283, location?.[1] || -98.5795]}
      zoom={zoomLevel || 4}
      minZoom={4}
      style={{ height: "50vh", width: "100%", zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        minZoom={4}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {location && (
        <LocationFocus location={location} zoomLevel={20} />
      )}

      <AreaHighlighter
        areaName={areaName || ""}
        zoomLevel={zoomLevel || 4}
        onComplete={onFinishZoom}
        suppressMove={!!location}
      />

      <MarkerClusterGroup>
        {data?.facilities?.map((hospital: any) =>
          hospital?.latitude && hospital?.longitude ? (
            <Marker
              key={`hospital-${hospital.id}`}
              position={[Number(hospital.latitude), Number(hospital.longitude)]}
              icon={hospitalIcon}
            >
              <Popup autoPan={false} closeButton={false}>
                <MapPopup
                  name={hospital?.name}
                  address={hospital?.location}
                  website={hospital?.website}
                />
              </Popup>
            </Marker>
          ) : null,
        )}
        {data?.universities?.map((university: any) =>
          university?.latitude && university?.longitude ? (
            <Marker
              key={`university-${university.id}`}
              position={[
                Number(university.latitude),
                Number(university.longitude),
              ]}
              icon={universityIcon}
            >
              <Popup autoPan={false} closeButton={false}>
                <MapPopup
                  name={university?.name}
                  psychologyDegrees={university?.psychology_degrees}
                  counselingDegrees={university?.counseling_degrees}
                  neuroscienceDegrees={university?.neuroscience_degrees}
                  address={university?.address}
                  phone={university?.phone}
                  website={university?.website}
                />
              </Popup>
            </Marker>
          ) : null,
        )}
        {data?.residencies?.map((residency: any) =>
          residency?.latitude && residency?.longitude ? (
            <Marker
              key={`residency-${residency.id}`}
              position={[
                Number(residency.latitude),
                Number(residency.longitude),
              ]}
              icon={residentialIcon}
            >
              <Popup autoPan={false} closeButton={false}>
                <MapPopup
                type="residency"
                  name={residency.program_name}
                  address={residency.location}
                  website={residency.website}
                  degree={residency.degree_types}
                />
              </Popup>
            </Marker>
          ) : null,
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default USAMapWithPointers;
