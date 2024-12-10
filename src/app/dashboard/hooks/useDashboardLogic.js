// useDashboardLogic.js
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { socket } from "@/socket";  // Asegúrate de tener la configuración correcta de Socket.IO
import { useRouter } from 'next/navigation';

const useDashboardLogic = () => {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    socket.emit('check-auth', { token });

    const handleAuthStatus = (data) => {
      if (!data.authenticated) {
        router.push('/login');
      } else {
        setLoading(false); 
      }
    };

    socket.on('auth-status', handleAuthStatus);
    socket.on('conectado-front', () => setIsConnected(true));
    socket.on('desconectado-front', () => setIsConnected(false));

    return () => {
      socket.off('auth-status', handleAuthStatus);
      socket.off('conectado-front');
      socket.off('desconectado-front');
    };
  }, [router]);

  const handleQRCodeClick = () => {
    Swal.fire({
      title: 'Código QR',
      text: 'Este es un ejemplo de alerta usando SweetAlert2.',
      icon: 'info',
      html: `
        <img id="qr-img" src="/qr.png" />
      `,
      confirmButtonText: 'Entendido'
    });
  };

  const handleQrUpdate = () => {
    const qrImg = document.getElementById('qr-img');
    if (qrImg) {
      qrImg.src = "/qr.png";
    }
  };

  useEffect(() => {
    socket.on('qr-updated', handleQrUpdate);
    return () => {
      socket.off('qr-updated', handleQrUpdate);
    };
  }, []);

  return {
    loading,
    isConnected,
    handleQRCodeClick
  };
};

export default useDashboardLogic;
