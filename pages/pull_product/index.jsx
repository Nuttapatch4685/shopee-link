import React,{useState} from "react";
import withProtectedUser from "@/hoc/withProtectedUser";
import Layout from "@/components/includes/Layout";

const DailyProduct = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [minSales, setMinSales] = useState("");
  const [maxSales, setMaxSales] = useState("");
  const [results, setResults] = useState([]);

  const extractLinks = (hasCommission) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, "text/html");

    const items = doc.querySelectorAll(".shopee-search-item-result__item");
    const extracted = [];

    items.forEach((item) => {
      // ✅ รองรับทั้ง DOM เก่าและใหม่
      const commissionImg = item.querySelector(
        'img[alt="ams-label"], img[src*="ams-label"], img[src*="sponsored"], img[alt="shopee-partner"], img[alt*="promotion-label"], img[src*="promotion-label"], img[alt*="promotion-label-icon"], img[alt*="flag-label"], img[src*="flag-label"]'
      );
      const isCommission = commissionImg !== null;

      if (isCommission === hasCommission) {
        const salesText = item.textContent || "";
        // ✅ Regex ครอบคลุมทั้ง +, พัน, k, และ /เดือน
        const salesMatch = salesText.match(/ขายได้\s*([\d,.]+)([kพัน]*)\+?\s*ชิ้น/);

        if (salesMatch) {
          let amount = parseFloat(salesMatch[1].replace(/,/g, ""));
          if (salesMatch[2]?.includes("k") || salesMatch[2]?.includes("พัน"))
            amount *= 1000;

          const min = parseFloat(minSales) || 0;
          const max = parseFloat(maxSales) || Infinity;

          if (amount >= min && amount <= max) {
            const link = item.querySelector("a[href]");
            if (link) {
              const href = link.getAttribute("href");
              const match = href.match(/i\.(\d+)\.(\d+)/);
              if (match) {
                const shopid = match[1];
                const itemid = match[2];
                const productLink = `https://shopee.co.th/product/${shopid}/${itemid}`;
                extracted.push(productLink);
              }
            }
          }
        }
      }
    });

    setResults(extracted);
  };

  const copyAllLinks = () => {
    navigator.clipboard
      .writeText(results.join("\n"))
      .then(() => alert("คัดลอกทั้งหมดสำเร็จ!"))
      .catch(() => alert("ไม่สามารถคัดลอกลิงค์ได้!"));
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-4">
          ดึงสินค้าตามใจ
        </h1>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-600 mb-4">
          <strong>วิธีใช้งาน:</strong>
          <ol className="list-decimal pl-5 mt-2 text-sm">
            <li>คลิกขวาที่สินค้า เลือก <em>Inspect</em></li>
            <li>ลิงค์สินค้าอยู่ในส่วน <code>ul class=</code></li>
            <li>คลิกขวา Copy &gt; Copy element</li>
            <li>นำมาใส่ในกล่องข้อความและกดดึงสินค้า</li>
          </ol>
        </div>

        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          placeholder="วางโค้ด HTML ของสินค้า..."
          className="w-full p-3 border rounded mb-4 h-40"
        />

        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="number"
            value={minSales}
            onChange={(e) => setMinSales(e.target.value)}
            placeholder="ยอดขายขั้นต่ำ (ชิ้น)"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={maxSales}
            onChange={(e) => setMaxSales(e.target.value)}
            placeholder="ยอดขายสูงสุด (ชิ้น)"
            className="p-2 border rounded"
          />
          <button
            onClick={() => extractLinks(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            ดึงสินค้ามีค่าคอม
          </button>
          <button
            onClick={() => extractLinks(false)}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            ดึงสินค้าไม่มีค่าคอม
          </button>
          <button
            onClick={copyAllLinks}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            คัดลอกลิงค์ทั้งหมด
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
            <p className="text-gray-500 text-sm">ยังไม่มีลิงก์ที่ดึงได้</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withProtectedUser(DailyProduct);
