-- Products: the single optional button ("link": { href, label } or null) becomes a list of links
-- ("links": [{ kind, href, label }]) so a product can point at Google Play, the App Store, its
-- website and its web app. The old button becomes the first link. The version goes up so an
-- admin tab opened before this can't save the old shape back over it.
UPDATE site_content
SET value = (
      SELECT coalesce(jsonb_agg(
               CASE WHEN p ? 'link' THEN
                 (p - 'link') || jsonb_build_object('links',
                   CASE WHEN jsonb_typeof(p -> 'link') = 'object' THEN
                     jsonb_build_array(jsonb_build_object(
                       'kind', CASE WHEN p -> 'link' ->> 'href' LIKE 'https://play.google.com/%' THEN 'google-play'
                                    WHEN p -> 'link' ->> 'href' LIKE 'https://apps.apple.com/%' THEN 'app-store'
                                    ELSE 'website' END,
                       'href', p -> 'link' ->> 'href',
                       'label', p -> 'link' ->> 'label'))
                   ELSE '[]'::jsonb END)
               ELSE p END
               ORDER BY ord), '[]'::jsonb)
      FROM jsonb_array_elements(value) WITH ORDINALITY AS t(p, ord)
    ),
    version = version + 1,
    updated_at = now(),
    updated_by = 'migration 003'
WHERE key = 'products'
  AND EXISTS (SELECT 1 FROM jsonb_array_elements(value) AS e(p) WHERE p ? 'link');
