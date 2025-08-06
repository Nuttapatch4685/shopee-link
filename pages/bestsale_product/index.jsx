"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import withProtectedUser from "@/hoc/withProtectedUser";

const BestSaleProducts = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [results, setResults] = useState([]);

  const extractCommissionProducts = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, "text/html");
      const items = doc.querySelectorAll("li");

      const extracted = [];

      items.forEach((item) => {
        // ตรวจสอบว่าในแต่ละสินค้า มีรูป promotion label หรือไม่
        const promoImg = item.querySelector("img[alt='promotion-label']");
        if (!promoImg) return;

        // หา href จาก <a class="contents" href="/...">
        const linkTag = item.querySelector("a.contents");
        if (!linkTag) return;

        const href = linkTag.getAttribute("href");
        if (!href) return;

        const match = href.match(/-i\.(\d+)\.(\d+)/); // ดึง shopid และ itemid
        if (match) {
          const shopid = match[1];
          const itemid = match[2];
          const productLink = `https://shopee.co.th/product/${shopid}/${itemid}`;
          extracted.push(productLink);
        }
      });

      setResults(extracted);
    } catch (error) {
      console.error("Error extracting links:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => alert("คัดลอกลิงก์สำเร็จ!"),
      () => alert("ไม่สามารถคัดลอกลิงก์ได้!")
    );
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-4">
          ดึงสินค้ายอดนิยม (มีค่าคอม)
        </h1>

        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          rows={12}
          className="w-full p-3 border border-gray-400 rounded mb-4"
          placeholder="วาง HTML ที่ก๊อปมาจาก Shopee ที่นี่"
        />

        <button
          onClick={extractCommissionProducts}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold"
        >
          🔍 ดึงลิงก์สินค้า
        </button>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">
            📦 ลิงก์สินค้าที่มีค่าคอม ({results.length} รายการ)
          </h2>
          <ul className="space-y-2">
            {results.map((link, index) => (
              <li key={index} className="bg-white p-2 rounded shadow flex justify-between items-center">
                <span className="truncate max-w-[80%] text-blue-600 underline">{link}</span>
                <button
                  onClick={() => copyToClipboard(link)}
                  className="text-sm text-orange-600 hover:underline"
                >
                  คัดลอก
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(BestSaleProducts);
