import React from "react";

const PricingTable = () => {
    const pricingData = [
        {
            service: "Request Upgrade",
            rate: "10 GP",
            value: "+100 Requests",
        },
        {
            service: "Storage Upgrade",
            rate: "10 GP",
            value: "+10 MB Storage",
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                Bảng giá
            </h2>
            <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Rate
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pricingData.map((item, index) => (
                        <tr key={index} className="bg-white">
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                {item.service}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                {item.rate}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                {item.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PricingTable;
