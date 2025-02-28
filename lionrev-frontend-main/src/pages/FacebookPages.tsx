import React, { useState, useEffect } from "react";

const FbPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: "",
    channel: "",
    campaignType: "",
    adSet: "",
    adName: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("token"); // Get user ID from localStorage

    if (!userId) {
      console.error("No user token found!");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/facebook/campaigns?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((err) => console.error("Error fetching campaigns:", err));
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      (!filters.dateRange || campaign.date === filters.dateRange) &&
      (!filters.channel || campaign.channel.includes(filters.channel)) &&
      (!filters.campaignType || campaign.type === filters.campaignType) &&
      (!filters.adSet || campaign.adSet === filters.adSet) &&
      (!filters.adName || campaign.name.includes(filters.adName))
    );
  });

  return (
    <div className="flex">
      {/* Sidebar Filters */}
      <div className="w-1/4 p-4 bg-purple-200 rounded-md">
        <h3 className="text-lg font-bold">Filters</h3>
        <label>Data Range:</label>
        <input type="date" name="dateRange" onChange={handleFilterChange} className="block w-full p-2 mb-2" />
        <label>Channel:</label>
        <input type="text" name="channel" onChange={handleFilterChange} className="block w-full p-2 mb-2" />
        <label>Campaign Type:</label>
        <input type="text" name="campaignType" onChange={handleFilterChange} className="block w-full p-2 mb-2" />
        <label>Ad Sets:</label>
        <input type="text" name="adSet" onChange={handleFilterChange} className="block w-full p-2 mb-2" />
        <label>Ad Name:</label>
        <input type="text" name="adName" onChange={handleFilterChange} className="block w-full p-2" />
      </div>

      {/* Campaigns Table */}
      <div className="w-3/4 p-4">
        <table className="w-full border border-gray-300">
          <thead className="bg-purple-300">
            <tr>
              <th className="p-2 border">Campaign</th>
              <th className="p-2 border">Spend</th>
              <th className="p-2 border">Clicks</th>
              <th className="p-2 border">CPC</th>
              <th className="p-2 border">CTR</th>
              <th className="p-2 border">CPM</th>
              <th className="p-2 border">Leads</th>
              <th className="p-2 border">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{campaign.name}</td>
                <td className="p-2 border">${campaign.spend}</td>
                <td className="p-2 border">{campaign.clicks}</td>
                <td className="p-2 border">${campaign.cpc}</td>
                <td className="p-2 border">{campaign.ctr}%</td>
                <td className="p-2 border">${campaign.cpm}</td>
                <td className="p-2 border">{campaign.leads}</td>
                <td className="p-2 border">${campaign.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FbPage;
