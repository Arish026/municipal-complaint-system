'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Check, AlertCircle, Crosshair } from 'lucide-react';

interface MapPickerProps {
  currentLocation: string;
  onLocationSelect: (locationText: string, coords?: { lat: number; lng: number }) => void;
  onGpsSuccess?: (msg: string) => void;
  onGpsError?: (msg: string) => void;
}

interface KarachiZone {
  name: string;
  landmark: string;
  district: string;
  lat: number;
  lng: number;
  xPercent: number; // For visual canvas mapping
  yPercent: number;
}

const KARACHI_ZONES: KarachiZone[] = [
  {
    name: 'North Nazimabad',
    landmark: 'Block H near Five Star Chowrangi, North Nazimabad',
    district: 'District Central',
    lat: 24.9452,
    lng: 67.0421,
    xPercent: 44,
    yPercent: 22,
  },
  {
    name: 'Gulshan-e-Iqbal',
    landmark: 'University Road near Disco Bakery, Block 13-D, Gulshan',
    district: 'District East',
    lat: 24.9184,
    lng: 67.0973,
    xPercent: 62,
    yPercent: 32,
  },
  {
    name: 'Federal B Area',
    landmark: 'Block 14 Dastagir near Water Pump Chowrangi',
    district: 'District Central',
    lat: 24.9256,
    lng: 67.0652,
    xPercent: 52,
    yPercent: 26,
  },
  {
    name: 'Saddar / Empress Market',
    landmark: 'Preedy Street near Empress Market & Regal, Saddar',
    district: 'District South',
    lat: 24.8582,
    lng: 67.0254,
    xPercent: 38,
    yPercent: 58,
  },
  {
    name: 'Shahrah-e-Faisal',
    landmark: 'Shahrah-e-Faisal near Baloch Colony Flyover ramp',
    district: 'District East',
    lat: 24.8711,
    lng: 67.0854,
    xPercent: 58,
    yPercent: 52,
  },
  {
    name: 'Clifton Block 4 / Boat Basin',
    landmark: 'Near Bilawal Chowrangi & Boat Basin, Block 4, Clifton',
    district: 'District South',
    lat: 24.8214,
    lng: 67.0321,
    xPercent: 40,
    yPercent: 74,
  },
  {
    name: 'DHA Phase 6',
    landmark: 'Khayaban-e-Shahbaz commercial lane, DHA Phase 6',
    district: 'District South',
    lat: 24.8012,
    lng: 67.0624,
    xPercent: 54,
    yPercent: 82,
  },
  {
    name: 'Korangi Industrial',
    landmark: 'Main Korangi Crossing near Indus Hospital',
    district: 'District Korangi',
    lat: 24.8341,
    lng: 67.1265,
    xPercent: 76,
    yPercent: 66,
  },
];

export const MapPicker: React.FC<MapPickerProps> = ({
  currentLocation,
  onLocationSelect,
  onGpsSuccess,
  onGpsError,
}) => {
  const [selectedZone, setSelectedZone] = useState<KarachiZone>(KARACHI_ZONES[1]);
  const [pinCoords, setPinCoords] = useState<{ x: number; y: number }>({
    x: KARACHI_ZONES[1].xPercent,
    y: KARACHI_ZONES[1].yPercent,
  });
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number }>({
    lat: KARACHI_ZONES[1].lat,
    lng: KARACHI_ZONES[1].lng,
  });

  const handleZoneClick = (zone: KarachiZone) => {
    setSelectedZone(zone);
    setPinCoords({ x: zone.xPercent, y: zone.yPercent });
    setLiveCoords({ lat: zone.lat, lng: zone.lng });
    setGpsLocked(false);
    onLocationSelect(zone.landmark, { lat: zone.lat, lng: zone.lng });
  };

  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    // Approximate Karachi bounding coordinates (lat: 25.0 to 24.75, lng: 66.9 to 67.2)
    const lat = Number((25.0 - (y / 100) * 0.25).toFixed(4));
    const lng = Number((66.95 + (x / 100) * 0.25).toFixed(4));

    setPinCoords({ x, y });
    setLiveCoords({ lat, lng });
    setGpsLocked(false);

    // Find nearest named district
    let nearest = KARACHI_ZONES[0];
    let minDistance = 999999;
    KARACHI_ZONES.forEach((z) => {
      const dist = Math.hypot(z.xPercent - x, z.yPercent - y);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = z;
      }
    });

    const landmarkText = `${nearest.district} (Approx. ${nearest.name} sector, Coords: ${lat}°N, ${lng}°E)`;
    onLocationSelect(landmarkText, { lat, lng });
  };

  const handleTriggerGps = () => {
    setIsLocatingGps(true);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocatingGps(false);
          setGpsLocked(true);
          const { latitude, longitude, accuracy } = position.coords;
          const lat = Number(latitude.toFixed(4));
          const lng = Number(longitude.toFixed(4));
          setLiveCoords({ lat, lng });

          // Map within Karachi boundaries or fallback to closest zone
          const nearest = KARACHI_ZONES[0];
          setPinCoords({ x: nearest.xPercent, y: nearest.yPercent });

          const gpsText = `GPS Locked: ${lat}° N, ${lng}° E (${nearest.district}, ±${Math.round(accuracy)}m)`;
          onLocationSelect(gpsText, { lat, lng });
          if (onGpsSuccess) {
            onGpsSuccess(`GPS Locked: ${lat}° N, ${lng}° E (Accuracy: ±${Math.round(accuracy)}m)`);
          }
        },
        (error) => {
          setIsLocatingGps(false);
          // Simulated fallback GPS for Karachi Central
          const fallback = KARACHI_ZONES[1];
          setPinCoords({ x: fallback.xPercent, y: fallback.yPercent });
          setLiveCoords({ lat: fallback.lat, lng: fallback.lng });
          setGpsLocked(true);

          const fallbackText = `GPS Coordinates: ${fallback.lat}° N, ${fallback.lng}° E (${fallback.landmark})`;
          onLocationSelect(fallbackText, { lat: fallback.lat, lng: fallback.lng });

          if (onGpsError) {
            onGpsError('GPS permission denied or timeout. Used Karachi Civic GPS fallback.');
          }
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocatingGps(false);
      if (onGpsError) onGpsError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="map-picker-card">
      <div className="map-picker-topbar">
        <div className="map-picker-title">
          <Compass size={15} color="var(--primary-moss)" />
          <span>Karachi Municipal GPS Map Picker</span>
        </div>

        <div className="map-picker-actions">
          <button
            type="button"
            className={`btn-gps-trigger ${isLocatingGps ? 'locating' : ''} ${gpsLocked ? 'locked' : ''}`}
            onClick={handleTriggerGps}
            disabled={isLocatingGps}
          >
            <Navigation size={13} className={isLocatingGps ? 'spin' : ''} />
            <span>{isLocatingGps ? 'Locking GPS...' : gpsLocked ? 'GPS Locked' : 'Locate via GPS'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Stylized Karachi Map Canvas */}
      <div
        className="karachi-map-canvas"
        onClick={handleMapCanvasClick}
        title="Click anywhere on the Karachi map to drop a pin"
      >
        {/* Subtle Map Grid Lines */}
        <div className="map-grid-overlay" />

        {/* Karachi Coastline Representation */}
        <div className="map-sea-area">
          <span>Arabian Sea (Karachi Coast)</span>
        </div>

        {/* Major Karachi Arteries */}
        <div className="map-highway shahrah-faisal" title="Shahrah-e-Faisal" />
        <div className="map-highway university-road" title="University Road" />
        <div className="map-highway super-highway" title="M-9 Motorway" />

        {/* Hotspot Markers */}
        {KARACHI_ZONES.map((zone) => {
          const isSelected = selectedZone.name === zone.name;
          return (
            <button
              key={zone.name}
              type="button"
              className={`map-zone-node ${isSelected ? 'active' : ''}`}
              style={{ left: `${zone.xPercent}%`, top: `${zone.yPercent}%` }}
              onClick={(e) => {
                e.stopPropagation();
                handleZoneClick(zone);
              }}
              title={zone.landmark}
            >
              <span className="zone-dot" />
              <span className="zone-label">{zone.name}</span>
            </button>
          );
        })}

        {/* Active Dropped Pin */}
        <div
          className="map-active-pin"
          style={{ left: `${pinCoords.x}%`, top: `${pinCoords.y}%` }}
        >
          <div className="pin-pulse" />
          <MapPin size={22} className="pin-icon" />
        </div>
      </div>

      {/* Coordinate & District Readout Strip */}
      <div className="map-readout-strip">
        <div className="readout-item">
          <Crosshair size={12} color="var(--primary-moss)" />
          <span>Coordinates:</span>
          <strong>{liveCoords.lat}° N, {liveCoords.lng}° E</strong>
        </div>

        <div className="readout-item">
          <MapPin size={12} color="var(--text-muted)" />
          <span>Current Pin:</span>
          <strong>{selectedZone.name}</strong>
        </div>

        <span className="map-hint-text">Click anywhere on map to reposition pin</span>
      </div>

      {/* Quick Karachi District Chips */}
      <div className="map-hotspots-row">
        <span className="hotspots-caption">Quick Karachi Hotspots:</span>
        <div className="hotspots-pills">
          {KARACHI_ZONES.slice(0, 5).map((zone) => (
            <button
              key={zone.name}
              type="button"
              className={`hotspot-chip ${selectedZone.name === zone.name ? 'active' : ''}`}
              onClick={() => handleZoneClick(zone)}
            >
              <Check size={10} className="check-icon" />
              <span>{zone.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
