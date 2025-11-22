import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';

// Controlador de cámara para volar al barrio cuando se selecciona
const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                duration: 2.5, // Vuelo cinematográfico
                easeLinearity: 0.25
            });
        }
    }, [center, zoom, map]);
    return null;
};

const MapLeaflet = ({ activeNeighborhood }) => {
    // Coordenadas iniciales de Los Angeles (Vista general)
    const defaultCenter = [34.0522, -118.2437];
    const defaultZoom = 11;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ background: '#0f172a' }}
        >
            {/* Controlador de efectos de cámara */}
            <MapController
                center={activeNeighborhood ? activeNeighborhood.center : defaultCenter}
                zoom={activeNeighborhood ? 13 : defaultZoom}
            />

            {/* Capa del Mapa (Modo Oscuro) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Lógica de Renderizado: SOLO mostramos el polígono si hay un resultado activo */}
            {activeNeighborhood && (
                <Polygon
                    key={activeNeighborhood.id} // La key fuerza al componente a redibujarse si cambia el barrio
                    positions={activeNeighborhood.coordinates}
                    pathOptions={{
                        color: '#8b5cf6',      // Borde violeta brillante
                        fillColor: '#8b5cf6',  // Relleno violeta
                        fillOpacity: 0.6,      // Transparencia
                        weight: 3              // Grosor del borde
                    }}
                >
                    <Popup className="custom-popup" autoPan={false}>
                        <div className="p-2">
                            <h3 className="text-slate-900 font-bold text-lg mb-1">{activeNeighborhood.name}</h3>
                            <div className="text-violet-600 text-xs font-semibold uppercase tracking-wider">
                                Match: {activeNeighborhood.match}
                            </div>
                        </div>
                    </Popup>
                </Polygon>
            )}

        </MapContainer>
    );
};

export default MapLeaflet;