import express from 'express';
import { z } from 'zod';
import db from '../config/db.js';
import axios from 'axios';

const router = express.Router();



let accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI4NTU4MjUsImlzcyI6Imh0dHBzOi8vYXBpLmdldGpvYmJlci5jb20iLCJjbGllbnRfaWQiOiI5MzhhOTllOS03MmE0LTQzYWItYmM0MC0wMDMwODJjMjk5ZDYiLCJzY29wZSI6InJlYWRfY2xpZW50cyB3cml0ZV9jbGllbnRzIHJlYWRfcmVxdWVzdHMgd3JpdGVfcmVxdWVzdHMgcmVhZF9xdW90ZXMgd3JpdGVfcXVvdGVzIHJlYWRfam9icyB3cml0ZV9qb2JzIHJlYWRfdXNlcnMgd3JpdGVfdXNlcnMiLCJhcHBfaWQiOiI5MzhhOTllOS03MmE0LTQzYWItYmM0MC0wMDMwODJjMjk5ZDYiLCJ1c2VyX2lkIjoyODU1ODI1LCJhY2NvdW50X2lkIjoxNDU2MDU3LCJleHAiOjE3MzkyNTUwMjl9.1xoJBBJUc4vJBg0VKNl1oeRZVsnXgy8YG8y11wh3lRI"; 
const refreshToken = "311b478fe300f7ae3588530d0ad61276";  // Store this securely
const clientId = "938a99e9-72a4-43ab-bc40-003082c299d6";
const clientSecret = "6e58887be91ab79a742e0dfd02d65a214e9ae51f676152df4822a3734a28cdba";

// Function to refresh access token
const refreshAccessToken = async () => {
  try { 
    const response = await axios.post("https://api.getjobber.com/api/oauth/token", {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    if (response.data.access_token) {
      accessToken = response.data.access_token; // Update token globally
      console.log("Access token refreshed:", accessToken);
    }
  } catch (error) {
    console.error("Failed to refresh access token:", error.response?.data || error.message);
  }
};

// Function to make authenticated API requests
const makeJobberRequest = async (query) => {
  try {
    return await axios.post(
      "https://api.getjobber.com/api/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-JOBBER-GRAPHQL-VERSION": "2025-01-20"
        }
      }
    );
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Access token expired. Refreshing...");
      await refreshAccessToken();
      return makeJobberRequest(query); // Retry after refreshing token
    }
    throw error;
  }
};


// Validation schema for Facebook Lead
const FacebookLeadSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  ad_id: z.string().optional(),
  ad_name: z.string().optional(),
  adset_id: z.string().optional(),
  adset_name: z.string().optional(),
  campaign_id: z.string().optional(),
  campaign_name: z.string().optional(),
  form_id: z.string().optional(),
  form_name: z.string().optional(),
  lead_id: z.string().optional(),
  platform: z.string().optional(),
  zip_code: z.string().optional(),
  page_id: z.string().optional(),
  page_name: z.string().optional(),
  raw_full_name: z.string().optional(),
  raw_phone_number: z.string().optional(),
  raw_email: z.string().optional(),
  raw_services_interested: z.string().optional(),
  raw_zip_code: z.string().optional(),
  services_interested: z.string().optional(),
  vehicle: z.string().optional(),
  create_at: z.string().optional()
});

// Handle Facebook Lead Ads webhook
router.post('/facebook-lead', async (req, res, next) => {
  try {
    const leadData = FacebookLeadSchema.parse(req.body);
   
    const result = await db.query(
      `INSERT INTO facebook_leads (
        email, full_name, phone_number, status, ad_id, ad_name, adset_id, adset_name,
        campaign_id, campaign_name, form_id, form_name, lead_id, platform, zip_code,
        page_id, page_name, raw_full_name, raw_phone_number, raw_email,
        raw_services_interested, raw_zip_code, services_interested, vehicle, create_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24,$25
      ) RETURNING *`,
      [
        leadData.email,
        leadData.full_name,
        leadData.phone_number,
        'New Lead',
        leadData.ad_id,
        leadData.ad_name,
        leadData.adset_id,
        leadData.adset_name,
        leadData.campaign_id,
        leadData.campaign_name,
        leadData.form_id,
        leadData.form_name,
        leadData.lead_id,
        leadData.platform,
        leadData.zip_code,
        leadData.page_id,
        leadData.page_name,
        leadData.raw_full_name,
        leadData.raw_phone_number,
        leadData.raw_email,
        leadData.raw_services_interested,
        leadData.raw_zip_code,
        leadData.services_interested,
        leadData.vehicle,
        leadData.create_at ? new Date(leadData.create_at) : new Date()
      ]
    );

    
    
    // Prepare GraphQL mutation
    const query = `
      mutation {
        clientCreate(input: { 
          firstName: "${leadData.full_name?.split(' ')[0] || 'Jane'}", 
          lastName: "${leadData.full_name?.split(' ')[1] || 'Doe'}", 
          companyName: "Facebook Lead", 
          emails: [{ description: MAIN, primary: true, address: "${leadData.email}" }] 
        }) { 
          client { id firstName lastName } 
          userErrors { message path } 
        } 
      }
    `;

    // Send request to Jobber API
    // const jobberResponse = await axios.post(
    //   "https://api.getjobber.com/api/graphql",
    //   { query },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //       "X-JOBBER-GRAPHQL-VERSION": "2025-01-20"
    //     }
    //   }
    // );
    const jobberResponse = await makeJobberRequest(query);


    const topics = ["JOB_CREATE", "REQUEST_CREATE", "QUOTE_CREATE"];
    const webhookUrl = "https://app.lionrev.com/api/webhook/jobber-webhook";
  
    try {
      for (const topic of topics) {
        const response = await axios.post(
          "https://api.getjobber.com/api/graphql",
          {
            query: `
              mutation {
                webhookEndpointCreate(input: {
                  topic: ${topic}, 
                  url: "${webhookUrl}"
                }) {
                  webhookEndpoint {
                    id
                    topic
                    url
                  }
                  userErrors {
                    message
                  }
                }
              }
            `
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              "X-JOBBER-GRAPHQL-VERSION": "2025-01-20"
            }
          }
        );
  
        if (response.data?.data?.webhookEndpointCreate?.webhookEndpoint) {
          console.log(`Webhook created for ${topic}:`, response.data.data.webhookEndpointCreate.webhookEndpoint);
        } else {
          console.error(`Error creating webhook for ${topic}:`, response.data?.data?.webhookEndpointCreate?.userErrors);
        }
      }
    } catch (error) {
      console.error("Error registering webhooks:", error.response?.data || error.message);
    }
  
   
    
    

    // res.status(201).json(result.rows[0]);
    res.status(201).json({
      lionRevLead: result.rows[0],
      jobberLead: jobberResponse.data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid lead data',
        details: error.errors 
      });
    }
    next(error);
  }
});




router.post('/jobber-webhook', async (req, res, next) => {
  try {
    console.log("Received webhook data:", req.body);

    const event = req.body?.data?.webHookEvent; // Ensure safe access
    if (!event || !event.topic || !event.itemId) {
      return res.status(400).json({ error: "Invalid webhook payload", receivedData: req.body });
    }

    const { topic, itemId } = event;
    console.log(`Processing Jobber webhook: ${topic} for item ID: ${itemId}`);

    switch (topic) {
      case "JOB_CREATE":
        await handleJobCreate(itemId, res);
        break;

      case "REQUEST_CREATE":
        await handleRequestCreate(itemId, res);
        break;

      case "QUOTE_CREATE":
        await handleQuoteCreate(itemId, res);
        break;

      default:
        console.log("Unhandled webhook event:", topic);
        return res.status(200).json({ message: "Webhook received but no action taken" });
    }
  } catch (error) {
    console.error("Error processing Jobber webhook:", error);
    next(error);
  }
});


const handleJobCreate = async (itemId, res) => {
  try {
    const jobberResponse = await makeJobberRequest(`
      {
        job(id: "${itemId}") {
          id
          title
          lineItems {
            edges {
              node {
                description
                totalPrice
                quantity
              }
            }
          }
          client {
            id
            name
            emails {
              address
            }
          }
        }
      }
    `);

    if (!jobberResponse.data?.data?.job) {
      return res.status(400).json({ error: "Job not found in Jobber API" });
    }

    const jobData = jobberResponse.data.data.job;
    const totalRevenue = jobData.lineItems.edges.reduce((sum, item) => sum + (item.node.totalPrice || 0), 0);
    const emailList = jobData.client?.emails?.map(email => email.address) || [];


    const updateResult = await db.query(
            `UPDATE facebook_leads 
             SET revenue = $1, status = 'Closed'
             WHERE email = ANY($2) 
             RETURNING *`,
            [totalRevenue, emailList]
          );

    console.log(`Job Created - ID: ${itemId}, Revenue: $${totalRevenue}`);

    res.status(200).json({ success: true, jobData, totalRevenue, emailList });
  } catch (error) {
    console.error("Error handling job creation:", error);
    res.status(500).json({ error: "Failed to process job creation" });
  }
};


const handleRequestCreate = async (itemId, res) => {
  try {
    const jobberResponse = await makeJobberRequest(`
      {
        request(id: "${itemId}") {
          id
          title
          createdAt
          client {
            id
            name
            emails {
              address
            }
          }
        }
      }
    `);
  
    if (!jobberResponse.data?.data?.request) {
      return res.status(400).json({ error: "Request not found in Jobber API" });
    }

    const requestData = jobberResponse.data.data.request;
    const clientEmail = requestData.client?.emails?.[0]?.address || "No Email";
    const emailArray = [clientEmail];
    const updateResult = await db.query(
      `UPDATE facebook_leads 
       SET status = $1 
       WHERE email = ANY($2::text[]) 
       RETURNING *`,
      ['Estimate Scheduled', emailArray] // clientEmail should be an array
    );
    res.status(200).json({ updateResult });
    console.log(`Request Created - ID: ${itemId}, Title: ${requestData.title}, Client: ${requestData.client?.name}`);

    res.status(200).json({ success: true, requestData, clientEmail });
  } catch (error) {
    res.status(200).json( error );

    console.error("Error handling request creation:", error);
    res.status(500).json({ error: "Failed to process request creation" });
  }
};



const handleQuoteCreate = async (itemId, res) => {
  try {
    const jobberResponse = await makeJobberRequest(`
      {
        quote(id: "${itemId}") {
          id
          title
          createdAt
          client {
            id
            name
            emails {
              address
            }
          }
        }
      }
    `);

    if (!jobberResponse.data?.data?.quote) {
      return res.status(400).json({ error: "Quote not found in Jobber API" });
    }

    const quoteData = jobberResponse.data.data.quote;
    const clientEmail = quoteData.client?.emails?.[0]?.address || "No Email";


    const emailArray = [clientEmail];
    const updateResult = await db.query(
      `UPDATE facebook_leads 
       SET status = $1 
       WHERE email = ANY($2::text[]) 
       RETURNING *`,
      ['Quote Created', emailArray] // clientEmail should be an array
    );

    console.log(`Quote Created - ID: ${itemId}, Price: $${quoteData.totalPrice}, Client: ${quoteData.client?.name}`);

    res.status(200).json({ success: true, quoteData, clientEmail });
  } catch (error) {
    console.error("Error handling quote creation:", error);
    res.status(500).json({ error: "Failed to process quote creation" });
  }
};



export default router;