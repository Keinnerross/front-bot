'use client';

import { Fragment, useEffect, useState } from "react";
import useDashboardLogic from "./hooks/useDashboardLogic";
import { socket } from '@/socket';
import Swal from 'sweetalert2';
import LoadingScreen from "../components/commons/loadingScreen";
import { IoQrCode } from "react-icons/io5";
import { FaCircleUser, FaCircle, FaRegUser } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { logOut } from "./hooks/logoutSession";

import { BiLogOut } from "react-icons/bi";
import CardOrder from "../components/dashboard/cardOrder";
import Image from "next/image";


const Dashboard = () => {
    const { loading, handleQRCodeClick } = useDashboardLogic();
    const [orders, setOrders] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [tooltip, setTooltip] = useState(false);

    let hasInteracted = false;

    const handleUserInteraction = () => {
        if (!hasInteracted) {
            hasInteracted = true;
        }
    };



    useEffect(() => {
        document.addEventListener('click', handleUserInteraction);

        socket.on('new-order', (newOrders) => {

            const hasInProcessOrder = newOrders.some(order => order.estado === 'En proceso');

            if (hasInProcessOrder) {
                if (hasInteracted) {
                    const audio = new Audio('/audio/notificacion.mp3');
                    audio.play();

                }

                Swal.fire({
                    title: '¡Nuevo Pedido!',
                    text: 'Tienes un nuevo pedido en sistema',
                    icon: 'info',
                    confirmButtonText: 'Aceptar'
                });


            }

            setOrders(newOrders);
        });


        socket.on('get-orders', (orders) => {
            setOrders(orders);
        });


        socket.on('conectado-front', () => {
            setIsConnected(true)
            console.log("Sock connect")
        });
        socket.on('desconectado-front', () => {
            setIsConnected(false)
            console.log("Es false")


        });


        return () => {
            socket.off('new-order');
            socket.off('get-orders');
            socket.off('conectado-front');
            socket.off('desconectado-front');

        };
    }, []);




    const handleTooltip = () => {
        setTooltip(true)
        setTimeout(() => {
            setTooltip(false)

        }, 1500)
    }


    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <Fragment>

            <div className="w-full h-screen bg-[#fbc2c8]  items-center justify-center fixed z-[999999999999] flex md:hidden">
                <p className="font-semibold text-center px-4">     Aplicacion solo disponible en Escritorio  </p>
            </div>
            <div className="dashboard min-h-screen bg-background-color hidden md:flex justify-center pb-20">
                <div className="w-[90vw] flex flex-col gap-5 pt-16">
                    <div className="p-6 rounded-xl flex justify-between items-center ">
                        <div className="flex flex-col">
                            <div className="flex">

                                <h2 className="text-4xl font-semibold"> ¡Bienvenido!🍓</h2>

                            </div>

                            <div className="conectado-container font-light">
                                {isConnected ?
                                    <div className="flex gap-1 items-center">
                                        <FaCircle color="lightgreen" size={13} />
                                        <p className="font-medium">Conectado</p>
                                    </div> :
                                    <div className="flex gap-1 items-center">
                                        <FaCircle color="orange" size={13} />
                                        <p className="font-medium">Desconectado</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex gap-4 text-text">
                            <button className="flex gap-4 items-center cursor-pointer bg-[#fbc2c8] hover:bg-[#f5a4ac] py-1 px-4 rounded-xl" onClick={handleQRCodeClick}>
                                <IoQrCode size={20} />
                                <p>Escanear QR</p>
                            </button>

                            <details className="card-user relative cursor-pointer hover:bg-slate-100 py-1 px-4 rounded-xl">
                                <summary className="flex gap-2 items-center">
                                    <FaCircleUser size={35} />
                                    <div className="flex gap-2 items-center">
                                        <div className="flex flex-col">
                                            <span className="text-base font-semibold">Administrador</span>
                                            <span className="text-gray-500 text-sm">Perfil y ajustes</span>

                                        </div>
                                        <MdKeyboardArrowDown size={20} />
                                    </div>
                                </summary>
                                <ul className="bg-white p-4 rounded-b-xl absolute top-[100%] left-0 w-full shadow-md ">

                                    <li className="p-2 rounded-xl hover:bg-slate-100 flex gap-2 items-center relative" onClick={() => handleTooltip()}>
                                        <FaRegUser />
                                        <p>Editar Cuenta</p>

                                        <span id="tooltip" className={` transition-opacity duration-300 ease-in-out absolute top-0  right-[118%] bg-pink-200 text-sm p-2 rounded-xl ${tooltip ? "opacity-100" : "opacity-0"}`}> próximamente</span>

                                    </li>
                                    <li className="p-2 rounded-xl hover:bg-slate-100 flex gap-2 items-center" onClick={() => logOut()}>
                                        <BiLogOut size={17} />
                                        <p>Cerrar sesión</p>
                                    </li>

                                </ul>
                            </details>
                        </div>
                    </div>
                    <div className="dashboard-list w-full min-h-[300px] bg-white rounded-xl">
                        <ul id="orders-list ">
                            <li className="p-6 border-t border-b border-light-gray grid grid-cols-8 gap-10 text-sm uppercase font-semibold text-gray-400 ">
                                <section className="flex justify-center">Orden</section>
                                <section className="flex justify-center">Fecha</section>
                                <section className="flex justify-start">Producto</section>
                                <section className="flex justify-center">Salsas/Toppings</section>
                                <section className="flex justify-center">Extras</section>
                                <section className="flex justify-center">Metodo Pago</section>
                                <section className="flex justify-center">Estado</section>
                                <section className="flex justify-center">Total</section>

                            </li>
                            {orders.map((order, index) => (
                                <CardOrder key={index} order={order} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div >
        </Fragment >

    );
};

export default Dashboard;
