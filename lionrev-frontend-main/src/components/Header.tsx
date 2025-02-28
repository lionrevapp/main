import { useState, useEffect } from "react";
import { Filter, Columns2, LogOut } from "lucide-react";
import { ToggleButton } from "./ToggleButton";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
export const Header = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const navigate = useNavigate();

// yasir code
const [showSelectionPopup, setShowSelectionPopup] = useState(false);
const [businesses, setBusinesses] = useState([]);
const [selectedBusinessId, setSelectedBusinessId] = useState(null);
const [adAccounts, setAdAccounts] = useState([]);
const [selectedAdAccounts, setSelectedAdAccounts] = useState([]); // ✅ Multi-selection

const handleFacebookLogin = async () => {
  if (!window.FB) {
    console.error("Facebook SDK is NOT available.");
    return;
  }

  console.log("Opening Facebook Login Popup ✅");

  window.FB.login(
    (response) => {
      if (response.authResponse) {
        const fbToken = response.authResponse.accessToken;

        // Store Token
        updateFbToken(localStorage.getItem("token"), fbToken)
          .then(() => {
            const fblongtoken = localStorage.getItem("fbAccessToken");

            // ✅ Fetch Business Managers
            window.FB.api(
              "/me/businesses",
              "GET",
              { access_token: fblongtoken },
              (businessResponse) => {
                if (businessResponse?.data?.length > 0) {
                  setBusinesses(businessResponse.data);
                  setShowSelectionPopup(true); // Show selection popup
                } else {
                  console.error("No Business Managers found.");
                }
              }
            );
          })
          .catch((error) => console.error("Error updating token:", error));
      } else {
        console.error("User did not authorize the app.");
      }
    },
    {
      scope:
        "business_management,ads_management,ads_read,public_profile,email",
    }
  );
};

const handleBusinessSelection = (businessId) => {
  setSelectedBusinessId(businessId);
  const fblongtoken = localStorage.getItem("fbAccessToken");

  // ✅ Fetch Ad Accounts for Selected Business
  window.FB.api(
    `/${businessId}/owned_ad_accounts?fields=id,name`,
    "GET",
    { access_token: fblongtoken },
    (adResponse) => {
      if (adResponse?.data?.length > 0) {
        setAdAccounts(adResponse.data);
      } else {
        console.error("No Ad Accounts found.");
      }
    }
  );
};


const handleAdAccountSelection = (account) => {
  setSelectedAdAccounts((prev) => {
    // Check if the account is already selected
    const exists = prev.some((a) => a.id === account.id);
    if (exists) {
      return prev.filter((a) => a.id !== account.id); // Unselect if already selected
    }
    return [...prev, account]; // Otherwise, add the full account object
  });
};

const fetchCampaignsForAdAccounts = async (adAccounts) => {
  const fblongtoken = localStorage.getItem("fbAccessToken");

  const campaigns = [];

  for (const account of adAccounts) {
    try {
      const response = await new Promise((resolve) => {
        window.FB.api(
          `/${account.id}/campaigns?fields=id,name`,
          "GET",
          { access_token: fblongtoken },
          (campaignResponse) => resolve(campaignResponse)
        );
      });

      if (response?.data?.length > 0) {
        response.data.forEach((campaign) => {
          campaigns.push({
            accountId: account.id,
            campaignId: campaign.id,
            name: campaign.name,
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching campaigns for account ${account.id}:`, error);
    }
  }

  return campaigns;
};

const handleFinalSelection = async () => {
  const userId = localStorage.getItem("token"); // Assuming you store user ID in localStorage
  if (!selectedBusinessId || selectedAdAccounts.length === 0) {
    alert("Please select a Business Manager and at least one Ad Account.");
    return;
  }
  
  const campaigns = await fetchCampaignsForAdAccounts(selectedAdAccounts);

  console.log("Payload being sent:", JSON.stringify({
    userId,
    businessManagerId: selectedBusinessId,
    adAccounts: selectedAdAccounts,
    campaigns,
  }, null, 2));

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facebook/save-facebook-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        businessManagerId: selectedBusinessId,
        adAccounts: selectedAdAccounts.map(({ id, name }) => ({ id, name })),
        campaigns,
      }),
    });

    const result = await response.json();
    console.log("Server Response:", result);

    if (response.ok) {
      alert("Data saved successfully!");
      setShowSelectionPopup(false); // Close popup after saving
    } else {
      alert("Failed to save data.");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// end yasir code

  
  

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fbUser");
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/");
  };

  // Facebook Login Callback
  const responseFacebook = async (response) => {
    if (response.accessToken) {
      setUser(response);
      localStorage.setItem("fbUser", JSON.stringify(response));
  
      try {
        const { data } = await axios.get(
          `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${response.accessToken}`
        );
        localStorage.setItem("fbAdAccounts", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching Facebook Ad Accounts:", error);
      }
    }
  };



  
  // const savePageTokens = async (userId, pages) => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facebook/savePageTokens`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId, pages }),
  //     });
  
  //     const data = await response.json();
  //     console.log("Page Tokens Saved:", data);
  //   } catch (error) {
  //     console.error("Error saving page tokens:", error);
  //   }
  // };


  const savePageTokens = async (userId, pages) => {
    const longLivedPages = [];
  
    for (const page of pages) {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${page.id}?  
          fields=access_token&  
          access_token=${page.access_token}`
        );
  
        const data = await response.json();
        if (data.access_token) {
          longLivedPages.push({
            id: page.id,
            name: page.name,
            access_token: data.access_token, // Long-lived token
          });
        }
      } catch (error) {
        console.error("Error exchanging page token:", error);
      }
    }
  
    // Now send the long-lived tokens to your backend
    await fetch(`${import.meta.env.VITE_API_URL}/api/facebook/savePageTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, pages: longLivedPages }),
    });
  
    console.log("Long-Lived Page Tokens Saved ✅:", longLivedPages);
  };
  
  
  
  // const updateFbToken = async (userId,fbToken) =>{
   

  //   try {
  //     const url = `${import.meta.env.VITE_API_URL}/api/facebook/updateFbToken`;
  //     const res = await axios.post(url, { fbToken, userId });
  //     setUser(res.data);
  //     console.log("API Response:", res.data);
  //   } catch (error) {
  //     console.error("Error updating FB token:", error);
  //   }
  // };


  

  const updateFbToken = async (userId, shortLivedToken) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?  
        grant_type=fb_exchange_token&  
        client_id=1250020949408627&  
        client_secret=80ef236e4c6e4c1ea96a3f2e52004102&  
        fb_exchange_token=${shortLivedToken}`
      );
  
      const data = await response.json();
      if (data.access_token) {
        const longLivedToken = data.access_token;
        localStorage.setItem("fbAccessToken", longLivedToken);
        // Now send the long-lived token to your backend
        await fetch(`${import.meta.env.VITE_API_URL}/api/facebook/updateFbToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, fbToken: longLivedToken }),
        });
  
        console.log("Long-Lived Token Saved ✅:", longLivedToken);
      } else {
        console.error("Failed to exchange token:", data);
      }
    } catch (error) {
      console.error("Error fetching long-lived token:", error);
    }
  };
  

  const deletefbuser = async (userId) =>{
   

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/facebook/deleteFbToken`;
      const res = await axios.post(url, {  userId });
      setUser(res.data);
      console.log("API Response:", res.data);
    } catch (error) {
      console.error("Error updating FB token:", error);
    }
  };
  

  // Load User from Local Storage
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const toke = localStorage.getItem("token");
    const fbAccessToken = localStorage.getItem("fbAccessToken");

    setUser({ name: userName,token:toke,fbAccessToken:fbAccessToken });
  
    if (window.FB) {
      setSdkLoaded(true);
      return;
    }
  
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1250020949408627", // Your Facebook App ID
        cookie: true,
        xfbml: true,
        version: "v18.0", // Ensure valid version
      });
      setSdkLoaded(true);
    };
  
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    const storedFbUser = localStorage.getItem("fbUser");
    const token = localStorage.getItem("token");
    
    // if (storedFbUser) {
    //   setUser(JSON.parse(storedFbUser));
    // } else if (token) {
    //   setUser({ name: userName });
    // } else {
    //   setUser(null);
    // }
  }, []);

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-4">
        {["Sales", "Quotes", "Leads", "Calls"].map((item) => (
          <button
            key={item}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => setShowDialog(true)}
        >
          <Columns2 className="w-4 h-4 mr-2" />
          Columns
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Date Filter
        </button>

        {/* Show User if Logged in */}
      
          <div className="flex items-center space-x-4">
         
            <span className="font-semibold">{user?.name ?? "Loading..."}</span>
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
          
  


{user?.fbAccessToken && user?.fbAccessToken !== "null" ? (

<button
  onClick={async () => {
    const fbAccessToken = localStorage.getItem("fbAccessToken"); // Retrieve stored token

  

    try {
      // Revoke the Facebook access token
      const response = await fetch(
        `https://graph.facebook.com/me/permissions?access_token=${fbAccessToken}`,
        { method: "DELETE" }
      );

      const result = await response.json();
      console.log("Logout Response:", result);

      if (result.success) {
        // Clear local storage
        localStorage.removeItem("fbAccessToken");
      
        const toke = localStorage.getItem("token");

        // Optionally, call your API to delete the Facebook user
        deletefbuser(toke);

        // Reload page to ensure logout
        window.location.reload();
      } else {
        console.error("Failed to log out from Facebook:", result);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }}
  className="px-4 py-2 bg-red-600 text-white rounded-md"
>
  Disconnect Facebook
</button>

) : (

  <div>
  <button
    onClick={handleFacebookLogin}
    className="px-4 py-2 bg-blue-600 text-white rounded-md"
  >
    Login with Facebook
  </button>

  {/* ✅ Selection Popup */}
  {showSelectionPopup && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-2">Select Business & Ad Accounts</h2>

        {/* Business Selection */}
        <label className="block mb-2">Business Manager</label>
        <select
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => handleBusinessSelection(e.target.value)}
        >
          <option value="">Select Business Manager</option>
          {businesses.map((biz) => (
            <option key={biz.id} value={biz.id}>
              {biz.name}
            </option>
          ))}
        </select>

        {/* Ad Account Selection */}
        <label className="block mb-2">Ad Accounts</label>
        <div className="border p-2 rounded mb-4 max-h-40 overflow-y-auto">
          {adAccounts.map((account) => (
            <div key={account.id} className="flex items-center mb-2">
             <input
              type="checkbox"
              id={account.id}
              checked={selectedAdAccounts.some((a) => a.id === account.id)}
              onChange={() => handleAdAccountSelection(account)}
              className="mr-2"
            />

              <label htmlFor={account.id}>{account.name}</label>
            </div>
          ))}
        </div>

        {/* Confirm Selection */}
        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={handleFinalSelection}
          disabled={!selectedAdAccounts.length}
        >
          Continue
        </button>
      </div>
    </div>
  )}
</div>


  /*
<button
  onClick={() => {
    if (sdkLoaded && window.FB) {
      console.log("Manually calling FB.login 2323 ✅",user);
      window.FB.login(
        // { scope: "public_profile,email" }
         
         (response) => { 
          console.log("Manual Login Response:", response.authResponse);
          if (response.authResponse) {
            const fbToken = response.authResponse.accessToken;
            const toke = localStorage.getItem("token");
            const userId = toke; // Replace with the actual user ID
    
      const userName = localStorage.getItem("userName");


  
      setUser({ name: userName,token:toke,fbAccessToken:fbToken });
            // Call your API to update the Facebook token
         updateFbToken(userId,fbToken);
var fblongtoken = localStorage.getItem("fbAccessToken");
         window.FB.api(
          "/me/accounts",
          "GET",
          { access_token: fblongtoken },
          (pageResponse) => {
            console.log("Pages Response:", pageResponse);
            if (pageResponse && pageResponse.data) {
              // Send Page Tokens to Backend
              savePageTokens(userId, pageResponse.data);
            }
          }
        );

          }

        },
        {
          config_id: '935117665471322' // right
          // configId: '<CONFIG_ID>' // wrong
        },
        {
          scope: "pages_show_list,pages_manage_ads,leads_retrieval,pages_read_engagement,public_profile,email"
        }        
      );
    } else {
      console.error("Facebook SDK is NOT available.");
    }
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded-md"
>
  Connect Facebook
</button>
*/
)}
      </div>

      {/* Dialog for Column Filters */}
      {showDialog && (
        <div
          className="fixed inset-0 m-auto my-auto bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowDialog(false)}
        >
          <div className="bg-white p-4 rounded-lg space-y-4" onClick={(e) => e.stopPropagation()}>
            {["Full Name", "Email", "Phone", "Service", "Zip", "Created Date"].map((field) => (
              <div key={field} className="flex justify-between items-center space-x-4">
                <span>{field}</span>
                <ToggleButton />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
