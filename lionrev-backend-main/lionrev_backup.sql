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
-- Name: ads; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.ads (
    id integer NOT NULL,
    campaign_id integer,
    ad_id character varying(255) NOT NULL,
    name character varying(255),
    spend numeric(10,2),
    clicks integer,
    lead_count integer,
    revenue numeric(10,2)
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
-- Name: campaigns; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.campaigns (
    id integer NOT NULL,
    user_id integer,
    campaign_id character varying(255) NOT NULL,
    name character varying(255),
    spend numeric(10,2),
    clicks integer,
    lead_count integer,
    revenue numeric(10,2)
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
-- Name: fb_pages; Type: TABLE; Schema: public; Owner: lionrevadmin
--

CREATE TABLE public.fb_pages (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    page_id character varying(255) NOT NULL,
    page_name character varying(255),
    page_access_token text NOT NULL
);


ALTER TABLE public.fb_pages OWNER TO lionrevadmin;

--
-- Name: fb_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: lionrevadmin
--

CREATE SEQUENCE public.fb_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fb_pages_id_seq OWNER TO lionrevadmin;

--
-- Name: fb_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lionrevadmin
--

ALTER SEQUENCE public.fb_pages_id_seq OWNED BY public.fb_pages.id;


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
    ad_id integer,
    lead_id character varying(255) NOT NULL,
    revenue numeric(10,2)
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
-- Name: ads id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ads ALTER COLUMN id SET DEFAULT nextval('public.ads_id_seq'::regclass);


--
-- Name: campaigns id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN id SET DEFAULT nextval('public.campaigns_id_seq'::regclass);


--
-- Name: facebook_leads id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.facebook_leads ALTER COLUMN id SET DEFAULT nextval('public.facebook_leads_id_seq'::regclass);


--
-- Name: fb_pages id; Type: DEFAULT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.fb_pages ALTER COLUMN id SET DEFAULT nextval('public.fb_pages_id_seq'::regclass);


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
-- Data for Name: ads; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.ads (id, campaign_id, ad_id, name, spend, clicks, lead_count, revenue) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.campaigns (id, user_id, campaign_id, name, spend, clicks, lead_count, revenue) FROM stdin;
\.


--
-- Data for Name: facebook_leads; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.facebook_leads (id, email, full_name, phone_number, status, ad_id, ad_name, adset_id, adset_name, campaign_id, campaign_name, form_id, form_name, lead_id, platform, zip_code, page_id, page_name, raw_full_name, raw_phone_number, raw_email, raw_services_interested, raw_zip_code, services_interested, vehicle, create_at, revenue) FROM stdin;
\.


--
-- Data for Name: fb_pages; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.fb_pages (id, user_id, page_id, page_name, page_access_token) FROM stdin;
\.


--
-- Data for Name: jobber_tokens; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.jobber_tokens (id, access_token, refresh_token, expires_in, created_at) FROM stdin;
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.leads (id, ad_id, lead_id, revenue) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: lionrevadmin
--

COPY public.users (id, name, email, password, created_at, fb_access_token) FROM stdin;
1	yasir shah	gemini.yasu@gmail.com	$2a$10$eoI1tsd/6Vn2fgwgQhBqUOXMflSgv9ngPRhsGfvUqn69LdJ0TuXYq	2025-02-17 00:11:02.277546	\N
\.


--
-- Name: ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.ads_id_seq', 1, false);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 1, false);


--
-- Name: facebook_leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.facebook_leads_id_seq', 1, false);


--
-- Name: fb_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lionrevadmin
--

SELECT pg_catalog.setval('public.fb_pages_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: ads ads_ad_id_key; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_ad_id_key UNIQUE (ad_id);


--
-- Name: ads ads_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_campaign_id_key; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_campaign_id_key UNIQUE (campaign_id);


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
-- Name: fb_pages fb_pages_page_id_key; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.fb_pages
    ADD CONSTRAINT fb_pages_page_id_key UNIQUE (page_id);


--
-- Name: fb_pages fb_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.fb_pages
    ADD CONSTRAINT fb_pages_pkey PRIMARY KEY (id);


--
-- Name: jobber_tokens jobber_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.jobber_tokens
    ADD CONSTRAINT jobber_tokens_pkey PRIMARY KEY (id);


--
-- Name: leads leads_lead_id_key; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_lead_id_key UNIQUE (lead_id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


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
-- Name: ads ads_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id);


--
-- Name: campaigns campaigns_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: leads leads_ad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lionrevadmin
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_ad_id_fkey FOREIGN KEY (ad_id) REFERENCES public.ads(id);


--
-- PostgreSQL database dump complete
--

