'use client'
import React from 'react';
import AppKitProvider from './AppKitProvider';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <AppKitProvider>
      {children}
    </AppKitProvider>
  );
}
