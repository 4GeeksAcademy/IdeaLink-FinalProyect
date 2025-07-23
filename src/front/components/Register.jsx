import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo_dark from '../assets/img/Logo_dark.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Usuario registrado correctamente', {
          onClose: () => navigate("/"),
        });
      } else {
        toast.error(data.msg || '❌ Error al registrar usuario');
      }

    } catch (error) {
      toast.error("❌ Error de red al registrar usuario");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col justify-center w-full max-w-md shadow-[0_0_40px_#8b5cf6] rounded-lg p-6 sm:p-10 bg-gray-800"
      >
        <div className="flex justify-center mb-4">
          <img className="h-30 object-contain" src={Logo_dark} alt="IdeaLink Logo" />
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-white mb-6">
          REGISTRA TU CUENTA
        </h2>

        <form onSubmit={handleRegister} className="space-y-6" method="POST">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              id="username"
              required
              className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white outline outline-1 outline-gray-500 placeholder:text-gray-400 focus:outline-2 focus:outline-purple-500 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              autoComplete="email"
              required
              className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white outline outline-1 outline-gray-500 placeholder:text-gray-400 focus:outline-2 focus:outline-purple-500 sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              id="password"
              autoComplete="current-password"
              required
              className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white outline outline-1 outline-gray-500 placeholder:text-gray-400 focus:outline-2 focus:outline-purple-500 sm:text-sm"
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
            >
              Regístrate
            </button>
          </div>
        </form>
      </motion.div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        pauseOnFocusLoss
        pauseOnHover
        draggable
        theme="dark"
      />

    </div>

  );
};

export default Register;
