import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getProfile } from "../store";
import "../index.css";

export const Layout = () => {
    const { dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("jwt-token");

            if (token) {
                try {
                    const user = await getProfile();
                    dispatch({ type: "set_user", payload: { ...user, token } });
                } catch (error) {
                    console.warn("⚠️ Token inválido o expirado");
                    localStorage.removeItem("jwt-token");
                    localStorage.removeItem("user-profile");
                    dispatch({ type: "set_user", payload: null });
                }
            } else {
                dispatch({ type: "set_user", payload: null });
            }

            setLoading(false);
        };

        fetchUser();
    }, [dispatch]);


    if (loading) {
        return (
            <div className="text-white h-screen flex justify-center items-center">
                <p>Cargando sesión...</p>
            </div>
        );
    }

    return (
        <ScrollToTop>
            <div>
                <Outlet />
            </div>
        </ScrollToTop>
    );
};
