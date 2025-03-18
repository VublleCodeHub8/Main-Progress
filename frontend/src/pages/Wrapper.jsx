import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "@/components/Landing";
import Auth from "./Auth";

export default function Wrapper() {
  const token = useSelector((state) => state.misc.token);
  return <>{token.token != null ? <Outlet></Outlet> : <Landing />}</>;
}
