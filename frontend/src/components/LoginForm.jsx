import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { miscActions } from "@/store/main";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().trim().email({
    message: "Email invalid.",
  }),
  password: z
    .string()
    .regex(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/
      ),
      {
        message:
          "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      }
    )
    .max(30, {
      message: "Password cannot be more than 30 characters.",
    })
    .min(6, {
      message: "Password must be of 6 or more characters.",
    }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);

      if (res.ok) {
        setMsg(null);
        const content = await res.json();
        const token = {
          token: content.token,
          expiry: content.expiry,
          role: content.role,
          email: content.email,
        };
        localStorage.setItem("token", JSON.stringify(token));
        
        dispatch(miscActions.setEmail(content.email));
        dispatch(miscActions.setLogin(true));
        dispatch(miscActions.setToken(token));

        if (content.role === "admin") {
          navigate("/admin");
        } else if (content.role === "dev") {
          navigate("/dev");
        } else {
          navigate("/");
        }
      } else if (res.status == 400) {
        setMsg("Invalid details.");
      } else if (res.status == 500) {
        setMsg("Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a1a] rounded-2xl p-8 w-[500px] border-2 border-[#333] shadow-2xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex items-center space-x-2">
                  <Mail className="text-gray-400" size={18} />
                  <span>Email</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="JohnDoe123@gmail.com" 
                      {...field} 
                      className="bg-[#2a2a2a] border-[#444] text-white focus:ring-2 focus:ring-blue-600 pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                </FormControl>
                <FormDescription className="text-gray-500">
                  Enter your registered Email Id.
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white flex items-center space-x-2">
                  <Lock className="text-gray-400" size={18} />
                  <span>Password</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field} 
                      className="bg-[#2a2a2a] border-[#444] text-white focus:ring-2 focus:ring-blue-600 pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="text-gray-500">
                  Enter your password
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-6">
            <Button 
              type="submit" 
              className="bg-white text-black hover:bg-gray-200 transition-colors duration-300"
            >
              {loading ? "Signing In..." : "Submit"}
            </Button>
            {msg && (
              <p className="text-red-400 text-sm flex items-center">
                {msg}
              </p>
            )}
          </div>
        </form>
      </Form>
    </motion.div>
  );
}