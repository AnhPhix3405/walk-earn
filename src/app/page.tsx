'use client'
import React, { useState } from 'react';
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
  Target
} from 'lucide-react';

function App() {
  const [isWalking, setIsWalking] = useState(false);
  const [walkingTime, setWalkingTime] = useState(0);

  // Mock data
  const walletAddress = "addr1qxy2w...8k7m9n2p";
  const currentADA = 1247.85;
  const todayEarned = 12.5;
  const walkingHistory = [
    { date: "2024-01-15", distance: "3.2 km", time: "45 min", earned: 8.5 },
    { date: "2024-01-14", distance: "2.8 km", time: "38 min", earned: 7.2 },
    { date: "2024-01-13", distance: "4.1 km", time: "52 min", earned: 10.8 },
    { date: "2024-01-12", distance: "2.1 km", time: "28 min", earned: 5.4 },
  ];

  const handleStartWalking = () => {
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
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wallet className="w-4 h-4" />
              <span className="font-mono">{walletAddress}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Số dư hiện tại</h2>
            <Coins className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {currentADA.toLocaleString()}
              <span className="text-2xl font-medium text-gray-600 ml-2">ADA</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+{todayEarned} ADA hôm nay</span>
            </div>
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
              <div className="text-2xl font-bold text-blue-600 mb-1">2.8</div>
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
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              isWalking 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30'
            } transform hover:scale-105`}
          >
            {isWalking ? (
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
            {walkingHistory.map((record, index) => (
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
            ))}
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
              <div className="text-xl font-bold text-gray-900 mb-1">12.2</div>
              <div className="text-xs text-gray-600">km tổng</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">163</div>
              <div className="text-xs text-gray-600">phút</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">31.9</div>
              <div className="text-xs text-gray-600">ADA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;