'use client'
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Smartphone, Monitor, X } from 'lucide-react';

interface MobileWalletConnectProps {
  onConnect: (address: string, balance: number) => void;
  onClose: () => void;
}

export function MobileWalletConnect({ onConnect, onClose }: MobileWalletConnectProps) {
  const [connectionType, setConnectionType] = useState<'mobile' | 'extension'>('mobile');
  const [walletConnectUri, setWalletConnectUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (connectionType === 'mobile') {
      generateWalletConnectUri();
    }
  }, [connectionType]);

  const generateWalletConnectUri = () => {
    // TODO: Replace with your real WalletConnect Cloud Project ID
    // Get it from: https://cloud.walletconnect.com/
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2c8e53b3d9e7d8f9a5b2c4d6e8f0a1b3';
    const uri = `wc:${generateRandomString(32)}@2?relay-protocol=irn&symKey=${generateRandomString(64)}&projectId=${projectId}`;
    setWalletConnectUri(uri);
  };

  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleMobileConnect = () => {
    // Deep link to Eternl mobile app
    const eternlDeepLink = `eternl://wc?uri=${encodeURIComponent(walletConnectUri)}`;
    window.open(eternlDeepLink, '_blank');
    
    setIsConnecting(true);
    
    // Simulate connection for demo (replace with real WalletConnect logic)
    setTimeout(() => {
      onConnect('addr1q9x3p8r...mobile...demo', Math.random() * 100 + 15);
      setIsConnecting(false);
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletConnectUri);
    alert('URI đã được sao chép!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kết nối ví Cardano</h3>
          <p className="text-sm text-gray-600">Chọn cách kết nối phù hợp với thiết bị của bạn</p>
        </div>

        {/* Connection Type Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setConnectionType('mobile')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              connectionType === 'mobile'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile App</span>
          </button>
          <button
            onClick={() => setConnectionType('extension')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              connectionType === 'extension'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Extension</span>
          </button>
        </div>

        {/* Mobile Connection */}
        {connectionType === 'mobile' && (
          <div className="text-center">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-4 flex justify-center">
              <QRCodeSVG
                value={walletConnectUri}
                size={200}
                className="mx-auto"
                fgColor="#1f2937"
                bgColor="#ffffff"
              />
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600">
                📱 <strong>Bước 1:</strong> Mở app Eternl trên điện thoại
                <br />
                📷 <strong>Bước 2:</strong> Quét QR code hoặc click nút bên dưới
                <br />
                ✅ <strong>Bước 3:</strong> Xác nhận kết nối trong app
              </p>
              
              <button
                onClick={handleMobileConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-700 transition-colors disabled:opacity-50"
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang kết nối...</span>
                  </div>
                ) : (
                  'Mở Eternl App'
                )}
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center space-x-2 w-full text-gray-600 hover:text-gray-800 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Sao chép URI</span>
              </button>
            </div>
          </div>
        )}

        {/* Extension Connection */}
        {connectionType === 'extension' && (
          <div className="text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                💻 <strong>Dành cho máy tính</strong> với extension trình duyệt
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="text-left">
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  Cài đặt extension ví Cardano:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Eternl Wallet</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Nami Wallet</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Flint Wallet</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={onClose}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Sử dụng Extension
              </button>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500">
              Đang chờ xác nhận từ ví mobile...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
