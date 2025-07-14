'use client'
import React, { useState, useEffect } from 'react';
import { useWalletList, useWallet } from '@meshsdk/react';
import { WalletProvider } from '../components/WalletProvider';
import { MobileWalletConnect } from '../components/MobileWalletConnect';
import { 
  Wallet, 
  Activity, 
  Coins, 
  Calendar, 
  Play, 
  TrendingUp, 
  MapPin, 
  Clock,
  Trophy,
  Target,
  ChevronDown,
  Copy,
  LogOut,
  AlertCircle
} from 'lucide-react';

function WalkEarnApp() {
  const { connect, connected, disconnect, name, wallet } = useWallet();
  const wallets = useWalletList();
  const [isWalking, setIsWalking] = useState(false);
  const [walkingTime, setWalkingTime] = useState(0);
  const [showWalletList, setShowWalletList] = useState(false);
  const [showMobileConnect, setShowMobileConnect] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isMobileConnected, setIsMobileConnected] = useState(false);

  // Detect if user is on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      }
    };
    checkMobile();
  }, []);

  // Get wallet info when connected
  useEffect(() => {
    async function getWalletInfo() {
      if (wallet && connected) {
        try {
          const addr = await wallet.getChangeAddress();
          setWalletAddress(addr.slice(0, 12) + '...' + addr.slice(-8));
          
          // Get wallet balance (convert from lovelace to ADA)
          const balance = await wallet.getBalance();
          if (balance && balance.length > 0) {
            const adaBalance = balance.find((asset: any) => asset.unit === 'lovelace');
            if (adaBalance) {
              setWalletBalance(parseInt(adaBalance.quantity) / 1000000);
            }
          }
        } catch (error) {
          console.error("Error getting wallet info:", error);
        }
      }
    }

    if (connected) {
      getWalletInfo();
    }
  }, [wallet, connected]);

  const handleConnectWallet = (walletName: string) => {
    if (isMobile) {
      // For mobile, show WalletConnect modal
      setShowMobileConnect(true);
      setShowWalletList(false);
    } else {
      // For desktop, use normal extension connection
      connect(walletName);
      setShowWalletList(false);
    }
  };

  const handleMobileConnect = (address: string, balance: number) => {
    setWalletAddress(address.slice(0, 12) + '...' + address.slice(-8));
    setWalletBalance(balance);
    setIsMobileConnected(true);
    setShowMobileConnect(false);
  };

  const handleDisconnect = () => {
    if (isMobileConnected) {
      setIsMobileConnected(false);
    } else {
      disconnect();
    }
    setWalletAddress("");
    setWalletBalance(0);
  };

  // Real data only - no mock data
  const currentADA = (connected || isMobileConnected) ? walletBalance : 0;
  const todayEarned = 0; // Will be calculated from real walking data
  const walkingHistory: any[] = []; // Will be populated from backend/local storage
  
  // Update connection status
  const isConnected = connected || isMobileConnected;
  const displayWalletName = isMobileConnected ? 'Eternl Mobile' : name;

  const handleStartWalking = () => {
    if (!isConnected) {
      alert('Vui lòng kết nối ví Cardano trước khi bắt đầu!');
      return;
    }
    
    setIsWalking(!isWalking);
    if (!isWalking) {
      // Start timer simulation
      const timer = setInterval(() => {
        setWalkingTime(prev => prev + 1);
      }, 1000);
      
      setTimeout(() => {
        clearInterval(timer);
        setIsWalking(false);
        setWalkingTime(0);
      }, 10000); // Auto stop after 10 seconds for demo
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">WalkEarn</h1>
            </div>
            
            {/* Wallet Connection */}
            <div className="relative">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-mono">{walletAddress}</span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="text-xs text-red-500 hover:text-red-600 p-1"
                    title="Ngắt kết nối"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (isMobile) {
                        setShowMobileConnect(true);
                      } else {
                        setShowWalletList(!showWalletList);
                      }
                    }}
                    className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-blue-700 transition-colors"
                  >
                    <Wallet className="w-3 h-3" />
                    <span>Kết nối ví</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {showWalletList && !isMobile && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 rounded-md shadow-lg z-10">
                      {wallets.map((wallet, index) => (
                        <button
                          key={index}
                          className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left text-sm"
                          onClick={() => handleConnectWallet(wallet.name)}
                        >
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-6 h-6 mr-3"
                          />
                          <span>{wallet.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Wallet Connection Notice */}
        {!isConnected && (
          <div className="bg-amber-50/80 backdrop-blur-md rounded-2xl shadow-lg border border-amber-200/50 p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium">Kết nối ví để bắt đầu</p>
                <p className="text-amber-700">
                  {isMobile 
                    ? '📱 Sử dụng app Eternl để kết nối với WalletConnect'
                    : '💻 Kết nối ví Cardano (Eternl, Nami, Flint...) để nhận ADA từ việc đi bộ'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isConnected ? `Số dư ví ${displayWalletName}` : 'Số dư demo'}
            </h2>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              {isConnected && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentADA.toLocaleString('vi-VN', { maximumFractionDigits: 2 })}
              <span className="text-2xl font-medium text-gray-600 ml-2">ADA</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+{todayEarned} ADA hôm nay</span>
            </div>
            {connected && (
              <div className="mt-2 text-xs text-green-600 flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Kết nối thực với ví {displayWalletName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tiến độ hôm nay</h2>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
              <div className="text-sm text-gray-600">km đã đi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{todayEarned}</div>
              <div className="text-sm text-gray-600">ADA kiếm được</div>
            </div>
          </div>
        </div>

        {/* Start Walking Button */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <button
            onClick={handleStartWalking}
            disabled={!isConnected}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              !isConnected
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isWalking 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30'
            } ${isConnected ? 'transform hover:scale-105' : ''}`}
          >
            {!isConnected ? (
              <>
                <Wallet className="w-6 h-6" />
                <span>Cần kết nối ví</span>
              </>
            ) : isWalking ? (
              <>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span>Dừng lại ({walkingTime}s)</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                <span>Bắt đầu đi bộ</span>
              </>
            )}
          </button>
          
          {isWalking && (
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600 mb-2">Đang theo dõi...</div>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>GPS hoạt động</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                  <span>Đang đi bộ</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Walking History */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử đi bộ</h2>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            {walkingHistory.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chưa có lịch sử đi bộ</p>
                <p className="text-gray-400 text-xs">Bắt đầu đi bộ để tạo lịch sử đầu tiên!</p>
              </div>
            ) : (
              walkingHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{record.distance}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{record.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">+{record.earned} ADA</div>
                    <div className="text-xs text-gray-500">{record.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Thống kê tuần</h2>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-xs text-gray-600">km tổng</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-xs text-gray-600">phút</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-xs text-gray-600">ADA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile WalletConnect Modal */}
      {showMobileConnect && (
        <MobileWalletConnect
          onConnect={handleMobileConnect}
          onClose={() => setShowMobileConnect(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <WalkEarnApp />
    </WalletProvider>
  );
}