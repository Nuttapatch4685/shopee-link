import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { withProtectedUser } from '@/hoc/withProtectedUser';

const RemoveDuplicateLinks = () => {
  const [inputText, setInputText] = useState('');
  const [outputLinks, setOutputLinks] = useState('');

  const extractLinks = () => {
    const lines = inputText.trim().split('\n').map(line => line.trim()).filter(Boolean);
    const uniqueLinks = [...new Set(lines)];
    setOutputLinks(uniqueLinks.join('\n'));

    alert(`Total Links: ${lines.length}\nDuplicate Links: ${lines.length - uniqueLinks.length}\nUnique Links: ${uniqueLinks.length}`);
  };

  const copyLinks = () => {
    navigator.clipboard.writeText(outputLinks)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => alert('Copy failed: ' + err));
  };

  return (
    <Layout>
      <div className="w-full min-h-24 bg-white p-4 rounded">
        <h1 className="text-3xl mb-4">ลบลิงค์ซ้ำ</h1>

        <p className="mb-2 text-gray-700">ใส่ลิงก์ URL (1 บรรทัดต่อ 1 ลิงก์):</p>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="https://example.com/link1\nhttps://example.com/link2"
          className="w-full border border-gray-300 min-h-48 focus:outline-none focus:border-blue-500 p-2 rounded mb-3"
        />

        <div className="flex flex-col lg:flex-row gap-2 mb-3">
          <Button onClick={extractLinks} className="lg:w-1/4 w-full">
            🧮 Remove Duplicates
          </Button>
          <Button onClick={copyLinks} className="lg:w-1/4 w-full">
            📋 Copy All Links
          </Button>
        </div>

        <div className="output">
          <h2 className="text-xl font-medium mt-4 mb-2">ผลลัพธ์ที่ไม่ซ้ำ</h2>
          <textarea
            readOnly
            value={outputLinks}
            placeholder="ผลลัพธ์จะอยู่ตรงนี้..."
            className="w-full border border-gray-300 min-h-48 focus:outline-none p-2 rounded"
          />
        </div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(RemoveDuplicateLinks);
