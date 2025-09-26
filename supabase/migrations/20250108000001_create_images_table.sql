CREATE TABLE IF NOT EXISTS public.images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category text NOT NULL,
    image_url text NOT NULL,
    likes integer DEFAULT 0,
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS images_category_idx ON public.images(category);
CREATE INDEX IF NOT EXISTS images_created_at_idx ON public.images(created_at DESC);
CREATE INDEX IF NOT EXISTS images_likes_idx ON public.images(likes DESC);

alter publication supabase_realtime add table images;