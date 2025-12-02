import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar } from "lucide-react";
import { SEO } from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBlogPostBySlug } from "@/data/blogs";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");

  const post = params?.slug ? getBlogPostBySlug(params.slug) : undefined;

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        type="article"
        image={post.heroImage}
        keywords={['golf cart cleaning', 'golf cart spray', post.category, 'golf cart maintenance']}
        article={{
          publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
          modifiedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
          author: 'TIGON Spray',
          section: post.category,
          tags: ['golf cart', 'cleaning tips', 'maintenance'],
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-8" data-testid="button-back">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            {/* Post Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary uppercase">{post.category}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-post-title">
                {post.title}
              </h1>
            </div>

            {/* Hero Image */}
            <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-8">
              <img
                src={post.heroImage}
                alt={post.heroImageAlt || post.title}
                className="h-full w-full object-cover"
                data-testid="img-hero"
              />
            </div>

            {/* Post Content - Rendered with Markdown */}
            <article 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-p:mb-4 prose-ul:my-4 prose-li:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground" 
              data-testid="text-content"
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => (
                    <Link href={href || '#'} className="text-primary hover:underline">
                      {children}
                    </Link>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Related Products CTA */}
            <div className="mt-12 p-8 bg-card rounded-lg border">
              <h3 className="text-2xl font-bold mb-4">Ready to try TIGON Spray?</h3>
              <p className="text-muted-foreground mb-6">
                Explore our premium golf cart spray cleaners and keep your cart looking pristine.
              </p>
              <Button asChild size="lg" data-testid="button-shop-products">
                <Link href="/products">
                  Shop Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
