import React, { useState } from "react";
import Link from "next/link";
import Topnav from "./Topnav";
import Sidenav from "./Sidenav";

const Layout = ({ children }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <Topnav setToggle={setToggle} toggle={toggle} />
      <Sidenav setToggle={setToggle} toggle={toggle} />
      <div className="lg:pl-[300px] pl-0 pt-[70px] w-[100vw - 300px]">
        <div className="lg:w-[calc(100% - 300px)] w-full  h-[100vh] p-4 bg-gray-100/60">
          <div className="">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
