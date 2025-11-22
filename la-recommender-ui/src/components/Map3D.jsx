import React, { useEffect, useRef, useMemo } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9zZXBsbG10MjAiLCJhIjoiY21pYWY5aDg5MHhmZTJpczk5ODcxYmlmayJ9.guB9Abh7CFwHL_3FYRlEKQ';

const Map3D = ({ neighborhoods = [], focusedNeighborhood }) => {
    const mapRef = useRef(null);

    // Generamos la fuente GeoJSON solo para los barrios que YA tengan polígono cargado
    const geoJSONData = useMemo(() => {
        // Filtramos solo los que tienen datos de geometría cargados
        const readyNeighborhoods = neighborhoods.filter(nb => nb.polygonGeoJSON);

        if (readyNeighborhoods.length === 0) return null;

        return {
            type: 'FeatureCollection',
            features: readyNeighborhoods.map(nb => ({
                type: 'Feature',
                properties: { id: nb.id, name: nb.name, score: nb.score },
                geometry: nb.polygonGeoJSON // Usamos directamente el GeoJSON que viene de la API
            }))
        };
    }, [neighborhoods]);

    // Efecto de vuelo (usa el centro simple mientras carga el polígono)
    useEffect(() => {
        if (focusedNeighborhood && mapRef.current) {
            const [lat, lng] = focusedNeighborhood.center;

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
            <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                filter={['==', 'extrude', 'true']}
                type="fill-extrusion"
                minzoom={13}
                paint={{
                    'fill-extrusion-color': '#aaa',
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
                                '#8b5cf6',
                                '#475569'
                            ],
                            'fill-opacity': 0.5
                        }}
                    />
                    <Layer
                        id="neighborhood-line"
                        type="line"
                        paint={{
                            'line-color': '#a78bfa',
                            'line-width': 3
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
                    <div className="p-2 text-slate-900 min-w-[150px]">
                        <h3 className="font-bold text-lg">{focusedNeighborhood.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500 font-bold">MATCH</span>
                            <span className="text-sm text-violet-700 font-extrabold">{focusedNeighborhood.score}%</span>
                        </div>
                        {!focusedNeighborhood.polygonGeoJSON && (
                            <div className="text-[10px] text-orange-600 mt-1 animate-pulse">Cargando perímetro...</div>
                        )}
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default Map3D;