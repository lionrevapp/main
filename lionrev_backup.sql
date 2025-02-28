--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ad_accounts; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.ad_accounts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    account_id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.ad_accounts OWNER TO lionrevadmin;

--
-- Name: ad_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.ad_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ad_accounts_id_seq OWNER TO lionrevadmin;

--
-- Name: ad_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.ad_accounts_id_seq OWNED BY public.ad_accounts.id;


--
-- Name: ads; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.ads (
    id integer NOT NULL,
    user_id integer NOT NULL,
    account_id text NOT NULL,
    campaign_id text NOT NULL,
    ad_id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.ads OWNER TO lionrevadmin;

--
-- Name: ads_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ads_id_seq OWNER TO lionrevadmin;

--
-- Name: ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.ads_id_seq OWNED BY public.ads.id;


--
-- Name: business_managers; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.business_managers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    business_manager_id text NOT NULL
);


ALTER TABLE public.business_managers OWNER TO lionrevadmin;

--
-- Name: business_managers_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.business_managers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.business_managers_id_seq OWNER TO lionrevadmin;

--
-- Name: business_managers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.business_managers_id_seq OWNED BY public.business_managers.id;


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.campaigns (
    id integer NOT NULL,
    user_id integer NOT NULL,
    account_id text NOT NULL,
    campaign_id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.campaigns OWNER TO lionrevadmin;

--
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.campaigns_id_seq OWNER TO lionrevadmin;

--
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.campaigns_id_seq OWNED BY public.campaigns.id;


--
-- Name: facebook_leads; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.facebook_leads (
    id integer NOT NULL,
    email character varying(255),
    full_name character varying(255),
    phone_number character varying(50),
    status character varying(50),
    ad_id character varying(50),
    ad_name character varying(255),
    adset_id character varying(50),
    adset_name character varying(255),
    campaign_id character varying(50),
    campaign_name character varying(255),
    form_id character varying(50),
    form_name character varying(255),
    lead_id character varying(50),
    platform character varying(50),
    zip_code character varying(20),
    page_id character varying(50),
    page_name character varying(255),
    raw_full_name text,
    raw_phone_number text,
    raw_email text,
    raw_services_interested text,
    raw_zip_code text,
    services_interested text,
    vehicle text,
    create_at timestamp without time zone DEFAULT now(),
    revenue numeric(10,2) DEFAULT 0.00
);


ALTER TABLE public.facebook_leads OWNER TO lionrevadmin;

--
-- Name: facebook_leads_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.facebook_leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facebook_leads_id_seq OWNER TO lionrevadmin;

--
-- Name: facebook_leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.facebook_leads_id_seq OWNED BY public.facebook_leads.id;


--
-- Name: jobber_tokens; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.jobber_tokens (
    id integer NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    expires_in integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.jobber_tokens OWNER TO lionrevadmin;

--
-- Name: jobber_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.jobber_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobber_tokens_id_seq OWNER TO lionrevadmin;

--
-- Name: jobber_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.jobber_tokens_id_seq OWNED BY public.jobber_tokens.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    user_id integer NOT NULL,
    account_id text NOT NULL,
    campaign_id text NOT NULL,
    ad_id text NOT NULL,
    lead_id text NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE public.leads OWNER TO lionrevadmin;

--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leads_id_seq OWNER TO lionrevadmin;

--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fb_access_token text
);


ALTER TABLE public.users OWNER TO lionrevadmin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO lionrevadmin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ad_accounts id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ad_accounts ALTER COLUMN id SET DEFAULT nextval('public.ad_accounts_id_seq'::regclass);


--
-- Name: ads id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ads ALTER COLUMN id SET DEFAULT nextval('public.ads_id_seq'::regclass);


--
-- Name: business_managers id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.business_managers ALTER COLUMN id SET DEFAULT nextval('public.business_managers_id_seq'::regclass);


--
-- Name: campaigns id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN id SET DEFAULT nextval('public.campaigns_id_seq'::regclass);


--
-- Name: facebook_leads id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.facebook_leads ALTER COLUMN id SET DEFAULT nextval('public.facebook_leads_id_seq'::regclass);


--
-- Name: jobber_tokens id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.jobber_tokens ALTER COLUMN id SET DEFAULT nextval('public.jobber_tokens_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ad_accounts; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.ad_accounts (id, user_id, account_id, name) FROM stdin;
27	2	act_668513717746723	Jade Stems Agency
\.


--
-- Data for Name: ads; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.ads (id, user_id, account_id, campaign_id, ad_id, name) FROM stdin;
\.


--
-- Data for Name: business_managers; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.business_managers (id, user_id, business_manager_id) FROM stdin;
24	2	2767783386844067
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.campaigns (id, user_id, account_id, campaign_id, name) FROM stdin;
74	2	act_668513717746723	120215829602150130	BTA - Agency - Quiz - Cold
75	2	act_668513717746723	120215452606390130	BTA - Agency - Leads - Cold
76	2	act_668513717746723	120212706966200130	BTL - Form Leads - Warm
77	2	act_668513717746723	120212089197510130	BTL - Form Leads
78	2	act_668513717746723	120212072251340130	BTL - Form Leads - Cold
79	2	act_668513717746723	120212006548380130	BTL - Messages - Cold
80	2	act_668513717746723	23853875445590129	JSA - Leads - Custom - Pool Cleaners - All Season - Relaunch
81	2	act_668513717746723	23853807571740129	JSA - Leads - Custom - Pool Cleaners - All Season
82	2	act_668513717746723	23853806968200129	JSA - Leads - Custom - Pool Cleaners
83	2	act_668513717746723	23853770022620129	JSA - Leads - Custom - Pool Cleaners
84	2	act_668513717746723	23852473851840129	JSA - Leads - Custom - WMM - 10.14.22
85	2	act_668513717746723	23852275839700129	JSA - Leads - Broad - Lead Guarantee - LP
86	2	act_668513717746723	23852237016200129	JSA - Leads - Broad - Lead Guarantee - LF - 9.26 - Copy
87	2	act_668513717746723	23852171404750129	JSA - Leads - Broad - Lead Guarantee - LF
88	2	act_668513717746723	23852000288500129	JSA - Law Firms - Interest - ASO - Money Back - BC - 9.1
89	2	act_668513717746723	23851941674210129	JSA - Law Firms - Interest - Visitors - Money Back - 8.26
90	2	act_668513717746723	23851941622230129	JSA - Law Firms - Interest - ASO - Money Back - BC - 8.26
91	2	act_668513717746723	23851811964780129	JSA - Law Firms - Interest - Visitors - Money Back
92	2	act_668513717746723	23851811902510129	JSA - Law Firms - Single Interest - ASO - Money Back
93	2	act_668513717746723	23851811885800129	JSA - Law Firms - Interest - ASO - Money Back - BC
94	2	act_668513717746723	23851339089910129	JSA - Law Firms - Interest - ASO - Money Back
95	2	act_668513717746723	23851302359050129	JSA - Law Firms - Interest - ASO - Money Back - Snipe
96	2	act_668513717746723	23851274516300129	JSA - Law Firms - Interest - Remarketing - Money Back
97	2	act_668513717746723	23851255167990129	JSA - Law Firms - Interest - ASO - Money Back - V2
98	2	act_668513717746723	23851250473270129	JSA - Law Firms - Interest - ASO - Money Back
\.


--
-- Data for Name: facebook_leads; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.facebook_leads (id, email, full_name, phone_number, status, ad_id, ad_name, adset_id, adset_name, campaign_id, campaign_name, form_id, form_name, lead_id, platform, zip_code, page_id, page_name, raw_full_name, raw_phone_number, raw_email, raw_services_interested, raw_zip_code, services_interested, vehicle, create_at, revenue) FROM stdin;
1	s-killian@sbcglobal.net	Joe Killian	+17158217334	New Lead	120218198708790759	i01 - c01	120218198708810759	Broad	120218198708820759	NWI - Form Leads - Cold - Leads - Advantage+	1028821832339277	NWI Form Full	930694445888485	fb	54022	798977163546459	NWI Tree Service & Landscaping	Joe Killian	+17158217334	\N	2 tress taking down ! Cleaned up ! And stumps also 🤠🤠	54022	2 tress taking down ! Cleaned up ! And stumps also 🤠🤠	\N	2025-02-25 17:15:48	0.00
2	rachelshalander@yahoo.com	Rachel Shalander	+17154172840	New Lead	120218198708790759	i01 - c01	120218198708810759	Broad	120218198708820759	NWI - Form Leads - Cold - Leads - Advantage+	1028821832339277	NWI Form Full	532545259312901	fb	54017	798977163546459	NWI Tree Service & Landscaping	Rachel Shalander	+17154172840	\N	trimming, pruning	54017	trimming, pruning	\N	2025-02-25 17:17:28	0.00
3	olson9family@yahoo.com	Charlene Olson	+16125016937	New Lead	120218198708790759	i01 - c01	120218198708810759	Broad	120218198708820759	NWI - Form Leads - Cold - Leads - Advantage+	1028821832339277	NWI Form Full	514503968337542	fb	55107	798977163546459	NWI Tree Service & Landscaping	Charlene Olson	+16125016937	\N	Tree removal	55107	Tree removal	\N	2025-02-25 19:50:41	0.00
4	stevekoehler29@gmail.com	Steve Koehler	+17634862033	New Lead	120218198708790759	i01 - c01	120218198708810759	Broad	120218198708820759	NWI - Form Leads - Cold - Leads - Advantage+	1028821832339277	NWI Form Full	1184649476574813	fb	55432	798977163546459	NWI Tree Service & Landscaping	Steve Koehler	+17634862033	\N	trimming and removal	55432	trimming and removal	\N	2025-02-26 18:07:49	0.00
\.


--
-- Data for Name: jobber_tokens; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.jobber_tokens (id, access_token, refresh_token, expires_in, created_at) FROM stdin;
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.leads (id, user_id, account_id, campaign_id, ad_id, lead_id, data) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.users (id, name, email, password, created_at, fb_access_token) FROM stdin;
1	yasir shah	gemini.yasu@gmail.com	$2a$10$eoI1tsd/6Vn2fgwgQhBqUOXMflSgv9ngPRhsGfvUqn69LdJ0TuXYq	2025-02-17 00:11:02.277546	\N
2	sam	lionrevapp@gmail.com	$2a$10$/ojvQ4GB3vcXr9URtudMtuhPE8YehMJWOCEuQa0NTvntoPak8riKC	2025-02-25 10:13:48.337791	EAARw4y6mu3MBO2UlA6wGknZB78i28RstEsXc9ladZAjxkAYJIEdihbk0V6ztPbyI3v6ZBije7YiZAzfRfQeJZA888ZBIMRGo9mIq0I5XlNVFjYcjLnu9dR1l2XHaRISZBWoMyvmOfxFFGEC01QKl33IB1hR9D5JjZCkLfzN191WNjZCQ9vRGDcxi5rHh3
\.


--
-- Name: ad_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.ad_accounts_id_seq', 28, true);


--
-- Name: ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.ads_id_seq', 244, true);


--
-- Name: business_managers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.business_managers_id_seq', 25, true);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 123, true);


--
-- Name: facebook_leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.facebook_leads_id_seq', 4, true);


--
-- Name: jobber_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.jobber_tokens_id_seq', 1, false);


--
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.leads_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: ad_accounts ad_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ad_accounts
    ADD CONSTRAINT ad_accounts_pkey PRIMARY KEY (id);


--
-- Name: ads ads_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_pkey PRIMARY KEY (id);


--
-- Name: business_managers business_managers_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.business_managers
    ADD CONSTRAINT business_managers_pkey PRIMARY KEY (id);


--
-- Name: business_managers business_managers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.business_managers
    ADD CONSTRAINT business_managers_user_id_key UNIQUE (user_id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: facebook_leads facebook_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.facebook_leads
    ADD CONSTRAINT facebook_leads_pkey PRIMARY KEY (id);


--
-- Name: jobber_tokens jobber_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.jobber_tokens
    ADD CONSTRAINT jobber_tokens_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: ad_accounts unique_account_id; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ad_accounts
    ADD CONSTRAINT unique_account_id UNIQUE (account_id);


--
-- Name: campaigns unique_campaign_id; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT unique_campaign_id UNIQUE (campaign_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

