-- Enquiries sent from the contact form. The same enquiry also goes to Netlify Forms
-- (which emails it); this copy feeds the /admin/ inbox.
CREATE TABLE enquiries (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  engagement      text NOT NULL,
  name            text NOT NULL,
  email           text NOT NULL,
  company         text,
  message         text NOT NULL,
  page            text,
  -- Optional attachment, stored in the private "assets" bucket under this key.
  attachment_key  text,
  attachment_name text,
  attachment_type text,
  attachment_size integer
);

CREATE INDEX enquiries_created_at_idx ON enquiries (created_at DESC);
