import { ClubStatus as ClubStatusEnum, Sport as SportEnum } from "../../common/enums";

export type ClubSport = (typeof SportEnum)[keyof typeof SportEnum];

export type ClubStatus = (typeof ClubStatusEnum)[keyof typeof ClubStatusEnum];

export interface Club {
  id: string;
  name: string;
  image?: string | null;
  sport: ClubSport;
  phone: string;
  address: string;
  city: string;
  country: string;
  assignmentId: string;
  status: ClubStatus;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubListResponse {
  data: Club[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    lastPage?: number;
  };
}

export interface CreateClubDto {
  name: string;
  image?: string;
  sport: ClubSport;
  phone: string;
  address: string;
  city: string;
  country: string;
  assignmentId: string;
  status?: ClubStatus;
  available?: boolean;
}

export interface UpdateClubDto extends CreateClubDto {
  id: string;
}

export interface ClubModalProps {
  open: boolean;
  onClose: () => void;
  data?: Club;
  onSaved?: () => void;
}
