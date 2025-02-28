import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

// router.get("/getPages", async (req, res) => {
//     const userId = req.headers.authorization; // Ensure you're using auth middleware
  
//     try {
//       // Fetch Facebook pages from the database
//       const pages = await db.query(
//         "SELECT page_id, page_name, page_access_token FROM fb_pages WHERE user_id = $1",
//         [userId]
//       );
  
//       if (!pages.rows.length) {
//         return res.status(404).json({ error: "No pages found for this user" });
//       }
  
//       res.json(pages.rows); // Return pages from the database
//     } catch (error) {
//       console.error("Error fetching Facebook Pages from DB:", error);
//       res.status(500).json({ error: "Failed to fetch pages from database" });
//     }
//   });


// const axios = require("axios");

router.get("/getPages", async (req, res) => {
  const userAccessToken = req.headers.authorization; // User's short-lived token

  const user = await db.query("SELECT * FROM users WHERE id = $1", [userAccessToken]);
      
      var usertoken =  user.rows[0].fb_access_token;



  try {
    // 1️⃣ Fetch Pages using the user's short-lived usertoken
    const fbResponse = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?access_token=${usertoken}`, {
     
    });

    if (!fbResponse.data || !fbResponse.data.data.length) {
      return res.status(404).json({ error: "No pages found for this user" });
    }

    const pages = fbResponse.data.data;
    const queries = [];


    for (const page of pages) {
        // const longTokenResponse = await axios.get(`https://graph.facebook.com/v22.0/${page.id}`, {
        //   params: {
        //     fields: "access_token",
        //     access_token: page.access_token, // Short-lived page token
        //   },
        // });


        const longTokenResponse = await axios.get(
            `https://graph.facebook.com/v22.0/oauth/access_token`,
            {
              params: {
                grant_type: "fb_exchange_token",
                client_id: "1250020949408627",
                client_secret: "80ef236e4c6e4c1ea96a3f2e52004102",
                fb_exchange_token: page.access_token, // short-lived token
              },
            }
          );
  
        const longLivedToken = longTokenResponse.data.access_token;
  
        // 3️⃣ Save the page details & long-lived token in DB
        queries.push(
          db.query(
            `INSERT INTO fb_pages (user_id, page_id, page_name, page_access_token)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (page_id) 
             DO UPDATE SET page_access_token = EXCLUDED.page_access_token`,
            [userAccessToken, page.id, page.name, longLivedToken]
          )
        );
      }
  
      await Promise.all(queries);

      const pages2 = await db.query(
                "SELECT page_id, page_name, page_access_token FROM fb_pages WHERE user_id = $1",
                [userAccessToken]
              );
          
              if (!pages2.rows.length) {
                return res.status(404).json({ error: "No pages found for this user" });
              }
          
              res.json(pages2.rows); 

  } catch (error) {
    console.error("Error fetching Facebook Pages:", error.response?.data || error);
    res.status(500).json({ error: error.response?.data  });
  }
});

  

router.post("/updateFbToken", async (req, res) => {
    const { userId, fbToken } = req.body;
  
    if (!userId || !fbToken) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
  
      // Insert into database
      const result = await db.query(
        "UPDATE users SET fb_access_token = $1 WHERE id = $2 RETURNING *",
        [fbToken, userId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }


    //   const adAccountsResponse = await fetch(
    //     `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name&access_token=${fbToken}`
    // );
    // const adAccountsData = await adAccountsResponse.json();

    // if (!adAccountsData.data) {
    //     return res.status(500).json({ error: "Failed to fetch ad accounts" });
    // }

    // for (const account of adAccountsData.data) {
    //     await db.query(
    //         `INSERT INTO fb_ad_accounts (user_id, account_id, account_name) VALUES ($1, $2, $3)
    //         ON CONFLICT (account_id) DO NOTHING`,
    //         [userId, account.id, account.name]
    //     );

    //     // Fetch Campaigns for Each Ad Account
    //     const campaignsResponse = await fetch(
    //         `https://graph.facebook.com/v18.0/${account.id}/campaigns?fields=id,name,status,objective,created_time&access_token=${fbToken}`
    //     );
    //     const campaignsData = await campaignsResponse.json();

    //     if (campaignsData.data) {
    //         for (const campaign of campaignsData.data) {
    //             await db.query(
    //                 `INSERT INTO fb_campaigns (user_id, account_id, campaign_id, campaign_name, status, objective, created_time) 
    //                 VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (campaign_id) DO NOTHING`,
    //                 [userId, account.id, campaign.id, campaign.name, campaign.status, campaign.objective, campaign.created_time]
    //             );

    //             // Fetch Ads for Each Campaign
    //             const adsResponse = await fetch(
    //                 `https://graph.facebook.com/v18.0/${campaign.id}/ads?fields=id,name,spend,clicks,cpc,ctr,cpm,leads,revenue&access_token=${fbToken}`
    //             );
    //             const adsData = await adsResponse.json();

    //             if (adsData.data) {
    //                 for (const ad of adsData.data) {
    //                     await db.query(
    //                         `INSERT INTO fb_ads (user_id, campaign_id, ad_id, ad_name, spend, clicks, cpc, ctr, cpm, leads, revenue)
    //                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    //                         ON CONFLICT (ad_id) DO NOTHING`,
    //                         [
    //                             userId,
    //                             campaign.id,
    //                             ad.id,
    //                             ad.name,
    //                             ad.spend || 0,
    //                             ad.clicks || 0,
    //                             ad.cpc || 0,
    //                             ad.ctr || 0,
    //                             ad.cpm || 0,
    //                             ad.leads || 0,
    //                             ad.revenue || 0,
    //                         ]
    //                     );
    //                 }
    //             }
    //         }
    //     }
    // }



      res.status(201).json({ message: "User token successfully", user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });


 

  router.post("/save-facebook-data", async (req, res) => {
    const { userId, businessManagerId, adAccounts, campaigns } = req.body;
  
    if (!userId || !businessManagerId || !adAccounts || adAccounts.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // await db.query("DELETE FROM business_managers WHERE user_id = $1", [userId]);
    // await db.query("DELETE FROM ad_accounts WHERE user_id = $1", [userId]);
    // await db.query("DELETE FROM campaigns WHERE user_id = $1", [userId]);
    // await db.query("DELETE FROM ads WHERE user_id = $1", [userId]);
    // await db.query("DELETE FROM leads WHERE user_id = $1", [userId]);
  
    try {
      // ✅ Store Business Manager
      const businessQuery = `
        INSERT INTO business_managers (user_id, business_manager_id) 
        VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE SET business_manager_id = EXCLUDED.business_manager_id
      `;
      await db.query(businessQuery, [userId, businessManagerId]);
  
      // ✅ Store Ad Accounts (Bulk Insert)
      const adAccountValues = [];
      const adAccountPlaceholders = adAccounts.map((_, i) => {
        const baseIndex = i * 3 + 1;
        adAccountValues.push(userId, adAccounts[i].id, adAccounts[i].name);
        return `($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2})`;
      }).join(",");
  
      if (adAccountValues.length > 0) {
        const adAccountQuery = `
          INSERT INTO ad_accounts (user_id, account_id, name)
          VALUES ${adAccountPlaceholders}
          ON CONFLICT (account_id) DO UPDATE SET name = EXCLUDED.name;
        `;
        await db.query(adAccountQuery, adAccountValues);
      }
  
      // ✅ Store Campaigns (Bulk Insert)
      if (campaigns.length > 0) {
        const campaignValues = [];
        const campaignPlaceholders = campaigns.map((_, i) => {
          const baseIndex = i * 4 + 1;
          campaignValues.push(userId, campaigns[i].accountId, campaigns[i].campaignId, campaigns[i].name);
          return `($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
        }).join(",");
  
        const campaignQuery = `
          INSERT INTO campaigns (user_id, account_id, campaign_id, name)
          VALUES ${campaignPlaceholders}
          ON CONFLICT (campaign_id) DO UPDATE SET name = EXCLUDED.name;
        `;
        await db.query(campaignQuery, campaignValues);
      }
  
      res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ message: "Internal Server Error", details: error.message, stack: error.stack });
    }
  });
  

  router.post("/savePageTokens", async (req, res) => {
    const { userId, pages } = req.body;
  
    if (!userId || !pages || pages.length === 0) {
      return res.status(400).json({ error: "Invalid request data" });
    }
  
    try {
      const queries = pages.map((page) => {
        return db.query(
          `INSERT INTO fb_pages (user_id, page_id, page_name, page_access_token)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (page_id) 
           DO UPDATE SET page_access_token = EXCLUDED.page_access_token`,
          [userId, page.id, page.name, page.access_token]
        );
      });
  
      await Promise.all(queries);
  
      res.status(201).json({ message: "Page tokens saved successfully" });
    } catch (error) {
      console.error("Error saving page tokens:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  router.post("/deleteFbToken", async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
  
      // Insert into database
      const result = await db.query(
        "UPDATE users SET fb_access_token = $1 WHERE id = $2 RETURNING *",
        ['null', userId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(201).json({ message: "User token successfully", user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });



  router.get("/business-managers", async (req, res) => {
    try {
        const userId = req.headers.authorization; // Assuming this is the user ID
        const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const page_id = req.query.page_id;
        if (!user.rows.length || !user.rows[0].fb_access_token) {
            return res.status(401).json({ error: "Not connected to Facebook" });
        }

        const accessToken = user.rows[0].fb_access_token;

        // Step 1: Get Business Managers
        const response = await axios.get(
            // `https://graph.facebook.com/v22.0/me/businesses?&access_token=${accessToken}`,
           `https://graph.facebook.com/v22.0/${page_id}?fields=business&access_token=${accessToken}`,

            { timeout: 10000 }
        );

        if (!response.data.business) {
            return res.status(404).json({ error: "No business managers found" });
        }

        const businessManagers = Array.isArray(response.data.business)
        ? response.data.business
        : [response.data.business];

        res.json(businessManagers);
    } catch (error) {
        console.error("Error fetching business managers:", error);
        res.status(500).json({
            error: `https://graph.facebook.com/v22.0/${page_id}?fields=business&access_token==${accessToken}`,
            details: error.message,
            stack: error.stack,
        });
    }
});


// router.get("/ad-accounts", async (req, res) => {
//     try {
//         const userId = req.headers.authorization;
//         const businessManagerId = req.query.business_manager_id; // Get Business Manager ID from query params

//         if (!businessManagerId) {
//             return res.status(400).json({ error: "Business Manager ID is required" });
//         }

//         const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

//         if (!user.rows.length || !user.rows[0].fb_access_token) {
//             return res.status(401).json({ error: "Not connected to Facebook" });
//         }

//         const accessToken = user.rows[0].fb_access_token;

//         // Step 2: Get Ad Accounts under the selected Business Manager
//         const response = await axios.get(
//             `https://graph.facebook.com/v22.0/${businessManagerId}/owned_ad_accounts?access_token=${accessToken}`,
//             { timeout: 10000 }
//         );

//         if (!response.data.data || response.data.data.length === 0) {
//             return res.status(404).json({ error: "No ad accounts found" });
//         }

//         const adAccounts = response.data.data.map(account => ({
//             id: account.id,
//             name: account.name || `Ad Account ${account.id}`
//         }));

//         res.json(adAccounts);
//     } catch (error) {
//         console.error("Error fetching ad accounts:", error);
//         res.status(500).json({
//             error: "Failed to fetch ad accounts",
//             details: error.message,
//             stack: error.stack,
//         });
//     }
// });


// Fetch All Campaign Data (Including Leads, Ads, Clicks, Revenue)
// router.get("/campaigns", async (req, res) => {
//     var  accessToken = '';
//     const ad_account_id = req.query.ad_account_id;

//     try {
//         const userId = req.headers.authorization;
//         const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

//         if (!user.rows.length || !user.rows[0].fb_access_token) {
//             return res.status(401).json({ error: "Not connected to Facebook" });
//         }

//          accessToken = user.rows[0].fb_access_token;

  

//         let allCampaigns = [];
//        // allCampaigns.push(adAccountsResponse.data.data);
//         // Step 2: Fetch campaigns for each ad account separately
       
     
//             //allCampaigns.push(`https://graph.facebook.com/v22.0/${account.id}/campaigns?fields=id,name,spend,clicks,leads&access_token=${accessToken}`);
//             try {
//                 const campaignsResponse = await axios.get(`https://graph.facebook.com/v22.0/${ad_account_id}/campaigns?fields=id,name,spend,leads&access_token=${accessToken}`, {
//                    // params: { access_token: accessToken, fields: "id,name,spend,clicks,leads" },
//                     timeout: 10000
//                 });
              
//                 // allCampaigns.push(campaignsResponse.data.data);
//                 if (campaignsResponse.data.data) {
                
//                     for (const campaign of campaignsResponse.data.data) {
//                         // await db.query(
//                         //     `INSERT INTO campaigns (user_id, campaign_id, name, spend, clicks, lead_count) 
//                         //      VALUES ($1, $2, $3, $4, $5, $6)
//                         //      ON CONFLICT (campaign_id) DO UPDATE 
//                         //      SET spend = EXCLUDED.spend, clicks = EXCLUDED.clicks, lead_count = EXCLUDED.lead_count`,
//                         //     [userId, campaign.id, campaign.name, campaign.spend || 0, campaign.clicks || 0, campaign.leads || 0]
//                         // );
//                         allCampaigns.push(campaign);
//                     }
//                 }
//             } catch (err) {
//                 // res.status(500).json({
//                 //     error: "Failed to fetch campaigns",
//                 //     details: accessToken,
//                 //     stack: err.stack, // Add full error stack for debugging
//                 // });
//                 console.error(`Error fetching campaigns for ad account ${ad_account_id}:`, err.message);
//             }
        

//         res.json(allCampaigns);
//     } catch (error) {
//         console.error("Error fetching campaigns:", error);
//         res.status(500).json({
//             error: "Failed to fetch campaigns",
//             details: accessToken,
//             stack: error.stack, // Add full error stack for debugging
//         });
//     }
// });



router.get('/ad-accounts', async (req, res) => {
    const userId = req.query.user_id;
  
    try {
      const adAccounts = await db.query('SELECT account_id, account_name FROM fb_ad_accounts WHERE user_id = $1', [userId]);
      res.json(adAccounts.rows);
    } catch (error) {
      console.error("Error fetching ad accounts:", error);
      res.status(500).json({ error: "Failed to fetch ad accounts" });
    }
  });
  
  // Get campaign types
  router.get('/campaign-types', async (req, res) => {
    const userId = req.query.user_id;
  
    try {
      // Assuming you have a campaign_types table or similar
      const campaignTypes = await db.query('SELECT DISTINCT objective FROM fb_campaigns WHERE user_id = $1', [userId]);
      res.json(campaignTypes.rows.map(row => row.objective)); // Extract objective for campaign types
    } catch (error) {
      console.error("Error fetching campaign types:", error);
      res.status(500).json({ error: "Failed to fetch campaign types" });
    }
  });
  
  // Get campaigns based on filters
  router.get('/campaigns', async (req, res) => {
    const { user_id, adName, dateRange, channel, campaignType, adSet } = req.query;
  
    try {
      const filters = [];
      const filterValues = [];
  
      // Build the SQL query with filters
      let query = 'SELECT * FROM campaigns WHERE user_id = $1';
      filterValues.push(user_id);
  
      if (adName) {
        filters.push('campaign_name ILIKE $' + (filterValues.length + 1));
        filterValues.push(`%${adName}%`);
      }
      if (channel) {
        filters.push('account_id = $' + (filterValues.length + 1));
        filterValues.push(channel);
      }
      if (campaignType) {
        filters.push('objective = $' + (filterValues.length + 1));
        filterValues.push(campaignType);
      }
      // Add more filters as needed...
  
      if (filters.length > 0) {
        query += ' AND ' + filters.join(' AND ');
      }
  
      const campaigns = await db.query(query, filterValues);
      res.json(campaigns.rows);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns",
        details: error.message,

       });
    }
  });
  


// Fetch Ad-Level Data (Including Leads, Revenue)

router.get("/ads", async (req, res) => {
    const userId = req.headers.authorization;
    const pageid = req.headers.pagetoken;

    const campaignId = req.query.campaign_id;

    try {

        
        // Get user from the database
        const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

        // Check if user exists and has a Facebook token
        if (!user.rows.length || !user.rows[0].fb_access_token) {
            return res.status(401).json({ error: "Not connected to Facebook" });
        }

        const fbToken = user.rows[0].fb_access_token;
        let allAds = [];

        // Fetch ads for the given campaign
        try {
            const response = await axios.get(`https://graph.facebook.com/v22.0/${campaignId}/ads?fields=id,name,spend&access_token=${fbToken}`, {
                timeout: 10000,
            });

            if (response.data.data && response.data.data.length > 0) {
                for (const ad of response.data.data) {
                    allAds.push({
                        id: ad.id,
                        name: ad.name,
                        spend: ad.spend || 0,
                        clicks: ad.clicks || 0,
                        leads: ad.leads || 0,
                    });

                    // Optional: Store the data in the database
                    // await db.query(
                    //     `INSERT INTO ads (ad_id, name, spend, clicks, lead_count) 
                    //      VALUES ($1, $2, $3, $4, $5)
                    //      ON CONFLICT (ad_id) DO UPDATE 
                    //      SET spend = EXCLUDED.spend, clicks = EXCLUDED.clicks, lead_count = EXCLUDED.lead_count`,
                    //     [ad.id, ad.name, ad.spend || 0, ad.clicks || 0, ad.leads || 0]
                    // );
                }
            } else {
                return res.status(400).json({ error: "No ads found for this campaign" });
            }
        } catch (err) {
            console.error(`Error fetching ads for campaign ${campaignId}:`, err.message);
            return res.status(500).json({
                error: `https://graph.facebook.com/v22.0/${campaignId}/ads?fields=id,name,spend,clicks,leads&access_token=${fbToken}`,
                details: err.message,
            });
        }

        res.json(allAds);
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).json({
            error: `https://graph.facebook.com/v22.0/${campaignId}/ads?fields=id,name,spend,clicks,leads&access_token=${fbToken}`,
            details: error.stack,
        });
    }
});

// Fetch Leads
// router.get("/leads", async (req, res) => {
//     try {
//         const user = await db.query("SELECT * FROM users WHERE id = $1", [req.user.userId]);
//         if (!user.rows.length || !user.rows[0].fb_access_token) return res.status(401).json({ error: "Not connected to Facebook" });

//         const response = await axios.get(`https://graph.facebook.com/v22.0/me/adaccounts?fields=leads{id,created_time}`, {
//             params: { access_token: user.rows[0].fb_access_token }
//         });

//         for (const lead of response.data.leads.data) {
//             await db.query(
//                 `INSERT INTO leads (ad_id, lead_id) VALUES ($1, $2)
//                  ON CONFLICT (lead_id) DO NOTHING`,
//                 [req.user.adId, lead.id]
//             );
//         }

//         res.json(response.data.leads.data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch leads data" });
//     }
// });

router.get("/leads", async (req, res) => {
    const { ad_id, page_id } = req.query;
  var pageAccessToken = '';
    if (!ad_id || !page_id) {
      return res.status(400).json({ error: "Ad ID and Page ID are required" });
    }
  
    try {
      const page = await db.query("SELECT page_access_token FROM fb_pages WHERE page_id = $1", [page_id]);
  
      if (!page.rows.length) {
        return res.status(404).json({ error: "Page not found or token missing" });
      }
  
       pageAccessToken = page.rows[0].page_access_token;
      const response = await axios.get(`https://graph.facebook.com/v22.0/${ad_id}/leads?access_token=${pageAccessToken}`);
  
      res.json(response.data.data);
    } catch (error) {
      res.status(500).json({ error: `https://graph.facebook.com/v22.0/${ad_id}/leads?access_token=${pageAccessToken}` });
    }
  });
  





  router.post("/saveBusinessManager", async (req, res) => {
    const { userId, businessManagerId, fbAccessToken } = req.body;
  
    if (!userId || !businessManagerId || !fbAccessToken) {
      return res.status(400).json({ message: "Missing required data" });
    }
  
    try {
      // Delete old data for the user
      await db.query("DELETE FROM business_managers WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM ad_accounts WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM campaigns WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM ads WHERE user_id = $1", [userId]);
      await db.query("DELETE FROM leads WHERE user_id = $1", [userId]);
  
      // Insert new Business Manager
      await db.query(
        "INSERT INTO business_managers (user_id, business_manager_id) VALUES ($1, $2)",
        [userId, businessManagerId]
      );
  
  

      // Fetch and store Ad Accounts
      const adAccounts = await fetchAdAccounts(businessManagerId, fbAccessToken);
      for (let account of adAccounts) {
        await db.query(
          "INSERT INTO ad_accounts (user_id, account_id, name) VALUES ($1, $2, $3)",
          [userId, account.id, account.name]
        );
  
        // Fetch and store Campaigns
        const campaigns = await fetchCampaigns(account.id, fbAccessToken);
        for (let campaign of campaigns) {
          await db.query(
            "INSERT INTO campaigns (user_id, account_id, campaign_id, name) VALUES ($1, $2, $3, $4)",
            [userId, account.id, campaign.id, campaign.name]
          );
  
          // Fetch and store Ads
          const ads = await fetchAds(campaign.id, fbAccessToken);
          for (let ad of ads) {
            await db.query(
              "INSERT INTO ads (user_id, account_id, campaign_id, ad_id, name) VALUES ($1, $2, $3, $4, $5)",
              [userId, account.id, campaign.id, ad.id, ad.name]
            );
  
            // Fetch and store Leads
            // const leads = await fetchLeads(ad.id, fbAccessToken);
            // for (let lead of leads) {
            //   await db.query(
            //     "INSERT INTO leads (user_id, account_id, campaign_id, ad_id, lead_id, data) VALUES ($1, $2, $3, $4, $5, $6)",
            //     [userId, account.id, campaign.id, ad.id, lead.id, JSON.stringify(lead)]
            //   );
            // }
          }
        }
      }
  
      res.json({ message: "Business Manager and Ad Data saved successfully" });
    } catch (error) {
      console.error("Error saving business manager:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message, 
        stack: error.stack  
      });
    }
});

  
  // Helper function to fetch Ad Accounts
  const fetchAdAccounts = async (businessManagerId, token) => {
    console.log(`Fetching Ad Accounts for BM ID: ${businessManagerId}`);
    console.log(`Token: ${token}`);

    try {
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/${businessManagerId}/owned_ad_accounts?fields=id,name`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Ad Accounts Response:", response.data);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching Ad Accounts:", error.response ? error.response.data : error.message);
       return error.stack;
    }
};

  
  // Helper function to fetch Campaigns
  const fetchCampaigns = async (accountId, token) => {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${accountId}/campaigns?fields=id,name`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data || [];
  };
  
  // Helper function to fetch Ads
  const fetchAds = async (campaignId, token) => {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${campaignId}/ads?fields=id,name`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data || [];
  };
  
  // Helper function to fetch Leads
//   const fetchLeads = async (adId, token) => {
//     const response = await axios.get(
//       `https://graph.facebook.com/v18.0/${adId}/leads?fields=id,field_data`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data.data || [];
//   };


  export default router;