const TableLoading = () => {
  // Generate 10 rows to match your screenshot
  const rows = Array.from({ length: 10 });
  const widthClasses = ["w-[24%]", "w-[31%]", "w-[28%]", "w-[35%]"];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Table Header Placeholder */}
      <div className="bg-[#F1F5F9] h-12 flex items-center px-6 gap-4">
        <div className="w-8 h-4 bg-gray-300 rounded" /> {/* SL */}
        <div className="w-32 h-4 bg-gray-300 rounded" /> {/* Universities */}
        <div className="ml-auto w-32 h-4 bg-gray-300 rounded" />{" "}
        {/* Psychology */}
        <div className="w-32 h-4 bg-gray-300 rounded" /> {/* Neuroscience */}
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-gray-50">
        {rows.map((_, index) => (
          <div
            key={index}
            className={`flex items-center px-6 py-4 gap-4 ${index % 2 === 1 ? "bg-[#F8FAFC]/50" : "bg-white"}`}
          >
            {/* SL Column */}
            <div className="w-8 h-4 bg-gray-200 rounded" />

            {/* University Name Column - Staggered widths for realism */}
            <div
              className={`h-4 bg-gray-200 rounded ${widthClasses[index % widthClasses.length]}`}
            />

            {/* Degree Columns */}
            <div className="ml-auto flex gap-2">
              <div className="w-16 h-4 bg-gray-100 rounded" />
            </div>
            <div className="w-24 flex justify-start">
              <div className="w-8 h-4 bg-gray-100 rounded opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableLoading;
