export interface MarkerData {
  geocode: [number, number];
  popUp: string;
}

export interface DescriptionMenuProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export interface MapEventsProps {
  onAddMarker: (marker: MarkerData) => void;
}