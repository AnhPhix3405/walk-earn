'use client'
import { ReactNode } from 'react';
import { MeshProvider } from '@meshsdk/react';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <MeshProvider>
      {children}
    </MeshProvider>
  );
}
