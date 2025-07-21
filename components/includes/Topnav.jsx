import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CiLogout } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";

const Topnav = (props) => {
  const { user, logout } = useAuth();

  const { toggle, setToggle } = props;

  return (
    <div className="lg:w-[calc(100%-300px)] w-full h-[70px] bg-primary fixed top-0 right-0 z-20">
      <div className="w-full flex justify-end pt-4 px-4 relative">
        <button className="lg:hidden block absolute left-4 top-5 text-white" onClick={() => setToggle(!toggle)}>
          <RxHamburgerMenu className="w-7 h-7" />
        </button>
        {user?.role === "USER" ? <div className="mr-4 pt-2 text-white">เครดิต : {user?.credit}</div> : <></>}
        <div className="">
          <button onClick={logout} className="px-4 h-10 rounded-md uppercase cursor-pointer flex justify-center items-center text-white border border-white">
            อกกจากระบบ <CiLogout className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
