export type UserRole = 'client' | 'vendor' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  fromGoogle?: boolean;
  category?: string;
  location?: string;
  price?: string;
  bio?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  bio: string;
  price: string;
  phone: string;
  email: string;
  password?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  avatar: string;
  color: string;
  photo?: string;
  photo2?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  eventDate: string;
  eventType: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  vendorId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Application {
  id: string;
  businessName: string;
  category: string;
  state: string;
  city: string;
  yearsInBusiness: string;
  bio: string;
  eventTypes: string[];
  instagramHandle?: string;
  websiteUrl?: string;
  priceRange: string;
  phone: string;
  whatsapp?: string;
  bankName?: string;
  accountNumber?: string;
  ownerName: string;
  email: string;
  password: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface BookingResult {
  success: boolean;
  error?: string;
  booking?: Booking;
}

export interface ReviewResult {
  success: boolean;
  error?: string;
  review?: Review;
}

export interface AppResult {
  success: boolean;
  error?: string;
  application?: Application;
}

export interface ResetResult {
  success: boolean;
  error?: string;
}

export interface VerifyResult {
  success: boolean;
  error?: string;
}

export interface RatingResult {
  rating: number;
  count: number;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface BookingData {
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  eventDate: string;
  eventType: string;
  message: string;
}

export interface ReviewData {
  bookingId: string;
  vendorId: string;
  rating: number;
  comment: string;
}

export interface ApplicationData {
  businessName: string;
  category: string;
  state: string;
  city: string;
  yearsInBusiness: string;
  bio: string;
  eventTypes: string[];
  instagramHandle?: string;
  websiteUrl?: string;
  priceRange: string;
  phone: string;
  whatsapp?: string;
  bankName?: string;
  accountNumber?: string;
  ownerName: string;
  email: string;
  password: string;
}
