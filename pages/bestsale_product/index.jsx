"use client";
import React,{useState} from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

const BestSaleProducts = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [results, setResults] = useState([]);

  const extractCommissionLinks = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, "text/html");

    const result = [];

    const items = doc.querySelectorAll("li.shopee-search-item-result__item");

    items.forEach((item) => {
      // โครงสร้างที่ 1: ตรวจจาก src รูปภาพค่าคอม
      const hasCommissionImage1 = item.querySelector(
        'img[src*="fd4662aa56269f31f40d.png"]'
      );

      // โครงสร้างที่ 2: ตรวจจาก alt="promotion-label"
      const hasCommissionImage2 = item.querySelector(
        'img[alt="promotion-label"]'
      );

      if (hasCommissionImage1 || hasCommissionImage2) {
        const aTag = item.querySelector("a.contents");
        const href = aTag ? aTag.getAttribute("href") : null;

        if (href) {
          // แปลงลิงก์เป็นแบบ https://shopee.co.th/product/shopId/productId
          const match = href.match(/i\.(\d+)\.(\d+)/);
          if (match) {
            const shopId = match[1];
            const productId = match[2];
            const fullUrl = `https://shopee.co.th/product/${shopId}/${productId}`;
            result.push(fullUrl);
          }
        }
      }
    });

    setResults(result);
  };
};


  const copyAllLinks = () => {
  const text = results.join("\n");
  navigator.clipboard.writeText(text)
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
            onClick={extractCommissionLinks}
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
