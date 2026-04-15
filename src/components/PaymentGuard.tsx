import React from 'react';

const PaymentGuard = ({ children }: { children: React.ReactNode }) => {
  // Ubah ke true untuk mengunci total, false jika sudah lunas
  const isPending = true; 

  if (!isPending) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full p-10 bg-white border-2 border-red-100 shadow-2xl rounded-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="mb-6 text-2xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
          Akses Website Ditutup
        </h1>

        <div className="text-left space-y-4">
          <p className="text-gray-700 font-medium text-lg leading-relaxed">
            "Maaf website ini kami tutup, belum melunasi pembayaran yang nunggak. Jangan salahkan developer jika sulit untuk membayar."
          </p>
          
          <div className="p-4 bg-gray-900 rounded-xl">
            <p className="text-red-400 font-bold italic text-sm">
              "Developer bukan budak yang disuruh-suruh terus. Waktu itu mahal, jangan membuang waktu jika bercanda order!"
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <button 
            onClick={() => window.location.href = 'https://wa.me/nomorkamu'}
            className="w-full py-4 font-extrabold text-white transition-all bg-red-600 rounded-2xl hover:bg-red-700 active:scale-95 shadow-lg shadow-red-200"
          >
            Selesaikan Pembayaran Sekarang
          </button>
          <p className="mt-6 text-xs text-gray-400 font-bold tracking-widest uppercase">
            System Locked by iboycloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGuard;
