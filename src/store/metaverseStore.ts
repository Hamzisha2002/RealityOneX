import { create } from 'zustand';
import { Property, UserWallet } from '@/types/property';
import { properties, mockUserWallet } from '@/data/properties';

interface MetaverseStore {
  properties: Property[];
  selectedProperty: Property | null;
  isWalletConnected: boolean;
  wallet: UserWallet | null;
  showPropertyModal: boolean;
  
  selectProperty: (property: Property | null) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  setShowPropertyModal: (show: boolean) => void;
  purchaseProperty: (propertyId: string) => void;
  purchaseFractionalShares: (propertyId: string, shares: number) => void;
}

export const useMetaverseStore = create<MetaverseStore>((set, get) => ({
  properties: properties,
  selectedProperty: null,
  isWalletConnected: false,
  wallet: null,
  showPropertyModal: false,

  selectProperty: (property) => set({ selectedProperty: property, showPropertyModal: !!property }),
  
  connectWallet: () => {
    set({ 
      isWalletConnected: true, 
      wallet: mockUserWallet 
    });
  },
  
  disconnectWallet: () => {
    set({ 
      isWalletConnected: false, 
      wallet: null 
    });
  },
  
  setShowPropertyModal: (show) => set({ showPropertyModal: show }),
  
  purchaseProperty: (propertyId) => {
    const { properties, wallet } = get();
    if (!wallet) return;
    
    set({
      properties: properties.map((p) =>
        p.id === propertyId ? { ...p, owner: wallet.address, isForSale: false, status: 'Sold' as const } : p
      ),
      wallet: {
        ...wallet,
        ownedProperties: [...wallet.ownedProperties, propertyId],
      },
    });
  },
  
  purchaseFractionalShares: (propertyId, shares) => {
    const { wallet } = get();
    if (!wallet) return;
    
    const existingOwnership = wallet.fractionalOwnership.find(
      (o) => o.propertyId === propertyId
    );
    
    set({
      wallet: {
        ...wallet,
        fractionalOwnership: existingOwnership
          ? wallet.fractionalOwnership.map((o) =>
              o.propertyId === propertyId
                ? { ...o, shares: o.shares + shares }
                : o
            )
          : [...wallet.fractionalOwnership, { propertyId, shares }],
      },
    });
  },
}));