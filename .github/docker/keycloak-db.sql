--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-2.pgdg110+2)
-- Dumped by pg_dump version 14.5 (Debian 14.5-2.pgdg110+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_event_entity (
    id character varying(36) NOT NULL,
    admin_event_time bigint,
    realm_id character varying(255),
    operation_type character varying(255),
    auth_realm_id character varying(255),
    auth_client_id character varying(255),
    auth_user_id character varying(255),
    ip_address character varying(255),
    resource_path character varying(2550),
    representation text,
    error character varying(255),
    resource_type character varying(64)
);


--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.associated_policy (
    policy_id character varying(36) NOT NULL,
    associated_policy_id character varying(36) NOT NULL
);


--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentication_execution (
    id character varying(36) NOT NULL,
    alias character varying(255),
    authenticator character varying(36),
    realm_id character varying(36),
    flow_id character varying(36),
    requirement integer,
    priority integer,
    authenticator_flow boolean DEFAULT false NOT NULL,
    auth_flow_id character varying(36),
    auth_config character varying(36)
);


--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentication_flow (
    id character varying(36) NOT NULL,
    alias character varying(255),
    description character varying(255),
    realm_id character varying(36),
    provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
    top_level boolean DEFAULT false NOT NULL,
    built_in boolean DEFAULT false NOT NULL
);


--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authenticator_config (
    id character varying(36) NOT NULL,
    alias character varying(255),
    realm_id character varying(36)
);


--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authenticator_config_entry (
    authenticator_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.broker_link (
    identity_provider character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL,
    broker_user_id character varying(255),
    broker_username character varying(255),
    token text,
    user_id character varying(255) NOT NULL
);


--
-- Name: client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client (
    id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    full_scope_allowed boolean DEFAULT false NOT NULL,
    client_id character varying(255),
    not_before integer,
    public_client boolean DEFAULT false NOT NULL,
    secret character varying(255),
    base_url character varying(255),
    bearer_only boolean DEFAULT false NOT NULL,
    management_url character varying(255),
    surrogate_auth_required boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    protocol character varying(255),
    node_rereg_timeout integer DEFAULT 0,
    frontchannel_logout boolean DEFAULT false NOT NULL,
    consent_required boolean DEFAULT false NOT NULL,
    name character varying(255),
    service_accounts_enabled boolean DEFAULT false NOT NULL,
    client_authenticator_type character varying(255),
    root_url character varying(255),
    description character varying(255),
    registration_token character varying(255),
    standard_flow_enabled boolean DEFAULT true NOT NULL,
    implicit_flow_enabled boolean DEFAULT false NOT NULL,
    direct_access_grants_enabled boolean DEFAULT false NOT NULL,
    always_display_in_console boolean DEFAULT false NOT NULL
);


--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_attributes (
    client_id character varying(36) NOT NULL,
    value character varying(4000),
    name character varying(255) NOT NULL
);


--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_auth_flow_bindings (
    client_id character varying(36) NOT NULL,
    flow_id character varying(36),
    binding_name character varying(255) NOT NULL
);


--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_initial_access (
    id character varying(36) NOT NULL,
    realm_id character varying(36) NOT NULL,
    "timestamp" integer,
    expiration integer,
    count integer,
    remaining_count integer
);


--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_node_registrations (
    client_id character varying(36) NOT NULL,
    value integer,
    name character varying(255) NOT NULL
);


--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope (
    id character varying(36) NOT NULL,
    name character varying(255),
    realm_id character varying(36),
    description character varying(255),
    protocol character varying(255)
);


--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope_attributes (
    scope_id character varying(36) NOT NULL,
    value character varying(2048),
    name character varying(255) NOT NULL
);


--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope_client (
    client_id character varying(255) NOT NULL,
    scope_id character varying(255) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_scope_role_mapping (
    scope_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


--
-- Name: client_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_session (
    id character varying(36) NOT NULL,
    client_id character varying(36),
    redirect_uri character varying(255),
    state character varying(255),
    "timestamp" integer,
    session_id character varying(36),
    auth_method character varying(255),
    realm_id character varying(255),
    auth_user_id character varying(36),
    current_action character varying(36)
);


--
-- Name: client_session_auth_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_session_auth_status (
    authenticator character varying(36) NOT NULL,
    status integer,
    client_session character varying(36) NOT NULL
);


--
-- Name: client_session_note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_session_note (
    name character varying(255) NOT NULL,
    value character varying(255),
    client_session character varying(36) NOT NULL
);


--
-- Name: client_session_prot_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_session_prot_mapper (
    protocol_mapper_id character varying(36) NOT NULL,
    client_session character varying(36) NOT NULL
);


--
-- Name: client_session_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_session_role (
    role_id character varying(255) NOT NULL,
    client_session character varying(36) NOT NULL
);


--
-- Name: client_user_session_note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_user_session_note (
    name character varying(255) NOT NULL,
    value character varying(2048),
    client_session character varying(36) NOT NULL
);


--
-- Name: component; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.component (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_id character varying(36),
    provider_id character varying(36),
    provider_type character varying(255),
    realm_id character varying(36),
    sub_type character varying(255)
);


--
-- Name: component_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.component_config (
    id character varying(36) NOT NULL,
    component_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(4000)
);


--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.composite_role (
    composite character varying(36) NOT NULL,
    child_role character varying(36) NOT NULL
);


--
-- Name: credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    user_id character varying(36),
    created_date bigint,
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);


--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_client_scope (
    realm_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL,
    default_scope boolean DEFAULT false NOT NULL
);


--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_entity (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    details_json character varying(2550),
    error character varying(255),
    ip_address character varying(255),
    realm_id character varying(255),
    session_id character varying(255),
    event_time bigint,
    type character varying(255),
    user_id character varying(255)
);


--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_attribute (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    value character varying(2024)
);


--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_consent_cl_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_credential (
    id character varying(36) NOT NULL,
    salt bytea,
    type character varying(255),
    created_date bigint,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36),
    user_label character varying(255),
    secret_data text,
    credential_data text,
    priority integer
);


--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_required_action (
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fed_user_role_mapping (
    role_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    storage_provider_id character varying(36)
);


--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.federated_identity (
    identity_provider character varying(255) NOT NULL,
    realm_id character varying(36),
    federated_user_id character varying(255),
    federated_username character varying(255),
    token text,
    user_id character varying(36) NOT NULL
);


--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.federated_user (
    id character varying(255) NOT NULL,
    storage_provider_id character varying(255),
    realm_id character varying(36) NOT NULL
);


--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    group_id character varying(36) NOT NULL
);


--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_role_mapping (
    role_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_provider (
    internal_id character varying(36) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    provider_alias character varying(255),
    provider_id character varying(255),
    store_token boolean DEFAULT false NOT NULL,
    authenticate_by_default boolean DEFAULT false NOT NULL,
    realm_id character varying(36),
    add_token_role boolean DEFAULT true NOT NULL,
    trust_email boolean DEFAULT false NOT NULL,
    first_broker_login_flow_id character varying(36),
    post_broker_login_flow_id character varying(36),
    provider_display_name character varying(255),
    link_only boolean DEFAULT false NOT NULL
);


--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_provider_config (
    identity_provider_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identity_provider_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    idp_alias character varying(255) NOT NULL,
    idp_mapper_name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.idp_mapper_config (
    idp_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keycloak_group (
    id character varying(36) NOT NULL,
    name character varying(255),
    parent_group character varying(36) NOT NULL,
    realm_id character varying(36)
);


--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keycloak_role (
    id character varying(36) NOT NULL,
    client_realm_constraint character varying(255),
    client_role boolean DEFAULT false NOT NULL,
    description character varying(255),
    name character varying(255),
    realm_id character varying(255),
    client character varying(36),
    realm character varying(36)
);


--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migration_model (
    id character varying(36) NOT NULL,
    version character varying(36),
    update_time bigint DEFAULT 0 NOT NULL
);


--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offline_client_session (
    user_session_id character varying(36) NOT NULL,
    client_id character varying(255) NOT NULL,
    offline_flag character varying(4) NOT NULL,
    "timestamp" integer,
    data text,
    client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
    external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL
);


--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offline_user_session (
    user_session_id character varying(36) NOT NULL,
    user_id character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    created_on integer NOT NULL,
    offline_flag character varying(4) NOT NULL,
    data text,
    last_session_refresh integer DEFAULT 0 NOT NULL
);


--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.policy_config (
    policy_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value text
);


--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.protocol_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    protocol character varying(255) NOT NULL,
    protocol_mapper_name character varying(255) NOT NULL,
    client_id character varying(36),
    client_scope_id character varying(36)
);


--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.protocol_mapper_config (
    protocol_mapper_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: realm; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm (
    id character varying(36) NOT NULL,
    access_code_lifespan integer,
    user_action_lifespan integer,
    access_token_lifespan integer,
    account_theme character varying(255),
    admin_theme character varying(255),
    email_theme character varying(255),
    enabled boolean DEFAULT false NOT NULL,
    events_enabled boolean DEFAULT false NOT NULL,
    events_expiration bigint,
    login_theme character varying(255),
    name character varying(255),
    not_before integer,
    password_policy character varying(2550),
    registration_allowed boolean DEFAULT false NOT NULL,
    remember_me boolean DEFAULT false NOT NULL,
    reset_password_allowed boolean DEFAULT false NOT NULL,
    social boolean DEFAULT false NOT NULL,
    ssl_required character varying(255),
    sso_idle_timeout integer,
    sso_max_lifespan integer,
    update_profile_on_soc_login boolean DEFAULT false NOT NULL,
    verify_email boolean DEFAULT false NOT NULL,
    master_admin_client character varying(36),
    login_lifespan integer,
    internationalization_enabled boolean DEFAULT false NOT NULL,
    default_locale character varying(255),
    reg_email_as_username boolean DEFAULT false NOT NULL,
    admin_events_enabled boolean DEFAULT false NOT NULL,
    admin_events_details_enabled boolean DEFAULT false NOT NULL,
    edit_username_allowed boolean DEFAULT false NOT NULL,
    otp_policy_counter integer DEFAULT 0,
    otp_policy_window integer DEFAULT 1,
    otp_policy_period integer DEFAULT 30,
    otp_policy_digits integer DEFAULT 6,
    otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
    otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
    browser_flow character varying(36),
    registration_flow character varying(36),
    direct_grant_flow character varying(36),
    reset_credentials_flow character varying(36),
    client_auth_flow character varying(36),
    offline_session_idle_timeout integer DEFAULT 0,
    revoke_refresh_token boolean DEFAULT false NOT NULL,
    access_token_life_implicit integer DEFAULT 0,
    login_with_email_allowed boolean DEFAULT true NOT NULL,
    duplicate_emails_allowed boolean DEFAULT false NOT NULL,
    docker_auth_flow character varying(36),
    refresh_token_max_reuse integer DEFAULT 0,
    allow_user_managed_access boolean DEFAULT false NOT NULL,
    sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
    sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
    default_role character varying(255)
);


--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_attribute (
    name character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL,
    value text
);


--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_default_groups (
    realm_id character varying(36) NOT NULL,
    group_id character varying(36) NOT NULL
);


--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_enabled_event_types (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_events_listeners (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_localizations (
    realm_id character varying(255) NOT NULL,
    locale character varying(255) NOT NULL,
    texts text NOT NULL
);


--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_required_credential (
    type character varying(255) NOT NULL,
    form_label character varying(255),
    input boolean DEFAULT false NOT NULL,
    secret boolean DEFAULT false NOT NULL,
    realm_id character varying(36) NOT NULL
);


--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_smtp_config (
    realm_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realm_supported_locales (
    realm_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.redirect_uris (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.required_action_config (
    required_action_id character varying(36) NOT NULL,
    value text,
    name character varying(255) NOT NULL
);


--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.required_action_provider (
    id character varying(36) NOT NULL,
    alias character varying(255),
    name character varying(255),
    realm_id character varying(36),
    enabled boolean DEFAULT false NOT NULL,
    default_action boolean DEFAULT false NOT NULL,
    provider_id character varying(255),
    priority integer
);


--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_attribute (
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    resource_id character varying(36) NOT NULL
);


--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_policy (
    resource_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_scope (
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server (
    id character varying(36) NOT NULL,
    allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
    policy_enforce_mode character varying(15) NOT NULL,
    decision_strategy smallint DEFAULT 1 NOT NULL
);


--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_perm_ticket (
    id character varying(36) NOT NULL,
    owner character varying(255) NOT NULL,
    requester character varying(255) NOT NULL,
    created_timestamp bigint NOT NULL,
    granted_timestamp bigint,
    resource_id character varying(36) NOT NULL,
    scope_id character varying(36),
    resource_server_id character varying(36) NOT NULL,
    policy_id character varying(36)
);


--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_policy (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255) NOT NULL,
    decision_strategy character varying(20),
    logic character varying(20),
    resource_server_id character varying(36) NOT NULL,
    owner character varying(255)
);


--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_resource (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    icon_uri character varying(255),
    owner character varying(255) NOT NULL,
    resource_server_id character varying(36) NOT NULL,
    owner_managed_access boolean DEFAULT false NOT NULL,
    display_name character varying(255)
);


--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_server_scope (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    icon_uri character varying(255),
    resource_server_id character varying(36) NOT NULL,
    display_name character varying(255)
);


--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_uris (
    resource_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_attribute (
    id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255)
);


--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scope_mapping (
    client_id character varying(36) NOT NULL,
    role_id character varying(36) NOT NULL
);


--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scope_policy (
    scope_id character varying(36) NOT NULL,
    policy_id character varying(36) NOT NULL
);


--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_attribute (
    name character varying(255) NOT NULL,
    value character varying(255),
    user_id character varying(36) NOT NULL,
    id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL
);


--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_consent (
    id character varying(36) NOT NULL,
    client_id character varying(255),
    user_id character varying(36) NOT NULL,
    created_date bigint,
    last_updated_date bigint,
    client_storage_provider character varying(36),
    external_client_id character varying(255)
);


--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_consent_client_scope (
    user_consent_id character varying(36) NOT NULL,
    scope_id character varying(36) NOT NULL
);


--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_entity (
    id character varying(36) NOT NULL,
    email character varying(255),
    email_constraint character varying(255),
    email_verified boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    federation_link character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    realm_id character varying(255),
    username character varying(255),
    created_timestamp bigint,
    service_account_client_link character varying(255),
    not_before integer DEFAULT 0 NOT NULL
);


--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_config (
    user_federation_provider_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_mapper (
    id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    federation_provider_id character varying(36) NOT NULL,
    federation_mapper_type character varying(255) NOT NULL,
    realm_id character varying(36) NOT NULL
);


--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_mapper_config (
    user_federation_mapper_id character varying(36) NOT NULL,
    value character varying(255),
    name character varying(255) NOT NULL
);


--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_federation_provider (
    id character varying(36) NOT NULL,
    changed_sync_period integer,
    display_name character varying(255),
    full_sync_period integer,
    last_sync integer,
    priority integer,
    provider_name character varying(255),
    realm_id character varying(36)
);


--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group_membership (
    group_id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL
);


--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_required_action (
    user_id character varying(36) NOT NULL,
    required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_role_mapping (
    role_id character varying(255) NOT NULL,
    user_id character varying(36) NOT NULL
);


--
-- Name: user_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_session (
    id character varying(36) NOT NULL,
    auth_method character varying(255),
    ip_address character varying(255),
    last_session_refresh integer,
    login_username character varying(255),
    realm_id character varying(255),
    remember_me boolean DEFAULT false NOT NULL,
    started integer,
    user_id character varying(255),
    user_session_state integer,
    broker_session_id character varying(255),
    broker_user_id character varying(255)
);


--
-- Name: user_session_note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_session_note (
    user_session character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(2048)
);


--
-- Name: username_login_failure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.username_login_failure (
    realm_id character varying(36) NOT NULL,
    username character varying(255) NOT NULL,
    failed_login_not_before integer,
    last_failure bigint,
    last_ip_failure character varying(255),
    num_failures integer
);


--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.web_origins (
    client_id character varying(36) NOT NULL,
    value character varying(255) NOT NULL
);


--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
703af00e-8142-4686-be89-86c20e867b6f	9fee10b9-5012-4bba-af72-b870b536afc1
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
f6d8621d-dbd7-498d-9cc4-535a044b1fd2	\N	auth-cookie	3ad74e4d-c3f3-49be-94e9-8999a62aa878	67315390-4507-4252-a88a-f24ae2d9bec5	2	10	f	\N	\N
07c40c9f-9529-472d-b702-dad0bd2987c2	\N	auth-spnego	3ad74e4d-c3f3-49be-94e9-8999a62aa878	67315390-4507-4252-a88a-f24ae2d9bec5	3	20	f	\N	\N
987f0a9f-00e9-4888-b76a-308607c389f9	\N	identity-provider-redirector	3ad74e4d-c3f3-49be-94e9-8999a62aa878	67315390-4507-4252-a88a-f24ae2d9bec5	2	25	f	\N	\N
e6a5636b-8971-4f57-a0b4-f7b99362153c	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	67315390-4507-4252-a88a-f24ae2d9bec5	2	30	t	8cce2478-65b8-4433-a81a-0d1d8a0353c6	\N
4fd68143-abe5-4ad1-b71b-45efa0aa05d6	\N	auth-username-password-form	3ad74e4d-c3f3-49be-94e9-8999a62aa878	8cce2478-65b8-4433-a81a-0d1d8a0353c6	0	10	f	\N	\N
2711c130-9131-433c-b784-c5f90086a742	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	8cce2478-65b8-4433-a81a-0d1d8a0353c6	1	20	t	6de22679-2788-40c1-b3e3-bfa0117a06b1	\N
f474d9a9-9915-4d77-a789-8c8ef5e2589f	\N	conditional-user-configured	3ad74e4d-c3f3-49be-94e9-8999a62aa878	6de22679-2788-40c1-b3e3-bfa0117a06b1	0	10	f	\N	\N
b9dad226-e544-4169-9a9d-c5bd3e6fd7ba	\N	auth-otp-form	3ad74e4d-c3f3-49be-94e9-8999a62aa878	6de22679-2788-40c1-b3e3-bfa0117a06b1	0	20	f	\N	\N
ec8c7e75-fb04-41fb-99a1-bdca4bcf08ed	\N	direct-grant-validate-username	3ad74e4d-c3f3-49be-94e9-8999a62aa878	925bca9b-8040-4f05-9570-c4dc292749a6	0	10	f	\N	\N
ea7a0323-3f56-420f-8b95-adbd8f62c3d8	\N	direct-grant-validate-password	3ad74e4d-c3f3-49be-94e9-8999a62aa878	925bca9b-8040-4f05-9570-c4dc292749a6	0	20	f	\N	\N
f70d91a4-1484-44c6-a7f8-f5e212c69a37	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	925bca9b-8040-4f05-9570-c4dc292749a6	1	30	t	20e196b1-d5e6-4747-9044-4e8e6371895a	\N
278bd52e-91a9-40ec-8028-8f20bec1136a	\N	conditional-user-configured	3ad74e4d-c3f3-49be-94e9-8999a62aa878	20e196b1-d5e6-4747-9044-4e8e6371895a	0	10	f	\N	\N
59cc9d77-9eee-4615-ad14-a300c67d1f1b	\N	direct-grant-validate-otp	3ad74e4d-c3f3-49be-94e9-8999a62aa878	20e196b1-d5e6-4747-9044-4e8e6371895a	0	20	f	\N	\N
436803e8-7a97-40cd-915a-bb45cfbd3051	\N	registration-page-form	3ad74e4d-c3f3-49be-94e9-8999a62aa878	419e04be-ad30-4e3b-9c8e-d3334e375714	0	10	t	ad7279b5-7ddf-4798-852e-98ab969fc656	\N
baa6342e-d050-4135-8a18-c26e40011dd1	\N	registration-user-creation	3ad74e4d-c3f3-49be-94e9-8999a62aa878	ad7279b5-7ddf-4798-852e-98ab969fc656	0	20	f	\N	\N
7affa2f2-405f-4369-be71-7bf5aead9538	\N	registration-profile-action	3ad74e4d-c3f3-49be-94e9-8999a62aa878	ad7279b5-7ddf-4798-852e-98ab969fc656	0	40	f	\N	\N
5d4641f6-3989-4cb7-8f79-91775346cd9b	\N	registration-password-action	3ad74e4d-c3f3-49be-94e9-8999a62aa878	ad7279b5-7ddf-4798-852e-98ab969fc656	0	50	f	\N	\N
c735a488-9798-4b1c-b32f-4c96e4bc2d21	\N	registration-recaptcha-action	3ad74e4d-c3f3-49be-94e9-8999a62aa878	ad7279b5-7ddf-4798-852e-98ab969fc656	3	60	f	\N	\N
e125d1af-2167-4185-9a0d-2d775088b7dc	\N	reset-credentials-choose-user	3ad74e4d-c3f3-49be-94e9-8999a62aa878	90df5430-4530-4fe4-b222-a4267cdaf7db	0	10	f	\N	\N
a27ea855-7af3-4942-bf80-99a08db4d024	\N	reset-credential-email	3ad74e4d-c3f3-49be-94e9-8999a62aa878	90df5430-4530-4fe4-b222-a4267cdaf7db	0	20	f	\N	\N
6f63c1ef-a882-4e05-9810-b1cd92a1fb48	\N	reset-password	3ad74e4d-c3f3-49be-94e9-8999a62aa878	90df5430-4530-4fe4-b222-a4267cdaf7db	0	30	f	\N	\N
7eb4fc07-5d41-4a0e-a404-23f7cb055077	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	90df5430-4530-4fe4-b222-a4267cdaf7db	1	40	t	ddca3d1a-70ce-41c6-8eeb-7af128557b20	\N
3e813f91-1f20-47ee-9b47-05e56cd54563	\N	conditional-user-configured	3ad74e4d-c3f3-49be-94e9-8999a62aa878	ddca3d1a-70ce-41c6-8eeb-7af128557b20	0	10	f	\N	\N
177a3aac-5725-44dd-a55c-a2d9a97637b4	\N	reset-otp	3ad74e4d-c3f3-49be-94e9-8999a62aa878	ddca3d1a-70ce-41c6-8eeb-7af128557b20	0	20	f	\N	\N
7472ff63-e06e-4d83-b1a3-72d768370d71	\N	client-secret	3ad74e4d-c3f3-49be-94e9-8999a62aa878	aeea3f18-7140-4799-bc31-bc523d16e00b	2	10	f	\N	\N
cf230da5-bfc6-4867-8238-6eed54260c3a	\N	client-jwt	3ad74e4d-c3f3-49be-94e9-8999a62aa878	aeea3f18-7140-4799-bc31-bc523d16e00b	2	20	f	\N	\N
8ebced88-6a36-4560-bb32-b8b4695b873b	\N	client-secret-jwt	3ad74e4d-c3f3-49be-94e9-8999a62aa878	aeea3f18-7140-4799-bc31-bc523d16e00b	2	30	f	\N	\N
9d7a00a1-087a-414c-a48f-bd67f684330c	\N	client-x509	3ad74e4d-c3f3-49be-94e9-8999a62aa878	aeea3f18-7140-4799-bc31-bc523d16e00b	2	40	f	\N	\N
37c466c7-c133-4ca7-9043-51773cce3b01	\N	idp-review-profile	3ad74e4d-c3f3-49be-94e9-8999a62aa878	b56073f7-2027-4a40-a84f-1c8a0d9ff8d8	0	10	f	\N	185f527f-8611-44a1-af93-e1f8955a4268
5280a664-b430-4e0a-b99c-8b3a22298c85	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	b56073f7-2027-4a40-a84f-1c8a0d9ff8d8	0	20	t	0f3a7ec1-9f92-4357-ae6c-d8a91b62ede7	\N
c2f1d3d5-1e36-4e76-9464-f0f67b4caf54	\N	idp-create-user-if-unique	3ad74e4d-c3f3-49be-94e9-8999a62aa878	0f3a7ec1-9f92-4357-ae6c-d8a91b62ede7	2	10	f	\N	7dab279f-f892-47a7-9521-66e77ea152ec
5f47cbf5-0690-492b-9f16-762d5c1887fe	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	0f3a7ec1-9f92-4357-ae6c-d8a91b62ede7	2	20	t	e56bb1b9-9540-4fa2-98f4-8a1d54339394	\N
946615ec-3d8a-4bf3-a316-528395958b4e	\N	idp-confirm-link	3ad74e4d-c3f3-49be-94e9-8999a62aa878	e56bb1b9-9540-4fa2-98f4-8a1d54339394	0	10	f	\N	\N
b829b1bf-f079-41ab-be60-35d91a5f0e1f	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	e56bb1b9-9540-4fa2-98f4-8a1d54339394	0	20	t	6c413e88-1227-4c8d-a969-96c713de7a8e	\N
aa68456d-951c-4a64-a41a-5685056a861c	\N	idp-email-verification	3ad74e4d-c3f3-49be-94e9-8999a62aa878	6c413e88-1227-4c8d-a969-96c713de7a8e	2	10	f	\N	\N
8614bda7-f056-4d9c-8b33-525a75dc027c	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	6c413e88-1227-4c8d-a969-96c713de7a8e	2	20	t	a122a441-c3ad-48d8-8600-1a1da9c1ce56	\N
e964d98c-00d1-4c14-999b-01ee6d21c1e4	\N	idp-username-password-form	3ad74e4d-c3f3-49be-94e9-8999a62aa878	a122a441-c3ad-48d8-8600-1a1da9c1ce56	0	10	f	\N	\N
42a6f7df-09c8-4342-8b31-e774bcd01d98	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	a122a441-c3ad-48d8-8600-1a1da9c1ce56	1	20	t	b0a96c5a-8ee8-49e3-a752-cf8b42694b13	\N
ebbc695b-9bb8-46a6-84a1-1af9a1df3086	\N	conditional-user-configured	3ad74e4d-c3f3-49be-94e9-8999a62aa878	b0a96c5a-8ee8-49e3-a752-cf8b42694b13	0	10	f	\N	\N
5eb432f5-5c08-401a-8f22-912b2e74ac1c	\N	auth-otp-form	3ad74e4d-c3f3-49be-94e9-8999a62aa878	b0a96c5a-8ee8-49e3-a752-cf8b42694b13	0	20	f	\N	\N
5169aba9-87c7-4a38-8710-5975f81c216c	\N	http-basic-authenticator	3ad74e4d-c3f3-49be-94e9-8999a62aa878	6afb081f-60af-4b63-a08d-83da1320a22a	0	10	f	\N	\N
13d63ac0-119b-4dad-b247-5996ff74ca91	\N	docker-http-basic-authenticator	3ad74e4d-c3f3-49be-94e9-8999a62aa878	c23f6a31-7fdd-4758-82ee-8270e020ae1d	0	10	f	\N	\N
91fee6e5-b7ee-458a-9c16-442a180fd763	\N	no-cookie-redirect	3ad74e4d-c3f3-49be-94e9-8999a62aa878	a7ef2db8-f03e-4423-8a1f-96a47bb6ca80	0	10	f	\N	\N
17207a04-615d-432a-872c-fa5b8729639b	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	a7ef2db8-f03e-4423-8a1f-96a47bb6ca80	0	20	t	9ecc9d1a-e536-4b03-9af9-deaeb554efe6	\N
c94ef248-7576-458b-a97d-cb9e58ad27e1	\N	basic-auth	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9ecc9d1a-e536-4b03-9af9-deaeb554efe6	0	10	f	\N	\N
c76a2e6b-1334-48f3-97ad-5ff7fba76f2a	\N	basic-auth-otp	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9ecc9d1a-e536-4b03-9af9-deaeb554efe6	3	20	f	\N	\N
e988875b-13ee-4a33-ae49-6faa43ed940c	\N	auth-spnego	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9ecc9d1a-e536-4b03-9af9-deaeb554efe6	3	30	f	\N	\N
03389c40-15c5-475d-90b2-fbc2f2aedce8	\N	idp-email-verification	eee17a22-75b7-4ac9-a844-a9dd52c83d91	094886c5-ea39-482e-98f5-ed28d38f037d	2	10	f	\N	\N
2ee76009-6695-4364-a901-0195c11a4e9d	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	094886c5-ea39-482e-98f5-ed28d38f037d	2	20	t	2c0a4b0f-a220-475e-81d8-e1a900943c33	\N
c8097ab5-354a-4de6-b637-e8e4405aafe1	\N	basic-auth	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c245d00a-0007-4e58-80da-a41034368069	0	10	f	\N	\N
d9b00bf9-d479-4f39-b6fe-c64f0e7ab3a9	\N	basic-auth-otp	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c245d00a-0007-4e58-80da-a41034368069	3	20	f	\N	\N
b4c39fe9-2c27-43b6-a61b-bd22c00ecb1e	\N	auth-spnego	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c245d00a-0007-4e58-80da-a41034368069	3	30	f	\N	\N
c3b16b83-cb69-4b20-a534-999a7250ef60	\N	conditional-user-configured	eee17a22-75b7-4ac9-a844-a9dd52c83d91	05a69006-2d82-4f44-a7ee-9ffe6c01c4ba	0	10	f	\N	\N
3d42ca97-e292-47f0-ae3d-2287eefcb824	\N	auth-otp-form	eee17a22-75b7-4ac9-a844-a9dd52c83d91	05a69006-2d82-4f44-a7ee-9ffe6c01c4ba	0	20	f	\N	\N
009e0acc-c9bd-4043-a7cd-d6a7edc4bfa0	\N	conditional-user-configured	eee17a22-75b7-4ac9-a844-a9dd52c83d91	92554df9-16da-499a-931c-c18aa9af03cc	0	10	f	\N	\N
e91381f2-0f29-4950-a780-c80544a55e3f	\N	direct-grant-validate-otp	eee17a22-75b7-4ac9-a844-a9dd52c83d91	92554df9-16da-499a-931c-c18aa9af03cc	0	20	f	\N	\N
51f4db9c-677f-4960-a1b2-aacae46535cd	\N	conditional-user-configured	eee17a22-75b7-4ac9-a844-a9dd52c83d91	ce105f75-18b8-4f75-b026-5f34220e5d88	0	10	f	\N	\N
7a8cb168-b7fd-4a84-ba76-fd09da097c88	\N	auth-otp-form	eee17a22-75b7-4ac9-a844-a9dd52c83d91	ce105f75-18b8-4f75-b026-5f34220e5d88	0	20	f	\N	\N
6378dda4-86e6-4df5-9326-0bedca66c62a	\N	idp-confirm-link	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1ccaaa81-10d6-4a8d-9e59-474c589caecc	0	10	f	\N	\N
fac06ae3-826f-43b4-bb8c-92f246cb3fa0	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1ccaaa81-10d6-4a8d-9e59-474c589caecc	0	20	t	094886c5-ea39-482e-98f5-ed28d38f037d	\N
c0acd653-d094-4dd3-912d-3d62b3304db3	\N	conditional-user-configured	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c15ccec4-a799-4f8b-89a8-d27d08b0be33	0	10	f	\N	\N
9b6dfcda-5603-4b7b-8acb-663ae835b239	\N	reset-otp	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c15ccec4-a799-4f8b-89a8-d27d08b0be33	0	20	f	\N	\N
b1978d78-4bd2-4977-8e84-779bab08e74d	\N	idp-create-user-if-unique	eee17a22-75b7-4ac9-a844-a9dd52c83d91	b7d4692b-31d5-4d84-be9e-5382b0f82f83	2	10	f	\N	e2f221dd-104e-4626-a3f1-a13b2c5b6e5c
1df71e85-e4df-425e-bafa-e586e909ddd0	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	b7d4692b-31d5-4d84-be9e-5382b0f82f83	2	20	t	1ccaaa81-10d6-4a8d-9e59-474c589caecc	\N
37adcbbd-384f-4626-b42f-544475958a16	\N	idp-username-password-form	eee17a22-75b7-4ac9-a844-a9dd52c83d91	2c0a4b0f-a220-475e-81d8-e1a900943c33	0	10	f	\N	\N
121a5f29-132e-4f4b-99b0-60ff3ce9e368	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	2c0a4b0f-a220-475e-81d8-e1a900943c33	1	20	t	ce105f75-18b8-4f75-b026-5f34220e5d88	\N
dac1eb28-ca9a-4f03-8e0f-3dd182e4ca5f	\N	auth-cookie	eee17a22-75b7-4ac9-a844-a9dd52c83d91	48234375-3f31-450b-b148-b4ebdd9e006e	2	10	f	\N	\N
c5c39df6-4f3a-4128-83ae-6f99cba25532	\N	auth-spnego	eee17a22-75b7-4ac9-a844-a9dd52c83d91	48234375-3f31-450b-b148-b4ebdd9e006e	3	20	f	\N	\N
6e9fe02a-4016-4dca-9e1c-b8f5a505d59a	\N	identity-provider-redirector	eee17a22-75b7-4ac9-a844-a9dd52c83d91	48234375-3f31-450b-b148-b4ebdd9e006e	2	25	f	\N	\N
ad2d7ea5-34ff-40ff-b7be-71d0bb9170c5	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	48234375-3f31-450b-b148-b4ebdd9e006e	2	30	t	d782a542-a22f-4ade-9607-ea2e5abe3db0	\N
2eeb564d-21b6-438b-9332-04aa4eb6db58	\N	client-secret	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1a8ce953-4599-476e-80c6-9bcaf392fbf7	2	10	f	\N	\N
7c5b4ada-4558-4bed-bd40-a3a96c01c66d	\N	client-jwt	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1a8ce953-4599-476e-80c6-9bcaf392fbf7	2	20	f	\N	\N
2dc14a4d-b037-4418-951a-9671345867af	\N	client-secret-jwt	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1a8ce953-4599-476e-80c6-9bcaf392fbf7	2	30	f	\N	\N
5840480a-207a-46a3-a6ef-b7b9b2311495	\N	client-x509	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1a8ce953-4599-476e-80c6-9bcaf392fbf7	2	40	f	\N	\N
a6289cc9-406a-47b9-bcec-481a2f6811f9	\N	direct-grant-validate-username	eee17a22-75b7-4ac9-a844-a9dd52c83d91	d5de58ec-2522-4084-b164-370477291f2e	0	10	f	\N	\N
c664f2e4-f6b2-41f0-b990-6f9b5daa7b5c	\N	direct-grant-validate-password	eee17a22-75b7-4ac9-a844-a9dd52c83d91	d5de58ec-2522-4084-b164-370477291f2e	0	20	f	\N	\N
67840f81-7885-44f5-8195-e69ee1652cb6	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	d5de58ec-2522-4084-b164-370477291f2e	1	30	t	92554df9-16da-499a-931c-c18aa9af03cc	\N
bb5d3228-fccd-43e2-91c9-760003316c03	\N	docker-http-basic-authenticator	eee17a22-75b7-4ac9-a844-a9dd52c83d91	37bf3298-1bae-40b5-8332-018498514b1f	0	10	f	\N	\N
66f7e716-c94b-4e51-9f28-2ec4adbec5ab	\N	idp-review-profile	eee17a22-75b7-4ac9-a844-a9dd52c83d91	9a2e1b48-e007-4fa2-b115-6aa2103cd0ff	0	10	f	\N	9540e153-6270-420f-9660-2cff276a19b3
cb0262d4-55a1-4acd-b733-ced90b63bed5	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	9a2e1b48-e007-4fa2-b115-6aa2103cd0ff	0	20	t	b7d4692b-31d5-4d84-be9e-5382b0f82f83	\N
6227a3d3-ffb6-421a-ba4c-31da28ea7387	\N	auth-username-password-form	eee17a22-75b7-4ac9-a844-a9dd52c83d91	d782a542-a22f-4ade-9607-ea2e5abe3db0	0	10	f	\N	\N
b3e15dcf-55ce-4d46-b332-869fb51d7bac	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	d782a542-a22f-4ade-9607-ea2e5abe3db0	1	20	t	05a69006-2d82-4f44-a7ee-9ffe6c01c4ba	\N
d7692eab-39a8-4358-a443-d37ee3ece058	\N	no-cookie-redirect	eee17a22-75b7-4ac9-a844-a9dd52c83d91	2976fd26-2c2b-444e-ab61-3b8a3250ac7c	0	10	f	\N	\N
0c365ec6-a88d-4cb2-8be6-ec7d126787f6	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	2976fd26-2c2b-444e-ab61-3b8a3250ac7c	0	20	t	c245d00a-0007-4e58-80da-a41034368069	\N
adb44630-e94e-49b1-9e59-df82004c1902	\N	registration-page-form	eee17a22-75b7-4ac9-a844-a9dd52c83d91	31a8354c-9212-4b9d-85e5-a53c764b1b30	0	10	t	c08a5d61-bcb3-4e7d-8ecc-b04f978d705d	\N
0eb4a4da-5704-4d5e-a9a9-3cc504ec4f8b	\N	registration-user-creation	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c08a5d61-bcb3-4e7d-8ecc-b04f978d705d	0	20	f	\N	\N
0700f7a6-82bf-403f-87d1-d0979b4b3a2e	\N	registration-profile-action	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c08a5d61-bcb3-4e7d-8ecc-b04f978d705d	0	40	f	\N	\N
e97b24c2-0ef7-4430-b66f-52f7cbca770b	\N	registration-password-action	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c08a5d61-bcb3-4e7d-8ecc-b04f978d705d	0	50	f	\N	\N
f333a19c-dc43-41ce-a0b9-3e6ec55233c2	\N	registration-recaptcha-action	eee17a22-75b7-4ac9-a844-a9dd52c83d91	c08a5d61-bcb3-4e7d-8ecc-b04f978d705d	3	60	f	\N	\N
7528b3f5-c137-462f-a7d9-200a4c9791a0	\N	reset-credentials-choose-user	eee17a22-75b7-4ac9-a844-a9dd52c83d91	b4fb32ad-448d-4320-90a6-ad8b62d53c9e	0	10	f	\N	\N
3910468c-5f4f-43c5-acb1-05fc74c3d774	\N	reset-credential-email	eee17a22-75b7-4ac9-a844-a9dd52c83d91	b4fb32ad-448d-4320-90a6-ad8b62d53c9e	0	20	f	\N	\N
b130be24-67e7-4fe0-9ad4-d332b828ace3	\N	reset-password	eee17a22-75b7-4ac9-a844-a9dd52c83d91	b4fb32ad-448d-4320-90a6-ad8b62d53c9e	0	30	f	\N	\N
3fc487d2-30c6-408e-b7ed-55f18bac208d	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	b4fb32ad-448d-4320-90a6-ad8b62d53c9e	1	40	t	c15ccec4-a799-4f8b-89a8-d27d08b0be33	\N
6fa7f679-2d42-4bae-beee-6be79356d37a	\N	http-basic-authenticator	eee17a22-75b7-4ac9-a844-a9dd52c83d91	dc8fb268-3d64-4edd-8a52-53b4548dbb26	0	10	f	\N	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
67315390-4507-4252-a88a-f24ae2d9bec5	browser	browser based authentication	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
8cce2478-65b8-4433-a81a-0d1d8a0353c6	forms	Username, password, otp and other auth forms.	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
6de22679-2788-40c1-b3e3-bfa0117a06b1	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
925bca9b-8040-4f05-9570-c4dc292749a6	direct grant	OpenID Connect Resource Owner Grant	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
20e196b1-d5e6-4747-9044-4e8e6371895a	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
419e04be-ad30-4e3b-9c8e-d3334e375714	registration	registration flow	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
ad7279b5-7ddf-4798-852e-98ab969fc656	registration form	registration form	3ad74e4d-c3f3-49be-94e9-8999a62aa878	form-flow	f	t
90df5430-4530-4fe4-b222-a4267cdaf7db	reset credentials	Reset credentials for a user if they forgot their password or something	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
ddca3d1a-70ce-41c6-8eeb-7af128557b20	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
aeea3f18-7140-4799-bc31-bc523d16e00b	clients	Base authentication for clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	client-flow	t	t
b56073f7-2027-4a40-a84f-1c8a0d9ff8d8	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
0f3a7ec1-9f92-4357-ae6c-d8a91b62ede7	User creation or linking	Flow for the existing/non-existing user alternatives	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
e56bb1b9-9540-4fa2-98f4-8a1d54339394	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
6c413e88-1227-4c8d-a969-96c713de7a8e	Account verification options	Method with which to verity the existing account	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
a122a441-c3ad-48d8-8600-1a1da9c1ce56	Verify Existing Account by Re-authentication	Reauthentication of existing account	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
b0a96c5a-8ee8-49e3-a752-cf8b42694b13	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
6afb081f-60af-4b63-a08d-83da1320a22a	saml ecp	SAML ECP Profile Authentication Flow	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
c23f6a31-7fdd-4758-82ee-8270e020ae1d	docker auth	Used by Docker clients to authenticate against the IDP	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
a7ef2db8-f03e-4423-8a1f-96a47bb6ca80	http challenge	An authentication flow based on challenge-response HTTP Authentication Schemes	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	t	t
9ecc9d1a-e536-4b03-9af9-deaeb554efe6	Authentication Options	Authentication options.	3ad74e4d-c3f3-49be-94e9-8999a62aa878	basic-flow	f	t
094886c5-ea39-482e-98f5-ed28d38f037d	Account verification options	Method with which to verity the existing account	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
c245d00a-0007-4e58-80da-a41034368069	Authentication Options	Authentication options.	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
05a69006-2d82-4f44-a7ee-9ffe6c01c4ba	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
92554df9-16da-499a-931c-c18aa9af03cc	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
ce105f75-18b8-4f75-b026-5f34220e5d88	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
1ccaaa81-10d6-4a8d-9e59-474c589caecc	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
c15ccec4-a799-4f8b-89a8-d27d08b0be33	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
b7d4692b-31d5-4d84-be9e-5382b0f82f83	User creation or linking	Flow for the existing/non-existing user alternatives	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
2c0a4b0f-a220-475e-81d8-e1a900943c33	Verify Existing Account by Re-authentication	Reauthentication of existing account	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
48234375-3f31-450b-b148-b4ebdd9e006e	browser	browser based authentication	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
1a8ce953-4599-476e-80c6-9bcaf392fbf7	clients	Base authentication for clients	eee17a22-75b7-4ac9-a844-a9dd52c83d91	client-flow	t	t
d5de58ec-2522-4084-b164-370477291f2e	direct grant	OpenID Connect Resource Owner Grant	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
37bf3298-1bae-40b5-8332-018498514b1f	docker auth	Used by Docker clients to authenticate against the IDP	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
9a2e1b48-e007-4fa2-b115-6aa2103cd0ff	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
d782a542-a22f-4ade-9607-ea2e5abe3db0	forms	Username, password, otp and other auth forms.	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	f	t
2976fd26-2c2b-444e-ab61-3b8a3250ac7c	http challenge	An authentication flow based on challenge-response HTTP Authentication Schemes	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
31a8354c-9212-4b9d-85e5-a53c764b1b30	registration	registration flow	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
c08a5d61-bcb3-4e7d-8ecc-b04f978d705d	registration form	registration form	eee17a22-75b7-4ac9-a844-a9dd52c83d91	form-flow	f	t
b4fb32ad-448d-4320-90a6-ad8b62d53c9e	reset credentials	Reset credentials for a user if they forgot their password or something	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
dc8fb268-3d64-4edd-8a52-53b4548dbb26	saml ecp	SAML ECP Profile Authentication Flow	eee17a22-75b7-4ac9-a844-a9dd52c83d91	basic-flow	t	t
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
185f527f-8611-44a1-af93-e1f8955a4268	review profile config	3ad74e4d-c3f3-49be-94e9-8999a62aa878
7dab279f-f892-47a7-9521-66e77ea152ec	create unique user config	3ad74e4d-c3f3-49be-94e9-8999a62aa878
e2f221dd-104e-4626-a3f1-a13b2c5b6e5c	create unique user config	eee17a22-75b7-4ac9-a844-a9dd52c83d91
9540e153-6270-420f-9660-2cff276a19b3	review profile config	eee17a22-75b7-4ac9-a844-a9dd52c83d91
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
185f527f-8611-44a1-af93-e1f8955a4268	missing	update.profile.on.first.login
7dab279f-f892-47a7-9521-66e77ea152ec	false	require.password.update.after.registration
9540e153-6270-420f-9660-2cff276a19b3	missing	update.profile.on.first.login
e2f221dd-104e-4626-a3f1-a13b2c5b6e5c	false	require.password.update.after.registration
\.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
659fec1b-26c9-4eb0-924f-5aae63a5985f	t	f	master-realm	0	f	\N	\N	t	\N	f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
1becba53-c352-4349-8814-9c03b63dfe00	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
690d9ca3-295e-4fcc-bbef-da87d5b418be	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
0c76b7d5-f93f-42b8-a74d-07838831d851	t	f	broker	0	f	\N	\N	t	\N	f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
5e0362a6-cd82-4108-9c0a-dadfe944eb54	t	f	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	t	f	admin-cli	0	f	b19YXoPSR50E3xsSBJHBDDdjYPCj3JvK	http://localhost:3000	f		f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	openid-connect	0	f	f	${client_admin-cli}	t	client-secret	http://localhost:3000		\N	f	f	t	f
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	t	f	security-admin-console	0	t	\N	/admin/showcase/console/	f	\N	f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
9f041010-887d-426e-811e-2ab07ca84a96	t	f	showcase-realm	0	f	\N	\N	t	\N	f	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	0	f	f	showcase Realm	f	client-secret	\N	\N	\N	t	f	f	f
34262697-003e-4c57-a55f-241bb014a8a7	t	f	account	0	t	\N	/realms/showcase/account/	f	\N	f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
c3fa9f4d-ca56-401b-a799-f291488773c0	t	t	showcase-auth	0	t	\N	http://localhost:3000/	f		f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	-1	t	f	Showcase Auth	f	client-secret	http://localhost:3000/		\N	t	f	t	f
0b25b475-7074-4ce8-85a6-b32fb28bd048	t	f	realm-management	0	f	\N	\N	f	\N	f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	0	f	f	${client_realm-management}	t	client-secret	\N	\N	\N	t	f	f	f
a143887d-b1d6-4c25-9e62-81f11b0fdd81	t	f	account-console	0	t	\N	/realms/showcase/account/	f	\N	f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
7cd5b438-6539-4dc2-8222-4500eaa6c508	t	f	admin-cli	0	f	eXqrcJ2mHLwLaZCXoUlBFcUiYFdY6cCu	http://localhost:3000	f		f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	0	f	f	${client_admin-cli}	t	client-secret	http://localhost:3000		\N	f	f	t	f
14434784-2168-489e-8b3d-b5121fa76ce1	t	f	broker	0	f	\N	\N	t	\N	f	eee17a22-75b7-4ac9-a844-a9dd52c83d91	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_attributes (client_id, value, name) FROM stdin;
1becba53-c352-4349-8814-9c03b63dfe00	+	post.logout.redirect.uris
690d9ca3-295e-4fcc-bbef-da87d5b418be	+	post.logout.redirect.uris
690d9ca3-295e-4fcc-bbef-da87d5b418be	S256	pkce.code.challenge.method
5e0362a6-cd82-4108-9c0a-dadfe944eb54	+	post.logout.redirect.uris
5e0362a6-cd82-4108-9c0a-dadfe944eb54	S256	pkce.code.challenge.method
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	false	oauth2.device.authorization.grant.enabled
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	false	oidc.ciba.grant.enabled
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	false	display.on.consent.screen
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	true	backchannel.logout.session.required
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	false	backchannel.logout.revoke.offline.tokens
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	1685720009	client.secret.creation.time
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	http://localhost:3000	backchannel.logout.url
34262697-003e-4c57-a55f-241bb014a8a7	+	post.logout.redirect.uris
a143887d-b1d6-4c25-9e62-81f11b0fdd81	+	post.logout.redirect.uris
a143887d-b1d6-4c25-9e62-81f11b0fdd81	S256	pkce.code.challenge.method
7cd5b438-6539-4dc2-8222-4500eaa6c508	false	oidc.ciba.grant.enabled
7cd5b438-6539-4dc2-8222-4500eaa6c508	true	backchannel.logout.session.required
7cd5b438-6539-4dc2-8222-4500eaa6c508	http://localhost:3000	backchannel.logout.url
7cd5b438-6539-4dc2-8222-4500eaa6c508	http://localhost:3000	post.logout.redirect.uris
7cd5b438-6539-4dc2-8222-4500eaa6c508	false	display.on.consent.screen
7cd5b438-6539-4dc2-8222-4500eaa6c508	false	oauth2.device.authorization.grant.enabled
7cd5b438-6539-4dc2-8222-4500eaa6c508	false	use.jwks.url
7cd5b438-6539-4dc2-8222-4500eaa6c508	false	backchannel.logout.revoke.offline.tokens
14434784-2168-489e-8b3d-b5121fa76ce1	+	post.logout.redirect.uris
0b25b475-7074-4ce8-85a6-b32fb28bd048	+	post.logout.redirect.uris
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	+	post.logout.redirect.uris
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	S256	pkce.code.challenge.method
c3fa9f4d-ca56-401b-a799-f291488773c0	false	oidc.ciba.grant.enabled
c3fa9f4d-ca56-401b-a799-f291488773c0	true	backchannel.logout.session.required
c3fa9f4d-ca56-401b-a799-f291488773c0	http://localhost:3000	backchannel.logout.url
c3fa9f4d-ca56-401b-a799-f291488773c0	http://localhost:3000/	post.logout.redirect.uris
c3fa9f4d-ca56-401b-a799-f291488773c0	false	display.on.consent.screen
c3fa9f4d-ca56-401b-a799-f291488773c0	false	oauth2.device.authorization.grant.enabled
c3fa9f4d-ca56-401b-a799-f291488773c0	false	backchannel.logout.revoke.offline.tokens
7cd5b438-6539-4dc2-8222-4500eaa6c508	1685722157	client.secret.creation.time
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
e69d9b90-3997-4d54-8a17-db5a1dfe2138	offline_access	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect built-in scope: offline_access	openid-connect
c3000c03-a1fa-4bfc-bf5b-0ae82eea7044	role_list	3ad74e4d-c3f3-49be-94e9-8999a62aa878	SAML role list	saml
73255b0a-ab8e-434b-bfbf-8790c07d04d1	profile	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect built-in scope: profile	openid-connect
856672ff-10dc-4fd3-97fc-bab3e06a2e2e	email	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect built-in scope: email	openid-connect
782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	address	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect built-in scope: address	openid-connect
e1448427-2df5-40cf-9200-c3b75410023c	phone	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect built-in scope: phone	openid-connect
b608d51d-b6fa-4dfa-9610-f79e7e95ff85	roles	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect scope for add user roles to the access token	openid-connect
81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	web-origins	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect scope for add allowed web origins to the access token	openid-connect
f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	microprofile-jwt	3ad74e4d-c3f3-49be-94e9-8999a62aa878	Microprofile - JWT built-in scope	openid-connect
57ecc5c1-220d-4050-aedb-f34faff67f10	acr	3ad74e4d-c3f3-49be-94e9-8999a62aa878	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
1f2f9597-8dab-4779-bffe-47c6695deafe	phone	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect built-in scope: phone	openid-connect
e0d406b7-3601-45c1-8131-2585eeb37060	microprofile-jwt	eee17a22-75b7-4ac9-a844-a9dd52c83d91	Microprofile - JWT built-in scope	openid-connect
9a3add25-e9e2-48f9-8d0f-c9595ca3998e	profile	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect built-in scope: profile	openid-connect
6420ab5b-9e2f-477d-ac2d-03e511c567ca	address	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect built-in scope: address	openid-connect
018368f4-e0f5-4737-875b-a6139276236b	roles	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect scope for add user roles to the access token	openid-connect
55654cb7-8fa1-481d-bba3-45ae74299567	role_list	eee17a22-75b7-4ac9-a844-a9dd52c83d91	SAML role list	saml
2e41b0c5-9570-4667-9bfd-d132f86e1d37	acr	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
27ab1952-e2d1-4836-8e30-5abc4fbe1b38	offline_access	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect built-in scope: offline_access	openid-connect
592391bb-095c-4a2a-b698-b0e622c16aa5	email	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect built-in scope: email	openid-connect
d671cd38-1d4f-4a87-9211-5183a7e3469f	web-origins	eee17a22-75b7-4ac9-a844-a9dd52c83d91	OpenID Connect scope for add allowed web origins to the access token	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
e69d9b90-3997-4d54-8a17-db5a1dfe2138	true	display.on.consent.screen
e69d9b90-3997-4d54-8a17-db5a1dfe2138	${offlineAccessScopeConsentText}	consent.screen.text
c3000c03-a1fa-4bfc-bf5b-0ae82eea7044	true	display.on.consent.screen
c3000c03-a1fa-4bfc-bf5b-0ae82eea7044	${samlRoleListScopeConsentText}	consent.screen.text
73255b0a-ab8e-434b-bfbf-8790c07d04d1	true	display.on.consent.screen
73255b0a-ab8e-434b-bfbf-8790c07d04d1	${profileScopeConsentText}	consent.screen.text
73255b0a-ab8e-434b-bfbf-8790c07d04d1	true	include.in.token.scope
856672ff-10dc-4fd3-97fc-bab3e06a2e2e	true	display.on.consent.screen
856672ff-10dc-4fd3-97fc-bab3e06a2e2e	${emailScopeConsentText}	consent.screen.text
856672ff-10dc-4fd3-97fc-bab3e06a2e2e	true	include.in.token.scope
782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	true	display.on.consent.screen
782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	${addressScopeConsentText}	consent.screen.text
782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	true	include.in.token.scope
e1448427-2df5-40cf-9200-c3b75410023c	true	display.on.consent.screen
e1448427-2df5-40cf-9200-c3b75410023c	${phoneScopeConsentText}	consent.screen.text
e1448427-2df5-40cf-9200-c3b75410023c	true	include.in.token.scope
b608d51d-b6fa-4dfa-9610-f79e7e95ff85	true	display.on.consent.screen
b608d51d-b6fa-4dfa-9610-f79e7e95ff85	${rolesScopeConsentText}	consent.screen.text
b608d51d-b6fa-4dfa-9610-f79e7e95ff85	false	include.in.token.scope
81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	false	display.on.consent.screen
81ca9dda-42a6-4e4c-87b3-e9b73c8c3325		consent.screen.text
81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	false	include.in.token.scope
f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	false	display.on.consent.screen
f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	true	include.in.token.scope
57ecc5c1-220d-4050-aedb-f34faff67f10	false	display.on.consent.screen
57ecc5c1-220d-4050-aedb-f34faff67f10	false	include.in.token.scope
9a3add25-e9e2-48f9-8d0f-c9595ca3998e	true	include.in.token.scope
9a3add25-e9e2-48f9-8d0f-c9595ca3998e	true	display.on.consent.screen
9a3add25-e9e2-48f9-8d0f-c9595ca3998e	${profileScopeConsentText}	consent.screen.text
6420ab5b-9e2f-477d-ac2d-03e511c567ca	true	include.in.token.scope
6420ab5b-9e2f-477d-ac2d-03e511c567ca	true	display.on.consent.screen
6420ab5b-9e2f-477d-ac2d-03e511c567ca	${addressScopeConsentText}	consent.screen.text
018368f4-e0f5-4737-875b-a6139276236b	false	include.in.token.scope
018368f4-e0f5-4737-875b-a6139276236b	true	display.on.consent.screen
018368f4-e0f5-4737-875b-a6139276236b	${rolesScopeConsentText}	consent.screen.text
55654cb7-8fa1-481d-bba3-45ae74299567	${samlRoleListScopeConsentText}	consent.screen.text
55654cb7-8fa1-481d-bba3-45ae74299567	true	display.on.consent.screen
2e41b0c5-9570-4667-9bfd-d132f86e1d37	false	include.in.token.scope
2e41b0c5-9570-4667-9bfd-d132f86e1d37	false	display.on.consent.screen
27ab1952-e2d1-4836-8e30-5abc4fbe1b38	${offlineAccessScopeConsentText}	consent.screen.text
27ab1952-e2d1-4836-8e30-5abc4fbe1b38	true	display.on.consent.screen
592391bb-095c-4a2a-b698-b0e622c16aa5	true	include.in.token.scope
592391bb-095c-4a2a-b698-b0e622c16aa5	true	display.on.consent.screen
592391bb-095c-4a2a-b698-b0e622c16aa5	${emailScopeConsentText}	consent.screen.text
d671cd38-1d4f-4a87-9211-5183a7e3469f	false	include.in.token.scope
d671cd38-1d4f-4a87-9211-5183a7e3469f	false	display.on.consent.screen
d671cd38-1d4f-4a87-9211-5183a7e3469f		consent.screen.text
1f2f9597-8dab-4779-bffe-47c6695deafe	true	include.in.token.scope
1f2f9597-8dab-4779-bffe-47c6695deafe	true	display.on.consent.screen
1f2f9597-8dab-4779-bffe-47c6695deafe	${phoneScopeConsentText}	consent.screen.text
e0d406b7-3601-45c1-8131-2585eeb37060	true	include.in.token.scope
e0d406b7-3601-45c1-8131-2585eeb37060	false	display.on.consent.screen
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
1becba53-c352-4349-8814-9c03b63dfe00	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
1becba53-c352-4349-8814-9c03b63dfe00	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
1becba53-c352-4349-8814-9c03b63dfe00	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
1becba53-c352-4349-8814-9c03b63dfe00	57ecc5c1-220d-4050-aedb-f34faff67f10	t
1becba53-c352-4349-8814-9c03b63dfe00	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
1becba53-c352-4349-8814-9c03b63dfe00	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
1becba53-c352-4349-8814-9c03b63dfe00	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
1becba53-c352-4349-8814-9c03b63dfe00	e1448427-2df5-40cf-9200-c3b75410023c	f
1becba53-c352-4349-8814-9c03b63dfe00	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
690d9ca3-295e-4fcc-bbef-da87d5b418be	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
690d9ca3-295e-4fcc-bbef-da87d5b418be	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
690d9ca3-295e-4fcc-bbef-da87d5b418be	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
690d9ca3-295e-4fcc-bbef-da87d5b418be	57ecc5c1-220d-4050-aedb-f34faff67f10	t
690d9ca3-295e-4fcc-bbef-da87d5b418be	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
690d9ca3-295e-4fcc-bbef-da87d5b418be	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
690d9ca3-295e-4fcc-bbef-da87d5b418be	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
690d9ca3-295e-4fcc-bbef-da87d5b418be	e1448427-2df5-40cf-9200-c3b75410023c	f
690d9ca3-295e-4fcc-bbef-da87d5b418be	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	57ecc5c1-220d-4050-aedb-f34faff67f10	t
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	e1448427-2df5-40cf-9200-c3b75410023c	f
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
0c76b7d5-f93f-42b8-a74d-07838831d851	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
0c76b7d5-f93f-42b8-a74d-07838831d851	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
0c76b7d5-f93f-42b8-a74d-07838831d851	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
0c76b7d5-f93f-42b8-a74d-07838831d851	57ecc5c1-220d-4050-aedb-f34faff67f10	t
0c76b7d5-f93f-42b8-a74d-07838831d851	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
0c76b7d5-f93f-42b8-a74d-07838831d851	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
0c76b7d5-f93f-42b8-a74d-07838831d851	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
0c76b7d5-f93f-42b8-a74d-07838831d851	e1448427-2df5-40cf-9200-c3b75410023c	f
0c76b7d5-f93f-42b8-a74d-07838831d851	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
659fec1b-26c9-4eb0-924f-5aae63a5985f	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
659fec1b-26c9-4eb0-924f-5aae63a5985f	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
659fec1b-26c9-4eb0-924f-5aae63a5985f	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
659fec1b-26c9-4eb0-924f-5aae63a5985f	57ecc5c1-220d-4050-aedb-f34faff67f10	t
659fec1b-26c9-4eb0-924f-5aae63a5985f	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
659fec1b-26c9-4eb0-924f-5aae63a5985f	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
659fec1b-26c9-4eb0-924f-5aae63a5985f	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
659fec1b-26c9-4eb0-924f-5aae63a5985f	e1448427-2df5-40cf-9200-c3b75410023c	f
659fec1b-26c9-4eb0-924f-5aae63a5985f	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
5e0362a6-cd82-4108-9c0a-dadfe944eb54	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
5e0362a6-cd82-4108-9c0a-dadfe944eb54	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
5e0362a6-cd82-4108-9c0a-dadfe944eb54	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
5e0362a6-cd82-4108-9c0a-dadfe944eb54	57ecc5c1-220d-4050-aedb-f34faff67f10	t
5e0362a6-cd82-4108-9c0a-dadfe944eb54	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
5e0362a6-cd82-4108-9c0a-dadfe944eb54	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
5e0362a6-cd82-4108-9c0a-dadfe944eb54	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
5e0362a6-cd82-4108-9c0a-dadfe944eb54	e1448427-2df5-40cf-9200-c3b75410023c	f
5e0362a6-cd82-4108-9c0a-dadfe944eb54	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
34262697-003e-4c57-a55f-241bb014a8a7	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
34262697-003e-4c57-a55f-241bb014a8a7	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
34262697-003e-4c57-a55f-241bb014a8a7	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
34262697-003e-4c57-a55f-241bb014a8a7	018368f4-e0f5-4737-875b-a6139276236b	t
34262697-003e-4c57-a55f-241bb014a8a7	592391bb-095c-4a2a-b698-b0e622c16aa5	t
34262697-003e-4c57-a55f-241bb014a8a7	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
34262697-003e-4c57-a55f-241bb014a8a7	1f2f9597-8dab-4779-bffe-47c6695deafe	f
34262697-003e-4c57-a55f-241bb014a8a7	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
34262697-003e-4c57-a55f-241bb014a8a7	e0d406b7-3601-45c1-8131-2585eeb37060	f
a143887d-b1d6-4c25-9e62-81f11b0fdd81	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
a143887d-b1d6-4c25-9e62-81f11b0fdd81	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
a143887d-b1d6-4c25-9e62-81f11b0fdd81	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
a143887d-b1d6-4c25-9e62-81f11b0fdd81	018368f4-e0f5-4737-875b-a6139276236b	t
a143887d-b1d6-4c25-9e62-81f11b0fdd81	592391bb-095c-4a2a-b698-b0e622c16aa5	t
a143887d-b1d6-4c25-9e62-81f11b0fdd81	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
a143887d-b1d6-4c25-9e62-81f11b0fdd81	1f2f9597-8dab-4779-bffe-47c6695deafe	f
a143887d-b1d6-4c25-9e62-81f11b0fdd81	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
a143887d-b1d6-4c25-9e62-81f11b0fdd81	e0d406b7-3601-45c1-8131-2585eeb37060	f
7cd5b438-6539-4dc2-8222-4500eaa6c508	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
7cd5b438-6539-4dc2-8222-4500eaa6c508	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
7cd5b438-6539-4dc2-8222-4500eaa6c508	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
7cd5b438-6539-4dc2-8222-4500eaa6c508	018368f4-e0f5-4737-875b-a6139276236b	t
7cd5b438-6539-4dc2-8222-4500eaa6c508	592391bb-095c-4a2a-b698-b0e622c16aa5	t
7cd5b438-6539-4dc2-8222-4500eaa6c508	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
7cd5b438-6539-4dc2-8222-4500eaa6c508	1f2f9597-8dab-4779-bffe-47c6695deafe	f
7cd5b438-6539-4dc2-8222-4500eaa6c508	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
7cd5b438-6539-4dc2-8222-4500eaa6c508	e0d406b7-3601-45c1-8131-2585eeb37060	f
14434784-2168-489e-8b3d-b5121fa76ce1	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
14434784-2168-489e-8b3d-b5121fa76ce1	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
14434784-2168-489e-8b3d-b5121fa76ce1	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
14434784-2168-489e-8b3d-b5121fa76ce1	018368f4-e0f5-4737-875b-a6139276236b	t
14434784-2168-489e-8b3d-b5121fa76ce1	592391bb-095c-4a2a-b698-b0e622c16aa5	t
14434784-2168-489e-8b3d-b5121fa76ce1	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
14434784-2168-489e-8b3d-b5121fa76ce1	1f2f9597-8dab-4779-bffe-47c6695deafe	f
14434784-2168-489e-8b3d-b5121fa76ce1	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
14434784-2168-489e-8b3d-b5121fa76ce1	e0d406b7-3601-45c1-8131-2585eeb37060	f
0b25b475-7074-4ce8-85a6-b32fb28bd048	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
0b25b475-7074-4ce8-85a6-b32fb28bd048	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
0b25b475-7074-4ce8-85a6-b32fb28bd048	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
0b25b475-7074-4ce8-85a6-b32fb28bd048	018368f4-e0f5-4737-875b-a6139276236b	t
0b25b475-7074-4ce8-85a6-b32fb28bd048	592391bb-095c-4a2a-b698-b0e622c16aa5	t
0b25b475-7074-4ce8-85a6-b32fb28bd048	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
0b25b475-7074-4ce8-85a6-b32fb28bd048	1f2f9597-8dab-4779-bffe-47c6695deafe	f
0b25b475-7074-4ce8-85a6-b32fb28bd048	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
0b25b475-7074-4ce8-85a6-b32fb28bd048	e0d406b7-3601-45c1-8131-2585eeb37060	f
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	018368f4-e0f5-4737-875b-a6139276236b	t
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	592391bb-095c-4a2a-b698-b0e622c16aa5	t
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	1f2f9597-8dab-4779-bffe-47c6695deafe	f
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	e0d406b7-3601-45c1-8131-2585eeb37060	f
c3fa9f4d-ca56-401b-a799-f291488773c0	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
c3fa9f4d-ca56-401b-a799-f291488773c0	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
c3fa9f4d-ca56-401b-a799-f291488773c0	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
c3fa9f4d-ca56-401b-a799-f291488773c0	018368f4-e0f5-4737-875b-a6139276236b	t
c3fa9f4d-ca56-401b-a799-f291488773c0	592391bb-095c-4a2a-b698-b0e622c16aa5	t
c3fa9f4d-ca56-401b-a799-f291488773c0	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
c3fa9f4d-ca56-401b-a799-f291488773c0	1f2f9597-8dab-4779-bffe-47c6695deafe	f
c3fa9f4d-ca56-401b-a799-f291488773c0	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
c3fa9f4d-ca56-401b-a799-f291488773c0	e0d406b7-3601-45c1-8131-2585eeb37060	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
e69d9b90-3997-4d54-8a17-db5a1dfe2138	e85f8e66-0030-4d42-8f5f-36bba6279ad2
27ab1952-e2d1-4836-8e30-5abc4fbe1b38	27b58e14-4dc1-46a2-b51f-581b021bf987
\.


--
-- Data for Name: client_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_session (id, client_id, redirect_uri, state, "timestamp", session_id, auth_method, realm_id, auth_user_id, current_action) FROM stdin;
\.


--
-- Data for Name: client_session_auth_status; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_session_auth_status (authenticator, status, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_note; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_prot_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_session_prot_mapper (protocol_mapper_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_session_role (role_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_user_session_note; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_user_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
97342771-fce4-4f7b-837a-947477bc1842	Trusted Hosts	3ad74e4d-c3f3-49be-94e9-8999a62aa878	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	anonymous
6597c990-7329-4e32-b61f-77bf41efeb53	Consent Required	3ad74e4d-c3f3-49be-94e9-8999a62aa878	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	anonymous
1fe5efec-c300-46c5-91aa-4c9be6c2cf61	Full Scope Disabled	3ad74e4d-c3f3-49be-94e9-8999a62aa878	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	anonymous
72d6ffbd-d0dc-45e1-8b17-96f19d3292bb	Max Clients Limit	3ad74e4d-c3f3-49be-94e9-8999a62aa878	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	anonymous
e28e03a6-d5d2-4c07-83c1-22fd72b0685f	Allowed Protocol Mapper Types	3ad74e4d-c3f3-49be-94e9-8999a62aa878	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	anonymous
1478fd08-2f7c-4c21-b620-2e4c3a13b8de	Allowed Client Scopes	3ad74e4d-c3f3-49be-94e9-8999a62aa878	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	anonymous
b36d1e3f-a789-4cb2-9da4-82dca2b45027	Allowed Protocol Mapper Types	3ad74e4d-c3f3-49be-94e9-8999a62aa878	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	authenticated
526048a0-8329-475c-b7a0-a1aed9edbcd5	Allowed Client Scopes	3ad74e4d-c3f3-49be-94e9-8999a62aa878	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	authenticated
3721ce67-abfa-4fef-bf11-925e893e84ef	rsa-generated	3ad74e4d-c3f3-49be-94e9-8999a62aa878	rsa-generated	org.keycloak.keys.KeyProvider	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N
ac3e3b26-7874-425b-8c4d-47e35ec7299e	rsa-enc-generated	3ad74e4d-c3f3-49be-94e9-8999a62aa878	rsa-enc-generated	org.keycloak.keys.KeyProvider	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N
f69013cc-b3e0-4239-9dfa-6dff58cf6736	hmac-generated	3ad74e4d-c3f3-49be-94e9-8999a62aa878	hmac-generated	org.keycloak.keys.KeyProvider	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N
37a48b2a-aac3-49b1-acf0-4335fd636752	aes-generated	3ad74e4d-c3f3-49be-94e9-8999a62aa878	aes-generated	org.keycloak.keys.KeyProvider	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N
4ada9823-cc3d-4030-aa1f-1e74c67079c6	Consent Required	eee17a22-75b7-4ac9-a844-a9dd52c83d91	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	anonymous
ff19829f-ad8b-4a0e-ac5f-5279732037df	Allowed Protocol Mapper Types	eee17a22-75b7-4ac9-a844-a9dd52c83d91	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	anonymous
05410241-36bf-41c8-b80d-84684e991b36	Trusted Hosts	eee17a22-75b7-4ac9-a844-a9dd52c83d91	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	anonymous
f60c8f12-2b84-4f07-812b-b8e496a12c78	Full Scope Disabled	eee17a22-75b7-4ac9-a844-a9dd52c83d91	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	anonymous
bd725465-4a05-49eb-97fa-98128d430fb5	Allowed Client Scopes	eee17a22-75b7-4ac9-a844-a9dd52c83d91	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	anonymous
266f153c-7a0a-4281-ad28-f2985285a232	Allowed Protocol Mapper Types	eee17a22-75b7-4ac9-a844-a9dd52c83d91	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	authenticated
288bbc34-b377-48b6-a2ca-0b00212a75bb	Allowed Client Scopes	eee17a22-75b7-4ac9-a844-a9dd52c83d91	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	authenticated
39f6d708-32d0-455f-8da1-0add0d0388e1	Max Clients Limit	eee17a22-75b7-4ac9-a844-a9dd52c83d91	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	anonymous
dca4f0e5-7ff4-4316-8fae-991203af7e05	hmac-generated	eee17a22-75b7-4ac9-a844-a9dd52c83d91	hmac-generated	org.keycloak.keys.KeyProvider	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N
fad036bf-730a-4f2e-95fa-48aec703da2a	aes-generated	eee17a22-75b7-4ac9-a844-a9dd52c83d91	aes-generated	org.keycloak.keys.KeyProvider	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N
ddca9b77-14a0-4ff6-afb8-1000cd995a13	rsa-enc-generated	eee17a22-75b7-4ac9-a844-a9dd52c83d91	rsa-enc-generated	org.keycloak.keys.KeyProvider	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N
019ec1c2-2d57-4aeb-9a13-8f9cb4fcc4d6	rsa-generated	eee17a22-75b7-4ac9-a844-a9dd52c83d91	rsa-generated	org.keycloak.keys.KeyProvider	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
d7547d95-afe8-4f63-9b0c-4ff67d5985af	72d6ffbd-d0dc-45e1-8b17-96f19d3292bb	max-clients	200
81440f16-a408-430e-8f0f-cf659ddfb01c	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
c6422e82-584e-406a-bcda-2281de36a3c3	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	saml-user-attribute-mapper
bb0298d8-98f0-4d11-81e9-ba0f6ff10197	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	saml-user-property-mapper
1c07a8ea-b398-420e-a2e1-b6d57258f684	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	oidc-address-mapper
61846e89-6386-4cef-9850-1fba2e20631c	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	saml-role-list-mapper
18bef433-8819-4703-b0a9-f7d528eac14f	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	oidc-full-name-mapper
264aca32-8827-449c-891b-9b50f7306fe5	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
6c1f6288-91f9-4f47-9525-07669e1ac3e6	b36d1e3f-a789-4cb2-9da4-82dca2b45027	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
06833791-f74a-4546-8d98-74368a951363	1478fd08-2f7c-4c21-b620-2e4c3a13b8de	allow-default-scopes	true
de5fb84d-4fbd-425e-b104-ec856cf758be	97342771-fce4-4f7b-837a-947477bc1842	host-sending-registration-request-must-match	true
6529da9d-5f1d-43f5-a407-9759ca002682	97342771-fce4-4f7b-837a-947477bc1842	client-uris-must-match	true
b66cf686-05a7-4cb6-906c-d3febf5037a3	526048a0-8329-475c-b7a0-a1aed9edbcd5	allow-default-scopes	true
3e9aa4da-daef-4cef-b46b-3ce65bea51bd	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	saml-role-list-mapper
d2ef27e0-359c-4195-98d2-5ce525d36888	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	saml-user-attribute-mapper
f4061cfc-29d6-4d7c-8cdf-04c5e40ad2a2	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	oidc-full-name-mapper
fd0401ad-9ab5-4046-adef-472740eee32a	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
b21d465a-1fc7-4f93-981a-2c933853c9c8	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
3e8fdf19-4253-480b-a50a-86249697d6b3	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	oidc-address-mapper
a3fe7a2e-7ab0-4b9f-a951-334b4d9583ae	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
be86d8e5-a4e0-4bd7-b05e-9ea352ca8455	e28e03a6-d5d2-4c07-83c1-22fd72b0685f	allowed-protocol-mapper-types	saml-user-property-mapper
c737e2cc-e6f9-4a0a-b2d7-fcf5aeeddc6e	37a48b2a-aac3-49b1-acf0-4335fd636752	secret	Vxc2T2NFKpYTx1u2C4Fv_g
fae34482-5747-4db0-8e62-33a507fb3ea4	37a48b2a-aac3-49b1-acf0-4335fd636752	priority	100
4198e055-6611-4526-a3f4-20150d71f369	37a48b2a-aac3-49b1-acf0-4335fd636752	kid	5cbba979-9df0-4ef1-84ff-06dc2d042f6a
6f639bf9-79a2-4018-8bd6-16bab9a25c8c	3721ce67-abfa-4fef-bf11-925e893e84ef	keyUse	SIG
be1872b6-ca83-4da4-8daf-b5ba667235d9	3721ce67-abfa-4fef-bf11-925e893e84ef	certificate	MIICmzCCAYMCBgGIe62k7zANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjMwNjAyMTAzNDE3WhcNMzMwNjAyMTAzNTU3WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCXaLOkwj1wTl7yJjmHG1ewChFL9grci1HsTRvrLzplLUg6DpNJxQDEp5YOWLCb/x1BBylUaoABNPzygQMIOjGAtQeFD8XMvO5VzqhrV8UluoL8I6ZftJYSp1ARou11kgJ94zk0qBN9nqJQr2ZpJjukPJ9VzfynZJIBrgdspxL/GVVdTxuDGdXtkej4irxklv/j+66RcJKKrS1zHCBrEPt3cCmiCQ6bNG8dTQfnVc/jos+eIJLWExl7eesPy45VBtAg+dxkDYt4rDFmMyS0fgDaXv5mFMXOawgXzgPmXyHUPyk6cW5+vQJtTmFpJku4sNBNXfqJJIwB0tXxHYJWnnjrAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAGOK+H27AVCktgow4d8rLgUeI1AT7FVl+1ntSGrZFSp7tu3CY1x11U35BCfi+pPsNupGeHSxH2WA84KhL5ublUaJjG5l6BOFk8qq6S+3S+AwnkxgjhpYr8Lz65rghMjrtxGNky+MJ9OeuMCpM2hUfNVHMsJRP4hRX26Wa0LtJ56OY4r1XQJ0j8eELRHldGwheFPjyVoi7gQCirycAWcD224e3zwQXXrtiy4+PExjlA+A2VFRqjAMy0x8CivtgXWozGTbdjcUB5I22+W+AC4fA6wIzvLKEoQvT4TIMrw776cnFApeDW3AZQr74rgD4uA/HzGCYqGdKZSNF4NiPnyZRCE=
e5dc355b-7b25-4606-9067-26677e2e57f5	3721ce67-abfa-4fef-bf11-925e893e84ef	privateKey	MIIEogIBAAKCAQEAl2izpMI9cE5e8iY5hxtXsAoRS/YK3ItR7E0b6y86ZS1IOg6TScUAxKeWDliwm/8dQQcpVGqAATT88oEDCDoxgLUHhQ/FzLzuVc6oa1fFJbqC/COmX7SWEqdQEaLtdZICfeM5NKgTfZ6iUK9maSY7pDyfVc38p2SSAa4HbKcS/xlVXU8bgxnV7ZHo+Iq8ZJb/4/uukXCSiq0tcxwgaxD7d3ApogkOmzRvHU0H51XP46LPniCS1hMZe3nrD8uOVQbQIPncZA2LeKwxZjMktH4A2l7+ZhTFzmsIF84D5l8h1D8pOnFufr0CbU5haSZLuLDQTV36iSSMAdLV8R2CVp546wIDAQABAoIBADkRRCCV+61ARMYVRTqYwjC+Yq2UU5yzwFGF8L9wwhxPeHk1dCtqXvNATS0kHZD2k5Kmfdvs9kk+LRbELJ3lvTHLScXL35xfG5/o8A7hepPRXDxnvXY2LRhjyqiTFdhqC5liUvX3Yb1H1Nr/eWSpffJVzSJ8rL11CRkr/G1l/aF7WQf/Tl1rEaNF/GclbVKipfjchTOMPZnL/u88jqVRsevVgqnUzYaSN2sYCzc7n7eHiMG/aeaYPMBp31sgNAlUIPHvT5VveUagSu7nPJuoeK6kPzhb37reA4splE8B9yuFbdvpk7nKUpXR/4X4k0+KDXHSCMwXuIzDDetIe6jgfUECgYEAxqNXZcCyOfe33+1PD85YPkUvfQ4of+ETfkDn/Kg2HqKMbsILSr8xYNdSBtJ4uU+7GvRI4IrgcdDSYHJGe+PVPwS8vncM0B6S4gQMSsinNTefPIAynHoJfIbc7rCvaptpOK7thZLJTEL1zzo/gJSBs65LE9WCZMXp/lBYjRfQrKsCgYEAwyHe+nVUi2aWU8E2OnSddtstR8IE4Ma3XRzkBiSSNdXKu4+EZD6tbOluwkOUca2778kiVahHRSBn8QpKt6EpFiIrWRr7I28ZrBXGPtmCi4jpuL2Sm8IlZm5Z+X8Ec/jJZ+qNLHFegDnQIPhR4mQmhTqo5Pg5xKYq/KzFh1GM5MECgYB80RTQ9nXHoRYkmnyspO+kKVs+zI+8U1UpZ2WeyKBBPcjarAnmbR99B7AeY1DCuQwMUuYcWofQXPRk8EnD/ZT45WQolqwxdpS7eumycEVJVmsz3CZxVunxGtlnDxUa+w7yNFFCNstQpV7KWYKfrDGYE3RPwUEPS6HOUPRjrExOwwKBgG6uJqDfrk3HqZrmK9EqViqVlXBvT38Dl/wbqAcH9VrN4klS1WBa4Nm26lkMJgX46nHPH0eAxLQj9nEVSl4v7nMcfIP1Nt/ZY7FlRGZfz5k/1nowJRluHPKlwykub6MsSWlE9EByKY0HvdMFpsSH1AWbyTLezT2KlzVs9jmT+xvBAoGAJaNuoumVvpOz2hGkFVwrKxj99cT9bH4yrzl4Ut/VvTxmfYq6FOAgpHAR+ae/FqP42Xxo3n1FZINUvqnXv42jT25p192Zgv1/KSbY7f/XT+XQrdJBNMKodCpCfz3/LXKYfKt5K3YYLeGKu6Udb0tDCjZ+H9UHI4Kh10EV9DL6UJc=
23daf8cd-805f-4bf0-abba-9f61b005feec	3721ce67-abfa-4fef-bf11-925e893e84ef	priority	100
8502a2c7-4031-4d52-97b9-67454a436671	f69013cc-b3e0-4239-9dfa-6dff58cf6736	priority	100
9e45e95b-ea01-4633-aa7e-99bebeaccacf	f69013cc-b3e0-4239-9dfa-6dff58cf6736	secret	A8pHOe8RGdjDbm__C7-nCLlrE9iXXbsOQcUb4LXLGOxnAjMkG4hWHPPhMmUiMxZicX7pzzpvHn4GYt825vLaAg
312bc065-a0aa-4512-a493-0ba5d60966b9	f69013cc-b3e0-4239-9dfa-6dff58cf6736	kid	e7b2085d-4ddd-447c-83e6-a93135dac99d
437eb149-ae31-4f66-90b9-478dbd87755c	f69013cc-b3e0-4239-9dfa-6dff58cf6736	algorithm	HS256
a09bbdd8-e95c-4cca-915e-0d8af45f5d51	ac3e3b26-7874-425b-8c4d-47e35ec7299e	certificate	MIICmzCCAYMCBgGIe62mCzANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjMwNjAyMTAzNDE3WhcNMzMwNjAyMTAzNTU3WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDLExgX7gjmYLEvmHfIThE3b3171mywuK+CCcoYitE6rYzXMd5bFqHnzkCK94hwPiHKVzef+wolq4RUv4eiDMB2VuJDtg9vVp8MaiTBCek+Tj5GyCRYeWbqjNvkd4RxQn87bNoh2+kXveQPwP6FjhwHBpRf1uVzpDEP182Gn0VjQC9eNk9OOem60e06tVfd1MDkuIr8y+QHl96tYFNXisONHMk1zs/A4QjhMCjUAlcP/1uLe8vn0nvSrujebXTRJC8YC6OqRrVpFgRVNLmmYzoDBp0QgVThIrQ9uHg/dTI5R5QqlJNLrpC4CV9kEROhlXo3nV8t47xV9euHrwEqa+e9AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAA5mMxyM11OEEtFBA7s52wtPGPvMa4BSGMLZqnI8Hfkuxv8DVgYF7vNi3vMV/RsK4ZCVQ5WamdqqlN0QcvaMlUkfHM2+mhQR5+3NNQjWWhr4m9VqOiGm3t8K5F9GXir/SnNtn/OPuAcnH0qTFYVD6vP/fnYO4Qkj9Pmx2cEUwHnvh9XtRblOiTeRafGu0eYUZ5jlZEI+hpzsTNY8eEuKVkTsvNe13Os5/OA4Mw86zRncIIb2kNECd2Pm+2B213yZmT0kn1Ov7fvcofFkgZl6Dd8liMPGKECHMbji/3cr/1yA5ZBOlCyfvbAcbAVf+nntyuwFrgdUZv/nSI4oNtIN0Q8=
4f025a29-d722-406a-ae24-9164dbe3fa7a	ac3e3b26-7874-425b-8c4d-47e35ec7299e	keyUse	ENC
883ce843-5d6c-41d4-8f38-43dfa1137c10	ac3e3b26-7874-425b-8c4d-47e35ec7299e	privateKey	MIIEpAIBAAKCAQEAyxMYF+4I5mCxL5h3yE4RN299e9ZssLivggnKGIrROq2M1zHeWxah585AiveIcD4hylc3n/sKJauEVL+HogzAdlbiQ7YPb1afDGokwQnpPk4+RsgkWHlm6ozb5HeEcUJ/O2zaIdvpF73kD8D+hY4cBwaUX9blc6QxD9fNhp9FY0AvXjZPTjnputHtOrVX3dTA5LiK/MvkB5ferWBTV4rDjRzJNc7PwOEI4TAo1AJXD/9bi3vL59J70q7o3m100SQvGAujqka1aRYEVTS5pmM6AwadEIFU4SK0Pbh4P3UyOUeUKpSTS66QuAlfZBEToZV6N51fLeO8VfXrh68BKmvnvQIDAQABAoIBAEXpQugqGIJHU3iRQtuAlMjC5y5U+YI1cqaP/DVKxREwYkZLcsNlHUQSa4HsCdqqaTOhpxK6eBnT3HDYpzcQsMmMy8SHzvSDm6nIePLEGLpMcYAosuqKkPW6nJEg3EWpoOeyZ740WSDFTNhnlrgf3mJEz5vW/ZM8OW+82ZK5DkhGWWjKF1LO85PeqXEvlr+uAs1M4+fhdHf7f58xbapZpcyNBueBvtvB9Tx1NFetCq+TTSfZnoAA0+4SaZF7xQC/KyMhMTAqEi1nHOIptHf61nyB4IkdyBfglYRh+g0B1znMTqKXvzSUDxjgLHQmEVu0BahMRA7OUUic5BELdo7LPvkCgYEA7YxzwkwqilQrBQIyItoJbImQYN+iQHdxhQX7rSqU+hFHCOZb3KQ44Cgp+ffsdYJQ0Ux3fIxBhS9rY0C5tC1CeLpdPJalkG9W/jB9CQQyTOpDk5tHcj8gQVbFfDQlHKfIweEpyufJiS+D+XPJW4eE16pyfupiP9Dm/wpLl1ODeS8CgYEA2tkkD7t7S9pcaenBi6pC+/9MjOkcsy6pM+KE7nplgMu0fUqy5PrVwsIeemrggMK8/LgqhWTgxoqAdPAV2VMGRatD1SUoKf8nufLPFE4NohqM7MkM8Hq+MfGZEeLrpGzOWwZVC47QxKtFuquyJ6+eeT8atu1zGRdQFydGDZyz2tMCgYEAu/paHFYTj9VdGaCMNiIeNQKC+vXdOnCKp359k6HPtDd54+QOq4JU86U02ndDahXOiGGfaDLBInjM3QT6L0dlg43OfESmDa7dw1Zxi3IDr/Ptt9+34QNtLedRbaECATQQ3MOmQ8e6JtIv+HWU0NZj3BoocqBdUSyprwbhnIVc08cCgYEAhbBuQhoSiNTc7Wp57HrXLp/XwKDLAn63qFVxRUmJ5jMKkBtoy06b9Lym57uQZ7gOwQc0Gob0dPS44jaj8j2wsDCeYH+xWG5hc0trywifdW5otmFfQSyKMXJYQr/vmWNKb/qfS080I2BJWW53h5zV31V4WVUWobZHG83HEpuulzcCgYAYR4TPvnVXMxlEIBz6ioydFiKtLvP773S5pC5O3OPesrZ5/wQit7tjzpwfbbTAgJB/3qNEjYXRLZdIMCuSA5rnVNZHQm8iAijNUsW2mkU5MfrYaY5/114SZcdLl8WrVYfXizuyXQjxYvqrAF8aVNi+VZltjnAcqUARVk+hMc0nBQ==
aa44abc9-831f-41b5-9b99-623da4e70041	ac3e3b26-7874-425b-8c4d-47e35ec7299e	priority	100
6f31afaf-2289-40ba-83d3-b60075a29b3e	ac3e3b26-7874-425b-8c4d-47e35ec7299e	algorithm	RSA-OAEP
868502a5-97b8-415e-9874-1fbce383a85d	dca4f0e5-7ff4-4316-8fae-991203af7e05	kid	4a3c79f7-27f9-4f58-96d8-50d708b0040a
34462c59-bf99-45a8-bd9a-2d476ab1b828	dca4f0e5-7ff4-4316-8fae-991203af7e05	algorithm	HS256
d5cbd1f2-4acb-413e-8b30-aac0ae5e0066	dca4f0e5-7ff4-4316-8fae-991203af7e05	priority	100
fa4d5eb2-76d6-4ceb-b78d-b0273dcb152b	dca4f0e5-7ff4-4316-8fae-991203af7e05	secret	RZjXGM49EpwU-iUMFTKAGTVc8ybxegmC3xA3f_IXfropVMvO23FlSvElvtD4kTGWv-4BTysfbgA37632aSR7Lw
beb12619-abb3-4ab7-9feb-90f0c9f3483d	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
57332201-efec-40e0-b14d-14bb9b758f08	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
38489e79-9cbe-4574-9874-af9652ff99be	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	saml-user-property-mapper
c79a4753-64ba-4da2-b59a-29f61fb20b14	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
e5ecda86-4665-4da7-8e49-81a795083d73	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	saml-user-attribute-mapper
69e7cbeb-a574-4d5b-9e17-a82909b68d46	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	saml-role-list-mapper
1892417f-1454-416a-b232-f0a6a914742b	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	oidc-address-mapper
bf1999e6-91f4-4fda-9ecf-4770c30681b1	ff19829f-ad8b-4a0e-ac5f-5279732037df	allowed-protocol-mapper-types	oidc-full-name-mapper
89d42910-0934-4d5c-b174-d61109a226c3	05410241-36bf-41c8-b80d-84684e991b36	client-uris-must-match	true
e4fe7b5b-1f45-4815-80f9-82c58100e926	05410241-36bf-41c8-b80d-84684e991b36	host-sending-registration-request-must-match	true
bfa4812d-886f-48ef-9393-82533f5d7ad2	fad036bf-730a-4f2e-95fa-48aec703da2a	kid	aa463552-956f-4ade-aea1-8b2b6da6322e
2adb4e65-008c-4d9f-854b-726797b4f9d8	fad036bf-730a-4f2e-95fa-48aec703da2a	secret	DvFOUI7DISzekoSJqEaLEA
265dc001-1e3c-4fe4-bf47-f7fda8fa30a3	fad036bf-730a-4f2e-95fa-48aec703da2a	priority	100
397a215a-a10b-449b-a8cc-026ba55605d9	bd725465-4a05-49eb-97fa-98128d430fb5	allow-default-scopes	true
b0767749-9b69-433e-bff2-16482b351029	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	saml-user-attribute-mapper
cf7a211c-f306-4dd1-ad45-3303bf2213be	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
f86a64e2-59d1-44c5-8f6f-79bcc8c92cd0	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	oidc-full-name-mapper
8dd24394-99ed-45c8-8b30-078b143c22ad	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	oidc-address-mapper
6c07ab65-65a9-4886-8a5d-608bbcaf023a	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
dc4259f8-47da-4813-a635-199478252e36	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
f0d63175-2dba-4786-b605-3e64765a3053	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	saml-user-property-mapper
07ba17c4-17a8-4390-b356-77776db78ad7	266f153c-7a0a-4281-ad28-f2985285a232	allowed-protocol-mapper-types	saml-role-list-mapper
97eefc4b-f431-4f8d-a6ef-c11513cae879	288bbc34-b377-48b6-a2ca-0b00212a75bb	allow-default-scopes	true
7400de9b-9a4a-45d7-834d-4c320db9c313	ddca9b77-14a0-4ff6-afb8-1000cd995a13	priority	100
fe82b56b-5a0b-49bd-b690-410ec1a1e088	ddca9b77-14a0-4ff6-afb8-1000cd995a13	certificate	MIICnzCCAYcCBgGIfN4TejANBgkqhkiG9w0BAQsFADATMREwDwYDVQQDDAhzaG93Y2FzZTAeFw0yMzA2MDIxNjA2NDhaFw0zMzA2MDIxNjA4MjhaMBMxETAPBgNVBAMMCHNob3djYXNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtN+zIAAwp7sVGGASrZrdZhT2cL07wx7kbrpPwjY4QzU00vE6NShVJDzdftnfdWyL8pC0dpt5r/Tx8Dn7tTRCWJr+FVbZSqSVAxWMSY3AkwjL83FBj3JLq92RN6FqXADzFCGRMJsFwh5okGmwN4798DCbIbAK9hWDoHOjZX1CybgXioYfsQSWon6aPKdW2qu4kUvGWiDB0UGqC8qT6w+miUBuD3UB3HWihtsvPAxoUFHpNoxn+kBzfKfCOojptsj2xtDtDgxpcjTDMnfOKNOm69Sxb4fnQ7CTWft8bljY63hA+GlC3KqGweZOsdzBCdMH04FVRIdU0tFJfj6DJbfIUQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAdJ6x0TsRNBsm6TnwYKHwNXFF69KB/Cz+l0umTV3CRVFZw8XNyfiPwwrBABGmOzfvP7d/1bLsK8RoeH7xTRqmncqvoptclqvvP6MQvetax9VHun6TXV0DA4/1TFAJ7h5gl3oHb1Yk8x+qYfx0PrOTtY0WNdZwvAdsBbkm+82fQbmfh1mcH5ydwN1wA1nsxz7G3WPoT6fNx7+3VYl4kA63w8jTlY5TSrn+RGksFV7L0ELO+g53LzOKHUDU6qgqc9gRtJti83DFBRaz6tacnMBFiPMA14NEWKVzOz+CsXZQIuzeZ00XTKJ+HSiqpOh4z7m48BhsGntuSlrcYkGp6UqM0
480f1dc1-40c0-4219-a8a8-41358d1262da	ddca9b77-14a0-4ff6-afb8-1000cd995a13	privateKey	MIIEoQIBAAKCAQEAtN+zIAAwp7sVGGASrZrdZhT2cL07wx7kbrpPwjY4QzU00vE6NShVJDzdftnfdWyL8pC0dpt5r/Tx8Dn7tTRCWJr+FVbZSqSVAxWMSY3AkwjL83FBj3JLq92RN6FqXADzFCGRMJsFwh5okGmwN4798DCbIbAK9hWDoHOjZX1CybgXioYfsQSWon6aPKdW2qu4kUvGWiDB0UGqC8qT6w+miUBuD3UB3HWihtsvPAxoUFHpNoxn+kBzfKfCOojptsj2xtDtDgxpcjTDMnfOKNOm69Sxb4fnQ7CTWft8bljY63hA+GlC3KqGweZOsdzBCdMH04FVRIdU0tFJfj6DJbfIUQIDAQABAoIBAAN77qZOZ/bcgJ4bqv3F8VSte9zKlwuIaA6Q+gcr8QlXDZ7a74vawcnE/rWaP/bHVz/I1U0Wlsa9Vr68Td1c9cKMA8Ud9eln7QiQ7PGgGyZJ7FcoEUL7M5Af4Gj8VpaR8cdraRxQ/tCmh3hGrOgOZ1UDNAMiB2gGRzw7QK8XCrG6LjZSiJGfoxZY1Np1Ha4gaehUbNCIGtHkAFZTdYZ+fGtgCtaXozKw3kow/HVwAsJdOCFgL2c6G+UyexokqyH35ODLkRTTKGfd/tl9im7uNd63wWfYpajE5dIASHf0o33WtkCOcdJTuNeJTd0sIH98F5Q7IiXVrO6lD19Y+9P5paUCgYEA3JJgNRC1bps29rBE3UHJ9O9RWNqXtDg1Vr34XkOW/CuVqyKCZAD4eRyEqyUkcJOcOnTcYmfi9JIIdUVUl+0of6hXfqVhTZnfagw7K8X/Zp3ytjzJwcGHoiO5bgNIusi8TlcY8gexvhU+Y50f92LRisCD6ec6AIrK6u0+M/zx3/0CgYEA0ez+61ItlhxI3ZrSjcJMeSTkt6AH/kWFEmWa8mO4w2d+NOodF5BGmXWSBSCYZuxAGhQbTnC3m/RDRtC3Nl3s4QlCuJmGaJPUKeLiMMOp9cuIoQ5mTi8XOyXYYJlyAZ12dVazC+FiMrrJmdYYbd6EW1z2rzg6Zi4JPRvNqWPsh+UCgYEAjudW5Yp5wbtWFOWG+EKTcdlLPuIAv4ZbKGPT8l6gB6jFQycMi3YFhZHwcmGSBk3cPhNQZYEhDYs/Z5sPf47rWina5faH4Br9IFvkSivxmK5kfaVMofecxHOYw6nlCP7c4XSUeNp7Uce5sBgwibrAP8EStgxVC9zgMuyaDFyo6JECgYBcOOh4it6Z/o0IRbbQLhaYddvAy54XV4UxYs+iQqrttS6domfrbSeGzT673+jz9j/m9QRV/nC7I6DWoGSMjtC8v+u+2ztP//mJ+TFzSNIGuEaqsn/BQzDKfELFlUOfcASVYeRAiOAx9xsP6R1MTyAIXxvEOEh3kSvf27ILA2nq/QJ/Y+n1/ibQMLXvS2yuf/o1Bu6MIHA9ilWj2TemQWh1Wuz3p3ZvIn6FeAweUtjBHbst5E7kytmPodC907i4vq/BWmeHLlsG00jI2gfzpI1sh4G3sFz/Pa71tULu3HS5hwVC36T5EaJV+TOQrK95T3xyFGsRty8BKG9Q7mn1j+5CWg==
f5a40cea-6738-46eb-b149-471bea39651f	ddca9b77-14a0-4ff6-afb8-1000cd995a13	algorithm	RSA-OAEP
99047533-e060-4f94-ab59-d872ada8a347	019ec1c2-2d57-4aeb-9a13-8f9cb4fcc4d6	priority	100
6f101411-8cf4-499d-9ed9-4d66a65d107e	019ec1c2-2d57-4aeb-9a13-8f9cb4fcc4d6	certificate	MIICnzCCAYcCBgGIfN4T2TANBgkqhkiG9w0BAQsFADATMREwDwYDVQQDDAhzaG93Y2FzZTAeFw0yMzA2MDIxNjA2NDhaFw0zMzA2MDIxNjA4MjhaMBMxETAPBgNVBAMMCHNob3djYXNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtqjazNB2MFE62ruuS8r6xy1wG768PKb/30Ttp5oiCJ8Uo1ZCXwWHxK9ifTPKILm+EI3MD+afCDeOcjAJ6N96c+LsoZ5Fuoe8pcMmsxe4EnTzMxJCXxSofpB57tmkmdsxouCEQXLQb2Kd75W52FWJICC7xbOULCsW/PG94V2iKTA5YZpQk5B12/ccYDpKYJsMjH6jIQs5ixRbNUKUkjJlY5Vb8h10fFoKEdAium4T2Xxjq+OOlgDW/f1EhbpV6qAr11XpDPPf1Du3EzpmqbGWo7DCf1TRJdNBhZN2RP4KwfPbvmTsfR7W59MmdGEDt6tYmI5QuGOcdbtfJUpMLulh1QIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAZ/Dlaj+4iBCJ+daKbh5fAEC77AT2KPQOwWZl47hZEi41mGsqUEta8m1GKDil3BaM9sS3weQOMoUntXJZvPPxv3FJ91U69VrnsNKXnFaLuRan4j8GTxmAfQh3vX543JZ6Ghfzd/ge3iXDfLyiLxKt/9Ll3nzYiIlP+JP0v0pe/ymyDDSj78TXFyVu7HRbrovxByvcWQ/kLaT8Mesx7E64xh8KyUcklRw1GhesQS5EqKxRt/G6ul7Is9TE/TegMvUNCSCJ4fmt3XmCpcF/qFpLRpIal0kPQZq+c14nZJUDcHthFCkrrLnaTK/yvGK0D1PYLEQ8sYSdf17Vo1LEE9dZr
ed610663-1eac-4847-a29e-b8784f0d0409	019ec1c2-2d57-4aeb-9a13-8f9cb4fcc4d6	privateKey	MIIEogIBAAKCAQEAtqjazNB2MFE62ruuS8r6xy1wG768PKb/30Ttp5oiCJ8Uo1ZCXwWHxK9ifTPKILm+EI3MD+afCDeOcjAJ6N96c+LsoZ5Fuoe8pcMmsxe4EnTzMxJCXxSofpB57tmkmdsxouCEQXLQb2Kd75W52FWJICC7xbOULCsW/PG94V2iKTA5YZpQk5B12/ccYDpKYJsMjH6jIQs5ixRbNUKUkjJlY5Vb8h10fFoKEdAium4T2Xxjq+OOlgDW/f1EhbpV6qAr11XpDPPf1Du3EzpmqbGWo7DCf1TRJdNBhZN2RP4KwfPbvmTsfR7W59MmdGEDt6tYmI5QuGOcdbtfJUpMLulh1QIDAQABAoH/Bv9G5AeRCowdb15/wVqSVzIIYUq2X+jqAcNPjk/BsTRbfOjaBjll5asC9vp82gTfA69qQdu2uBaLgfL2qF8c9kIhESalE7UfwHpRgayigi5OX2G7gVX33zYE+dxSFrThXu3JZZZPOdbDy5IPQl7JrLgImQO9fUSRmd4uNxs/X8VQ86ou6Kpb9W/5XRbJNxSrrICFl9WChb05ZhVgMdUWTGsjGMYxywAF0Du6b9gMtkPnt8fHFhlXdHq5hmxgNULqPoISq3K1EhUqF/H2nl6IgZMxEwpvvk1JMCzACpcUFHBqiFYEvTA5Ta5MDiqK6Tw8uqInrcp98d7a8noLtwtRAoGBAO+/EIZk7XRGDW1mgDkE4q03u4ktfSb6OwDqfr/QTKF4kAl7nAZfVR0TsbdcA0jZAxhW6IjeCysozJIjj0/QKv1XAAWGgAfnGJ2M3Zq0Yau9+Q0FPwy3EMh1ud2ifc0ugLL/EGrRE8Bta+qD8QpAuTtpiBzE+EJ3ZOXihCSME9IlAoGBAMMLBEY0phiHOZK3n/UEo6axPpTRLQ4DxCuemNwkzR64CQytk+otNbIhinhcYxZXLf+qma5+WXWqtqo94eA0uBBmj/e7HKvZnGQ4lqSFpVpSQXk+lVSQ2m1+SehUlfXpZML4bfh0SXuxcDpVfr1bjGp2OVy0QvEgCzhsj0MhxEnxAoGBAOSpfC5iluQeaHIeoE9B7J0/mdulikehxKMEBS4Xku8zGVYiElc1l+1qukbjOLLDYKNXSOQ5u7dHa4464lZCeq40y215siVXce/aygXi44E1aRPVHCSZeiVnu4W7lHcdUlzmz5bBoTAYbSQ5Aa5AuysCZXLjHtHuJErqOBTPkZwNAoGAIOUBwolsneRojFsVyjAPHbT09gpVS/DMrAKiizZVteGZ/R5lPPCFBtbrUKNcPs9TPbRbGPfMRLEW/51SNAsQJAv4KfLPwhgAbVKx7Wtw2MvYqQcqDkoj3KWY92sUo5XKXauieG28WvUxFVWH+42uH+JyiDUKuToLSmfcvZi7TzECgYEArebp6mLiv9vLnhTxAUhW8lKdPdTfDerzjJUhrwIEUxhSf4MwUesAoA+BtQGLcCzz7bp0qnq2lDLBZjys1DvBBIxp82LGJz3c3SHbeTeTj6aqwdzStsP0U5ukRaqnJdzv5F3+hKvQQlr0FAkLZvS7GeXP4ETaUnXBLgIivIzZGYo=
cc173995-7148-4acd-88ba-f99cf978bd78	39f6d708-32d0-455f-8da1-0add0d0388e1	max-clients	200
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.composite_role (composite, child_role) FROM stdin;
00e35af7-6be2-41c7-8425-85631c8d459a	0976df7a-5939-43c4-9093-832593b98c8c
00e35af7-6be2-41c7-8425-85631c8d459a	dff38e9a-928a-4f68-95fb-269bfc5a65e9
00e35af7-6be2-41c7-8425-85631c8d459a	5241ae38-6e26-4048-920c-df750bda9507
00e35af7-6be2-41c7-8425-85631c8d459a	59161409-3a42-47e8-a4db-2aa0ce7cb853
00e35af7-6be2-41c7-8425-85631c8d459a	29b3d652-af48-4e74-9d15-724f2617b5ea
00e35af7-6be2-41c7-8425-85631c8d459a	1524bd84-111b-4a70-846b-4c0264e5ebc5
00e35af7-6be2-41c7-8425-85631c8d459a	7089e0d4-1581-455b-a3cd-80d3e904426a
00e35af7-6be2-41c7-8425-85631c8d459a	6c609d55-1f69-4abe-b511-95bb5ec9c006
00e35af7-6be2-41c7-8425-85631c8d459a	0a2334cd-998f-4d1a-ba75-9a5f09ae595d
00e35af7-6be2-41c7-8425-85631c8d459a	9cc11ee4-47f0-4a00-a874-6e6717790388
00e35af7-6be2-41c7-8425-85631c8d459a	f671a650-fbee-41a7-ab05-82bc8181bb8f
00e35af7-6be2-41c7-8425-85631c8d459a	c22f75c3-5aaf-4607-bb66-ae63dea9b258
00e35af7-6be2-41c7-8425-85631c8d459a	599a3043-ddf8-4c88-bf6c-c91972cbf64c
00e35af7-6be2-41c7-8425-85631c8d459a	ff752a35-7da9-43d4-8558-1a5f4350f783
00e35af7-6be2-41c7-8425-85631c8d459a	d324f3dc-cf4e-4ce0-bdbc-b159b62769ec
00e35af7-6be2-41c7-8425-85631c8d459a	a43046b7-aa3b-425d-b596-f7e2caba2ee0
00e35af7-6be2-41c7-8425-85631c8d459a	b9874a29-56ee-41e4-9899-302263d80744
00e35af7-6be2-41c7-8425-85631c8d459a	6e04dd54-82c2-4712-a25f-04d316d690f9
29b3d652-af48-4e74-9d15-724f2617b5ea	a43046b7-aa3b-425d-b596-f7e2caba2ee0
59161409-3a42-47e8-a4db-2aa0ce7cb853	d324f3dc-cf4e-4ce0-bdbc-b159b62769ec
59161409-3a42-47e8-a4db-2aa0ce7cb853	6e04dd54-82c2-4712-a25f-04d316d690f9
f84bb28f-dc03-4b61-bd9d-894598ab747c	156bef95-81da-43e4-a69c-2079fea1256b
f84bb28f-dc03-4b61-bd9d-894598ab747c	2b1eeda6-2074-460c-aff0-ebba4b78c15c
2b1eeda6-2074-460c-aff0-ebba4b78c15c	cf5912e7-a580-4b62-bddc-67930ff69bf2
231b7964-2c43-4138-a07d-1ef308522e17	9eaf2c4b-7e9e-423e-977a-577f5e6a85b9
00e35af7-6be2-41c7-8425-85631c8d459a	7338abb4-e322-4d09-96c0-3442db0ddee9
f84bb28f-dc03-4b61-bd9d-894598ab747c	e85f8e66-0030-4d42-8f5f-36bba6279ad2
f84bb28f-dc03-4b61-bd9d-894598ab747c	0312cf2f-887e-41e3-bc88-18b1f3b26cc5
00e35af7-6be2-41c7-8425-85631c8d459a	bc96457c-694c-4bad-a3fa-137e1acb1e5c
00e35af7-6be2-41c7-8425-85631c8d459a	0e5ef484-8753-4f15-a11d-5668e1009e71
00e35af7-6be2-41c7-8425-85631c8d459a	afd092b0-d4f8-4604-8924-a611394577bf
00e35af7-6be2-41c7-8425-85631c8d459a	d1100f36-ee16-491d-b8a3-e1ad30d6f700
00e35af7-6be2-41c7-8425-85631c8d459a	f3d23bc8-a165-4b5f-a5d1-164807cf3832
00e35af7-6be2-41c7-8425-85631c8d459a	292fe9a5-eb33-4065-8f14-e8f64d17fe8c
00e35af7-6be2-41c7-8425-85631c8d459a	07384a22-8aff-4ddc-b37b-d0a8ac226aa2
00e35af7-6be2-41c7-8425-85631c8d459a	ab3448f1-90d9-4e53-835b-9e260380d4a7
00e35af7-6be2-41c7-8425-85631c8d459a	85f1b854-b8c5-4396-848c-62503eeef2e9
00e35af7-6be2-41c7-8425-85631c8d459a	d26fcf73-8b21-4c0e-bf50-cb37ac79d857
00e35af7-6be2-41c7-8425-85631c8d459a	d41e9846-df5b-4f34-9946-6e9eabf50ca2
00e35af7-6be2-41c7-8425-85631c8d459a	042624a2-7dac-4ab2-99eb-f2af3e747f1f
00e35af7-6be2-41c7-8425-85631c8d459a	ca51f33d-4f2f-449a-ab4a-718f83c88104
00e35af7-6be2-41c7-8425-85631c8d459a	2ca9db0f-5d74-427c-aca3-d386390be0d7
00e35af7-6be2-41c7-8425-85631c8d459a	b868316b-334a-4145-9d6c-19798e060741
00e35af7-6be2-41c7-8425-85631c8d459a	aac8da0f-e667-4bc5-b0d5-36101425aa11
00e35af7-6be2-41c7-8425-85631c8d459a	796dc3a9-a947-457a-bea9-8b07b9b7f50d
afd092b0-d4f8-4604-8924-a611394577bf	796dc3a9-a947-457a-bea9-8b07b9b7f50d
afd092b0-d4f8-4604-8924-a611394577bf	2ca9db0f-5d74-427c-aca3-d386390be0d7
d1100f36-ee16-491d-b8a3-e1ad30d6f700	b868316b-334a-4145-9d6c-19798e060741
239ce4cb-8fc5-4673-8bc5-9944eb0acaac	7e28a8d0-7ea3-4b0f-91b3-ad8cfd2ddc3e
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	10094551-05c3-4c6f-89ec-9cd33babd9bb
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	db82aea6-7bf5-4cbf-b317-74004ab21a69
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	36b91607-b821-4b21-bff0-18ab0ea022e1
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	3a547c2d-683b-45f7-81a2-9b14374e1aea
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	cd3ddfca-8cf6-4cf6-a567-8a26bdd203f9
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	35fe07b8-27d1-42b4-897a-1e2c5dfdf825
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	d50e0edd-34b7-433e-a65a-9f6589e80d36
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	239ce4cb-8fc5-4673-8bc5-9944eb0acaac
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	6de88b03-a5c7-4a05-9a48-524961341e6e
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	1695788d-899b-4590-abcc-871e7fe222f5
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	1ea78e88-24f5-4648-99e2-c6e15d57f772
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	27b58e14-4dc1-46a2-b51f-581b021bf987
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	d9de9c44-ee71-4b8a-af98-0a481c9e4a34
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	7e28a8d0-7ea3-4b0f-91b3-ad8cfd2ddc3e
36b91607-b821-4b21-bff0-18ab0ea022e1	10094551-05c3-4c6f-89ec-9cd33babd9bb
36b91607-b821-4b21-bff0-18ab0ea022e1	6e8a1339-75f6-424f-9b8e-ffc7f4b73ee0
36b91607-b821-4b21-bff0-18ab0ea022e1	55a6bb04-394a-4908-966a-179d393bd41e
36b91607-b821-4b21-bff0-18ab0ea022e1	112791ae-637f-4f36-8557-8306c3ea1b3c
36b91607-b821-4b21-bff0-18ab0ea022e1	f3d93c8a-2190-42f2-ba83-8b517e73f8a7
36b91607-b821-4b21-bff0-18ab0ea022e1	9e669170-3897-4ad8-96bd-8df1eb366d66
36b91607-b821-4b21-bff0-18ab0ea022e1	03f2aa10-7775-44f4-ae65-1b94e82bbc07
36b91607-b821-4b21-bff0-18ab0ea022e1	6fdc7c3a-e37b-4df3-930d-25964fe059e5
36b91607-b821-4b21-bff0-18ab0ea022e1	5406b1c5-a870-4ac5-a360-e1a1a86f643b
36b91607-b821-4b21-bff0-18ab0ea022e1	819734df-7e04-4557-b5f4-feba29e3d386
36b91607-b821-4b21-bff0-18ab0ea022e1	c69175f5-2852-4160-9fb7-20d625ef9a7e
36b91607-b821-4b21-bff0-18ab0ea022e1	1b7b4f20-9df9-4082-a2dc-bc08fdb728c4
36b91607-b821-4b21-bff0-18ab0ea022e1	95009d5b-303c-4ebb-93b1-97366d4712ea
36b91607-b821-4b21-bff0-18ab0ea022e1	c22e7da2-f04e-4acf-aad1-b3b67dc16097
36b91607-b821-4b21-bff0-18ab0ea022e1	adc95717-7543-43ab-a897-13c28d78c8e5
36b91607-b821-4b21-bff0-18ab0ea022e1	693a128a-7d6b-4bf5-bce2-e02b5034d4fe
36b91607-b821-4b21-bff0-18ab0ea022e1	8ac729aa-1c99-4310-819a-8b9dd459af27
36b91607-b821-4b21-bff0-18ab0ea022e1	dec272e2-d7b3-4d3e-801f-2cc84b5ec2a5
d9de9c44-ee71-4b8a-af98-0a481c9e4a34	db82aea6-7bf5-4cbf-b317-74004ab21a69
dec272e2-d7b3-4d3e-801f-2cc84b5ec2a5	1b7b4f20-9df9-4082-a2dc-bc08fdb728c4
dec272e2-d7b3-4d3e-801f-2cc84b5ec2a5	95009d5b-303c-4ebb-93b1-97366d4712ea
f3d93c8a-2190-42f2-ba83-8b517e73f8a7	819734df-7e04-4557-b5f4-feba29e3d386
00e35af7-6be2-41c7-8425-85631c8d459a	828c1370-4267-443d-867a-3e301c9dee78
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority) FROM stdin;
85d7f317-54ed-4840-8c57-23458990b3c1	\N	password	ebf4b0c4-eba7-4d3a-974e-a9134eec7290	1685702158269	\N	{"value":"R46Y+iH8584qwbUGimvC0UVGBfUwO1EyHP5E/XXhwf+7YLsuMfo6705Y28dqbntuwN6mr6XhqlMm7DC8O8yqSw==","salt":"yn1Vyo2OaEDlmaTEHKlq+A==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
31822fb6-fb27-4ce7-b457-d435bb743061	\N	password	9b4470ff-83cd-4a99-a94f-849a1de50ba2	1685722240781	\N	{"value":"p3/oe4ZDTpi6RDXy3WjmIJjwT5kBrZFGcYF+zDCOlUdEzWC/aTdo/zJfPzXGBMnACGkmOf2YeiQFDSrqNKLCDg==","salt":"Zm6eaf+lUk6TT73vntNaBg==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2023-06-02 10:35:55.463289	1	EXECUTED	8:bda77d94bf90182a1e30c24f1c155ec7	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.8.0	\N	\N	5702155208
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2023-06-02 10:35:55.469841	2	MARK_RAN	8:1ecb330f30986693d1cba9ab579fa219	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.8.0	\N	\N	5702155208
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2023-06-02 10:35:55.499205	3	EXECUTED	8:cb7ace19bc6d959f305605d255d4c843	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.8.0	\N	\N	5702155208
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2023-06-02 10:35:55.501959	4	EXECUTED	8:80230013e961310e6872e871be424a63	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.8.0	\N	\N	5702155208
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2023-06-02 10:35:55.563429	5	EXECUTED	8:67f4c20929126adc0c8e9bf48279d244	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.8.0	\N	\N	5702155208
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2023-06-02 10:35:55.565349	6	MARK_RAN	8:7311018b0b8179ce14628ab412bb6783	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.8.0	\N	\N	5702155208
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2023-06-02 10:35:55.622568	7	EXECUTED	8:037ba1216c3640f8785ee6b8e7c8e3c1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.8.0	\N	\N	5702155208
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2023-06-02 10:35:55.6244	8	MARK_RAN	8:7fe6ffe4af4df289b3157de32c624263	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.8.0	\N	\N	5702155208
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2023-06-02 10:35:55.627435	9	EXECUTED	8:9c136bc3187083a98745c7d03bc8a303	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.8.0	\N	\N	5702155208
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2023-06-02 10:35:55.679058	10	EXECUTED	8:b5f09474dca81fb56a97cf5b6553d331	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.8.0	\N	\N	5702155208
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2023-06-02 10:35:55.751397	11	EXECUTED	8:ca924f31bd2a3b219fdcfe78c82dacf4	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	5702155208
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2023-06-02 10:35:55.752932	12	MARK_RAN	8:8acad7483e106416bcfa6f3b824a16cd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	5702155208
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2023-06-02 10:35:55.766206	13	EXECUTED	8:9b1266d17f4f87c78226f5055408fd5e	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	5702155208
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-06-02 10:35:55.776483	14	EXECUTED	8:d80ec4ab6dbfe573550ff72396c7e910	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.8.0	\N	\N	5702155208
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-06-02 10:35:55.777726	15	MARK_RAN	8:d86eb172171e7c20b9c849b584d147b2	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5702155208
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-06-02 10:35:55.778944	16	MARK_RAN	8:5735f46f0fa60689deb0ecdc2a0dea22	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.8.0	\N	\N	5702155208
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-06-02 10:35:55.780186	17	EXECUTED	8:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.8.0	\N	\N	5702155208
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2023-06-02 10:35:55.804615	18	EXECUTED	8:5c1a8fd2014ac7fc43b90a700f117b23	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.8.0	\N	\N	5702155208
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2023-06-02 10:35:55.826158	19	EXECUTED	8:1f6c2c2dfc362aff4ed75b3f0ef6b331	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.8.0	\N	\N	5702155208
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2023-06-02 10:35:55.828885	20	EXECUTED	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.8.0	\N	\N	5702155208
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-06-02 10:35:56.188824	45	EXECUTED	8:a164ae073c56ffdbc98a615493609a52	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.8.0	\N	\N	5702155208
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2023-06-02 10:35:55.830109	21	MARK_RAN	8:9eb2ee1fa8ad1c5e426421a6f8fdfa6a	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.8.0	\N	\N	5702155208
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2023-06-02 10:35:55.831371	22	MARK_RAN	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.8.0	\N	\N	5702155208
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2023-06-02 10:35:55.842863	23	EXECUTED	8:d9fa18ffa355320395b86270680dd4fe	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.8.0	\N	\N	5702155208
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2023-06-02 10:35:55.84593	24	EXECUTED	8:90cff506fedb06141ffc1c71c4a1214c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.8.0	\N	\N	5702155208
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2023-06-02 10:35:55.847075	25	MARK_RAN	8:11a788aed4961d6d29c427c063af828c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.8.0	\N	\N	5702155208
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2023-06-02 10:35:55.869618	26	EXECUTED	8:a4218e51e1faf380518cce2af5d39b43	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.8.0	\N	\N	5702155208
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2023-06-02 10:35:55.907175	27	EXECUTED	8:d9e9a1bfaa644da9952456050f07bbdc	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.8.0	\N	\N	5702155208
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2023-06-02 10:35:55.90917	28	EXECUTED	8:d1bf991a6163c0acbfe664b615314505	update tableName=RESOURCE_SERVER_POLICY		\N	4.8.0	\N	\N	5702155208
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2023-06-02 10:35:55.943626	29	EXECUTED	8:88a743a1e87ec5e30bf603da68058a8c	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.8.0	\N	\N	5702155208
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2023-06-02 10:35:55.958503	30	EXECUTED	8:c5517863c875d325dea463d00ec26d7a	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.8.0	\N	\N	5702155208
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2023-06-02 10:35:55.968915	31	EXECUTED	8:ada8b4833b74a498f376d7136bc7d327	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.8.0	\N	\N	5702155208
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2023-06-02 10:35:55.971544	32	EXECUTED	8:b9b73c8ea7299457f99fcbb825c263ba	customChange		\N	4.8.0	\N	\N	5702155208
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-06-02 10:35:55.975178	33	EXECUTED	8:07724333e625ccfcfc5adc63d57314f3	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5702155208
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-06-02 10:35:55.976199	34	MARK_RAN	8:8b6fd445958882efe55deb26fc541a7b	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.8.0	\N	\N	5702155208
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-06-02 10:35:55.990424	35	EXECUTED	8:29b29cfebfd12600897680147277a9d7	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.8.0	\N	\N	5702155208
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2023-06-02 10:35:55.993535	36	EXECUTED	8:73ad77ca8fd0410c7f9f15a471fa52bc	addColumn tableName=REALM		\N	4.8.0	\N	\N	5702155208
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-06-02 10:35:55.996402	37	EXECUTED	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5702155208
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2023-06-02 10:35:55.998344	38	EXECUTED	8:27180251182e6c31846c2ddab4bc5781	addColumn tableName=FED_USER_CONSENT		\N	4.8.0	\N	\N	5702155208
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2023-06-02 10:35:56.001486	39	EXECUTED	8:d56f201bfcfa7a1413eb3e9bc02978f9	addColumn tableName=IDENTITY_PROVIDER		\N	4.8.0	\N	\N	5702155208
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2023-06-02 10:35:56.003074	40	MARK_RAN	8:91f5522bf6afdc2077dfab57fbd3455c	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.8.0	\N	\N	5702155208
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2023-06-02 10:35:56.004544	41	MARK_RAN	8:0f01b554f256c22caeb7d8aee3a1cdc8	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.8.0	\N	\N	5702155208
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2023-06-02 10:35:56.035112	42	EXECUTED	8:ab91cf9cee415867ade0e2df9651a947	customChange		\N	4.8.0	\N	\N	5702155208
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2023-06-02 10:35:56.16757	43	EXECUTED	8:ceac9b1889e97d602caf373eadb0d4b7	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.8.0	\N	\N	5702155208
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2023-06-02 10:35:56.177015	44	EXECUTED	8:84b986e628fe8f7fd8fd3c275c5259f2	addColumn tableName=USER_ENTITY		\N	4.8.0	\N	\N	5702155208
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-06-02 10:35:56.193839	46	EXECUTED	8:70a2b4f1f4bd4dbf487114bdb1810e64	customChange		\N	4.8.0	\N	\N	5702155208
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-06-02 10:35:56.199516	47	MARK_RAN	8:7be68b71d2f5b94b8df2e824f2860fa2	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.8.0	\N	\N	5702155208
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-06-02 10:35:56.221553	48	EXECUTED	8:bab7c631093c3861d6cf6144cd944982	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.8.0	\N	\N	5702155208
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-06-02 10:35:56.224938	49	EXECUTED	8:fa809ac11877d74d76fe40869916daad	addColumn tableName=REALM		\N	4.8.0	\N	\N	5702155208
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2023-06-02 10:35:56.244604	50	EXECUTED	8:fac23540a40208f5f5e326f6ceb4d291	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.8.0	\N	\N	5702155208
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2023-06-02 10:35:56.257367	51	EXECUTED	8:2612d1b8a97e2b5588c346e817307593	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.8.0	\N	\N	5702155208
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2023-06-02 10:35:56.258908	52	EXECUTED	8:9842f155c5db2206c88bcb5d1046e941	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5702155208
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2023-06-02 10:35:56.26032	53	EXECUTED	8:2e12e06e45498406db72d5b3da5bbc76	update tableName=REALM		\N	4.8.0	\N	\N	5702155208
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2023-06-02 10:35:56.261498	54	EXECUTED	8:33560e7c7989250c40da3abdabdc75a4	update tableName=CLIENT		\N	4.8.0	\N	\N	5702155208
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-06-02 10:35:56.266489	55	EXECUTED	8:87a8d8542046817a9107c7eb9cbad1cd	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.8.0	\N	\N	5702155208
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-06-02 10:35:56.273519	56	EXECUTED	8:3ea08490a70215ed0088c273d776311e	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.8.0	\N	\N	5702155208
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-06-02 10:35:56.284536	57	EXECUTED	8:2d56697c8723d4592ab608ce14b6ed68	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.8.0	\N	\N	5702155208
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-06-02 10:35:56.345337	58	EXECUTED	8:3e423e249f6068ea2bbe48bf907f9d86	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.8.0	\N	\N	5702155208
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2023-06-02 10:35:56.360902	59	EXECUTED	8:15cabee5e5df0ff099510a0fc03e4103	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.8.0	\N	\N	5702155208
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2023-06-02 10:35:56.363654	60	EXECUTED	8:4b80200af916ac54d2ffbfc47918ab0e	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.8.0	\N	\N	5702155208
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2023-06-02 10:35:56.36759	61	EXECUTED	8:66564cd5e168045d52252c5027485bbb	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.8.0	\N	\N	5702155208
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2023-06-02 10:35:56.370511	62	EXECUTED	8:1c7064fafb030222be2bd16ccf690f6f	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.8.0	\N	\N	5702155208
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2023-06-02 10:35:56.372246	63	EXECUTED	8:2de18a0dce10cdda5c7e65c9b719b6e5	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.8.0	\N	\N	5702155208
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2023-06-02 10:35:56.373588	64	EXECUTED	8:03e413dd182dcbd5c57e41c34d0ef682	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.8.0	\N	\N	5702155208
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2023-06-02 10:35:56.37484	65	EXECUTED	8:d27b42bb2571c18fbe3fe4e4fb7582a7	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.8.0	\N	\N	5702155208
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2023-06-02 10:35:56.381107	66	EXECUTED	8:698baf84d9fd0027e9192717c2154fb8	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.8.0	\N	\N	5702155208
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2023-06-02 10:35:56.383908	67	EXECUTED	8:ced8822edf0f75ef26eb51582f9a821a	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.8.0	\N	\N	5702155208
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2023-06-02 10:35:56.386179	68	EXECUTED	8:f0abba004cf429e8afc43056df06487d	addColumn tableName=REALM		\N	4.8.0	\N	\N	5702155208
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2023-06-02 10:35:56.400296	69	EXECUTED	8:6662f8b0b611caa359fcf13bf63b4e24	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.8.0	\N	\N	5702155208
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2023-06-02 10:35:56.403066	70	EXECUTED	8:9e6b8009560f684250bdbdf97670d39e	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.8.0	\N	\N	5702155208
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2023-06-02 10:35:56.405002	71	EXECUTED	8:4223f561f3b8dc655846562b57bb502e	addColumn tableName=RESOURCE_SERVER		\N	4.8.0	\N	\N	5702155208
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-06-02 10:35:56.408677	72	EXECUTED	8:215a31c398b363ce383a2b301202f29e	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	5702155208
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-06-02 10:35:56.411872	73	EXECUTED	8:83f7a671792ca98b3cbd3a1a34862d3d	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	5702155208
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-06-02 10:35:56.412896	74	MARK_RAN	8:f58ad148698cf30707a6efbdf8061aa7	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	5702155208
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-06-02 10:35:56.421689	75	EXECUTED	8:79e4fd6c6442980e58d52ffc3ee7b19c	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.8.0	\N	\N	5702155208
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-06-02 10:35:56.424963	76	EXECUTED	8:87af6a1e6d241ca4b15801d1f86a297d	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.8.0	\N	\N	5702155208
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-06-02 10:35:56.426692	77	EXECUTED	8:b44f8d9b7b6ea455305a6d72a200ed15	addColumn tableName=CLIENT		\N	4.8.0	\N	\N	5702155208
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-06-02 10:35:56.427633	78	MARK_RAN	8:2d8ed5aaaeffd0cb004c046b4a903ac5	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.8.0	\N	\N	5702155208
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-06-02 10:35:56.436079	79	EXECUTED	8:e290c01fcbc275326c511633f6e2acde	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.8.0	\N	\N	5702155208
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-06-02 10:35:56.437267	80	MARK_RAN	8:c9db8784c33cea210872ac2d805439f8	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.8.0	\N	\N	5702155208
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-06-02 10:35:56.439965	81	EXECUTED	8:95b676ce8fc546a1fcfb4c92fae4add5	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.8.0	\N	\N	5702155208
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-06-02 10:35:56.440974	82	MARK_RAN	8:38a6b2a41f5651018b1aca93a41401e5	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5702155208
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-06-02 10:35:56.442902	83	EXECUTED	8:3fb99bcad86a0229783123ac52f7609c	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5702155208
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-06-02 10:35:56.443826	84	MARK_RAN	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	5702155208
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-06-02 10:35:56.446309	85	EXECUTED	8:ab4f863f39adafd4c862f7ec01890abc	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.8.0	\N	\N	5702155208
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2023-06-02 10:35:56.449003	86	EXECUTED	8:13c419a0eb336e91ee3a3bf8fda6e2a7	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.8.0	\N	\N	5702155208
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2023-06-02 10:35:56.452918	87	EXECUTED	8:e3fb1e698e0471487f51af1ed80fe3ac	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.8.0	\N	\N	5702155208
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2023-06-02 10:35:56.457334	88	EXECUTED	8:babadb686aab7b56562817e60bf0abd0	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.8.0	\N	\N	5702155208
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.460576	89	EXECUTED	8:72d03345fda8e2f17093d08801947773	addColumn tableName=REALM; customChange		\N	4.8.0	\N	\N	5702155208
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.463722	90	EXECUTED	8:61c9233951bd96ffecd9ba75f7d978a4	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.8.0	\N	\N	5702155208
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.466574	91	EXECUTED	8:ea82e6ad945cec250af6372767b25525	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5702155208
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.471088	92	EXECUTED	8:d3f4a33f41d960ddacd7e2ef30d126b3	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.8.0	\N	\N	5702155208
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.472051	93	MARK_RAN	8:1284a27fbd049d65831cb6fc07c8a783	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.8.0	\N	\N	5702155208
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.47588	94	EXECUTED	8:9d11b619db2ae27c25853b8a37cd0dea	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.8.0	\N	\N	5702155208
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.476973	95	MARK_RAN	8:3002bb3997451bb9e8bac5c5cd8d6327	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.8.0	\N	\N	5702155208
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-06-02 10:35:56.479379	96	EXECUTED	8:dfbee0d6237a23ef4ccbb7a4e063c163	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.8.0	\N	\N	5702155208
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.483966	97	EXECUTED	8:75f3e372df18d38c62734eebb986b960	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	5702155208
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.48502	98	MARK_RAN	8:7fee73eddf84a6035691512c85637eef	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5702155208
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.490627	99	MARK_RAN	8:7a11134ab12820f999fbf3bb13c3adc8	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5702155208
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.493531	100	EXECUTED	8:c0f6eaac1f3be773ffe54cb5b8482b70	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5702155208
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.494658	101	MARK_RAN	8:18186f0008b86e0f0f49b0c4d0e842ac	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	5702155208
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.497448	102	EXECUTED	8:09c2780bcb23b310a7019d217dc7b433	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.8.0	\N	\N	5702155208
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-06-02 10:35:56.500747	103	EXECUTED	8:276a44955eab693c970a42880197fff2	customChange		\N	4.8.0	\N	\N	5702155208
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2023-06-02 10:35:56.503532	104	EXECUTED	8:ba8ee3b694d043f2bfc1a1079d0760d7	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.8.0	\N	\N	5702155208
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2023-06-02 10:35:56.506127	105	EXECUTED	8:5e06b1d75f5d17685485e610c2851b17	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.8.0	\N	\N	5702155208
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2023-06-02 10:35:56.508526	106	EXECUTED	8:4b80546c1dc550ac552ee7b24a4ab7c0	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.8.0	\N	\N	5702155208
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2023-06-02 10:35:56.5107	107	EXECUTED	8:af510cd1bb2ab6339c45372f3e491696	customChange		\N	4.8.0	\N	\N	5702155208
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
1001	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
3ad74e4d-c3f3-49be-94e9-8999a62aa878	e69d9b90-3997-4d54-8a17-db5a1dfe2138	f
3ad74e4d-c3f3-49be-94e9-8999a62aa878	c3000c03-a1fa-4bfc-bf5b-0ae82eea7044	t
3ad74e4d-c3f3-49be-94e9-8999a62aa878	73255b0a-ab8e-434b-bfbf-8790c07d04d1	t
3ad74e4d-c3f3-49be-94e9-8999a62aa878	856672ff-10dc-4fd3-97fc-bab3e06a2e2e	t
3ad74e4d-c3f3-49be-94e9-8999a62aa878	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe	f
3ad74e4d-c3f3-49be-94e9-8999a62aa878	e1448427-2df5-40cf-9200-c3b75410023c	f
3ad74e4d-c3f3-49be-94e9-8999a62aa878	b608d51d-b6fa-4dfa-9610-f79e7e95ff85	t
3ad74e4d-c3f3-49be-94e9-8999a62aa878	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325	t
3ad74e4d-c3f3-49be-94e9-8999a62aa878	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32	f
3ad74e4d-c3f3-49be-94e9-8999a62aa878	57ecc5c1-220d-4050-aedb-f34faff67f10	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	55654cb7-8fa1-481d-bba3-45ae74299567	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	9a3add25-e9e2-48f9-8d0f-c9595ca3998e	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	592391bb-095c-4a2a-b698-b0e622c16aa5	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	018368f4-e0f5-4737-875b-a6139276236b	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	d671cd38-1d4f-4a87-9211-5183a7e3469f	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	2e41b0c5-9570-4667-9bfd-d132f86e1d37	t
eee17a22-75b7-4ac9-a844-a9dd52c83d91	27ab1952-e2d1-4836-8e30-5abc4fbe1b38	f
eee17a22-75b7-4ac9-a844-a9dd52c83d91	6420ab5b-9e2f-477d-ac2d-03e511c567ca	f
eee17a22-75b7-4ac9-a844-a9dd52c83d91	1f2f9597-8dab-4779-bffe-47c6695deafe	f
eee17a22-75b7-4ac9-a844-a9dd52c83d91	e0d406b7-3601-45c1-8131-2585eeb37060	f
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.keycloak_group (id, name, parent_group, realm_id) FROM stdin;
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
f84bb28f-dc03-4b61-bd9d-894598ab747c	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	${role_default-roles}	default-roles-master	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	\N
00e35af7-6be2-41c7-8425-85631c8d459a	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	${role_admin}	admin	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	\N
0976df7a-5939-43c4-9093-832593b98c8c	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	${role_create-realm}	create-realm	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	\N
dff38e9a-928a-4f68-95fb-269bfc5a65e9	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_create-client}	create-client	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
5241ae38-6e26-4048-920c-df750bda9507	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_view-realm}	view-realm	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
59161409-3a42-47e8-a4db-2aa0ce7cb853	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_view-users}	view-users	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
29b3d652-af48-4e74-9d15-724f2617b5ea	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_view-clients}	view-clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
1524bd84-111b-4a70-846b-4c0264e5ebc5	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_view-events}	view-events	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
7089e0d4-1581-455b-a3cd-80d3e904426a	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_view-identity-providers}	view-identity-providers	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
6c609d55-1f69-4abe-b511-95bb5ec9c006	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_view-authorization}	view-authorization	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
0a2334cd-998f-4d1a-ba75-9a5f09ae595d	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_manage-realm}	manage-realm	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
9cc11ee4-47f0-4a00-a874-6e6717790388	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_manage-users}	manage-users	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
f671a650-fbee-41a7-ab05-82bc8181bb8f	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_manage-clients}	manage-clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
c22f75c3-5aaf-4607-bb66-ae63dea9b258	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_manage-events}	manage-events	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
599a3043-ddf8-4c88-bf6c-c91972cbf64c	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_manage-identity-providers}	manage-identity-providers	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
ff752a35-7da9-43d4-8558-1a5f4350f783	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_manage-authorization}	manage-authorization	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
d324f3dc-cf4e-4ce0-bdbc-b159b62769ec	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_query-users}	query-users	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
a43046b7-aa3b-425d-b596-f7e2caba2ee0	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_query-clients}	query-clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
b9874a29-56ee-41e4-9899-302263d80744	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_query-realms}	query-realms	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
6e04dd54-82c2-4712-a25f-04d316d690f9	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_query-groups}	query-groups	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
156bef95-81da-43e4-a69c-2079fea1256b	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_view-profile}	view-profile	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
2b1eeda6-2074-460c-aff0-ebba4b78c15c	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_manage-account}	manage-account	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
cf5912e7-a580-4b62-bddc-67930ff69bf2	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_manage-account-links}	manage-account-links	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
34df0121-dbf2-4555-97d0-7c6c4539c888	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_view-applications}	view-applications	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
9eaf2c4b-7e9e-423e-977a-577f5e6a85b9	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_view-consent}	view-consent	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
231b7964-2c43-4138-a07d-1ef308522e17	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_manage-consent}	manage-consent	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
7ce004ae-77b3-4774-b89f-d875f843579e	1becba53-c352-4349-8814-9c03b63dfe00	t	${role_delete-account}	delete-account	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1becba53-c352-4349-8814-9c03b63dfe00	\N
4286ac72-58eb-447b-9616-ef4bbd0007f5	0c76b7d5-f93f-42b8-a74d-07838831d851	t	${role_read-token}	read-token	3ad74e4d-c3f3-49be-94e9-8999a62aa878	0c76b7d5-f93f-42b8-a74d-07838831d851	\N
7338abb4-e322-4d09-96c0-3442db0ddee9	659fec1b-26c9-4eb0-924f-5aae63a5985f	t	${role_impersonation}	impersonation	3ad74e4d-c3f3-49be-94e9-8999a62aa878	659fec1b-26c9-4eb0-924f-5aae63a5985f	\N
e85f8e66-0030-4d42-8f5f-36bba6279ad2	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	${role_offline-access}	offline_access	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	\N
0312cf2f-887e-41e3-bc88-18b1f3b26cc5	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	${role_uma_authorization}	uma_authorization	3ad74e4d-c3f3-49be-94e9-8999a62aa878	\N	\N
f3d23bc8-a165-4b5f-a5d1-164807cf3832	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_view-events}	view-events	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
292fe9a5-eb33-4065-8f14-e8f64d17fe8c	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_view-identity-providers}	view-identity-providers	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
07384a22-8aff-4ddc-b37b-d0a8ac226aa2	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_view-authorization}	view-authorization	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
ab3448f1-90d9-4e53-835b-9e260380d4a7	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_manage-realm}	manage-realm	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
85f1b854-b8c5-4396-848c-62503eeef2e9	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_manage-users}	manage-users	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
d26fcf73-8b21-4c0e-bf50-cb37ac79d857	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_manage-clients}	manage-clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	eee17a22-75b7-4ac9-a844-a9dd52c83d91	f	${role_default-roles}	default-roles-showcase	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N	\N
bc96457c-694c-4bad-a3fa-137e1acb1e5c	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_create-client}	create-client	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
0e5ef484-8753-4f15-a11d-5668e1009e71	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_view-realm}	view-realm	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
afd092b0-d4f8-4604-8924-a611394577bf	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_view-users}	view-users	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
d1100f36-ee16-491d-b8a3-e1ad30d6f700	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_view-clients}	view-clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
d41e9846-df5b-4f34-9946-6e9eabf50ca2	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_manage-events}	manage-events	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
970c51bf-3593-4423-8024-04eee9a83e6f	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	t	\N	uma_protection	3ad74e4d-c3f3-49be-94e9-8999a62aa878	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	\N
042624a2-7dac-4ab2-99eb-f2af3e747f1f	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_manage-identity-providers}	manage-identity-providers	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
ca51f33d-4f2f-449a-ab4a-718f83c88104	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_manage-authorization}	manage-authorization	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
2ca9db0f-5d74-427c-aca3-d386390be0d7	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_query-users}	query-users	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
b868316b-334a-4145-9d6c-19798e060741	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_query-clients}	query-clients	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
aac8da0f-e667-4bc5-b0d5-36101425aa11	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_query-realms}	query-realms	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
796dc3a9-a947-457a-bea9-8b07b9b7f50d	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_query-groups}	query-groups	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
27b58e14-4dc1-46a2-b51f-581b021bf987	eee17a22-75b7-4ac9-a844-a9dd52c83d91	f	${role_offline-access}	offline_access	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N	\N
d50e0edd-34b7-433e-a65a-9f6589e80d36	eee17a22-75b7-4ac9-a844-a9dd52c83d91	f	${role_uma_authorization}	uma_authorization	eee17a22-75b7-4ac9-a844-a9dd52c83d91	\N	\N
10094551-05c3-4c6f-89ec-9cd33babd9bb	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_view-authorization}	view-authorization	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
36b91607-b821-4b21-bff0-18ab0ea022e1	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_realm-admin}	realm-admin	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
6e8a1339-75f6-424f-9b8e-ffc7f4b73ee0	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_manage-events}	manage-events	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
55a6bb04-394a-4908-966a-179d393bd41e	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_view-identity-providers}	view-identity-providers	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
112791ae-637f-4f36-8557-8306c3ea1b3c	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_impersonation}	impersonation	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
f3d93c8a-2190-42f2-ba83-8b517e73f8a7	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_view-clients}	view-clients	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
9e669170-3897-4ad8-96bd-8df1eb366d66	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_view-realm}	view-realm	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
03f2aa10-7775-44f4-ae65-1b94e82bbc07	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_create-client}	create-client	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
6fdc7c3a-e37b-4df3-930d-25964fe059e5	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_manage-authorization}	manage-authorization	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
5406b1c5-a870-4ac5-a360-e1a1a86f643b	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_manage-identity-providers}	manage-identity-providers	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
819734df-7e04-4557-b5f4-feba29e3d386	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_query-clients}	query-clients	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
c69175f5-2852-4160-9fb7-20d625ef9a7e	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_view-events}	view-events	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
1b7b4f20-9df9-4082-a2dc-bc08fdb728c4	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_query-groups}	query-groups	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
95009d5b-303c-4ebb-93b1-97366d4712ea	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_query-users}	query-users	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
c22e7da2-f04e-4acf-aad1-b3b67dc16097	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_manage-realm}	manage-realm	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
adc95717-7543-43ab-a897-13c28d78c8e5	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_manage-users}	manage-users	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
693a128a-7d6b-4bf5-bce2-e02b5034d4fe	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_query-realms}	query-realms	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
8ac729aa-1c99-4310-819a-8b9dd459af27	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_manage-clients}	manage-clients	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
dec272e2-d7b3-4d3e-801f-2cc84b5ec2a5	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	${role_view-users}	view-users	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
cd3ddfca-8cf6-4cf6-a567-8a26bdd203f9	7cd5b438-6539-4dc2-8222-4500eaa6c508	t	\N	uma_protection	eee17a22-75b7-4ac9-a844-a9dd52c83d91	7cd5b438-6539-4dc2-8222-4500eaa6c508	\N
1695788d-899b-4590-abcc-871e7fe222f5	14434784-2168-489e-8b3d-b5121fa76ce1	t	${role_read-token}	read-token	eee17a22-75b7-4ac9-a844-a9dd52c83d91	14434784-2168-489e-8b3d-b5121fa76ce1	\N
6de88b03-a5c7-4a05-9a48-524961341e6e	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_delete-account}	delete-account	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
db82aea6-7bf5-4cbf-b317-74004ab21a69	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_manage-account-links}	manage-account-links	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
1ea78e88-24f5-4648-99e2-c6e15d57f772	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_view-profile}	view-profile	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
3a547c2d-683b-45f7-81a2-9b14374e1aea	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_view-applications}	view-applications	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
d9de9c44-ee71-4b8a-af98-0a481c9e4a34	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_manage-account}	manage-account	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
7e28a8d0-7ea3-4b0f-91b3-ad8cfd2ddc3e	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_view-consent}	view-consent	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
239ce4cb-8fc5-4673-8bc5-9944eb0acaac	34262697-003e-4c57-a55f-241bb014a8a7	t	${role_manage-consent}	manage-consent	eee17a22-75b7-4ac9-a844-a9dd52c83d91	34262697-003e-4c57-a55f-241bb014a8a7	\N
5d9c0ff8-95dc-4bbf-b6ea-a1f50ace688c	0b25b475-7074-4ce8-85a6-b32fb28bd048	t	\N	uma_protection	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
828c1370-4267-443d-867a-3e301c9dee78	9f041010-887d-426e-811e-2ab07ca84a96	t	${role_impersonation}	impersonation	3ad74e4d-c3f3-49be-94e9-8999a62aa878	9f041010-887d-426e-811e-2ab07ca84a96	\N
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migration_model (id, version, update_time) FROM stdin;
ph2xx	19.0.3	1685702156
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh) FROM stdin;
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
9fee10b9-5012-4bba-af72-b870b536afc1	code	// by default, grants any permission associated with this policy\n$evaluation.grant();\n
703af00e-8142-4686-be89-86c20e867b6f	defaultResourceType	urn:admin-cli:resources:default
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
1803d9a4-f601-4688-9429-33d81663a330	audience resolve	openid-connect	oidc-audience-resolve-mapper	690d9ca3-295e-4fcc-bbef-da87d5b418be	\N
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	locale	openid-connect	oidc-usermodel-attribute-mapper	5e0362a6-cd82-4108-9c0a-dadfe944eb54	\N
a0bb3a86-5af2-4f0f-95a9-ff57ebdc5840	role list	saml	saml-role-list-mapper	\N	c3000c03-a1fa-4bfc-bf5b-0ae82eea7044
10c3e177-d173-429e-908b-98bca88e7dab	full name	openid-connect	oidc-full-name-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	family name	openid-connect	oidc-usermodel-property-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	given name	openid-connect	oidc-usermodel-property-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
d668a677-33e2-47cc-a7e6-154c8a93a4f2	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
02ba0ba4-6587-4605-a71c-61439f66463c	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
2151280a-3847-4628-8e4a-816e723d9b28	username	openid-connect	oidc-usermodel-property-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
528bd80f-6482-4572-888f-18a87ded2266	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
f4ccb725-27e8-47d7-99ae-83103e840c57	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
8d67ce79-afce-4429-a33a-02bd991b35a3	website	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
45cd3e60-7bc5-47c3-a584-41c67985b449	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
11e0ddd3-813b-4fb0-9376-895a6609ae70	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
c78f9a86-c1a3-4069-878e-7def4e22ff38	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
b0a79275-f071-424f-88c1-020749da940b	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	73255b0a-ab8e-434b-bfbf-8790c07d04d1
c1a5ebb5-3c44-459e-99fc-a758366d96cb	email	openid-connect	oidc-usermodel-property-mapper	\N	856672ff-10dc-4fd3-97fc-bab3e06a2e2e
13409e55-3a84-4d94-beaa-40617b024bc9	email verified	openid-connect	oidc-usermodel-property-mapper	\N	856672ff-10dc-4fd3-97fc-bab3e06a2e2e
802e4a63-8081-4a8b-b51c-70850bc87bc6	address	openid-connect	oidc-address-mapper	\N	782dd087-7d3c-4fb6-bc91-e0d1c1b06abe
a9129a82-1bd6-4946-bcbf-25120a471078	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	e1448427-2df5-40cf-9200-c3b75410023c
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	e1448427-2df5-40cf-9200-c3b75410023c
99e23bdb-4d49-4d2a-b97c-5bd13dd7b873	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	b608d51d-b6fa-4dfa-9610-f79e7e95ff85
bb22d249-b5b0-4e86-8a7f-c0b213135f9b	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	b608d51d-b6fa-4dfa-9610-f79e7e95ff85
645199c2-d14b-41e1-b207-faaf4766dbb9	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	b608d51d-b6fa-4dfa-9610-f79e7e95ff85
f95a9540-a3c5-49a2-ac07-d620b0b9ac3e	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	81ca9dda-42a6-4e4c-87b3-e9b73c8c3325
727913c0-6e09-4090-8afb-8f7cb469818c	upn	openid-connect	oidc-usermodel-property-mapper	\N	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32
6c1c5392-199d-4c6d-9b84-1284de79186e	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	f7843a3c-fb69-4ea4-bb8c-4dd99318fa32
67119c9e-9c2f-4e0c-aa22-92bbb3846dad	acr loa level	openid-connect	oidc-acr-mapper	\N	57ecc5c1-220d-4050-aedb-f34faff67f10
98c5327c-688a-4586-a722-56a75d918f9b	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	\N
10757eb6-03d3-4e17-a0f0-f1b506ae2c0e	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	\N
c9007a77-6ca5-4a7b-aaf9-8553b3f77438	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	\N
a1b056a1-80e1-487c-a2b8-c279911359b4	full name	openid-connect	oidc-full-name-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
22dd8216-081f-409b-aca8-135aa67057b5	website	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
6db9b298-771e-4732-9d19-5dfdd86cf7c3	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	given name	openid-connect	oidc-usermodel-property-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
f725803c-9682-402e-8ed8-32add964450f	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
8861035d-5ff1-4a10-a5ee-06b0af4a0839	username	openid-connect	oidc-usermodel-property-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
76127931-3a43-4e51-9d96-4fbf1ab91c68	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
5d66745a-8662-4278-b097-01ff53255b47	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
a78a08b8-d54f-461c-a49d-1c57c162f767	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	family name	openid-connect	oidc-usermodel-property-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
b6f429fe-7c23-435b-acd5-5ecf402a3733	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
ca445de3-6954-431e-bf8d-575593477bd7	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	9a3add25-e9e2-48f9-8d0f-c9595ca3998e
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	address	openid-connect	oidc-address-mapper	\N	6420ab5b-9e2f-477d-ac2d-03e511c567ca
b0565d86-6225-4668-a692-ad60270341ab	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	018368f4-e0f5-4737-875b-a6139276236b
bc6ac84f-af75-4614-ae65-7ace5e8f59ea	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	018368f4-e0f5-4737-875b-a6139276236b
b9bb2edc-f485-4219-a76b-4db4ec1cacf1	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	018368f4-e0f5-4737-875b-a6139276236b
c1d946b2-1c5c-4e02-bfe6-42cab9811224	role list	saml	saml-role-list-mapper	\N	55654cb7-8fa1-481d-bba3-45ae74299567
e57e2dfb-b001-4662-a6da-469be860c9bd	acr loa level	openid-connect	oidc-acr-mapper	\N	2e41b0c5-9570-4667-9bfd-d132f86e1d37
46aa6e98-2532-4980-814c-f66a614a734a	email verified	openid-connect	oidc-usermodel-property-mapper	\N	592391bb-095c-4a2a-b698-b0e622c16aa5
f62f43f5-7e30-441e-a966-660eaa4b96c8	email	openid-connect	oidc-usermodel-property-mapper	\N	592391bb-095c-4a2a-b698-b0e622c16aa5
c1c94267-0cd5-4866-a2d6-ede053a23682	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	d671cd38-1d4f-4a87-9211-5183a7e3469f
19f89cea-9a9a-49ca-8828-fe45530b6127	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	1f2f9597-8dab-4779-bffe-47c6695deafe
7269fd89-11c1-476a-8227-2078de06c5df	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	1f2f9597-8dab-4779-bffe-47c6695deafe
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	upn	openid-connect	oidc-usermodel-property-mapper	\N	e0d406b7-3601-45c1-8131-2585eeb37060
a6d5ca50-8763-48a5-8424-6e1e41509afe	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	e0d406b7-3601-45c1-8131-2585eeb37060
86c627e1-7b58-4f85-9b83-89c11e80e6a3	audience resolve	openid-connect	oidc-audience-resolve-mapper	a143887d-b1d6-4c25-9e62-81f11b0fdd81	\N
28d15a7f-5ebe-46ff-9219-7dda647c91f2	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	7cd5b438-6539-4dc2-8222-4500eaa6c508	\N
65cffc70-c953-4d69-8939-44075f831e5c	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	7cd5b438-6539-4dc2-8222-4500eaa6c508	\N
02388748-c28d-4a87-9f9d-e5e008209158	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	7cd5b438-6539-4dc2-8222-4500eaa6c508	\N
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	locale	openid-connect	oidc-usermodel-attribute-mapper	f7f2071d-3e4b-41bc-8988-7f6ec272ac24	\N
9c63afbe-05f5-4513-afb3-0da0bbf6769d	Client ID	openid-connect	oidc-usersessionmodel-note-mapper	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
825ac9cd-790a-47c1-83f1-568d341294f9	Client Host	openid-connect	oidc-usersessionmodel-note-mapper	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
20ea6641-132a-4db3-9dd4-5dab5014fc15	Client IP Address	openid-connect	oidc-usersessionmodel-note-mapper	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	true	userinfo.token.claim
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	locale	user.attribute
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	true	id.token.claim
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	true	access.token.claim
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	locale	claim.name
7ad11a04-b927-4d72-a5c7-d9aca3e61c69	String	jsonType.label
a0bb3a86-5af2-4f0f-95a9-ff57ebdc5840	false	single
a0bb3a86-5af2-4f0f-95a9-ff57ebdc5840	Basic	attribute.nameformat
a0bb3a86-5af2-4f0f-95a9-ff57ebdc5840	Role	attribute.name
02ba0ba4-6587-4605-a71c-61439f66463c	true	userinfo.token.claim
02ba0ba4-6587-4605-a71c-61439f66463c	nickname	user.attribute
02ba0ba4-6587-4605-a71c-61439f66463c	true	id.token.claim
02ba0ba4-6587-4605-a71c-61439f66463c	true	access.token.claim
02ba0ba4-6587-4605-a71c-61439f66463c	nickname	claim.name
02ba0ba4-6587-4605-a71c-61439f66463c	String	jsonType.label
10c3e177-d173-429e-908b-98bca88e7dab	true	userinfo.token.claim
10c3e177-d173-429e-908b-98bca88e7dab	true	id.token.claim
10c3e177-d173-429e-908b-98bca88e7dab	true	access.token.claim
11e0ddd3-813b-4fb0-9376-895a6609ae70	true	userinfo.token.claim
11e0ddd3-813b-4fb0-9376-895a6609ae70	zoneinfo	user.attribute
11e0ddd3-813b-4fb0-9376-895a6609ae70	true	id.token.claim
11e0ddd3-813b-4fb0-9376-895a6609ae70	true	access.token.claim
11e0ddd3-813b-4fb0-9376-895a6609ae70	zoneinfo	claim.name
11e0ddd3-813b-4fb0-9376-895a6609ae70	String	jsonType.label
2151280a-3847-4628-8e4a-816e723d9b28	true	userinfo.token.claim
2151280a-3847-4628-8e4a-816e723d9b28	username	user.attribute
2151280a-3847-4628-8e4a-816e723d9b28	true	id.token.claim
2151280a-3847-4628-8e4a-816e723d9b28	true	access.token.claim
2151280a-3847-4628-8e4a-816e723d9b28	preferred_username	claim.name
2151280a-3847-4628-8e4a-816e723d9b28	String	jsonType.label
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	true	userinfo.token.claim
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	lastName	user.attribute
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	true	id.token.claim
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	true	access.token.claim
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	family_name	claim.name
3b9bb6b0-a5df-49c5-9591-07e52daf8c99	String	jsonType.label
45cd3e60-7bc5-47c3-a584-41c67985b449	true	userinfo.token.claim
45cd3e60-7bc5-47c3-a584-41c67985b449	birthdate	user.attribute
45cd3e60-7bc5-47c3-a584-41c67985b449	true	id.token.claim
45cd3e60-7bc5-47c3-a584-41c67985b449	true	access.token.claim
45cd3e60-7bc5-47c3-a584-41c67985b449	birthdate	claim.name
45cd3e60-7bc5-47c3-a584-41c67985b449	String	jsonType.label
528bd80f-6482-4572-888f-18a87ded2266	true	userinfo.token.claim
528bd80f-6482-4572-888f-18a87ded2266	profile	user.attribute
528bd80f-6482-4572-888f-18a87ded2266	true	id.token.claim
528bd80f-6482-4572-888f-18a87ded2266	true	access.token.claim
528bd80f-6482-4572-888f-18a87ded2266	profile	claim.name
528bd80f-6482-4572-888f-18a87ded2266	String	jsonType.label
8d67ce79-afce-4429-a33a-02bd991b35a3	true	userinfo.token.claim
8d67ce79-afce-4429-a33a-02bd991b35a3	website	user.attribute
8d67ce79-afce-4429-a33a-02bd991b35a3	true	id.token.claim
8d67ce79-afce-4429-a33a-02bd991b35a3	true	access.token.claim
8d67ce79-afce-4429-a33a-02bd991b35a3	website	claim.name
8d67ce79-afce-4429-a33a-02bd991b35a3	String	jsonType.label
b0a79275-f071-424f-88c1-020749da940b	true	userinfo.token.claim
b0a79275-f071-424f-88c1-020749da940b	updatedAt	user.attribute
b0a79275-f071-424f-88c1-020749da940b	true	id.token.claim
b0a79275-f071-424f-88c1-020749da940b	true	access.token.claim
b0a79275-f071-424f-88c1-020749da940b	updated_at	claim.name
b0a79275-f071-424f-88c1-020749da940b	long	jsonType.label
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	true	userinfo.token.claim
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	firstName	user.attribute
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	true	id.token.claim
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	true	access.token.claim
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	given_name	claim.name
bb2a3f8d-e5e4-4b21-9dc2-032ce4c9c36b	String	jsonType.label
c78f9a86-c1a3-4069-878e-7def4e22ff38	true	userinfo.token.claim
c78f9a86-c1a3-4069-878e-7def4e22ff38	locale	user.attribute
c78f9a86-c1a3-4069-878e-7def4e22ff38	true	id.token.claim
c78f9a86-c1a3-4069-878e-7def4e22ff38	true	access.token.claim
c78f9a86-c1a3-4069-878e-7def4e22ff38	locale	claim.name
c78f9a86-c1a3-4069-878e-7def4e22ff38	String	jsonType.label
d668a677-33e2-47cc-a7e6-154c8a93a4f2	true	userinfo.token.claim
d668a677-33e2-47cc-a7e6-154c8a93a4f2	middleName	user.attribute
d668a677-33e2-47cc-a7e6-154c8a93a4f2	true	id.token.claim
d668a677-33e2-47cc-a7e6-154c8a93a4f2	true	access.token.claim
d668a677-33e2-47cc-a7e6-154c8a93a4f2	middle_name	claim.name
d668a677-33e2-47cc-a7e6-154c8a93a4f2	String	jsonType.label
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	true	userinfo.token.claim
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	gender	user.attribute
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	true	id.token.claim
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	true	access.token.claim
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	gender	claim.name
e4d11834-6ecc-4b5a-881a-d7c5879cc5b2	String	jsonType.label
f4ccb725-27e8-47d7-99ae-83103e840c57	true	userinfo.token.claim
f4ccb725-27e8-47d7-99ae-83103e840c57	picture	user.attribute
f4ccb725-27e8-47d7-99ae-83103e840c57	true	id.token.claim
f4ccb725-27e8-47d7-99ae-83103e840c57	true	access.token.claim
f4ccb725-27e8-47d7-99ae-83103e840c57	picture	claim.name
f4ccb725-27e8-47d7-99ae-83103e840c57	String	jsonType.label
13409e55-3a84-4d94-beaa-40617b024bc9	true	userinfo.token.claim
13409e55-3a84-4d94-beaa-40617b024bc9	emailVerified	user.attribute
13409e55-3a84-4d94-beaa-40617b024bc9	true	id.token.claim
13409e55-3a84-4d94-beaa-40617b024bc9	true	access.token.claim
13409e55-3a84-4d94-beaa-40617b024bc9	email_verified	claim.name
13409e55-3a84-4d94-beaa-40617b024bc9	boolean	jsonType.label
c1a5ebb5-3c44-459e-99fc-a758366d96cb	true	userinfo.token.claim
c1a5ebb5-3c44-459e-99fc-a758366d96cb	email	user.attribute
c1a5ebb5-3c44-459e-99fc-a758366d96cb	true	id.token.claim
c1a5ebb5-3c44-459e-99fc-a758366d96cb	true	access.token.claim
c1a5ebb5-3c44-459e-99fc-a758366d96cb	email	claim.name
c1a5ebb5-3c44-459e-99fc-a758366d96cb	String	jsonType.label
802e4a63-8081-4a8b-b51c-70850bc87bc6	formatted	user.attribute.formatted
802e4a63-8081-4a8b-b51c-70850bc87bc6	country	user.attribute.country
802e4a63-8081-4a8b-b51c-70850bc87bc6	postal_code	user.attribute.postal_code
802e4a63-8081-4a8b-b51c-70850bc87bc6	true	userinfo.token.claim
802e4a63-8081-4a8b-b51c-70850bc87bc6	street	user.attribute.street
802e4a63-8081-4a8b-b51c-70850bc87bc6	true	id.token.claim
802e4a63-8081-4a8b-b51c-70850bc87bc6	region	user.attribute.region
802e4a63-8081-4a8b-b51c-70850bc87bc6	true	access.token.claim
802e4a63-8081-4a8b-b51c-70850bc87bc6	locality	user.attribute.locality
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	true	userinfo.token.claim
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	phoneNumberVerified	user.attribute
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	true	id.token.claim
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	true	access.token.claim
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	phone_number_verified	claim.name
5f243a61-79e7-4c55-a22e-5fe6ceb4cf29	boolean	jsonType.label
a9129a82-1bd6-4946-bcbf-25120a471078	true	userinfo.token.claim
a9129a82-1bd6-4946-bcbf-25120a471078	phoneNumber	user.attribute
a9129a82-1bd6-4946-bcbf-25120a471078	true	id.token.claim
a9129a82-1bd6-4946-bcbf-25120a471078	true	access.token.claim
a9129a82-1bd6-4946-bcbf-25120a471078	phone_number	claim.name
a9129a82-1bd6-4946-bcbf-25120a471078	String	jsonType.label
99e23bdb-4d49-4d2a-b97c-5bd13dd7b873	true	multivalued
99e23bdb-4d49-4d2a-b97c-5bd13dd7b873	foo	user.attribute
99e23bdb-4d49-4d2a-b97c-5bd13dd7b873	true	access.token.claim
99e23bdb-4d49-4d2a-b97c-5bd13dd7b873	realm_access.roles	claim.name
99e23bdb-4d49-4d2a-b97c-5bd13dd7b873	String	jsonType.label
bb22d249-b5b0-4e86-8a7f-c0b213135f9b	true	multivalued
bb22d249-b5b0-4e86-8a7f-c0b213135f9b	foo	user.attribute
bb22d249-b5b0-4e86-8a7f-c0b213135f9b	true	access.token.claim
bb22d249-b5b0-4e86-8a7f-c0b213135f9b	resource_access.${client_id}.roles	claim.name
bb22d249-b5b0-4e86-8a7f-c0b213135f9b	String	jsonType.label
6c1c5392-199d-4c6d-9b84-1284de79186e	true	multivalued
6c1c5392-199d-4c6d-9b84-1284de79186e	foo	user.attribute
6c1c5392-199d-4c6d-9b84-1284de79186e	true	id.token.claim
6c1c5392-199d-4c6d-9b84-1284de79186e	true	access.token.claim
6c1c5392-199d-4c6d-9b84-1284de79186e	groups	claim.name
6c1c5392-199d-4c6d-9b84-1284de79186e	String	jsonType.label
727913c0-6e09-4090-8afb-8f7cb469818c	true	userinfo.token.claim
727913c0-6e09-4090-8afb-8f7cb469818c	username	user.attribute
727913c0-6e09-4090-8afb-8f7cb469818c	true	id.token.claim
727913c0-6e09-4090-8afb-8f7cb469818c	true	access.token.claim
727913c0-6e09-4090-8afb-8f7cb469818c	upn	claim.name
727913c0-6e09-4090-8afb-8f7cb469818c	String	jsonType.label
67119c9e-9c2f-4e0c-aa22-92bbb3846dad	true	id.token.claim
67119c9e-9c2f-4e0c-aa22-92bbb3846dad	true	access.token.claim
10757eb6-03d3-4e17-a0f0-f1b506ae2c0e	clientHost	user.session.note
10757eb6-03d3-4e17-a0f0-f1b506ae2c0e	true	id.token.claim
10757eb6-03d3-4e17-a0f0-f1b506ae2c0e	true	access.token.claim
10757eb6-03d3-4e17-a0f0-f1b506ae2c0e	clientHost	claim.name
10757eb6-03d3-4e17-a0f0-f1b506ae2c0e	String	jsonType.label
98c5327c-688a-4586-a722-56a75d918f9b	clientId	user.session.note
98c5327c-688a-4586-a722-56a75d918f9b	true	id.token.claim
98c5327c-688a-4586-a722-56a75d918f9b	true	access.token.claim
98c5327c-688a-4586-a722-56a75d918f9b	clientId	claim.name
98c5327c-688a-4586-a722-56a75d918f9b	String	jsonType.label
c9007a77-6ca5-4a7b-aaf9-8553b3f77438	clientAddress	user.session.note
c9007a77-6ca5-4a7b-aaf9-8553b3f77438	true	id.token.claim
c9007a77-6ca5-4a7b-aaf9-8553b3f77438	true	access.token.claim
c9007a77-6ca5-4a7b-aaf9-8553b3f77438	clientAddress	claim.name
c9007a77-6ca5-4a7b-aaf9-8553b3f77438	String	jsonType.label
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	true	userinfo.token.claim
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	zoneinfo	user.attribute
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	true	id.token.claim
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	true	access.token.claim
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	zoneinfo	claim.name
015537a7-6c6f-4809-bb98-3b5ba1bd4bf9	String	jsonType.label
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	true	userinfo.token.claim
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	lastName	user.attribute
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	true	id.token.claim
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	true	access.token.claim
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	family_name	claim.name
0fbfbed4-19a4-4241-b5e0-fe348f6d8707	String	jsonType.label
22dd8216-081f-409b-aca8-135aa67057b5	true	userinfo.token.claim
22dd8216-081f-409b-aca8-135aa67057b5	website	user.attribute
22dd8216-081f-409b-aca8-135aa67057b5	true	id.token.claim
22dd8216-081f-409b-aca8-135aa67057b5	true	access.token.claim
22dd8216-081f-409b-aca8-135aa67057b5	website	claim.name
22dd8216-081f-409b-aca8-135aa67057b5	String	jsonType.label
5d66745a-8662-4278-b097-01ff53255b47	true	userinfo.token.claim
5d66745a-8662-4278-b097-01ff53255b47	profile	user.attribute
5d66745a-8662-4278-b097-01ff53255b47	true	id.token.claim
5d66745a-8662-4278-b097-01ff53255b47	true	access.token.claim
5d66745a-8662-4278-b097-01ff53255b47	profile	claim.name
5d66745a-8662-4278-b097-01ff53255b47	String	jsonType.label
6db9b298-771e-4732-9d19-5dfdd86cf7c3	true	userinfo.token.claim
6db9b298-771e-4732-9d19-5dfdd86cf7c3	locale	user.attribute
6db9b298-771e-4732-9d19-5dfdd86cf7c3	true	id.token.claim
6db9b298-771e-4732-9d19-5dfdd86cf7c3	true	access.token.claim
6db9b298-771e-4732-9d19-5dfdd86cf7c3	locale	claim.name
6db9b298-771e-4732-9d19-5dfdd86cf7c3	String	jsonType.label
76127931-3a43-4e51-9d96-4fbf1ab91c68	true	userinfo.token.claim
76127931-3a43-4e51-9d96-4fbf1ab91c68	nickname	user.attribute
76127931-3a43-4e51-9d96-4fbf1ab91c68	true	id.token.claim
76127931-3a43-4e51-9d96-4fbf1ab91c68	true	access.token.claim
76127931-3a43-4e51-9d96-4fbf1ab91c68	nickname	claim.name
76127931-3a43-4e51-9d96-4fbf1ab91c68	String	jsonType.label
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	true	userinfo.token.claim
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	updatedAt	user.attribute
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	true	id.token.claim
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	true	access.token.claim
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	updated_at	claim.name
7ae54b97-39d0-4fbc-b4cf-d72b9a779153	long	jsonType.label
8861035d-5ff1-4a10-a5ee-06b0af4a0839	true	userinfo.token.claim
8861035d-5ff1-4a10-a5ee-06b0af4a0839	username	user.attribute
8861035d-5ff1-4a10-a5ee-06b0af4a0839	true	id.token.claim
8861035d-5ff1-4a10-a5ee-06b0af4a0839	true	access.token.claim
8861035d-5ff1-4a10-a5ee-06b0af4a0839	preferred_username	claim.name
8861035d-5ff1-4a10-a5ee-06b0af4a0839	String	jsonType.label
a1b056a1-80e1-487c-a2b8-c279911359b4	true	id.token.claim
a1b056a1-80e1-487c-a2b8-c279911359b4	true	access.token.claim
a1b056a1-80e1-487c-a2b8-c279911359b4	true	userinfo.token.claim
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	true	userinfo.token.claim
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	firstName	user.attribute
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	true	id.token.claim
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	true	access.token.claim
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	given_name	claim.name
a2a9130b-185f-4a0a-afba-fe27e4c4dd69	String	jsonType.label
a78a08b8-d54f-461c-a49d-1c57c162f767	true	userinfo.token.claim
a78a08b8-d54f-461c-a49d-1c57c162f767	birthdate	user.attribute
a78a08b8-d54f-461c-a49d-1c57c162f767	true	id.token.claim
a78a08b8-d54f-461c-a49d-1c57c162f767	true	access.token.claim
a78a08b8-d54f-461c-a49d-1c57c162f767	birthdate	claim.name
a78a08b8-d54f-461c-a49d-1c57c162f767	String	jsonType.label
b6f429fe-7c23-435b-acd5-5ecf402a3733	true	userinfo.token.claim
b6f429fe-7c23-435b-acd5-5ecf402a3733	picture	user.attribute
b6f429fe-7c23-435b-acd5-5ecf402a3733	true	id.token.claim
b6f429fe-7c23-435b-acd5-5ecf402a3733	true	access.token.claim
b6f429fe-7c23-435b-acd5-5ecf402a3733	picture	claim.name
b6f429fe-7c23-435b-acd5-5ecf402a3733	String	jsonType.label
ca445de3-6954-431e-bf8d-575593477bd7	true	userinfo.token.claim
ca445de3-6954-431e-bf8d-575593477bd7	gender	user.attribute
ca445de3-6954-431e-bf8d-575593477bd7	true	id.token.claim
ca445de3-6954-431e-bf8d-575593477bd7	true	access.token.claim
ca445de3-6954-431e-bf8d-575593477bd7	gender	claim.name
ca445de3-6954-431e-bf8d-575593477bd7	String	jsonType.label
f725803c-9682-402e-8ed8-32add964450f	true	userinfo.token.claim
f725803c-9682-402e-8ed8-32add964450f	middleName	user.attribute
f725803c-9682-402e-8ed8-32add964450f	true	id.token.claim
f725803c-9682-402e-8ed8-32add964450f	true	access.token.claim
f725803c-9682-402e-8ed8-32add964450f	middle_name	claim.name
f725803c-9682-402e-8ed8-32add964450f	String	jsonType.label
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	formatted	user.attribute.formatted
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	country	user.attribute.country
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	postal_code	user.attribute.postal_code
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	true	userinfo.token.claim
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	street	user.attribute.street
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	true	id.token.claim
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	region	user.attribute.region
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	true	access.token.claim
255ccc7f-1f89-4fff-bfe9-a39ad7af7dab	locality	user.attribute.locality
b9bb2edc-f485-4219-a76b-4db4ec1cacf1	foo	user.attribute
b9bb2edc-f485-4219-a76b-4db4ec1cacf1	true	access.token.claim
b9bb2edc-f485-4219-a76b-4db4ec1cacf1	resource_access.${client_id}.roles	claim.name
b9bb2edc-f485-4219-a76b-4db4ec1cacf1	String	jsonType.label
b9bb2edc-f485-4219-a76b-4db4ec1cacf1	true	multivalued
bc6ac84f-af75-4614-ae65-7ace5e8f59ea	foo	user.attribute
bc6ac84f-af75-4614-ae65-7ace5e8f59ea	true	access.token.claim
bc6ac84f-af75-4614-ae65-7ace5e8f59ea	realm_access.roles	claim.name
bc6ac84f-af75-4614-ae65-7ace5e8f59ea	String	jsonType.label
bc6ac84f-af75-4614-ae65-7ace5e8f59ea	true	multivalued
c1d946b2-1c5c-4e02-bfe6-42cab9811224	false	single
c1d946b2-1c5c-4e02-bfe6-42cab9811224	Basic	attribute.nameformat
c1d946b2-1c5c-4e02-bfe6-42cab9811224	Role	attribute.name
e57e2dfb-b001-4662-a6da-469be860c9bd	true	id.token.claim
e57e2dfb-b001-4662-a6da-469be860c9bd	true	access.token.claim
e57e2dfb-b001-4662-a6da-469be860c9bd	true	userinfo.token.claim
46aa6e98-2532-4980-814c-f66a614a734a	true	userinfo.token.claim
46aa6e98-2532-4980-814c-f66a614a734a	emailVerified	user.attribute
46aa6e98-2532-4980-814c-f66a614a734a	true	id.token.claim
46aa6e98-2532-4980-814c-f66a614a734a	true	access.token.claim
46aa6e98-2532-4980-814c-f66a614a734a	email_verified	claim.name
46aa6e98-2532-4980-814c-f66a614a734a	boolean	jsonType.label
f62f43f5-7e30-441e-a966-660eaa4b96c8	true	userinfo.token.claim
f62f43f5-7e30-441e-a966-660eaa4b96c8	email	user.attribute
f62f43f5-7e30-441e-a966-660eaa4b96c8	true	id.token.claim
f62f43f5-7e30-441e-a966-660eaa4b96c8	true	access.token.claim
f62f43f5-7e30-441e-a966-660eaa4b96c8	email	claim.name
f62f43f5-7e30-441e-a966-660eaa4b96c8	String	jsonType.label
19f89cea-9a9a-49ca-8828-fe45530b6127	true	userinfo.token.claim
19f89cea-9a9a-49ca-8828-fe45530b6127	phoneNumberVerified	user.attribute
19f89cea-9a9a-49ca-8828-fe45530b6127	true	id.token.claim
19f89cea-9a9a-49ca-8828-fe45530b6127	true	access.token.claim
19f89cea-9a9a-49ca-8828-fe45530b6127	phone_number_verified	claim.name
19f89cea-9a9a-49ca-8828-fe45530b6127	boolean	jsonType.label
7269fd89-11c1-476a-8227-2078de06c5df	true	userinfo.token.claim
7269fd89-11c1-476a-8227-2078de06c5df	phoneNumber	user.attribute
7269fd89-11c1-476a-8227-2078de06c5df	true	id.token.claim
7269fd89-11c1-476a-8227-2078de06c5df	true	access.token.claim
7269fd89-11c1-476a-8227-2078de06c5df	phone_number	claim.name
7269fd89-11c1-476a-8227-2078de06c5df	String	jsonType.label
a6d5ca50-8763-48a5-8424-6e1e41509afe	true	multivalued
a6d5ca50-8763-48a5-8424-6e1e41509afe	true	userinfo.token.claim
a6d5ca50-8763-48a5-8424-6e1e41509afe	foo	user.attribute
a6d5ca50-8763-48a5-8424-6e1e41509afe	true	id.token.claim
a6d5ca50-8763-48a5-8424-6e1e41509afe	true	access.token.claim
a6d5ca50-8763-48a5-8424-6e1e41509afe	groups	claim.name
a6d5ca50-8763-48a5-8424-6e1e41509afe	String	jsonType.label
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	true	userinfo.token.claim
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	username	user.attribute
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	true	id.token.claim
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	true	access.token.claim
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	upn	claim.name
f4839869-c3d8-44fe-9e7b-6980a9ffbb9d	String	jsonType.label
02388748-c28d-4a87-9f9d-e5e008209158	clientHost	user.session.note
02388748-c28d-4a87-9f9d-e5e008209158	true	userinfo.token.claim
02388748-c28d-4a87-9f9d-e5e008209158	true	id.token.claim
02388748-c28d-4a87-9f9d-e5e008209158	true	access.token.claim
02388748-c28d-4a87-9f9d-e5e008209158	clientHost	claim.name
02388748-c28d-4a87-9f9d-e5e008209158	String	jsonType.label
28d15a7f-5ebe-46ff-9219-7dda647c91f2	clientAddress	user.session.note
28d15a7f-5ebe-46ff-9219-7dda647c91f2	true	userinfo.token.claim
28d15a7f-5ebe-46ff-9219-7dda647c91f2	true	id.token.claim
28d15a7f-5ebe-46ff-9219-7dda647c91f2	true	access.token.claim
28d15a7f-5ebe-46ff-9219-7dda647c91f2	clientAddress	claim.name
28d15a7f-5ebe-46ff-9219-7dda647c91f2	String	jsonType.label
65cffc70-c953-4d69-8939-44075f831e5c	clientId	user.session.note
65cffc70-c953-4d69-8939-44075f831e5c	true	userinfo.token.claim
65cffc70-c953-4d69-8939-44075f831e5c	true	id.token.claim
65cffc70-c953-4d69-8939-44075f831e5c	true	access.token.claim
65cffc70-c953-4d69-8939-44075f831e5c	clientId	claim.name
65cffc70-c953-4d69-8939-44075f831e5c	String	jsonType.label
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	true	userinfo.token.claim
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	locale	user.attribute
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	true	id.token.claim
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	true	access.token.claim
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	locale	claim.name
07d78650-dcb4-476e-9bde-2b04a3d4e1e9	String	jsonType.label
20ea6641-132a-4db3-9dd4-5dab5014fc15	clientAddress	user.session.note
20ea6641-132a-4db3-9dd4-5dab5014fc15	true	id.token.claim
20ea6641-132a-4db3-9dd4-5dab5014fc15	true	access.token.claim
20ea6641-132a-4db3-9dd4-5dab5014fc15	clientAddress	claim.name
20ea6641-132a-4db3-9dd4-5dab5014fc15	String	jsonType.label
825ac9cd-790a-47c1-83f1-568d341294f9	clientHost	user.session.note
825ac9cd-790a-47c1-83f1-568d341294f9	true	id.token.claim
825ac9cd-790a-47c1-83f1-568d341294f9	true	access.token.claim
825ac9cd-790a-47c1-83f1-568d341294f9	clientHost	claim.name
825ac9cd-790a-47c1-83f1-568d341294f9	String	jsonType.label
9c63afbe-05f5-4513-afb3-0da0bbf6769d	clientId	user.session.note
9c63afbe-05f5-4513-afb3-0da0bbf6769d	true	id.token.claim
9c63afbe-05f5-4513-afb3-0da0bbf6769d	true	access.token.claim
9c63afbe-05f5-4513-afb3-0da0bbf6769d	clientId	claim.name
9c63afbe-05f5-4513-afb3-0da0bbf6769d	String	jsonType.label
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
3ad74e4d-c3f3-49be-94e9-8999a62aa878	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	659fec1b-26c9-4eb0-924f-5aae63a5985f	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	67315390-4507-4252-a88a-f24ae2d9bec5	419e04be-ad30-4e3b-9c8e-d3334e375714	925bca9b-8040-4f05-9570-c4dc292749a6	90df5430-4530-4fe4-b222-a4267cdaf7db	aeea3f18-7140-4799-bc31-bc523d16e00b	2592000	f	900	t	f	c23f6a31-7fdd-4758-82ee-8270e020ae1d	0	f	0	0	f84bb28f-dc03-4b61-bd9d-894598ab747c
eee17a22-75b7-4ac9-a844-a9dd52c83d91	60	300	300	\N	\N	\N	t	f	0	\N	showcase	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	9f041010-887d-426e-811e-2ab07ca84a96	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	48234375-3f31-450b-b148-b4ebdd9e006e	31a8354c-9212-4b9d-85e5-a53c764b1b30	d5de58ec-2522-4084-b164-370477291f2e	b4fb32ad-448d-4320-90a6-ad8b62d53c9e	1a8ce953-4599-476e-80c6-9bcaf392fbf7	2592000	f	900	t	f	37bf3298-1bae-40b5-8332-018498514b1f	0	f	0	0	35fe07b8-27d1-42b4-897a-1e2c5dfdf825
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	3ad74e4d-c3f3-49be-94e9-8999a62aa878	
_browser_header.xContentTypeOptions	3ad74e4d-c3f3-49be-94e9-8999a62aa878	nosniff
_browser_header.xRobotsTag	3ad74e4d-c3f3-49be-94e9-8999a62aa878	none
_browser_header.xFrameOptions	3ad74e4d-c3f3-49be-94e9-8999a62aa878	SAMEORIGIN
_browser_header.contentSecurityPolicy	3ad74e4d-c3f3-49be-94e9-8999a62aa878	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1; mode=block
_browser_header.strictTransportSecurity	3ad74e4d-c3f3-49be-94e9-8999a62aa878	max-age=31536000; includeSubDomains
bruteForceProtected	3ad74e4d-c3f3-49be-94e9-8999a62aa878	false
permanentLockout	3ad74e4d-c3f3-49be-94e9-8999a62aa878	false
maxFailureWaitSeconds	3ad74e4d-c3f3-49be-94e9-8999a62aa878	900
minimumQuickLoginWaitSeconds	3ad74e4d-c3f3-49be-94e9-8999a62aa878	60
waitIncrementSeconds	3ad74e4d-c3f3-49be-94e9-8999a62aa878	60
quickLoginCheckMilliSeconds	3ad74e4d-c3f3-49be-94e9-8999a62aa878	1000
maxDeltaTimeSeconds	3ad74e4d-c3f3-49be-94e9-8999a62aa878	43200
failureFactor	3ad74e4d-c3f3-49be-94e9-8999a62aa878	30
displayName	3ad74e4d-c3f3-49be-94e9-8999a62aa878	Keycloak
displayNameHtml	3ad74e4d-c3f3-49be-94e9-8999a62aa878	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	3ad74e4d-c3f3-49be-94e9-8999a62aa878	RS256
offlineSessionMaxLifespanEnabled	3ad74e4d-c3f3-49be-94e9-8999a62aa878	false
offlineSessionMaxLifespan	3ad74e4d-c3f3-49be-94e9-8999a62aa878	5184000
_browser_header.contentSecurityPolicyReportOnly	eee17a22-75b7-4ac9-a844-a9dd52c83d91	
_browser_header.xContentTypeOptions	eee17a22-75b7-4ac9-a844-a9dd52c83d91	nosniff
_browser_header.xRobotsTag	eee17a22-75b7-4ac9-a844-a9dd52c83d91	none
_browser_header.xFrameOptions	eee17a22-75b7-4ac9-a844-a9dd52c83d91	SAMEORIGIN
_browser_header.contentSecurityPolicy	eee17a22-75b7-4ac9-a844-a9dd52c83d91	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1; mode=block
_browser_header.strictTransportSecurity	eee17a22-75b7-4ac9-a844-a9dd52c83d91	max-age=31536000; includeSubDomains
bruteForceProtected	eee17a22-75b7-4ac9-a844-a9dd52c83d91	false
permanentLockout	eee17a22-75b7-4ac9-a844-a9dd52c83d91	false
maxFailureWaitSeconds	eee17a22-75b7-4ac9-a844-a9dd52c83d91	900
minimumQuickLoginWaitSeconds	eee17a22-75b7-4ac9-a844-a9dd52c83d91	60
waitIncrementSeconds	eee17a22-75b7-4ac9-a844-a9dd52c83d91	60
quickLoginCheckMilliSeconds	eee17a22-75b7-4ac9-a844-a9dd52c83d91	1000
maxDeltaTimeSeconds	eee17a22-75b7-4ac9-a844-a9dd52c83d91	43200
failureFactor	eee17a22-75b7-4ac9-a844-a9dd52c83d91	30
defaultSignatureAlgorithm	eee17a22-75b7-4ac9-a844-a9dd52c83d91	RS256
offlineSessionMaxLifespanEnabled	eee17a22-75b7-4ac9-a844-a9dd52c83d91	false
offlineSessionMaxLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	5184000
clientSessionIdleTimeout	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0
clientSessionMaxLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0
clientOfflineSessionIdleTimeout	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0
clientOfflineSessionMaxLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0
actionTokenGeneratedByAdminLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	43200
actionTokenGeneratedByUserLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	300
oauth2DeviceCodeLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	600
oauth2DevicePollingInterval	eee17a22-75b7-4ac9-a844-a9dd52c83d91	5
webAuthnPolicyRpEntityName	eee17a22-75b7-4ac9-a844-a9dd52c83d91	keycloak
webAuthnPolicySignatureAlgorithms	eee17a22-75b7-4ac9-a844-a9dd52c83d91	ES256
webAuthnPolicyRpId	eee17a22-75b7-4ac9-a844-a9dd52c83d91	
webAuthnPolicyAttestationConveyancePreference	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyAuthenticatorAttachment	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyRequireResidentKey	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyUserVerificationRequirement	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyCreateTimeout	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0
webAuthnPolicyAvoidSameAuthenticatorRegister	eee17a22-75b7-4ac9-a844-a9dd52c83d91	false
webAuthnPolicyRpEntityNamePasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	ES256
webAuthnPolicyRpIdPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	
webAuthnPolicyAttestationConveyancePreferencePasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyRequireResidentKeyPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	not specified
webAuthnPolicyCreateTimeoutPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	false
cibaBackchannelTokenDeliveryMode	eee17a22-75b7-4ac9-a844-a9dd52c83d91	poll
cibaExpiresIn	eee17a22-75b7-4ac9-a844-a9dd52c83d91	120
cibaInterval	eee17a22-75b7-4ac9-a844-a9dd52c83d91	5
cibaAuthRequestedUserHint	eee17a22-75b7-4ac9-a844-a9dd52c83d91	login_hint
parRequestUriLifespan	eee17a22-75b7-4ac9-a844-a9dd52c83d91	60
client-policies.profiles	eee17a22-75b7-4ac9-a844-a9dd52c83d91	{"profiles":[]}
client-policies.policies	eee17a22-75b7-4ac9-a844-a9dd52c83d91	{"policies":[]}
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
3ad74e4d-c3f3-49be-94e9-8999a62aa878	jboss-logging
eee17a22-75b7-4ac9-a844-a9dd52c83d91	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	3ad74e4d-c3f3-49be-94e9-8999a62aa878
password	password	t	t	eee17a22-75b7-4ac9-a844-a9dd52c83d91
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.redirect_uris (client_id, value) FROM stdin;
1becba53-c352-4349-8814-9c03b63dfe00	/realms/master/account/*
690d9ca3-295e-4fcc-bbef-da87d5b418be	/realms/master/account/*
5e0362a6-cd82-4108-9c0a-dadfe944eb54	/admin/master/console/*
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	http://localhost:3000
34262697-003e-4c57-a55f-241bb014a8a7	/realms/showcase/account/*
a143887d-b1d6-4c25-9e62-81f11b0fdd81	/realms/showcase/account/*
7cd5b438-6539-4dc2-8222-4500eaa6c508	http://localhost:3000
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	/admin/showcase/console/*
c3fa9f4d-ca56-401b-a799-f291488773c0	http://localhost:3000/*
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
6007e4b1-98c0-4411-9ca1-fabddfdb9014	VERIFY_EMAIL	Verify Email	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	VERIFY_EMAIL	50
506f1c4e-ca58-4bba-ab7f-2246bddab6b8	UPDATE_PROFILE	Update Profile	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	UPDATE_PROFILE	40
f7ff4024-ef47-4872-9816-07627d8d50fa	CONFIGURE_TOTP	Configure OTP	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	CONFIGURE_TOTP	10
e0ad9d59-3dc7-4819-a504-86103c766538	UPDATE_PASSWORD	Update Password	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	UPDATE_PASSWORD	30
ab65b186-c036-4447-bdcc-42eeb0bad743	terms_and_conditions	Terms and Conditions	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	f	terms_and_conditions	20
7d9e2f1f-811d-4e25-941f-e9be9eb1d5c1	update_user_locale	Update User Locale	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	update_user_locale	1000
ab29d6af-02cd-4597-a6fe-f910feb64e0b	delete_account	Delete Account	3ad74e4d-c3f3-49be-94e9-8999a62aa878	f	f	delete_account	60
09bda3b9-3260-4b7a-af2e-60346d9d8430	webauthn-register	Webauthn Register	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	webauthn-register	70
12a6b237-68dc-43ae-91cd-d555d2de695f	webauthn-register-passwordless	Webauthn Register Passwordless	3ad74e4d-c3f3-49be-94e9-8999a62aa878	t	f	webauthn-register-passwordless	80
f1be46ee-4caa-4ee8-8ec8-bd06bf204663	CONFIGURE_TOTP	Configure OTP	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	CONFIGURE_TOTP	10
0e3534ad-7b09-46c2-9d35-143777306eb7	terms_and_conditions	Terms and Conditions	eee17a22-75b7-4ac9-a844-a9dd52c83d91	f	f	terms_and_conditions	20
165a15c4-f7e1-4c90-aac2-8c743ad223a4	UPDATE_PASSWORD	Update Password	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	UPDATE_PASSWORD	30
cfda14ad-c084-4563-aed0-a1a5384df389	UPDATE_PROFILE	Update Profile	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	UPDATE_PROFILE	40
29a3089e-e3ff-47c3-aa3b-717f4b1c53ac	VERIFY_EMAIL	Verify Email	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	VERIFY_EMAIL	50
c522d1eb-0ea3-4c42-adac-b11b95ccfe27	delete_account	Delete Account	eee17a22-75b7-4ac9-a844-a9dd52c83d91	f	f	delete_account	60
f3c8eda3-9532-4bec-b33d-f8fd1d154399	webauthn-register	Webauthn Register	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	webauthn-register	70
1bc2d76b-cb9f-46fb-a8c0-89d0f76503e3	webauthn-register-passwordless	Webauthn Register Passwordless	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	webauthn-register-passwordless	80
07147e06-d3cf-4e03-a6b5-cec11e46350a	update_user_locale	Update User Locale	eee17a22-75b7-4ac9-a844-a9dd52c83d91	t	f	update_user_locale	1000
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
e875696e-8f47-4559-abe4-5652056b3a4a	a62712db-a492-4101-bd41-ada38a243a0b
e875696e-8f47-4559-abe4-5652056b3a4a	98ae5e45-6bbb-4290-9c47-109237b3e440
e875696e-8f47-4559-abe4-5652056b3a4a	564b86ce-9b82-489e-9454-0b952b1feb01
e875696e-8f47-4559-abe4-5652056b3a4a	ed53d63e-38d7-4fba-82be-065f6f1ddf83
e875696e-8f47-4559-abe4-5652056b3a4a	c0f24bbd-b2ae-4e9f-b17d-f57045c1e997
e875696e-8f47-4559-abe4-5652056b3a4a	101d27d0-6a46-4ffe-b431-335cf7f2216c
e875696e-8f47-4559-abe4-5652056b3a4a	07bc816c-153b-4017-ad93-660b20a56f01
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
e875696e-8f47-4559-abe4-5652056b3a4a	ae142a51-4626-458d-b64f-461f5edd2bde
e875696e-8f47-4559-abe4-5652056b3a4a	c0d75383-973c-457b-9c2d-da3918a3aab8
e875696e-8f47-4559-abe4-5652056b3a4a	821f12a7-207b-43d5-9219-cc7231595817
e875696e-8f47-4559-abe4-5652056b3a4a	b1dc7547-b853-4d31-bb19-811e97c0c5f7
e875696e-8f47-4559-abe4-5652056b3a4a	b52d5bba-85ba-4ef1-ba82-8185986bbe23
e875696e-8f47-4559-abe4-5652056b3a4a	a8279ab2-2e6c-4eb5-b5bb-51ce6f1a252c
e875696e-8f47-4559-abe4-5652056b3a4a	53c20763-624b-427a-a950-2b33c0831163
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	t	0	1
7cd5b438-6539-4dc2-8222-4500eaa6c508	t	0	1
0b25b475-7074-4ce8-85a6-b32fb28bd048	f	0	1
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
9fee10b9-5012-4bba-af72-b870b536afc1	Default Policy	A policy that grants access only for users within this realm	js	0	0	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	\N
703af00e-8142-4686-be89-86c20e867b6f	Default Permission	A permission that applies to the default resource type	resource	1	0	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	\N
a62712db-a492-4101-bd41-ada38a243a0b	manage.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
98ae5e45-6bbb-4290-9c47-109237b3e440	configure.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
564b86ce-9b82-489e-9454-0b952b1feb01	view.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
ed53d63e-38d7-4fba-82be-065f6f1ddf83	map-roles.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
c0f24bbd-b2ae-4e9f-b17d-f57045c1e997	map-roles-client-scope.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
101d27d0-6a46-4ffe-b431-335cf7f2216c	map-roles-composite.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
07bc816c-153b-4017-ad93-660b20a56f01	token-exchange.permission.client.c3fa9f4d-ca56-401b-a799-f291488773c0	\N	scope	1	0	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
12e448f6-3a60-471c-bd83-2b0df663b7bf	Default Resource	urn:admin-cli:resources:default	\N	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	f	\N
e875696e-8f47-4559-abe4-5652056b3a4a	client.resource.c3fa9f4d-ca56-401b-a799-f291488773c0	Client	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	0b25b475-7074-4ce8-85a6-b32fb28bd048	f	\N
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
53c20763-624b-427a-a950-2b33c0831163	manage	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
c0d75383-973c-457b-9c2d-da3918a3aab8	view	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
a8279ab2-2e6c-4eb5-b5bb-51ce6f1a252c	map-roles	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
821f12a7-207b-43d5-9219-cc7231595817	map-roles-client-scope	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
b1dc7547-b853-4d31-bb19-811e97c0c5f7	map-roles-composite	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
ae142a51-4626-458d-b64f-461f5edd2bde	configure	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
b52d5bba-85ba-4ef1-ba82-8185986bbe23	token-exchange	\N	0b25b475-7074-4ce8-85a6-b32fb28bd048	\N
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_uris (resource_id, value) FROM stdin;
12e448f6-3a60-471c-bd83-2b0df663b7bf	/*
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
690d9ca3-295e-4fcc-bbef-da87d5b418be	2b1eeda6-2074-460c-aff0-ebba4b78c15c
a143887d-b1d6-4c25-9e62-81f11b0fdd81	d9de9c44-ee71-4b8a-af98-0a481c9e4a34
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
53c20763-624b-427a-a950-2b33c0831163	a62712db-a492-4101-bd41-ada38a243a0b
ae142a51-4626-458d-b64f-461f5edd2bde	98ae5e45-6bbb-4290-9c47-109237b3e440
c0d75383-973c-457b-9c2d-da3918a3aab8	564b86ce-9b82-489e-9454-0b952b1feb01
a8279ab2-2e6c-4eb5-b5bb-51ce6f1a252c	ed53d63e-38d7-4fba-82be-065f6f1ddf83
821f12a7-207b-43d5-9219-cc7231595817	c0f24bbd-b2ae-4e9f-b17d-f57045c1e997
b1dc7547-b853-4d31-bb19-811e97c0c5f7	101d27d0-6a46-4ffe-b431-335cf7f2216c
b52d5bba-85ba-4ef1-ba82-8185986bbe23	07bc816c-153b-4017-ad93-660b20a56f01
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_attribute (name, value, user_id, id) FROM stdin;
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before) FROM stdin;
ebf4b0c4-eba7-4d3a-974e-a9134eec7290	\N	519b95c1-305e-4453-9405-34e6e58d78c6	f	t	\N	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	admin	1685702158152	\N	0
9f2afb64-c036-4ccc-97a8-8ffa8487186f	\N	9097eae4-ce65-41bf-92fc-5907783ec16b	f	t	\N	\N	\N	3ad74e4d-c3f3-49be-94e9-8999a62aa878	service-account-admin-cli	1685720598577	4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	0
66679948-3238-4e5a-a4fd-f0b3a74131dc	\N	7a3aef07-373b-45c1-91d4-46502973b02b	f	t	\N	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	service-account-admin-cli	1685683995553	7cd5b438-6539-4dc2-8222-4500eaa6c508	0
effe1e71-42eb-489a-bea1-80af145cde8b	\N	048d7ed8-8484-469d-9c7d-1c7a4be545bf	f	t	\N	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	service-account-realm-management	1685722109079	0b25b475-7074-4ce8-85a6-b32fb28bd048	0
9b4470ff-83cd-4a99-a94f-849a1de50ba2	aslambabu@gmail.com	aslambabu@gmail.com	t	t	\N	\N	\N	eee17a22-75b7-4ac9-a844-a9dd52c83d91	aslambabu@gmail.com	1685722240694	\N	0
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_group_membership (group_id, user_id) FROM stdin;
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
f84bb28f-dc03-4b61-bd9d-894598ab747c	ebf4b0c4-eba7-4d3a-974e-a9134eec7290
00e35af7-6be2-41c7-8425-85631c8d459a	ebf4b0c4-eba7-4d3a-974e-a9134eec7290
f84bb28f-dc03-4b61-bd9d-894598ab747c	9f2afb64-c036-4ccc-97a8-8ffa8487186f
970c51bf-3593-4423-8024-04eee9a83e6f	9f2afb64-c036-4ccc-97a8-8ffa8487186f
00e35af7-6be2-41c7-8425-85631c8d459a	9f2afb64-c036-4ccc-97a8-8ffa8487186f
0976df7a-5939-43c4-9093-832593b98c8c	9f2afb64-c036-4ccc-97a8-8ffa8487186f
e85f8e66-0030-4d42-8f5f-36bba6279ad2	9f2afb64-c036-4ccc-97a8-8ffa8487186f
0312cf2f-887e-41e3-bc88-18b1f3b26cc5	9f2afb64-c036-4ccc-97a8-8ffa8487186f
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	66679948-3238-4e5a-a4fd-f0b3a74131dc
27b58e14-4dc1-46a2-b51f-581b021bf987	66679948-3238-4e5a-a4fd-f0b3a74131dc
d50e0edd-34b7-433e-a65a-9f6589e80d36	66679948-3238-4e5a-a4fd-f0b3a74131dc
cd3ddfca-8cf6-4cf6-a567-8a26bdd203f9	66679948-3238-4e5a-a4fd-f0b3a74131dc
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	effe1e71-42eb-489a-bea1-80af145cde8b
5d9c0ff8-95dc-4bbf-b6ea-a1f50ace688c	effe1e71-42eb-489a-bea1-80af145cde8b
35fe07b8-27d1-42b4-897a-1e2c5dfdf825	9b4470ff-83cd-4a99-a94f-849a1de50ba2
\.


--
-- Data for Name: user_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_session (id, auth_method, ip_address, last_session_refresh, login_username, realm_id, remember_me, started, user_id, user_session_state, broker_session_id, broker_user_id) FROM stdin;
\.


--
-- Data for Name: user_session_note; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_session_note (user_session, name, value) FROM stdin;
\.


--
-- Data for Name: username_login_failure; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.username_login_failure (realm_id, username, failed_login_not_before, last_failure, last_ip_failure, num_failures) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.web_origins (client_id, value) FROM stdin;
5e0362a6-cd82-4108-9c0a-dadfe944eb54	+
4a40ab9f-ffdb-4b63-9f97-4f2a49035f4e	http://localhost:3000
7cd5b438-6539-4dc2-8222-4500eaa6c508	http://localhost:3000
f7f2071d-3e4b-41bc-8988-7f6ec272ac24	+
c3fa9f4d-ca56-401b-a799-f291488773c0	http://localhost:3000
\.


--
-- Name: username_login_failure CONSTRAINT_17-2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.username_login_failure
    ADD CONSTRAINT "CONSTRAINT_17-2" PRIMARY KEY (realm_id, username);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: client_user_session_note constr_cl_usr_ses_note; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT constr_cl_usr_ses_note PRIMARY KEY (client_session, name);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: client_session_role constraint_5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT constraint_5 PRIMARY KEY (client_session, role_id);


--
-- Name: user_session constraint_57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT constraint_57 PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client_session_note constraint_5e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT constraint_5e PRIMARY KEY (client_session, name);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: client_session constraint_8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT constraint_8 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: client_session_auth_status constraint_auth_status_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT constraint_auth_status_pk PRIMARY KEY (client_session, authenticator);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: client_session_prot_mapper constraint_cs_pmp_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT constraint_cs_pmp_pk PRIMARY KEY (client_session, protocol_mapper_id);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: user_session_note constraint_usn_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT constraint_usn_pk PRIMARY KEY (user_session, name);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_consent uk_jkuwuvd56ontgsuhogm8uewrt; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_jkuwuvd56ontgsuhogm8uewrt UNIQUE (client_id, client_storage_provider, external_client_id, user_id);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_att_by_name_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_att_by_name_value ON public.client_attributes USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_client_session_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_session_session ON public.client_session USING btree (session_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_offline_css_preload; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_css_preload ON public.offline_client_session USING btree (client_id, offline_flag);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_offline_uss_by_usersess; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_uss_by_usersess ON public.offline_user_session USING btree (realm_id, offline_flag, user_session_id);


--
-- Name: idx_offline_uss_createdon; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_uss_createdon ON public.offline_user_session USING btree (created_on);


--
-- Name: idx_offline_uss_preload; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offline_uss_preload ON public.offline_user_session USING btree (offline_flag, created_on, user_session_id);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_us_sess_id_on_cl_sess; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_us_sess_id_on_cl_sess ON public.offline_client_session USING btree (user_session_id);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: client_session_auth_status auth_status_constraint; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT auth_status_constraint FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: client_session_note fk5edfb00ff51c2736; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT fk5edfb00ff51c2736 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: user_session_note fk5edfb00ff51d3472; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT fk5edfb00ff51d3472 FOREIGN KEY (user_session) REFERENCES public.user_session(id);


--
-- Name: client_session_role fk_11b7sgqw18i532811v7o2dv76; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT fk_11b7sgqw18i532811v7o2dv76 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session_prot_mapper fk_33a8sgqw18i532811v7o2dk89; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT fk_33a8sgqw18i532811v7o2dk89 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session fk_b4ao2vcvat6ukau74wbwtfqo1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT fk_b4ao2vcvat6ukau74wbwtfqo1 FOREIGN KEY (session_id) REFERENCES public.user_session(id);


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_user_session_note fk_cl_usr_ses_note; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT fk_cl_usr_ses_note FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- PostgreSQL database dump complete
--

