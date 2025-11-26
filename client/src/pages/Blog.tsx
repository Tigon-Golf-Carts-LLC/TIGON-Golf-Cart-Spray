import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const publishedPosts = posts?.filter(post => post.published) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tips, guides, and insights for golf cart maintenance and care
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[400px]" />
              ))}
            </div>
          ) : publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group hover-elevate transition-all duration-200 h-full flex flex-col">
                    <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          data-testid={`img-blog-post-${post.id}`}
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold text-primary uppercase">{post.category}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.publishedAt!).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 line-clamp-2" data-testid={`text-blog-title-${post.id}`}>
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        <Button variant="link" className="p-0 h-auto justify-start">
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
