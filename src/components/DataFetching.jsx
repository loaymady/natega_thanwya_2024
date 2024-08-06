import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import JSZip from "jszip";

const DataFetching = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch the ZIP file from the public folder with cache-busting header
        const response = await fetch("/natega.zip", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch the ZIP file: ${response.statusText}`
          );
        }

        const blob = await response.blob();

        // Extract files from the ZIP using JSZip
        const zip = new JSZip();
        const zipFiles = await zip.loadAsync(blob);

        // Log the extracted files
        console.log("Extracted files:", zipFiles);

        if (!zipFiles || Object.keys(zipFiles.files).length === 0) {
          throw new Error("No files found in the ZIP archive.");
        }

        // Find the JSON file
        const jsonFile = zipFiles.files["natega.json"];

        if (jsonFile) {
          const jsonData = await jsonFile.async("text");
          setData(JSON.parse(jsonData));
        } else {
          setError("No JSON file found in the archive.");
        }
      } catch (error) {
        console.error("Error extracting file:", error);
        setError(`Error extracting file: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, []);

  const handleSearch = () => {
    if (!studentName) {
      alert("Please enter a student name");
      return;
    }

    if (data) {
      const foundResults = data.filter((item) =>
        item["الاسم"].startsWith(studentName)
      );

      setResults(
        foundResults.length > 0
          ? foundResults
          : [{ message: "No results found" }]
      );
    }
  };

  return (
    <div className="md:p-4">
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color={"#123abc"} loading={isLoading} size={150} />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <>
          <div className="grid grid-cols-12 gap-4">
            <h1 className="col-span-12 text-center text-2xl font-bold text-[#ed1b24]">
              نتيجة الثانوية العامة 2024 بالإسم
            </h1>
            <p className="col-span-12 text-center">ادخل اسم الطالب:</p>
            <div className="p-2 md:p-0 col-span-12 grid grid-cols-12 gap-4">
              <input
                type="text"
                id="studentName"
                className="col-span-8 p-2 border border-gray-300 rounded"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="col-span-4 bg-slate-700 text-white p-2 rounded"
              >
                النتيجة
              </button>
            </div>
          </div>
          {results.length > 0 && (
            <div className="mt-4">
              {results[0].message ? (
                <p>{results[0].message}</p>
              ) : (
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
                        <tr
                          key={index}
                          className="text-black hover:bg-gray-200"
                        >
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
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataFetching;
