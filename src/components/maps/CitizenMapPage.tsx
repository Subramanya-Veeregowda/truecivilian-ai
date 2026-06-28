import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useShell } from '../../context/ShellContext';
import { useNotifications } from '../../context/NotificationContext';
import { MapFilters as FilterType, Issue, HeatmapPoint, OptimizedRoute } from './types';
import { MapFilters } from './MapFilters';
import { SearchLocationBar } from './SearchLocationBar';
import { MyLocationButton } from './MyLocationButton';
import { HeatmapToggle } from './HeatmapToggle';
import { RoutePlannerCard } from './RoutePlannerCard';
import { NearbyIssuesPanel } from './NearbyIssuesPanel';
import { ClusteredMarkers } from './ClusteredMarkers';
import { IssueDetailsBottomSheet } from './IssueDetailsBottomSheet';
import { CanvasHeatmapOverlay } from './CanvasHeatmapOverlay';
import { RoutePolyline } from './RoutePolyline';
import { Sparkles, MapPin, Plus, Loader2, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export const CitizenMapPage: React.FC = () => {
  const { role, activeTab, setActiveTab } = useShell();
  const { addNotification } = useNotifications();

  // Map state
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 });
  const [zoom, setZoom] = useState<number>(13);
  const [address, setAddress] = useState<string>('Bangalore, KA, India');

  // Business data state
  const [issues, setIssues] = useState<Issue[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterType>({
    category: 'ALL',
    status: 'ALL',
    severity: 'ALL',
    priority: 'ALL',
    departmentId: 'ALL',
    distanceKm: 999999, // default to all distances
  });

  // UI view state
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number } | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);

  // 1. Fetch departments
  useEffect(() => {
    const fetchDeps = async () => {
      try {
        // Fallback static departments if API is pending database seeds
        const staticDeps = [
          { id: '1b10e5d1-9f93-4a1e-bf19-333e2dc088a1', name: 'Roads & Highway Board' },
          { id: '2b10e5d1-9f93-4a1e-bf19-333e2dc088a2', name: 'Water Supply & Sewerage Desk' },
          { id: '3b10e5d1-9f93-4a1e-bf19-333e2dc088a3', name: 'Municipal Solid Waste Dept' },
          { id: '4b10e5d1-9f93-4a1e-bf19-333e2dc088a4', name: 'Electricity Board (BESCOM)' },
        ];
        setDepartments(staticDeps);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDeps();
  }, []);

  // 2. Fetch issues from backend with filters applied
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.category !== 'ALL') params.category = filters.category;
      if (filters.status !== 'ALL') params.status = filters.status;
      if (filters.severity !== 'ALL') params.severity = filters.severity;
      if (filters.priority !== 'ALL') params.priority = filters.priority;
      if (filters.departmentId !== 'ALL') params.departmentId = filters.departmentId;

      // Distance radius filter from center
      if (filters.distanceKm < 100) {
        params.centerLat = center.lat;
        params.centerLng = center.lng;
        params.radiusKm = filters.distanceKm;
      }

      const response = await api.get<Issue[]>(`/maps/issues`, { params });
      setIssues(response.data);

      // Fetch heatmap points separately for high visual density performance
      const hmResponse = await api.get<HeatmapPoint[]>(`/maps/heatmap`);
      setHeatmapPoints(hmResponse.data);
    } catch (err) {
      console.error('Error loading map issues:', err);
      addNotification('Connection Error', 'Unable to fetch real-time map data from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasValidKey) {
      fetchIssues();
    }
  }, [filters, center, hasValidKey]);

  // 3. User GPS localization trigger
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      addNotification('GPS Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setZoom(15);
        setDroppedPin(null);
        setGpsLoading(false);
        addNotification('GPS Centered', 'Map locked to your exact coordinates.', 'success');
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsLoading(false);
        // Fallback default center to Bangalore with notice
        setCenter({ lat: 12.9716, lng: 77.5946 });
        addNotification('GPS Warning', 'Unable to fetch current GPS coordinates. Showing default municipal center.', 'info');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // 4. Handle location selected from geocoder autocomplete
  const handleLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
    setCenter({ lat: loc.lat, lng: loc.lng });
    setAddress(loc.address);
    setZoom(15);
    setDroppedPin(null);
  };

  // 5. Dropping custom pins on the map
  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      const { lat, lng } = e.detail.latLng;
      setDroppedPin({ lat, lng });
      setSelectedIssue(null);
    }
  };

  // 6. Transition to create report wizard using dropped pin
  const handleReportAtDroppedPin = () => {
    if (droppedPin) {
      localStorage.setItem('reportedPinLat', droppedPin.lat.toString());
      localStorage.setItem('reportedPinLng', droppedPin.lng.toString());
      setActiveTab('report');
    }
  };

  // Splash screen shown if API key is missing
  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center min-h-[75vh] bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl p-8 max-w-xl shadow-2xl text-xs text-left space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
              <MapPin className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-zinc-900 dark:text-white">Google Maps API Key Required</h2>
              <p className="text-zinc-400 font-medium font-mono text-[9px] uppercase tracking-wider">Sprint 9 Geospatial Module</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl text-amber-700 dark:text-amber-400 border border-amber-500/10 space-y-1">
            <p className="font-bold">Missing Environment Variable:</p>
            <p className="leading-relaxed">
              TrueCivilian requires a valid Google Maps Platform API key to render the interactive layout and calculate optimized routing paths.
            </p>
          </div>

          <div className="space-y-3.5">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Follow these 3 steps to configure your key:</p>
            <div className="space-y-2.5 leading-relaxed text-zinc-500 dark:text-zinc-400">
              <p>
                <strong>1. Get an API Key:</strong> Get your credentials from the{' '}
                <a
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline font-semibold"
                >
                  Google Cloud Console
                </a>.
              </p>
              <p>
                <strong>2. Inject into AI Studio:</strong> Open the <strong>Settings</strong> (⚙️ gear icon in the top-right corner) → click <strong>Secrets</strong> → type <code>GOOGLE_MAPS_PLATFORM_KEY</code> → paste your API key → press <strong>Enter</strong>.
              </p>
              <p>
                <strong>3. Automated Compilation:</strong> The development server will detect the key, rebuild the platform, and mount the fully active map automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAuthority = role === 'authority' || role === 'admin';

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <SearchLocationBar onLocationSelect={handleLocationSelect} defaultCenterAddress={address} />
          
          <div className="flex items-center gap-2.5">
            <HeatmapToggle showHeatmap={showHeatmap} onToggle={setShowHeatmap} />
            <MyLocationButton onClick={handleMyLocation} loading={gpsLoading} />
          </div>
        </div>

        <MapFilters
          filters={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters({
              category: 'ALL',
              status: 'ALL',
              severity: 'ALL',
              priority: 'ALL',
              departmentId: 'ALL',
              distanceKm: 999999,
            })
          }
          departments={departments}
        />
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[68vh]">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 h-full">
          {isAuthority ? (
            <RoutePlannerCard
              issues={issues}
              onRouteGenerated={setOptimizedRoute}
              startLocation={{ lat: center.lat, lng: center.lng, address }}
            />
          ) : (
            <NearbyIssuesPanel
              centerLat={center.lat}
              centerLng={center.lng}
              onSelectIssue={(issue) => {
                setSelectedIssue(issue);
                setCenter({ lat: issue.latitude, lng: issue.longitude });
                setZoom(15);
                setDroppedPin(null);
              }}
              selectedIssueId={selectedIssue?.id}
            />
          )}
        </div>

        {/* Map Container panel */}
        <div className="lg:col-span-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl shadow-xl overflow-hidden relative h-full">
          {loading && (
            <div className="absolute top-4 left-4 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border border-zinc-200/40 dark:border-zinc-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs shadow-md">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Filtering map pins...</span>
            </div>
          )}

          {/* Dropped custom pin menu tooltip */}
          {droppedPin && (
            <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-40 bg-zinc-900/95 border border-white/10 px-4 py-3 rounded-2xl flex items-center justify-between gap-4 shadow-xl max-w-sm">
              <div className="space-y-0.5">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Custom Dropped Pin</span>
                <p className="text-[10px] text-zinc-300 font-semibold truncate">
                  Lat: {droppedPin.lat.toFixed(5)}, Lng: {droppedPin.lng.toString().slice(0, 8)}
                </p>
              </div>
              <button
                onClick={handleReportAtDroppedPin}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-1.5 rounded-xl transition-all text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Report Issue
              </button>
            </div>
          )}

          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              center={center}
              onCenterChanged={(e) => setCenter(e.detail.center)}
              zoom={zoom}
              onZoomChanged={(e) => setZoom(e.detail.zoom)}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
            >
              {/* 1. Standard pin markers */}
              {!showHeatmap && (
                <ClusteredMarkers
                  issues={issues}
                  onMarkerClick={(issue) => {
                    setSelectedIssue(issue);
                    setDroppedPin(null);
                  }}
                  selectedIssueId={selectedIssue?.id}
                />
              )}

              {/* 2. Custom dropped pin marker */}
              {droppedPin && (
                <AdvancedMarker position={droppedPin}>
                  <Pin background="#ef4444" borderColor="#ffffff" glyphColor="#ffffff">
                    🎯
                  </Pin>
                </AdvancedMarker>
              )}

              {/* 3. Heatmap layer overlay */}
              {showHeatmap && heatmapPoints.length > 0 && (
                <CanvasHeatmapOverlay points={heatmapPoints} />
              )}

              {/* 4. Optimized routing path polyline */}
              {isAuthority && optimizedRoute && optimizedRoute.pathCoordinates.length > 1 && (
                <RoutePolyline path={optimizedRoute.pathCoordinates} />
              )}
            </Map>
          </APIProvider>

          {/* Issue Details Sheet sliding overlay */}
          {selectedIssue && (
            <IssueDetailsBottomSheet
              issue={selectedIssue}
              onClose={() => setSelectedIssue(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
