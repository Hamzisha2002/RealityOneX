export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  priceInPKR: string;
  priceInSol: number;
  location: string;
  areaName: string;
  coordinates: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  buildingType: 'residential' | 'commercial' | 'mixed' | 'landmark' | 'plot';
  color: string;
  owner: string | null;
  fractionalShares: number;
  totalShares: number;
  image?: string;
  isForSale: boolean;
  status: 'Available' | 'Sold' | 'Reserved';
  features: string[];
}

export interface UserWallet {
  address: string;
  balance: number;
  ownedProperties: string[];
  fractionalOwnership: { propertyId: string; shares: number }[];
}

export interface MetaverseState {
  selectedProperty: Property | null;
  isWalletConnected: boolean;
  wallet: UserWallet | null;
  properties: Property[];
}