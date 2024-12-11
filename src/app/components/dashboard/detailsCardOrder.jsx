const DetailsCardOrder = ({ order }) => {

    const renderDetail = (label, value, fallback) => (
        <div className="flex gap-4">
            <h2 className="font-semibold">{label}:</h2>
            <p className="text-gray-700">{value || fallback}</p>
        </div>
    );

    return (
        <div className="px-10 py-8 bg-slate-50 shadow-lg rounded-lg">
            <div className="flex justify-between gap-8  bg-slate-100 p-6 rounded-lg">

                {/* Detalles del Producto */}
                <div id="productOrderDetails" className="w-1/2 ">
                    <h2 className="text-2xl font-semibold text-text">{order.producto}</h2>
                    {renderDetail('Salsas', order.salsas, 'No aplica')}
                    {renderDetail('Toppings', order.toppings, 'No aplica')}
                    {renderDetail('Extras', order.extras, 'Sin extras')}
                </div>

                {/* Detalles del Pago */}
                <div id="productPayDetails" className="w-1/2 flex flex-col gap-2">
                    <div className="flex gap-4 w-full">
                        <h2 className="font-semibold">Dirección de entrega:</h2>
                        {/* Deja que el texto fluya hacia abajo y asegúrate de que pueda romper la línea */}
                        <p className="text-gray-700 break-words max-w-[80%]">{order.datosEntrega || 'Sin dirección proporcionada'}</p>
                    </div>
                    {renderDetail('Método de pago', order.metodoPago, 'No especificado')}
                    {renderDetail('Total', order.cuenta, 'No especificado')}
                    {renderDetail('Comprobante/Cambio', order.comprobante, 'Sin comprobante')}

                </div>
            </div>
        </div>
    );
}

export default DetailsCardOrder;
