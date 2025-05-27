--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4

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

--
-- Name: check_organizerId_coherency(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public."check_organizerId_coherency"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
    event_organizer_id INT;
BEGIN
    -- Get the organizerId from the referenced event row
    IF NEW."eventId" IS NOT NULL THEN
		SELECT "organizerId" INTO event_organizer_id FROM events WHERE id = NEW."eventId";

    	IF NEW."organizerId" != event_organizer_id THEN
        	RAISE EXCEPTION 'organizerId in wallet does not match organizerId in referenced event';
    	END IF;
	END IF;

    RETURN NEW;
END;$$;


--
-- Name: check_wallet_coherency(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_wallet_coherency() RETURNS trigger
    LANGUAGE plpgsql
    AS $$DECLARE
    wallet_user_id INT;
	wallet_event_id INT;
BEGIN
    IF NEW."walletId" IS NOT NULL THEN
        SELECT "userId" INTO wallet_user_id FROM wallets WHERE id = NEW."walletId";
		SELECT "eventId" INTO wallet_event_id FROM wallets WHERE id = NEW."walletId";

        IF NEW."userId" != wallet_user_id THEN
            RAISE EXCEPTION 'userId in registration does not match userId in referenced wallet';
        END IF;

		IF wallet_event_id IS NOT NULL THEN
			IF NEW."eventId" != wallet_event_id THEN
            	RAISE EXCEPTION 'eventId in registration does not match eventId in referenced wallet';
        	END IF;
		END IF;
    END IF;

    RETURN NEW;
END;$$;


--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_registrations (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "eventId" integer NOT NULL,
    "walletId" integer,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now()
);


--
-- Name: event_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_registrations_id_seq OWNED BY public.event_registrations.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "organizerId" integer NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    address character varying(255),
    description character varying(511),
    "videoUrl" character varying(511),
    "imageUrl" character varying(511)
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    activated boolean DEFAULT false,
    "fullName" character varying(255) DEFAULT NULL::character varying,
    email character varying(255) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying,
    birthday character varying(255) DEFAULT NULL::character varying,
    role character varying(10) DEFAULT 'USER'::character varying,
    "paymentURL" character varying(255) DEFAULT NULL::character varying,
    "pfpUrl" character varying(255) DEFAULT NULL::character varying,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying, 'ORGANIZER'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wallets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallets (
    id integer NOT NULL,
    "userId" integer,
    "organizerId" integer,
    amount numeric(10,2) DEFAULT 0,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "eventId" integer
);


--
-- Name: wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wallets_id_seq OWNED BY public.wallets.id;


--
-- Name: event_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations ALTER COLUMN id SET DEFAULT nextval('public.event_registrations_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wallets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets ALTER COLUMN id SET DEFAULT nextval('public.wallets_id_seq'::regclass);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: event_registrations unique_registration; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT unique_registration UNIQUE ("userId", "eventId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_userId_eventId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "wallets_userId_eventId_key" UNIQUE ("userId", "eventId");


--
-- Name: wallets check_organizerId_coherency; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "check_organizerId_coherency" BEFORE INSERT OR UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public."check_organizerId_coherency"();


--
-- Name: event_registrations check_wallet_coherency; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_wallet_coherency BEFORE INSERT OR UPDATE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.check_wallet_coherency();


--
-- Name: events events_organizerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: event_registrations fk_event; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT fk_event FOREIGN KEY ("eventId") REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_registrations fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: event_registrations fk_wallet; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT fk_wallet FOREIGN KEY ("walletId") REFERENCES public.wallets(id) ON DELETE SET NULL;


--
-- Name: wallets wallets_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "wallets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public.events(id) ON DELETE SET NULL;


--
-- Name: wallets wallets_organizerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "wallets_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wallets wallets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

