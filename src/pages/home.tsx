import "leaflet/dist/leaflet.css";

import React, { useState, useEffect, useRef } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import placeholderIcon from "../assets/icons/placeholder.png";
import DescriptionMenu from "../components/markerMenu";
import apiClient from "../utils/axios";
import FilterPanel from "../components/filterPanel";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from "mdb-react-ui-kit";
import { DivIcon, Icon, divIcon, point, LatLng } from "leaflet";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { FilterType, MapEventsProps, MarkerData } from "../utils/interfaces";
import { colorPalette } from "../utils/colorPalette"; // Import the color palette

const customIcon = new Icon({
  iconUrl: placeholderIcon,
  iconSize: [38, 38],
});

const createClusterCustomIcon = (cluster: { getChildCount: () => number }): DivIcon => {
  return divIcon({
    html: `<div style="background-color: ${colorPalette.primary}; color: white; border-radius: 50%; width: 33px; height: 33px; display: flex; align-items: center; justify-content: center; font-size: 14px;">
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
  filter: FilterType;
}

const FetchClusteredMarkers: React.FC<Props> = ({ onMarkersFetched, filter }) => {
  const map = useMap();
  const lastCenterRef = useRef<LatLng>(map.getCenter());

  const fetchMarkers = React.useCallback(async () => {
    const center = map.getCenter();
    const lastCenter = lastCenterRef.current;

    const distance = center.distanceTo(lastCenter);
    if (distance < 100) return;

    lastCenterRef.current = center;

    try {
      const response = await apiClient.get(`/markers/cluster`, {
        params: {
          lat: center.lat,
          lng: center.lng,
          filter: filter
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
  }, [map, onMarkersFetched, filter]);

  useEffect(() => {
    map.on("moveend", fetchMarkers);
    fetchMarkers();

    return () => {
      map.off("moveend", fetchMarkers);
    };
  }, [fetchMarkers, map]);

  return null;
};

const Home: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [filter, setFilter] = useState<FilterType>(FilterType.FRIENDS);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          setLocation({ lat: 51.505, lng: -0.09 }); // Default to London
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocation({ lat: 51.505, lng: -0.09 }); // Default to London
    }
  }, []);

  const handleAddMarker = async (marker: MarkerData) => {
    try {
      const response = await apiClient.post("/markers/", {
        description: marker.popUp,
        location: {
          coordinates: [marker.geocode[1], marker.geocode[0]],
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
    console.log("Fetched markers:", fetchedMarkers);
    setMarkers(fetchedMarkers);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <MDBContainer className="py-4">
      <MDBRow className="text-center mb-2">
        <MDBCol>
          <FilterPanel filter={filter} onFilterChange={handleFilterChange} />
        </MDBCol>
        <MDBCol>
          <MDBCard className="shadow-3" style={{ backgroundColor: colorPalette.primary, color: "white" }}>
            <MDBCardBody>
              <MDBCardTitle>
                <FaMapMarkerAlt className="me-2" />
                Welcome to Roamly
              </MDBCardTitle>
              <MDBCardText>
                Plan your next adventure by pointing the location of where you want to go!
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className="shadow-3" style={{ backgroundColor: colorPalette.secondary, color: "white" }}>
            <MDBCardBody>
              <MDBCardTitle>
                <FaLocationArrow className="me-2" />
                Your Location
              </MDBCardTitle>
              {location.lat !== 0 && location.lng !== 0 ? (
                <MDBCardText>
                  Latitude: {location.lat}
                  <br />
                  Longitude: {location.lng}
                </MDBCardText>
              ) : (
                <MDBCardText>Loading your location...</MDBCardText>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <MDBRow className="justify-content-center">
        <MDBCol md="12" style={{ position: "relative" }}>
          {location.lat !== 0 && location.lng !== 0 && (
            <MapContainer center={[location.lat, location.lng]} zoom={6} doubleClickZoom={false} minZoom={4} maxZoom={18}>
              <FetchClusteredMarkers onMarkersFetched={handleMarkersFetched} filter={filter} />
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
          )}
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