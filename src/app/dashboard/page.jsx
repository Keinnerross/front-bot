'use client';

import { useEffect, useState } from "react";
import useDashboardLogic from "./hooks/useDashboardLogic"; // Ruta al archivo de lógica de dashboard
import useOrderLogic from "./hooks/orders"; // Ruta al archivo de lógica de pedidos
import { socket } from '@/socket';
import Swal from 'sweetalert2'; // Importar SweetAlert2


const Dashboard = () => {
    const { loading, handleQRCodeClick } = useDashboardLogic();
    const [orders, setOrders] = useState([]);
    const [isConnected, setIsConnected] = useState(false);


    // Cargar los pedidos desde localStorage al iniciar el componente
    useEffect(() => {
        // Escuchar el evento 'new-order' desde el servidor para obtener nuevos pedidos
        socket.on('new-order', (newOrders) => {
            setOrders(newOrders); // Actualizar los pedidos
            // Mostrar una alerta con SweetAlert2
            Swal.fire({
                title: 'Nuevo Pedido!',
                text: '¡Tienes un nuevo pedido en tu sistema!',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
        });

        // Obtener los pedidos al conectar
        socket.on('get-orders', (orders) => {
            setOrders(orders);
        });


        socket.on('conectado-front', () => {
            setIsConnected(true)
            console.log("Es true")
        });
        socket.on('desconectado-front', () =>{
            setIsConnected(false)
            console.log("Es false")


        } );


        // Limpiar los eventos cuando el componente se desmonte
        return () => {
            socket.off('new-order');
            socket.off('get-orders');
            socket.off('conectado-front');
            socket.off('desconectado-front');
      
        };
    }, []);







    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-pink-100">
                <div className="spinner">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="dashboard w-screen h-screen bg-background-color flex justify-center">
            <div className="dashboard-section flex flex-col gap-5 w-4/5 pt-16">
                <div className="dashboard-header bg-white p-6 rounded-xl flex items-center justify-between">
                    <div className="header-section-welcome">
                        <h1>¡Bienvenido!🍓</h1>
                        <div className="conectado-container">
                            {isConnected ? <p>Conectado</p> : <p>Desconectado</p>}
                        </div>
                    </div>
                    <div className="header-section-user flex">
                        <div className="section-btn">
                            <button className="showQR" onClick={handleQRCodeClick}>
                                Scanear QR
                            </button>
                        </div>
                        <div className="section-info">
                            <div className="card-user">
                                <h4>Administrador</h4>
                                <p>Cerrar sesión</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-list w-full min-h-[300px] bg-white rounded-xl">
                    <ul id="orders-list">
                        {orders.map((order, index) => (
                            <li key={index} className="p-6 border-t border-b border-light-gray">
                                {order.producto},
                                {order.salsas && `Salsas: ${order.salsas}`},
                                {order.toppings && `Toppings: ${order.toppings}`},
                                {order.extras && `Extras: ${order.extras}`},
                                Fecha: {order.fecha},
                                Estado: {order.estado}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
