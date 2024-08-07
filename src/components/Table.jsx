import { memo } from "react";

/* eslint-disable react/prop-types */
const Table = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="hidden md:block md:py-2 md:px-4"></th>
            <th className="md:py-2 md:px-4">رقم الجلوس</th>
            <th className="md:py-2 md:px-4">الاسم</th>
            <th className="md:py-2 md:px-4">الدرجة</th>
            <th className="md:py-2 md:px-4">النسبة</th>
            <th className="md:py-2 md:px-4">حالة الطالب</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className="text-black hover:bg-gray-200">
              <td className="hidden md:block px-2 md:py-2 md:px-4 border-b">
                {index + 1}
              </td>
              <td className="px-2 md:py-2 md:px-4 border-b">
                {result["رقم الجلوس"]}
              </td>
              <td className="px-2 md:py-2 md:px-4 border-b">
                {result["الاسم"]}
              </td>
              <td className="px-2 md:py-2 md:px-4 border-b">
                {result["الدرجة"].toFixed(2)}
              </td>
              <td className="px-2 md:py-2 md:px-4 border-b">
                {((result["الدرجة"] / 410) * 100).toFixed(2)}%
              </td>
              <td className="px-2 md:py-2 md:px-4 border-b">
                {result["student_case_desc"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(Table);
