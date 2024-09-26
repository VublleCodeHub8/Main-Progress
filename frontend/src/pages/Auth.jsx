import AuthForm from "@/components/AuthForm";
import { LoginForm } from "@/components/LoginForm";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { miscActions } from "@/store/main";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const newToast = useSelector((state) => state.misc.toastMsg);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.misc.token);
  const fallback = useSelector((state) => state.misc.fallback);

  useEffect(() => {
    if (newToast) {
      if (newToast.mood === "success") {
        toast.success(newToast.msg);
      } else if (newToast.mood === "fail") {
        toast.error(newToast.msg);
      }
    }
  }, [newToast]);

  function close() {
    dispatch(miscActions.setToast(null));
  }

  async function signOut() {
    if (token.token != null) {
      const tok = token.token;
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: tok,
          expiry: new Date(new Date().getTime() - 1000).toISOString(),
        })
      );
      dispatch(miscActions.setToken({ token: null, expiry: null }));
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="p-16 w-full h-full flex justify-center">
          {fallback === true ? (
            <p>Loading...</p>
          ) : token.token != null ? (
            <Button onClick={signOut}>Sign Out</Button>
          ) : (
            <AuthForm />
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        onClose={close}
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </>
  );
}