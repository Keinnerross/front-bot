'use client'



import { useState } from "react";

const CardOrder = ({ order }) => {
    const [estado, setEstado] = useState(order.estado);

    const handleChange = (e) => {
        const nuevoEstado = e.target.value;
        setEstado(nuevoEstado);
    };

    return (
        <li>
            <details className="border-t border-b border-light-gray hover:bg-slate-100 cursor-pointer">
                <summary className="p-6 grid grid-cols-8 gap-10 text-sm">
                    <section id="id" className="flex justify-center">{order.id || "number"}</section>
                    <section id="date" className="flex justify-center">{order.fecha}</section>
                    <section id="product" className="flex justify-start">{order.producto}</section>
                    <section id="Salsas/Toppings" className="flex justify-center">{order.salsas && `Salsas: ${order.salsas}`}</section>
                    <section id="Extras" className="flex justify-center text-center">{order.extras || "Sin extras"}</section>
                    <section id="Metodo de pago" className="flex justify-center">{order.metodoPago}</section>
                    <section id="status" className="flex justify-center">
                        {estado === "En proceso" ? (
                            <select
                                className="bg-[#fff5d6] text-[#fdc824] font-semibold cursor-pointer px-2 py-1 rounded-xl uppercase"
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
                    <section id="account" className="flex justify-center">{order.cuenta}</section>
                </summary>
                <p>xd</p>
            </details>
        </li>
    );
};

export default CardOrder;
