import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GithubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141d38] text-[#34e0a1]">
      Logging you in with GitHub...
    </div>
  );
}
