import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import axios from "@/utils/api.utils";
import Alert from "@/utils/alerts.utils";
import { jwtVerify } from "jose";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const login = async (params) => {
    try {
      const payload = {
        username: params.username,
        password: params.password,
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, payload);

      if (res.status === 200) {
        const { token } = await res.data;
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        Alert.error("Error");
      }
    } catch (error) {
      let response = error.response;
      const { message } = response.data;
      Alert.error(message);
    }
  };

  const logout = async (_user) => {
    try {
      const payload = {
        user_id: user?.user_id,
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, payload);

      if (res.status === 200) {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      let response = error.response;
      const { message } = response.data;
      Alert.error(message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            localStorage.removeItem("token");
            setUser(null);
            router.push("/login");
          });
      }
    };
    checkAuth();
  }, [pathname]);

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
