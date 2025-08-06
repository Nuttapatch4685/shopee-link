"use client";
import React, { useState } from "react";
import Layout from "@/components/includes/Layout";
import withProtectedUser from "@/hoc/withProtectedUser";

const extractCommissionProducts = () => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInput, "text/html");
  const items = doc.querySelectorAll(".shopee-search-item-result__item");
  const extracted = [];

  items.forEach((item) => {
    const badge = item.querySelector('img[alt="promotion-label"]');
    if (!badge) return;

    const linkEl = item.querySelector('a[href*="/-i."]');
    if (linkEl) {
      const href = linkEl.getAttribute("href");
      const match = href.match(/-i\.(\d+)\.(\d+)/);
      if (match) {
        const shopid = match[1];
        const itemid = match[2];
        const productLink = `https://shopee.co.th/product/${shopid}/${itemid}`;
        extracted.push(productLink);
      }
    }
  });

  setResults(extracted);
};

  const copyAllLinks = () => {
    if (results.length === 0) {
      alert("ยังไม่มีลิงก์ให้คัดลอก!");
      return;
    }
    navigator.clipboard
      .writeText(results.join("\n"))
      .then(() => alert("คัดลอกทั้งหมดสำเร็จ!"))
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

export default withProtectedUser(CommissionProducts);
