'use client';

import React, { useState } from 'react';
import Layout from "@/components/Layout";
import TextField from '@/ui/TextField';
import Button from '@/ui/Button';
import withProtectedUser from '@/hoc/withProtectedUser';

const BestSaleProducts = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const extractCommissionProducts = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');

    const items = doc.querySelectorAll('.shopee-search-item-result__item');
    const extracted: string[] = [];

    items.forEach((item) => {
      const badge = item.querySelector('img[src*="fd4662aa"]');
      if (!badge) return;

      const linkEl = item.querySelector('a[href*="-i."]');
      if (!linkEl) return;

      const href = linkEl.getAttribute('href');
      const match = href?.match(/-i\.(\d+)\.(\d+)/);

      if (match) {
        const shopid = match[1];
        const itemid = match[2];
        const productLink = `https://shopee.co.th/product/${shopid}/${itemid}`;
        extracted.push(productLink);
      }
    });

    setResults(extracted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join('\n'));
    alert('คัดลอกลิงก์ทั้งหมดแล้ว');
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
