'use client'
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter, redirect } from 'next/navigation';
import Swal from 'sweetalert2';
import { socket } from '@/socket';
import LoadingScreen from '../components/commons/loadingScreen';
import { FaKey, FaUserAlt } from "react-icons/fa";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true); // Agregar un estado de carga
    const router = useRouter();

    useEffect(() => {
        // Verificar si ya hay un token guardado en el localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Si el token existe, emite el evento de autenticación con el token
            socket.emit('check-auth', { token });
        } else {
            socket.emit('check-auth'); // Si no hay token, simplemente verificamos
        }

        const handleAuthStatus = (data) => {
            if (data.authenticated) {
                window.location.href = '/dashboard';
            } else {
                setLoading(false); // Cuando se termine la verificación, dejamos de cargar
            }
        };

        socket.on('auth-status', handleAuthStatus);

        return () => {
            socket.off('auth-status', handleAuthStatus);
        };
    }, []);

    useEffect(() => {
        const handleLoginSuccess = (data) => {
            Swal.fire({
                icon: 'success',
                title: 'Login Exitoso',
                confirmButtonText: 'OK',
            }).then(() => {
                // Al iniciar sesión correctamente, guardamos el token
                localStorage.setItem('token', data.token);

                // Redirigir a la página del dashboard
                window.location.href = '/dashboard';
            });
        };

        const handleLoginError = (data) => {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message,
                confirmButtonText: 'Try Again',
            });
        };

        // Escuchar los eventos de login
        socket.on('login-success', handleLoginSuccess);
        socket.on('login-error', handleLoginError);

        // Limpiar las suscripciones cuando el componente se desmonte
        return () => {
            socket.off('login-success', handleLoginSuccess);
            socket.off('login-error', handleLoginError);
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Emitir el evento de login con los datos del formulario
        socket.emit('login', { username, password });
    };

    if (loading) {
        // Mostrar una carga o un spinner mientras se verifica la autenticación
        return (
            <LoadingScreen />
        );
    }

    return (
        <Fragment>
            <div className="w-full h-screen bg-[#fbc2c8]  items-center justify-center fixed z-50 flex md:hidden">
                <p className="font-semibold text-center px-4">     Aplicacion solo disponible en Escritorio  </p>
            </div>
            <div className="w-full h-screen bg-[#fbc2c8] hidden md:flex">
                <div className="w-1/2 h-full bg-no-repeat bg-[url('/bg-login.png')] bg-[position:0_150px] bg-[size:80%] relative">

                    <div className="absolute top-10 left-24 text-text font-semibold text-xl flex gap-2 items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                                src="/logo-fresata.jpg"
                                alt="Logo"
                                style={{
                                    width: "180%",  
                                    height: "180%",
                                    objectFit: "cover",  
                                    transform: "translate(0%, -22%)"  
                                }}
                            />
                        </div>
                        <p>FRESATA ® | Fresas con crema</p>
                    </div>
                </div>

                <div className="w-1/2 h-full flex justify-center items-center">
                    <div className="w-1/2 min-w-[400px] max-w-[400px] min-h-[65vh] p-8 bg-white rounded-3xl shadow-lg">
                        <h1 className="py-2 text-2xl font-semibold">Inicia Sesión</h1>
                        <p className="max-w-[99%] pb-2 text-gray-500 text-sm font-light leading-6">
                            Por favor ingresa tus credenciales para acceder a tu cuenta.
                        </p>
                        <form id="loginForm" className="text-left" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1 py-2">
                                <div className="!bg-[#ECF0F1] h-12 px-4 rounded-full flex items-center gap-4 ">

                                    <FaUserAlt fill="lightgray" />

                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Usuario"
                                        className="w-full h-full bg-transparent"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 py-2">
                                <div className="!bg-[#ECF0F1] h-12 px-4 rounded-full flex items-center gap-4">
                                    <FaKey fill="lightgray" />



                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        className="w-full h-full bg-transparent"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                className="w-full bg-red-700 text-white border-2 border-red-700 py-3 px-5 text-lg font-semibold rounded-full mt-4 transition-colors duration-300 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                type="submit"
                            >
                                Iniciar sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Login;
