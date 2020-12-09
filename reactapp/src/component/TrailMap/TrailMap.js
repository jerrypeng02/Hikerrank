import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './TrailMap.css';

const TrailMap = (props) => {
    // console.log(props)
  const mapContainerRef = useRef(null);

  var data = props.map_data
  var lgnNum = data.longitude
  var latNum = data.latitude
  var zoomNum = 10.5

//   var coordinates = data.map_info.features[0].geometry.coordinates
//   console.log('printing features...')
//   console.log(coordinates)

  // Calculate the optimal zoomNum
  const calculateZoom = () => {
      var coordinates_list = data.map_info.data.geometry.coordinates
      var coordinates;
      if (typeof(coordinates_list[0][0]) == typeof(0.123)) {
          coordinates = coordinates_list;
      } else if (typeof(coordinates_list[0][0][0]) == typeof(0.123)) {
          coordinates = coordinates_list[0];
      }
      // console.log(coordinates)
      var lgnMin = 10000;
      var lgnMax = -10000;
      var latMin = 10000;
      var latMax = -10000;
      for (let coord of coordinates) {
          if (coord[0] < lgnMin) {
              lgnMin = coord[0];
          }
          if (coord[0] > lgnMax) {
              lgnMax = coord[0]
          }
          if (coord[1] < latMin) {
              latMin = coord[1]
          }
          if (coord[1] > latMax) {
              latMax = coord[1]
          }
      }
      return [
          45 * Math.sqrt(Math.abs(lgnMin - lgnMax) * Math.abs(lgnMin - lgnMax) + Math.abs(latMin - latMax) * Math.abs(latMin - latMax)),
          (lgnMin + lgnMax) / 2.0,
          (latMin + latMax) / 2.0
        ];
  };
  // console.log('range', calculateZoom()[0]);
  zoomNum = 135.0 / (calculateZoom()[0] / 3.0 + 9.9);
  lgnNum = calculateZoom()[1];
  // .log('adjusted lgnNum', lgnNum)
  latNum = calculateZoom()[2];
  // console.log('adjusted latNum', latNum);
  
  // console.log('printing adjusted zoomNum', zoomNum);

  const [lng, setLng] = useState(lgnNum);
  const [lat, setLat] = useState(latNum);
  const [zoom, setZoom] = useState(zoomNum);

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
    //   setLng(map.getCenter().lng.toFixed(4));
    //   setLat(map.getCenter().lat.toFixed(4));
    //   setZoom(map.getZoom().toFixed(2));
    });

    // display all nearby trails in dashed line
    var nearby_trails = props.nearby_trails;
    // console.log('Trail Map nearby trails', nearby_trails)
    
    map.on('load', function () {

        for (let near_json of nearby_trails) {
            var source_name = near_json.tname + near_json.url.split('/')[5];
            // console.log('add near_json source name', source_name)
    
            var trail_json = near_json.map_info;
    
            map.addSource( source_name, trail_json)
    
            // decide trail color by difficulty
            var trail_color = '#085027'
            if (near_json.difficulty == 'Easiest') {
            trail_color = '#07b36b'
            } else if (near_json.difficulty == 'Most Difficult') {
            trail_color = '#0d8b94'
            }
    
            map.addLayer({
                'id': source_name,
                'type': 'line',
                'source': source_name,
                'layout': {
                'line-join': 'round',
                'line-cap': 'round'
                },
                'paint': {
                    'line-color': trail_color,
                    'line-width': zoomNum / 6.0,
                    'line-opacity': 0.7
                }
            });
        }
        
        
        var trail_json = props.map_data.map_info

        // decide trail color by difficulty
        var color = '#085027'
        if (trail_json.difficulty == 'Easiest') {
            color = '#07b36b'
        } else if (trail_json.difficulty == 'Most Difficult') {
            color = '#0d8b94'
        }

        map.addSource( 'trail', trail_json);
        map.addLayer({
            'id': 'trail_background',
            'type': 'line',
            'source': 'trail',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#dff57d',
                'line-width': zoomNum / 1.5
            }
        })
        map.addLayer({
            'id': 'trail',
            'type': 'line',
            'source': 'trail',
            'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
            'paint': {
                'line-color': color,
                'line-width': zoomNum / 4.0
            }
        });
        
        
    });

    // Clean up on unmount
    return () => map.remove();
  }, [props.nearby_trails]); // eslint-disable-line react-hooks/exhaustive-deps

  return  <div className='map-holder' ref={mapContainerRef} />
};

export default TrailMap;