'use client';

import React,{useState} from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";
import Button from "@/components/ui/Button";

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
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">ดึงสินค้ายอดนิยม (เฉพาะที่มีค่าคอม)</h1>
        <TextField
          label="วางโค้ด HTML ที่คัดลอกมา"
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          textarea
        />
        <Button onClick={extractCommissionProducts}>ดึงลิงก์สินค้า</Button>

        {results.length > 0 && (
          <>
            <Button onClick={copyToClipboard} className="mt-2 bg-green-600 hover:bg-green-700">
              คัดลอกลิงก์ทั้งหมด
            </Button>
            <div className="mt-4 space-y-2">
              {results.map((link, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">{link}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default withProtectedUser(BestSaleProducts);
