export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

// Separate type for creating a user including password
export interface NewUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface InventoryItem {
  id: number;
  name: string;
  batch: string;
  quantity: number;
  expiry_date: string;
  added_by: number;
  added_by_name?: string;
}

export interface WasteRecord {
  id: number;
  inventory_id: number;
  quantity: number;
  reason: 'expired' | 'damaged' | 'unsold';
  disposition: 'donation' | 'compost' | 'other';
  recorded_by: number;
  recorded_at: string;
  approved_by?: number;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface Discount {
  id: number;
  inventory_id: number;
  discount_percent: number;
  start_date: string;
  end_date: string;
  created_by: number;
}

export interface DonationPickup {
  id: number;
  scheduled_date: string;
  scheduled_time: string;
  recipient_organization: string;
  contact_person: string;
  contact_phone: string;
  items_summary: string;
  scheduled_by: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  completed_at?: string;
}