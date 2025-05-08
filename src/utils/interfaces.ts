export interface MarkerData {
  geocode: [number, number];
  popUp: string;
  _id: string;
  color?: string;
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

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  profilePicture: string;
}

export interface IRequest { 
  _id: string;
  userId: IUser;
  receiverId: IUser;
  status: string;
  createdAt: string;
}

export enum FilterType {
  YOURS = "yours",
  FRIENDS = "friends",
}