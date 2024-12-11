'use client';

import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { socket } from '@/socket';
import DetailsCardOrder from "./detailsCardOrder";


const CardOrder = ({ order }) => {
    const [estado, setEstado] = useState(order.estado);
    const [formattedDate, setFormattedDate] = useState({ date: "", time: "" });


    const updateOrderStatus = (newState) => {

        socket.emit('update-order', { orderNumber: order.numeroDeOrden, newState: newState });
        setEstado(newState)

    }


    const handleChange = async (e) => {
        const nuevoEstado = e.target.value;

        if (nuevoEstado === "Enviado") {
            const result = await Swal.fire({
                title: '¿Deseas marcar como enviado?',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    updateOrderStatus(nuevoEstado);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };







    useEffect(() => {
        if (order.fecha) {
            const [time, month, day, year] = order.fecha.split(" "); // Suponiendo que order.fecha es "21:34 12 09 24"
            const formattedDate = {
                time,
                date: `${day} ${month} ${year}`
            };
            setFormattedDate(formattedDate);
        }
    }, [order.fecha]);






    return (
        <li className="text-text">
            <details className="border-t border-b border-light-gray hover:bg-slate-100 cursor-pointer">
                <summary className="p-6 grid grid-cols-8 gap-10 text-sm">
                    <section id="numeroOrden" className="flex justify-center items-center">#{order.numeroDeOrden || "S/N"}</section>
                    <section id="date" className="flex flex-col items-center">
                        <p>{formattedDate.time}</p>
                        <p>{formattedDate.date}</p>

                    </section>
                    <div id="product" className="flex justify-start items-center">
                        <p className="line-clamp-2 max-w-xs max-h-[40px] overflow-hidden text-ellipsis">
                            {order.producto}
                        </p>
                    </div>
                    <section id="Salsas/Toppings" className="flex justify-center items-center">
                        <p className="line-clamp-2 max-w-xs max-h-[40px] overflow-hidden text-ellipsis">
                            {order.salsas && `Salsas: ${order.salsas}`}
                        </p>

                    </section>
                    <section id="Extras" className="flex justify-center text-center items-center">{order.extras || "Sin extras"}</section>
                    <section id="Metodo de pago" className="flex justify-center items-center">
                        {order.metodoPago && order.metodoPago.includes('Nequi') ? "Nequi" : order.metodoPago}
                    </section>
                    <section id="status" className="flex justify-center items-center">
                        {estado === "En proceso" ? (
                            <select
                                className="bg-[#fff5d6] text-[#fdc824] font-semibold cursor-pointer px-2 py-1 rounded-xl uppercase "
                                value={estado}
                                onChange={handleChange}

                            >
                                <option value="En proceso" className="text-text capitalize">En Proceso</option>
                                <option value="Enviado" className="text-text capitalize">Enviado</option>
                            </select>
                        ) : (
                            <span className="bg-[#cff0e6] text-[#5bc9a8] font-semibold px-2 py-1 rounded-xl uppercase flex items-center">
                                Enviado
                            </span>
                        )}
                    </section>
                    <section id="account" className="flex justify-center font-semibold items-center">{order.cuenta}</section>
                </summary>
                <DetailsCardOrder order={order} />
            </details>
        </li>
    );
};

export default CardOrder;
