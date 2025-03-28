import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthForm() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-8"
    >
      <Tabs defaultValue="signin" className="w-fit">
        <div className="flex justify-center w-full mb-6">
          <TabsList className="bg-[#2a2a2a] border-2 border-[#333] p-1 rounded-xl">
            <TabsTrigger 
              value="signin" 
              className="flex items-center space-x-2 px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="flex items-center space-x-2 px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="signin" className="mt-0">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup" className="mt-0">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
