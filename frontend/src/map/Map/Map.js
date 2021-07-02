import React, {useRef, useEffect} from 'react';

import Card from '../../shared/components/UIElements/Card/Card';
import './Map.css';

const Map = props => {
  const mapRef = useRef();

  const {center, zoom} = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });
  
    new window.google.maps.Marker({position: center, map: map});
  
  }, [center, zoom])

  return (
    <Card className="map__card">
      <div ref={mapRef} className={`map ${props.className}`} style={props.style}>
      
      </div>
    </Card>
  );
};

export default Map;