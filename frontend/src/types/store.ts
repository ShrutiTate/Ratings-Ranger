export interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  ownerId: number;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number; // 1-5
  createdAt: string;
  updatedAt: string;
}

export interface UserRating extends Rating {
  userName: string;
  userEmail: string;
}

export interface StoreWithUserRating extends Store {
  userRating?: Rating;
}