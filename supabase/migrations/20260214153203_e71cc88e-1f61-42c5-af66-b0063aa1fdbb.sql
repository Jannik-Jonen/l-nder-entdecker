
-- Comments table for blog posts
CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  post_type text NOT NULL DEFAULT 'blog', -- 'blog' or 'guide'
  user_id uuid NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can see approved comments
CREATE POLICY "Anyone can view approved comments"
  ON public.blog_comments FOR SELECT
  USING (status = 'approved');

-- Authors can see their own comments (even pending)
CREATE POLICY "Users can view own comments"
  ON public.blog_comments FOR SELECT
  USING (auth.uid() = user_id);

-- Logged-in users can create comments
CREATE POLICY "Users can create comments"
  ON public.blog_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.blog_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can update comments (approve/reject)
CREATE POLICY "Admins can update comments"
  ON public.blog_comments FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Bookmarks table
CREATE TABLE public.blog_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  post_type text NOT NULL DEFAULT 'blog', -- 'blog' or 'guide'
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON public.blog_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.blog_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.blog_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
