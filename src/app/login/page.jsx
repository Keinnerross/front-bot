'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, redirect } from 'next/navigation';
import Swal from 'sweetalert2';
import { socket } from '@/socket';

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
                title: 'Login Successful',
                text: data.message,
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
            <div className="flex justify-center items-center h-screen bg-pink-100 ">
                <div className="spinner">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-pink-100 flex">
            <div className="w-1/2 h-full bg-no-repeat bg-[url('/bg-login.png')] bg-[position:0_150px] bg-[size:80%] relative">
                <div className="absolute top-10 left-24 text-white font-semibold text-xl">FRESATA ® | Fresas con crema</div>
            </div>

            <div className="w-1/2 h-full flex justify-center items-center">
                <div className="w-1/2 min-w-1/2 max-w-1/2 h-[60vh] p-8 bg-white rounded-xl">
                    <h1 className="py-2 text-2xl font-semibold">Inicia Sesión</h1>
                    <p className="pb-2 text-gray-500 text-sm font-light leading-6">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime dicta modi voluptates mollitia sapiente?
                    </p>
                    <form id="loginForm" className="text-left" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1 py-2">
                            <div className="bg-white h-12 px-4 rounded-full flex items-center">
                                <i className="text-gray-400 pr-2 fas fa-user"></i>
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
                            <div className="bg-white h-12 px-4 rounded-full flex items-center">
                                <i className="text-gray-400 pr-2 fa fa-key"></i>
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
    );
}

export default Login;
