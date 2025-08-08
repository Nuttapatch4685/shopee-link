import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { GoDot } from "react-icons/go";
import classNames from "classnames";
import { LiaTimesSolid } from "react-icons/lia";

const Sidenav = (props) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { toggle, setToggle } = props;

  const menus = [
    {
      label: "ผู้ใช้งาน",
      href: "/users",
      icon: <GoDot className="w-4 h-4" />,
      access: ["SUPERADMIN", "ADMIN"],
    },
    {
      label: "ดึงสินค้าที่คุณอาจชอบ",
      href: "/like_product",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "ดึงสินค้าแนะนำประจำวัน",
      href: "/daily_product",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "แปลงลิงค์",
      href: "/convert_link",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "ค้นหา URL จากรหัส",
      href: "/search_url",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "ดึงรหัสสินค้า",
      href: "/get_product_code",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "ดึงสินค้า FLASHSALE",
      href: "/flashsale_product",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "ดึงสินค้าตามใจ",
      href: "/pull_product",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
      {
      label: "ดึงสินค้ายอดนิยม",
      href: "/bestsale_product",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
    {
      label: "ลบลิงค์ซ้ำ",
      href: "/same_link",
      icon: <GoDot />,
      access: ["SUPERADMIN", "ADMIN", "USER"],
    },
  ];

  return (
    <div className={classNames(`w-[300px] h-[100vh] fixed top-0 left-0 z-20 shadow-md bg-white lg:block overflow-auto`, toggle ? "block" : "hidden")}>
      <div className="h-16 relative">
        <button className="w-10 h-10 bg-primary text-center justify-center pl-[10px] items-center absolute right-2 top-3 text-white lg:hidden block" onClick={() => setToggle(false)}>
          <LiaTimesSolid className="w-5 h-5" />
        </button>
      </div>
      <ul className="px-2">
        {menus.map((item, index) => (
          <React.Fragment key={index}>
            {item.access.includes(user?.role) ? (
              <Link href={item.href} key={index}>
                <li
                  className={classNames(
                    `w-full py-2 mb-1 hover:bg-primary cursor-pointer rounded transition duration-300 px-4 text-gray-700 hover:text-white flex`,
                    pathname === item.href ? "bg-primary text-white" : ""
                  )}>
                  <span className="mt-1">{item.icon}</span>
                  <span className="ml-2">{item.label}</span>
                </li>
              </Link>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidenav;
