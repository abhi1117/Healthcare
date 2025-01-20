"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const cleanEmail = email?.replace(/"/g, "");
  const secretKey = searchParams.get("secretKey");

  return (
    <div>
      <Navbar email={cleanEmail || ""} />
      <Sidebar email={cleanEmail || ""} secretKey={secretKey || ""} />
    </div>
  );
};

export default Page;
