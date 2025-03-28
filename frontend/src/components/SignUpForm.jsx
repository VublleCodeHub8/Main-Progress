import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

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
import { miscActions } from "@/store/main";

const formSchema = z.object({
  username: z
    .string()
    .max(50, {
      message: "Username must be between 2 and 50 characters.",
    })
    .min(2, {
      message: "Username must be between 2 and 50 characters.",
    }),
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
          "Password must have minimum six characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      }
    )
    .max(30, {
      message: "Password cannot be more than 30 characters.",
    })
    .min(6, {
      message: "Password must be of 6 or more characters.",
    }),
  confirmPassword: z.string(),
});

export function SignUpForm() {
  const [msg, setMsg] = useState(null);
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.misc.toastMsg);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    if (values.password !== values.confirmPassword) {
      setMsg("Passwords does not match.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);

      if (res.ok) {
        setMsg(null);
        dispatch(
          miscActions.setToast({
            mood: "success",
            msg: "SignUp Successful😎",
          })
        );
        form.reset();
      } else if (res.status == 409) {
        setMsg("Email already exists.");
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
      className="bg-[#1a1a1a] rounded-2xl p-8 w-[800px] border-2 border-[#333] shadow-2xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-8">
            <div className="w-[400px] space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center space-x-2">
                      <User className="text-gray-400" size={18} />
                      <span>Username</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="bg-[#2a2a2a] border-[#444] text-white focus:ring-2 focus:ring-blue-600 pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      This will be displayed online.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
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
                      Enter new email.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[400px] space-y-6">
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
                      Enter password.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center space-x-2">
                      <Lock className="text-gray-400" size={18} />
                      <span>Confirm Password</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field} 
                          className="bg-[#2a2a2a] border-[#444] text-white focus:ring-2 focus:ring-blue-600 pl-10 pr-10"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Confirm your password.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Button 
              type="submit" 
              className="bg-white text-black hover:bg-gray-200 transition-colors duration-300"
            >
              {loading ? "Signing Up..." : "Submit"}
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