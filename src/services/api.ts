import { InventoryItem, WasteRecord, Discount, DonationPickup, User } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const register = async (name: string, email: string, password: string, role: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });
  return response.json();
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  return response.json();
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'added_by_name'>) => {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  return response.json();
};

export const updateInventoryItem = async (id: number, item: Partial<InventoryItem>) => {
  const response = await fetch(`${API_BASE_URL}/inventory?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  return response.json();
};

export const deleteInventoryItem = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/inventory?id=${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const recordWaste = async (waste: Omit<WasteRecord, 'id' | 'recorded_at' | 'approval_status'>) => {
  const response = await fetch(`${API_BASE_URL}/waste`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(waste),
  });
  return response.json();
};

export const createDiscount = async (discount: Omit<Discount, 'id'>) => {
  const response = await fetch(`${API_BASE_URL}/discounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discount),
  });
  return response.json();
};

export const scheduleDonation = async (donation: Omit<DonationPickup, 'id' | 'status'>) => {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donation),
  });
  return response.json();
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
};