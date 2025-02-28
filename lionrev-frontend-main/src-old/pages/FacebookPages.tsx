import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { LeadsTable } from "../components/LeadsTable";

function FbPage() {
  const [pages, setPages] = useState([]); // ✅ Step 1: Store user pages
  const [selectedPage, setSelectedPage] = useState(""); // ✅ Selected Page ID
  const [businessManagers, setBusinessManagers] = useState([]); // ✅ Step 2
  const [selectedBusinessManager, setSelectedBusinessManager] = useState("");
  const [adAccounts, setAdAccounts] = useState([]); // ✅ Step 3
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [selectedAd, setSelectedAd] = useState("");
  const [campaigns, setCampaigns] = useState([]); // ✅ Step 4
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const [ads, setAds] = useState([]); // ✅ Step 5
  const [leads, setLeads] = useState([]); // ✅ Step 6
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ✅ Step 1: Fetch Facebook Pages from Database
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchPages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/facebook/getPages`, {
          headers: { Authorization: `${token}` },
        });
        setPages(response.data);
      } catch (err) {
        setError("Failed to fetch Facebook pages");
      }
    };

    fetchPages();
  }, []);

  // ✅ Step 2: Fetch Business Managers when Page changes
  useEffect(() => {
    if (!selectedPage) return;
    localStorage.setItem("pageid", selectedPage);
    const fetchBusinessManagers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/facebook/business-managers?page_id=${selectedPage}`, {
          headers: { Authorization: `${token}` },
        });
        setBusinessManagers(response.data);
      } catch (err) {
        setError("Failed to fetch business managers");
      }
    };

    fetchBusinessManagers();
  }, [selectedPage]);

  // ✅ Step 3: Fetch Ad Accounts when Business Manager changes
  useEffect(() => {
    if (!selectedBusinessManager) return;

    const fetchAdAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/facebook/ad-accounts?business_manager_id=${selectedBusinessManager}`,
          { headers: { Authorization: `${token}` } }
        );
        setAdAccounts(response.data);
      } catch (err) {
        setError("Failed to fetch ad accounts");
      }
    };

    fetchAdAccounts();
  }, [selectedBusinessManager]);

  // ✅ Step 4: Fetch Campaigns when Ad Account changes
  useEffect(() => {
    if (!selectedAdAccount) return;
    const pageToken = localStorage.getItem("page_token"); // Retrieve stored page token

    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/facebook/campaigns?ad_account_id=${selectedAdAccount}`,
          {
            headers: {
              Authorization: `${token}`,
              "X-Page-Token": pageToken, // Pass the stored page token
            },
          }
        );
        setCampaigns(response.data);
      } catch (err) {
        setError("Failed to fetch campaigns");
      }
    };

    fetchCampaigns();
  }, [selectedAdAccount]);

  // ✅ Step 5: Fetch Ads when Campaign changes
  useEffect(() => {
    if (!selectedCampaign) return;
    const pageToken = localStorage.getItem("page_token");

    const fetchAds = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/facebook/ads?campaign_id=${selectedCampaign}`,
          {
            headers: {
              Authorization: `${token}`,
              "pagetoken": pageToken,
            },
          }
        );
        setAds(response.data);
      } catch (err) {
        setError("Failed to fetch ads");
      }
    };

    fetchAds();
  }, [selectedCampaign]);

  // ✅ Step 6: Fetch Leads when Campaign changes
  useEffect(() => {
    if (!selectedAd) return;
    const pageToken = localStorage.getItem("page_token");

    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/facebook/leads?ad_id=${selectedAd}&page_id=${selectedPage}`,
          {
            headers: {
              Authorization: `${token}`,
              "pageid": pageToken,
            },
          }
        );
        setLeads(response.data);
      } catch (err) {
        setError("Failed to fetch leads");
      }
    };

    fetchLeads();
  }, [selectedAd]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Header />

        {/* ✅ Facebook Page Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Select Facebook Page</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
          >
            <option value="">-- Select Page --</option>
            {pages.map((page) => (
              <option key={page.page_id} value={page.page_id}>
                {page.page_name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Business Manager Selection */}
        {selectedPage && (
          <div className="mb-4">
            <label className="block text-gray-700">Select Business Manager</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedBusinessManager}
              onChange={(e) => setSelectedBusinessManager(e.target.value)}
            >
              <option value="">-- Select Business Manager --</option>
              {businessManagers.map((bm) => (
                <option key={bm.id} value={bm.id}>
                  {bm.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ✅ Ad Accounts Selection */}
        {selectedBusinessManager && (
          <div className="mb-4">
            <label className="block text-gray-700">Select Ad Account</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedAdAccount}
              onChange={(e) => setSelectedAdAccount(e.target.value)}
            >
              <option value="">-- Select Ad Account --</option>
              {adAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ✅ Campaign Selection */}
        {selectedAdAccount && campaigns.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700">Select Campaign</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              <option value="">-- Select Campaign --</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        )}


        {/* ✅ Ad Selection */}
{selectedCampaign && ads.length > 0 && (
    <div className="mb-4">
      <label className="block text-gray-700">Select Ad</label>
      <select
        className="w-full p-2 border rounded"
        value={selectedAd}
        onChange={(e) => setSelectedAd(e.target.value)}
      >
        <option value="">-- Select Ad --</option>
        {ads.map((ad) => (
          <option key={ad.id} value={ad.id}>
            {ad.name}
          </option>
        ))}
      </select>
    </div>
  )}
      </div>
    </div>
  );
}

  

export default FbPage;
