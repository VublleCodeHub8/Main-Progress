import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useState } from "react";
import { useDispatch } from "react-redux";
import { miscActions } from "@/store/main";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
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
      console.log(res);

      if (res.ok) {
        setMsg(null);
        const content = await res.json();
        const token = {
          token: content.token,
          expiry: content.expiry,
        };
        localStorage.setItem("token", JSON.stringify(token));
        console.log(content);
        dispatch(miscActions.setLogin(true));
        dispatch(miscActions.setToken(token));

        navigate("/");
      } else if (res.status == 400) {
        setMsg("Invalid details.");
      } else if (res.status == 500) {
        setMsg("Something went wrong.");
      }
    } catch (err) {
      console.log(err);
    }
    console.log(values);
  }

  return (
    <div className="rounded-xl p-6 w-[500px] border-2 border-zinc-200 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email</FormLabel>
                <FormControl>
                  <Input placeholder="JohnDoe123@gmail.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your registered Email Id.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={"Password"} {...field} />
                </FormControl>
                <FormDescription>Enter Password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-6">
            <Button type="submit">Submit</Button>
            {loading ? (
              <p className="flex items-center text-sm">Signing In....</p>
            ) : (
              <p className="text-[#ef4444] text-sm flex items-center">{msg}</p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
