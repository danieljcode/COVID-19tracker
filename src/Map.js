import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./css/Map.css";
import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom} worldCopyJump={false} maxBounds={[[-90,-180],[90,180]]} maxBoundsViscosity={1.0} minZoom={2}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
