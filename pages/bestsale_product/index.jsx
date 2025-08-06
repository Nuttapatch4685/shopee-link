"use client";
import React, { useState } from "react";
import Layout from "@/components/includes/Layout";
import withProtectedUser from "@/hoc/withProtectedUser";

const BestSaleProducts = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [results, setResults] = useState([]);

  const extractCommissionProducts = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');
    const items = doc.querySelectorAll('a[data-sqe="link"]');
    const extracted = [];

    items.forEach((item) => {
      const commissionImg = item.querySelector('img[src*="fd4662aa56269f31f40d.png"]');
      if (commissionImg) {
        const href = item.href;
        if (href) {
          let cleanLink = href;
          try {
            const url = new URL(href);
            const pathname = url.pathname;
            const itemIdMatch = pathname.match(/-i\.(\d+)\.(\d+)/);
            if (itemIdMatch) {
              const itemId = itemIdMatch[2];
              const shopId = itemIdMatch[1];
              cleanLink = `https://shope.ee/${shopId}-${itemId}`;
            }
          } catch (error) {
            console.error('Invalid URL format:', href);
          }

          extracted.push(cleanLink);
        }
      }
    });

    setResults(extracted);
  };

  const copyToClipboard = () => {
    const textToCopy = results.join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('คัดลอกลิงก์ทั้งหมดแล้ว!'))
      .catch((err) => alert('คัดลอกไม่สำเร็จ: ' + err));
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

export default withProtectedUser(CommissionProducts);
