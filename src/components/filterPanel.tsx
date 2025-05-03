import React from "react";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRadio } from "mdb-react-ui-kit";
import { FilterType } from "../utils/interfaces";
import { colorPalette } from "../utils/colorPalette";

interface FilterPanelProps {
  filter: string;
  onFilterChange: (filter: FilterType) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filter, onFilterChange }) => {
  return (
    <MDBCard className="shadow-3 mb-4" style={{ backgroundColor: colorPalette.secondary }}>
      <MDBCardBody>
        <MDBCardTitle style={{ color: "white" }}>Filter Markers</MDBCardTitle>
        <MDBCardText>
          <MDBRadio
            name="filterOptions"
            id="filterYours"
            label={<span style={{ color: "rgb(255, 255, 255)" }}>Just Yours</span>}
            value={FilterType.YOURS}
            checked={filter === FilterType.YOURS}
            onChange={() => onFilterChange(FilterType.YOURS)}
          />
          <MDBRadio
            name="filterOptions"
            id="filterFriends"
            label={<span style={{ color: "rgb(255, 255, 255)" }}>Friends</span>}     
            value={FilterType.FRIENDS}
            checked={filter === FilterType.FRIENDS}
            onChange={() => onFilterChange(FilterType.FRIENDS)}
          />
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
};

export default FilterPanel;
