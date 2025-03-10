import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  console.log(toast);

  // 2. Define a submit handler.
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
      console.log(res);

      if (res.ok) {
        setMsg(null);
        dispatch(
          miscActions.setToast({
            mood: "success",
            msg: "SignUp Successful😎",
          })
        );
      } else if (res.status == 409) {
        setMsg("Email already exists.");
      }
    } catch (err) {
      console.log(err);
    }
    console.log(values);
  }

  return (
    <div className="rounded-xl p-6 w-fit border-2 border-zinc-200 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-8">
            <div className="w-[400px] space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed online.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="JohnDoe123@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>Enter new email.</FormDescription>
                    <FormMessage />
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
                    <FormLabel className="text-black">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={"Password"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={"Confirm Password"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Confirm your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <Button type="submit">Submit</Button>
            {loading ? (
              <p className="flex items-center text-sm">Signing Up....</p>
            ) : (
              <p className="text-[#ef4444] text-sm flex items-center">{msg}</p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}