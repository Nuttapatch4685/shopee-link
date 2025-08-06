"use client";
import React, { useState } from "react";
import Layout from "@/components/includes/Layout";
import withProtectedUser from "@/hoc/withProtectedUser";

const BestSaleProducts = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [results, setResults] = useState([]);

  const extractCommissionLinks = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, "text/html");

    const items = Array.from(doc.querySelectorAll("a"));

    const links = items
      .filter((item) => {
        // ค้นหา img ที่ alt="ams-label" ซึ่งเป็นสัญลักษณ์ของสินค้ามีค่าคอม
        return item.querySelector('img[alt="ams-label"]');
      })
      .map((item) => {
        const href = item.getAttribute("href");
        return href?.startsWith("http") ? href : `https:${href}`;
      });

    setResults(links.filter(Boolean));
  };

  const copyToClipboard = () => {
    const allLinks = results.join("\n");
    navigator.clipboard
      .writeText(allLinks)
      .then(() => alert("คัดลอกลิงก์ทั้งหมดแล้ว!"))
      .catch(() => alert("ไม่สามารถคัดลอกลิงก์ได้!"));
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-4">
          ดึงสินค้ามีค่าคอม
        </h1>

        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          placeholder="วางโค้ด HTML ของสินค้า Shopee ที่คัดลอกมาที่นี่..."
          className="w-full p-3 border rounded mb-4 h-40"
        />

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={extractCommissionProducts}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            ดึงสินค้ามีค่าคอม
          </button>
          <button
            onClick={copyAllLinks}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            คัดลอกลิงก์ทั้งหมด
          </button>
        </div>

        <div className="bg-white border rounded p-4 shadow min-h-[200px] overflow-y-auto">
          {results.length > 0 ? (
            results.map((link, idx) => (
              <div key={idx} className="text-sm mb-1">
                {link}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              ยังไม่มีลิงก์สินค้าที่มีค่าคอม
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(BestSaleProducts);
