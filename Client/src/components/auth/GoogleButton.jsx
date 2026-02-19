import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function GoogleButton() {
  const { googleLogin } = useAuth();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_CLIENT,
        callback: async (response) => {
          await googleLogin(response.credential);
        },
      });
    } else {
      console.error("Google API not loaded");
    }
  }, [googleLogin]);

  const handleGoogleLogin = () => {
    if (window.google) {
      google.accounts.id.prompt(); 
    } else {
      console.error("Google API not loaded");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="w-5 h-5"
      />
      <span className="font-medium">Sign in with Google</span>
    </button>
  );
}
