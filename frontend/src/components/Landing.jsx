import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Landing() {
  return (
    <div className="h-full w-full flex flex-col  ">
      <div className="flex mt-16 mx-auto">
        <Link to={"/auth"}>
          <Button>Login</Button>
        </Link>
      </div>
      <h1 className="text-[50px] text-center font-bold font-mono mt-16">
        Welcome to Cloud IDE
      </h1>
      <h3 className="text-[20px] text-center font-medium font-mono mt-6">
        Sign In to Continue
      </h3>
    </div>
  );
}
