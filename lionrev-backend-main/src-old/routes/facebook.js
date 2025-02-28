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
      res.status(201).json({ message: "User token successfully", user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
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


router.get("/ad-accounts", async (req, res) => {
    try {
        const userId = req.headers.authorization;
        const businessManagerId = req.query.business_manager_id; // Get Business Manager ID from query params

        if (!businessManagerId) {
            return res.status(400).json({ error: "Business Manager ID is required" });
        }

        const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (!user.rows.length || !user.rows[0].fb_access_token) {
            return res.status(401).json({ error: "Not connected to Facebook" });
        }

        const accessToken = user.rows[0].fb_access_token;

        // Step 2: Get Ad Accounts under the selected Business Manager
        const response = await axios.get(
            `https://graph.facebook.com/v22.0/${businessManagerId}/owned_ad_accounts?access_token=${accessToken}`,
            { timeout: 10000 }
        );

        if (!response.data.data || response.data.data.length === 0) {
            return res.status(404).json({ error: "No ad accounts found" });
        }

        const adAccounts = response.data.data.map(account => ({
            id: account.id,
            name: account.name || `Ad Account ${account.id}`
        }));

        res.json(adAccounts);
    } catch (error) {
        console.error("Error fetching ad accounts:", error);
        res.status(500).json({
            error: "Failed to fetch ad accounts",
            details: error.message,
            stack: error.stack,
        });
    }
});


// Fetch All Campaign Data (Including Leads, Ads, Clicks, Revenue)
router.get("/campaigns", async (req, res) => {
    var  accessToken = '';
    const ad_account_id = req.query.ad_account_id;

    try {
        const userId = req.headers.authorization;
        const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (!user.rows.length || !user.rows[0].fb_access_token) {
            return res.status(401).json({ error: "Not connected to Facebook" });
        }

         accessToken = user.rows[0].fb_access_token;

  

        let allCampaigns = [];
       // allCampaigns.push(adAccountsResponse.data.data);
        // Step 2: Fetch campaigns for each ad account separately
       
     
            //allCampaigns.push(`https://graph.facebook.com/v22.0/${account.id}/campaigns?fields=id,name,spend,clicks,leads&access_token=${accessToken}`);
            try {
                const campaignsResponse = await axios.get(`https://graph.facebook.com/v22.0/${ad_account_id}/campaigns?fields=id,name,spend,leads&access_token=${accessToken}`, {
                   // params: { access_token: accessToken, fields: "id,name,spend,clicks,leads" },
                    timeout: 10000
                });
              
                // allCampaigns.push(campaignsResponse.data.data);
                if (campaignsResponse.data.data) {
                
                    for (const campaign of campaignsResponse.data.data) {
                        // await db.query(
                        //     `INSERT INTO campaigns (user_id, campaign_id, name, spend, clicks, lead_count) 
                        //      VALUES ($1, $2, $3, $4, $5, $6)
                        //      ON CONFLICT (campaign_id) DO UPDATE 
                        //      SET spend = EXCLUDED.spend, clicks = EXCLUDED.clicks, lead_count = EXCLUDED.lead_count`,
                        //     [userId, campaign.id, campaign.name, campaign.spend || 0, campaign.clicks || 0, campaign.leads || 0]
                        // );
                        allCampaigns.push(campaign);
                    }
                }
            } catch (err) {
                // res.status(500).json({
                //     error: "Failed to fetch campaigns",
                //     details: accessToken,
                //     stack: err.stack, // Add full error stack for debugging
                // });
                console.error(`Error fetching campaigns for ad account ${ad_account_id}:`, err.message);
            }
        

        res.json(allCampaigns);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({
            error: "Failed to fetch campaigns",
            details: accessToken,
            stack: error.stack, // Add full error stack for debugging
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
  


  export default router;