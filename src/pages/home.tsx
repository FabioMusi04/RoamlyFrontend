import "leaflet/dist/leaflet.css";

import React, { useState, useEffect, useRef } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import placeholderIcon from "../assets/icons/placeholder.png";
import DescriptionMenu from "../components/markerMenu";
import apiClient from "../utils/axios";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { DivIcon, Icon, divIcon, point, LatLng } from "leaflet";
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
      const newMarker: MarkerData = { geocode: [e.latlng.lat, e.latlng.lng], popUp: "", _id: "" };
      onAddMarker(newMarker);
    },
  });
  return null;
};
interface Props {
  onMarkersFetched: (markers: MarkerData[]) => void;
}
const FetchClusteredMarkers: React.FC<Props> = ({ onMarkersFetched }) => {
  const map = useMap();
  const lastCenterRef = useRef<LatLng>(map.getCenter());

  const fetchMarkers = async () => {
    const center = map.getCenter();
    const lastCenter = lastCenterRef.current;

    // Only fetch if the center changed significantly
    const distance = center.distanceTo(lastCenter);
    if (distance < 100) return; // Skip if movement is less than 100 meters

    lastCenterRef.current = center;

    try {
      const response = await apiClient.get(`/markers/cluster`, {
        params: {
          lat: center.lat,
          lng: center.lng,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const data = response.data;

        const flattenedMarkers: MarkerData[] = data.flatMap((cluster: { markers: { _id: string; location: { coordinates: [number, number] }; description: string }[] }) =>
          cluster.markers.map((marker: { _id: string; location: { coordinates: [number, number] }; description: string }): MarkerData => ({
            _id: marker._id,
            geocode: [marker.location.coordinates[1], marker.location.coordinates[0]],
            popUp: marker.description,
          }))
        );
        
        onMarkersFetched(flattenedMarkers);
      } else {
        console.error("Failed to fetch markers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  useEffect(() => {
    map.on("moveend", fetchMarkers);
    // Initial fetch
    fetchMarkers();

    return () => {
      map.off("moveend", fetchMarkers);
    };
  }, [map]);

  return null;
};

const Home: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [description, setDescription] = useState("");

  const handleAddMarker = async (marker: MarkerData) => {
    try {
      const response = await apiClient.post("/markers/", {
        description: marker.popUp,
        location: {
          coordinates: [marker.geocode[1], marker.geocode[0]]
        },
      });
      if (response.status >= 200 && response.status < 300) {
        marker._id = response.data._id || response.data.id;

        setMarkers((prevMarkers) => [...prevMarkers, marker]);

        setSelectedMarker(marker);
      } else {
        console.error("Failed to add marker:", response.statusText);

        setMarkers((prevMarkers) =>
          prevMarkers.filter((m) => m.geocode[0] !== marker.geocode[0] && m.geocode[1] !== marker.geocode[1])
        );

        alert("Failed to add marker. Please try again.");
        setSelectedMarker(null);
      }
    } catch (error) {
      console.log("Error adding marker:", error);

      setMarkers((prevMarkers) =>
        prevMarkers.filter((m) => m.geocode[0] !== marker.geocode[0] && m.geocode[1] !== marker.geocode[1])
      );

      alert("An error occurred while adding the marker. Please try again.");
      setSelectedMarker(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const saveDescription = async () => {
    if (selectedMarker) {
      try {
        console.log(JSON.stringify(selectedMarker));
        const response = await apiClient.put(`/markers/${selectedMarker._id}`, {
          description,
        });

        if (response.status >= 200 && response.status < 300) {
          setMarkers((prevMarkers) =>
            prevMarkers.map((marker) =>
              marker === selectedMarker ? { ...marker, popUp: description } : marker
            )
          );

          setSelectedMarker(null);

          setDescription("");
        } else {
          console.error("Failed to update marker:", response.statusText);

          alert("Failed to update marker. Please try again.");
        }
      } catch (error) {
        console.log("Error updating marker:", error);

        alert("An error occurred while updating the marker. Please try again.");
      }
    }
  };

  const cancelMarker = async () => {
    if (selectedMarker) {
      try {
        const response = await apiClient.delete(`/markers/${selectedMarker._id}`);
        if (response.status >= 200 && response.status < 300) {
          setMarkers((prevMarkers) =>
            prevMarkers.filter((marker) => marker !== selectedMarker)
          );
          setSelectedMarker(null);
          setDescription("");
        } else {
          console.error("Failed to delete marker:", response.statusText);
          alert("Failed to delete marker. Please try again.");
        }
      } catch (error) {
        console.log("Error deleting marker:", error);
        alert("An error occurred while deleting the marker. Please try again.");
      }
    }
  };

  const handleMarkersFetched = (fetchedMarkers: MarkerData[]) => {
    setMarkers(fetchedMarkers);
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow className="text-center mb-4">
        <MDBCol>
          <h1>Welcome to Roamly</h1> {/* Add to spell-check ignore list */}
          <p>Plan your next adventure by pointing the location of where you want to go!</p>
        </MDBCol>
      </MDBRow>
      <MDBRow className="justify-content-center">
        <MDBCol md="12" style={{ position: "relative" }}>
          <MapContainer center={[51.505, -0.09]} zoom={13} doubleClickZoom={false}>
            <FetchClusteredMarkers onMarkersFetched={handleMarkersFetched} />
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