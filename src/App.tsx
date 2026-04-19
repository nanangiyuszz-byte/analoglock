import PaymentGuard from './components/PaymentGuard';

function App() {
  return (
    <PaymentGuard>
      <div>
        <h1>Website sedang aktif (Jika pembayaran lunas)</h1>
        {/* Masukkan Router atau Komponen Utama kamu di sini */}
      </div>
    </PaymentGuard>
  );
}

export default App;
