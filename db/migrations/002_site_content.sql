-- Site content edited in /admin/ (stack, working hours, products, services). Each key holds
-- one JSON document, checked against src/shared/content-schema.js before it is saved.
-- `version` goes up on every save, so two people editing at once can't overwrite each other.
-- The Netlify build reads this content and pre-renders the public pages from it.
CREATE TABLE site_content (
  key        text PRIMARY KEY CHECK (key IN ('stack', 'hours', 'products', 'services')),
  value      jsonb NOT NULL,
  version    integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- Images uploaded in /admin/ (product icons and screenshots), stored in the "assets" bucket
-- under media/. The build copies the ones in use into the site at /media/.
CREATE TABLE media (
  id           uuid PRIMARY KEY,
  key          text NOT NULL UNIQUE,
  file_name    text NOT NULL,
  content_type text NOT NULL,
  width        integer NOT NULL CHECK (width > 0),
  height       integer NOT NULL CHECK (height > 0),
  size         integer NOT NULL CHECK (size > 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  created_by   text
);

-- Each time someone pressed Publish (asked Netlify to rebuild the site).
CREATE TABLE publishes (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  requested_at timestamptz NOT NULL DEFAULT now(),
  requested_by text,
  ok           boolean NOT NULL,
  detail       text
);
