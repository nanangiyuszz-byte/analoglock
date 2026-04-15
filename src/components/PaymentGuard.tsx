import React, { useState, useEffect } from 'react';

const PaymentGuard = ({ children }: { children: React.ReactNode }) => {
  const isPending = true; 
  
  // State untuk menyimpan data perangkat palsu & asli
  const [deviceData, setDeviceData] = useState({
    ip: 'Mendeteksi...',
    os: 'Mendeteksi...',
    ram: 'Mendeteksi...',
    network: 'Mendeteksi...',
    battery: 'Mendeteksi...',
    location: 'Sinkronisasi satelit...'
  });

  useEffect(() => {
    // Fungsi untuk mengambil data (campuran asli & trik)
    const gatherData = async () => {
      // 1. Ambil Info OS dari User Agent (Asli)
      const ua = navigator.userAgent;
      let osName = "Unknown Device";
      if (/android/i.test(ua)) osName = "Android Smartphone";
      else if (/iphone|ipad|ipod/i.test(ua)) osName = "Apple iOS Device";
      else if (/windows/i.test(ua)) osName = "Windows PC";
      else if (/mac/i.test(ua)) osName = "MacBook/iMac";

      // 2. Ambil Estimasi RAM (Asli jika didukung browser)
      // @ts-ignore
      const ramInfo = navigator.deviceMemory ? `${navigator.deviceMemory}GB+` : '4GB/8GB (Estimasi)';

      // 3. Ambil Info Jaringan (Asli jika didukung)
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const netType = connection ? `${connection.effectiveType.toUpperCase()} - ${connection.downlink}Mbps` : 'LTE/4G Terdeteksi';

      // 4. Ambil Info Baterai (Asli)
      let batteryInfo = "Membaca sensor...";
      try {
        // @ts-ignore
        if ('getBattery' in navigator) {
          // @ts-ignore
          const battery = await navigator.getBattery();
          batteryInfo = `${Math.round(battery.level * 100)}% ${battery.charging ? '(Sedang Dicas)' : ''}`;
        }
      } catch (error) {}

      // 5. Generate IP Acak Lokal Indonesia (Trik)
      const randomIp = `114.${Math.floor(Math.random() * 100) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

      // Update state setelah delay kecil biar kelihatan seperti sedang "meretas"
      setTimeout(() => {
        setDeviceData({
          ip: randomIp,
          os: osName,
          ram: ramInfo,
          network: netType,
          battery: batteryInfo,
          location: 'Koordinat terkunci (Akurasi 15m)' // Trik: Seolah-olah tahu lokasinya
        });
      }, 1500);
    };

    gatherData();
  }, []);

  if (!isPending) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-xl w-full my-auto p-8 sm:p-10 bg-white border-2 border-red-100 shadow-2xl rounded-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="mb-6 text-2xl font-black text-center text-gray-900 leading-tight uppercase tracking-tighter">
          Akses Website Ditutup
        </h1>

        <div className="text-left space-y-4 mb-6">
          <p className="text-gray-700 font-medium text-[15px] sm:text-lg leading-relaxed text-center">
            "Maaf website ini kami tutup, belum melunasi pembayaran yang nunggak. Jangan salahkan developer jika sulit untuk membayar."
          </p>
          
          <div className="p-4 bg-gray-900 rounded-xl">
            <p className="text-red-400 font-bold italic text-sm text-center">
              "Developer bukan budak yang disuruh-suruh terus. Waktu itu mahal, jangan membuang waktu jika bercanda order!"
            </p>
          </div>
        </div>

        {/* KOTAK TERMINAL - DATA DEVICE */}
        <div className="p-4 mb-8 bg-black border border-gray-800 rounded-xl font-mono text-xs sm:text-sm shadow-inner">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-red-500 font-bold tracking-wider">SYSTEM LOG (DEVICE DETECTED)</span>
          </div>
          <ul className="text-green-400 space-y-2">
            <li><span className="text-gray-500">IP Address :</span> {deviceData.ip}</li>
            <li><span className="text-gray-500">Perangkat  :</span> {deviceData.os}</li>
            <li><span className="text-gray-500">Memory RAM :</span> {deviceData.ram}</li>
            <li><span className="text-gray-500">Jaringan   :</span> {deviceData.network}</li>
            <li><span className="text-gray-500">Baterai    :</span> {deviceData.battery}</li>
            <li className="text-red-400 font-semibold"><span className="text-gray-500">Lokasi     :</span> {deviceData.location}</li>
          </ul>
        </div>

        <div className="pt-6 border-t border-gray-100">
          {/* Jangan lupa ganti nomorkamu dengan nomor WA aslimu */}
          <button 
            onClick={() => window.location.href = 'https://wa.me/nomorkamu'}
            className="w-full py-4 font-extrabold text-white transition-all bg-red-600 rounded-2xl hover:bg-red-700 active:scale-95 shadow-lg shadow-red-200"
          >
            Selesaikan Pembayaran Sekarang
          </button>
          <p className="mt-6 text-xs text-center text-gray-400 font-bold tracking-widest uppercase">
            System Locked by iboycloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGuard;
