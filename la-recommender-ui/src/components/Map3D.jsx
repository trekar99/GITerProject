import React, { useEffect, useRef, useMemo } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zZXBsbG10MjAiLCJhIjoiY21pYWY5aDg5MHhmZTJpczk5ODcxYmlmayJ9.guB9Abh7CFwHL_3FYRlEKQ';

const Map3D = ({ neighborhoods = [], focusedNeighborhood, mapStyle, isGoTMode, onSelectNeighborhood }) => {
    const mapRef = useRef(null);

    // Generamos el GeoJSON de forma SEGURA
    const geoJSONData = useMemo(() => {
        // Filtramos barrios que tengan polígono Y que el polígono tenga coordenadas válidas
        const readyNeighborhoods = neighborhoods.filter(nb =>
            nb.polygonGeoJSON &&
            nb.polygonGeoJSON.coordinates &&
            nb.polygonGeoJSON.coordinates.length > 0
        );

        if (readyNeighborhoods.length === 0) return null;

        return {
            type: 'FeatureCollection',
            features: readyNeighborhoods.map(nb => ({
                type: 'Feature',
                properties: { id: nb.id, name: nb.name, score: nb.score },
                geometry: nb.polygonGeoJSON
            }))
        };
    }, [neighborhoods]);

    // Efecto de vuelo (flyTo) - También protegido
    useEffect(() => {
        if (focusedNeighborhood && mapRef.current && focusedNeighborhood.center) {
            const [lat, lng] = focusedNeighborhood.center;

            // Pequeña validación de coordenadas
            if (isNaN(lat) || isNaN(lng)) return;

            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 14,
                pitch: 60,
                bearing: -15,
                duration: 2500,
                essential: true
            });
        }
    }, [focusedNeighborhood]);

    // --- COLORES DINÁMICOS ---
    const polygonColors = {
        fillActive: isGoTMode ? '#7f1d1d' : '#8b5cf6',
        fillInactive: isGoTMode ? '#2c1810' : '#475569',
        line: isGoTMode ? '#d4af37' : '#a78bfa',
        opacity: isGoTMode ? 0.5 : 0.6
    };

    // Manejador de clics
    const onMapClick = (event) => {
        const features = event.features;
        if (features && features.length > 0) {
            const clickedFeature = features.find(f => f.layer.id === 'neighborhood-fill');
            if (clickedFeature) {
                const neighborhoodId = clickedFeature.properties.id;
                const selected = neighborhoods.find(nb => nb.id === neighborhoodId);
                if (selected && onSelectNeighborhood) {
                    onSelectNeighborhood(selected);
                }
            }
        }
    };

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                latitude: 34.0522,
                longitude: -118.2437,
                zoom: 10,
                pitch: 0,
                bearing: 0
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle || "mapbox://styles/mapbox/dark-v11"}
            mapboxAccessToken={MAPBOX_TOKEN}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            onClick={onMapClick}
            interactiveLayerIds={['neighborhood-fill']}
        >
            <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                filter={['==', 'extrude', 'true']}
                type="fill-extrusion"
                minzoom={13}
                paint={{
                    'fill-extrusion-color': isGoTMode ? '#3e3327' : '#aaa',
                    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
                    'fill-extrusion-opacity': 0.6
                }}
            />

            {geoJSONData && (
                <Source id="neighborhoods-source" type="geojson" data={geoJSONData}>
                    <Layer
                        id="neighborhood-fill"
                        type="fill"
                        paint={{
                            'fill-color': [
                                'case',
                                ['==', ['get', 'id'], focusedNeighborhood?.id || ''],
                                polygonColors.fillActive,
                                polygonColors.fillInactive
                            ],
                            'fill-opacity': polygonColors.opacity
                        }}
                    />
                    <Layer
                        id="neighborhood-line"
                        type="line"
                        paint={{
                            'line-color': polygonColors.line,
                            'line-width': 3,
                            'line-blur': isGoTMode ? 1 : 0
                        }}
                    />
                </Source>
            )}

            {focusedNeighborhood && (
                <Popup
                    longitude={focusedNeighborhood.center[1]}
                    latitude={focusedNeighborhood.center[0]}
                    anchor="bottom"
                    closeButton={false}
                    offset={40}
                    className="custom-popup-3d"
                >
                    <div className={`p-2 min-w-[150px] ${isGoTMode ? 'text-[#3e3327]' : 'text-slate-900'}`}>
                        <h3 className="font-bold text-lg">{focusedNeighborhood.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold opacity-70">MATCH</span>
                            <span className={`text-sm font-extrabold ${isGoTMode ? 'text-[#7f1d1d]' : 'text-violet-700'}`}>
                    {focusedNeighborhood.score}%
                </span>
                        </div>
                        {!focusedNeighborhood.polygonGeoJSON && (
                            <div className="text-[10px] mt-1 animate-pulse text-orange-600">
                                {isGoTMode ? "Buscando en los mapas..." : "Cargando perímetro..."}
                            </div>
                        )}
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default Map3D;