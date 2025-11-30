import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, PlusCircle, Pencil, Trash2, Eye } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  published: boolean;
  publishedAt?: string;
  tags?: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    published: false,
    tags: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title,
        slug: editPost.slug,
        content: editPost.content,
        excerpt: editPost.excerpt || "",
        coverImage: editPost.coverImage || "",
        published: editPost.published,
        tags: editPost.tags?.join(", ") || "",
      });
    }
  }, [editPost]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/blogs", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load blog posts",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      published: false,
      tags: "",
    });
    setEditPost(null);
    setIsCreating(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          coverImage: reader.result as string,
        });
        setUploadingImage(false);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      };
      reader.onerror = () => {
        setUploadingImage(false);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (!response.ok) throw new Error("Failed to create blog post");

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      fetchPosts();
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editPost) return;

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch(`/api/admin/blogs/${editPost.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (!response.ok) throw new Error("Failed to update blog post");

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });

      fetchPosts();
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog post",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/blogs/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete blog post");

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      fetchPosts();
      setDeletePostId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog post",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Blog Management
            </CardTitle>
            <CardDescription>
              Create, edit, and manage blog posts
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading blog posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blog posts yet. Create your first post!
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.authorName}</TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {post.viewCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(post.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditPost(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editPost} onOpenChange={resetForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 pb-6 border-b">
            <DialogTitle className="text-2xl font-serif bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {editPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editPost ? "Update your blog post details below" : "Fill in the details to create an amazing blog post"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Title & Slug Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter an engaging title..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                  className="h-11 font-mono text-sm"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Write a compelling summary that will appear in blog listings..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cover Image</Label>
              <div className="space-y-3">
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="group relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  style={{
                    borderColor: formData.coverImage ? '#a855f7' : undefined,
                  }}
                >
                  {uploadingImage ? (
                    <div className="text-center space-y-3">
                      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                      <p className="text-sm font-medium text-purple-600">Uploading image...</p>
                    </div>
                  ) : formData.coverImage ? (
                    <div className="relative w-full h-full p-3">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-3 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center pb-6">
                        <div className="bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full">
                          <p className="text-sm font-medium">Click to change image</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 px-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Click to upload cover image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here... Use **text** for bold headings."
                rows={12}
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Tip: Use **text** for headings and - for bullet points</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="skincare, beauty, tips, featured"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas. Use "featured" to highlight this post.</p>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="published" className="text-sm font-medium">Publish Immediately</Label>
                <p className="text-xs text-muted-foreground">Make this post visible to all visitors</p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={editPost ? handleUpdatePost : handleCreatePost}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {editPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
