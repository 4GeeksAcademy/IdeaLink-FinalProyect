// Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getProfile } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Logo_dark from "../assets/img/Logo_dark.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userAuth = await login(email, password);
      const profile = await getProfile();

      const userComplete = { ...profile, token: userAuth.token };

      dispatch({
        type: "set_user",
        payload: userComplete,
      });

      localStorage.setItem("user-profile", JSON.stringify(userComplete));

      navigate("/feed");
    } catch (err) {
      alert("Error al iniciar sesión: " + err.message);
    }
  };



  return (
    <div className="Login w-full flex justify-center bg-gray-900 text-white pe-5">
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8
                      h-auto lg:h-[800px] w-full max-w-[600px]
                      shadow-2xl shadow-purple-500/60 bg-gray-800 rounded-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-65" src={Logo_dark} alt="Logo" />
          <h2 className="mt-2 text-center text-2xl font-bold">Inicia sesión</h2>
        </div>

        <form onSubmit={handleLogin} className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md bg-gray-700 px-3 py-1.5"
          />
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full rounded-md bg-gray-700 px-3 py-1.5"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-purple-600 py-1.5 font-semibold hover:bg-purple-500"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400 mb-20">
          ¿Aún no eres miembro?{" "}
          <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

