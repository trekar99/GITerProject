import React, { useEffect, useRef, useMemo } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zZXBsbG10MjAiLCJhIjoiY21pYWY5aDg5MHhmZTJpczk5ODcxYmlmayJ9.guB9Abh7CFwHL_3FYRlEKQ';

const Map3D = ({ neighborhoods = [], focusedNeighborhood }) => {
    const mapRef = useRef(null);

    // 1. Crear un GeoJSON que contenga TODOS los barrios recomendados ("FeatureCollection")
    const geoJSONData = useMemo(() => {
        if (!neighborhoods || neighborhoods.length === 0) return null;

        return {
            type: 'FeatureCollection',
            features: neighborhoods.map(nb => {
                // Invertir coords a [Lng, Lat]
                const swappedCoords = nb.coordinates.map(coord => [coord[1], coord[0]]);
                return {
                    type: 'Feature',
                    properties: {
                        id: nb.id,
                        name: nb.name,
                        score: nb.score
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [swappedCoords]
                    }
                };
            })
        };
    }, [neighborhoods]);

    // 2. Efecto de Vuelo: Si cambia el "focusedNeighborhood", volamos allí
    useEffect(() => {
        if (focusedNeighborhood && mapRef.current) {
            const [lat, lng] = focusedNeighborhood.center;

            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 15,
                pitch: 60,
                bearing: -20,
                duration: 2000,
                essential: true
            });
        } else if (neighborhoods.length > 0 && mapRef.current) {
            // Si cargamos resultados pero no hay ninguno seleccionado, ir al Top 1
            const top1 = neighborhoods[0];
            const [lat, lng] = top1.center;
            mapRef.current.flyTo({ center: [lng, lat], zoom: 12, pitch: 40, duration: 2000 });
        }
    }, [focusedNeighborhood, neighborhoods]);

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
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        >
            {/* CAPA 1: EDIFICIOS 3D */}
            <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                filter={['==', 'extrude', 'true']}
                type="fill-extrusion"
                minzoom={14}
                paint={{
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
                    'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
                    'fill-extrusion-opacity': 0.6
                }}
            />

            {/* CAPA 2: TODOS LOS BARRIOS RECOMENDADOS */}
            {geoJSONData && (
                <Source id="neighborhoods-source" type="geojson" data={geoJSONData}>
                    {/* Relleno: Opacidad variable según si es el seleccionado */}
                    <Layer
                        id="neighborhood-fill"
                        type="fill"
                        paint={{
                            'fill-color': [
                                'case',
                                ['==', ['get', 'id'], focusedNeighborhood?.id || ''],
                                '#8b5cf6', // Color activo (Violeta fuerte)
                                '#475569'  // Color inactivo (Gris azulado)
                            ],
                            'fill-opacity': [
                                'case',
                                ['==', ['get', 'id'], focusedNeighborhood?.id || ''],
                                0.6, // Más visible si es el activo
                                0.3
                            ]
                        }}
                    />
                    {/* Borde */}
                    <Layer
                        id="neighborhood-line"
                        type="line"
                        paint={{
                            'line-color': '#a78bfa',
                            'line-width': 2
                        }}
                    />
                </Source>
            )}

            {/* POPUP: Solo si hay uno enfocado */}
            {focusedNeighborhood && (
                <Popup
                    longitude={focusedNeighborhood.center[1]}
                    latitude={focusedNeighborhood.center[0]}
                    anchor="bottom"
                    closeButton={false}
                    offset={40}
                    className="custom-popup-3d"
                >
                    <div className="p-2 text-slate-900 min-w-[150px]">
                        <h3 className="font-bold text-lg">{focusedNeighborhood.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500 font-bold">MATCH</span>
                            <span className="text-sm text-violet-700 font-extrabold">{focusedNeighborhood.score}%</span>
                        </div>
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default Map3D;