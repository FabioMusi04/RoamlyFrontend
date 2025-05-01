import "leaflet/dist/leaflet.css";

import React, { useState } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import placeholderIcon from "../assets/icons/placeholder.png";
import DescriptionMenu from "../components/markerMenu";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { DivIcon, Icon, divIcon, point } from "leaflet";
import { MapEventsProps, MarkerData } from "../utils/interfaces";

const customIcon = new Icon({
  iconUrl: placeholderIcon,
  iconSize: [38, 38],
});

const createClusterCustomIcon = (cluster: { getChildCount: () => number }): DivIcon => {
  return divIcon({
    html: `<div style="background-color: rgba(0, 123, 255, 0.85); color: white; border-radius: 50%; width: 33px; height: 33px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
             ${cluster.getChildCount()}
           </div>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

const MapEvents: React.FC<MapEventsProps> = ({ onAddMarker }) => {
  useMapEvents({
    dblclick(e) {
      const newMarker: MarkerData = { geocode: [e.latlng.lat, e.latlng.lng], popUp: "" };
      onAddMarker(newMarker);
    },
  });
  return null;
};

const Home: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [description, setDescription] = useState("");

  const handleAddMarker = (marker: MarkerData) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    setSelectedMarker(marker);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const saveDescription = () => {
    if (selectedMarker) {
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker === selectedMarker ? { ...marker, popUp: description } : marker
        )
      );
      setSelectedMarker(null);
      setDescription("");
    }
  };

  const cancelMarker = () => {
    if (selectedMarker) {
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker !== selectedMarker)
      );
      setSelectedMarker(null);
      setDescription("");
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow className="text-center mb-4">
        <MDBCol>
          <h1>Welcome to Roamly</h1>
          <p>Plan your next adventure by pointing the location of where you want to go!</p>
        </MDBCol>
      </MDBRow>
      <MDBRow className="justify-content-center">
        <MDBCol md="12" style={{ position: "relative" }}>
          <MapContainer center={[51.505, -0.09]} zoom={13} doubleClickZoom={false}>
            <MapEvents onAddMarker={handleAddMarker} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.geocode}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedMarker(marker);
                      setDescription(marker.popUp);
                    },
                  }}
                >
                  <Popup>{marker.popUp || "No description yet"}</Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
          {selectedMarker && (
            <DescriptionMenu
              description={description}
              onDescriptionChange={handleDescriptionChange}
              onSave={saveDescription}
              onCancel={cancelMarker}
              onClose={() => {
                setSelectedMarker(null);
                setDescription("");
              }}
            />
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Home;