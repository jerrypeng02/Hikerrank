import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = (props) => {
    console.log(props)
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-80.01);
  const [lat, setLat] = useState(40.43);
  const [zoom, setZoom] = useState(10.5);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    
    var trails = props.map_json_list
    console.log(trails)
    
    map.on('load', function () {
        for (let map_json of trails) {

            var source_name = map_json.name;

            var trail_json = map_json.map_info;

            map.addSource( source_name, {
                'type': 'geojson',
                'data': trail_json
            });
            map.addLayer({
                'id': source_name,
                'type': 'line',
                'source': source_name,
                'layout': {
                'line-join': 'round',
                'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#D03F0C',
                    'line-width': 5
                }
            });
        }
        
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;