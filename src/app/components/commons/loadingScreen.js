import Image from "next/image";

const LoadingScreen = () => {
    return (
        <div className="flex flex-col justify-center items-center  gap-4 h-screen bg-[#fbc2c8]">
            <Image
                className="rounded-full"
                width={150}
                height={150}
                src="/logo-fresata.jpg"
                alt="logo fresata - las mejores fresas con crema Colombia"
                priority />
            <div className="spinner">Cargando...</div>
        </div>
    )
}

export default LoadingScreen;