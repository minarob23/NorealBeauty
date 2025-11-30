import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@shared/schema";

const reviewFormSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  rating: z.number().min(1).max(5),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  onSubmitReview?: (data: ReviewFormData) => void;
  isSubmitting?: boolean;
}

type SortOption = "recent" | "highest" | "lowest";

export function ReviewsSection({
  productId,
  reviews,
  onSubmitReview,
  isSubmitting = false,
}: ReviewsSectionProps) {
  const { language } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();

  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      userName: "",
      rating: 5,
      title: "",
      content: "",
    },
  });

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "recent":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === rating).length / reviews.length) *
          100
        : 0,
  }));

  const handleSubmit = (data: ReviewFormData) => {
    onSubmitReview?.(data);
    form.reset();
    setDialogOpen(false);
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  const StarRating = ({
    rating,
    interactive = false,
    size = "sm",
    onSelect,
  }: {
    rating: number;
    interactive?: boolean;
    size?: "sm" | "md" | "lg";
    onSelect?: (rating: number) => void;
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={interactive ? { scale: 1.2 } : undefined}
            whileTap={interactive ? { scale: 0.9 } : undefined}
            onClick={() => interactive && onSelect?.(star)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            disabled={!interactive}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= rating
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <Card className="lg:w-72">
          <CardContent className="p-6">
            <div className="text-center">
              <div
                className="text-5xl font-light"
                data-testid="text-average-rating"
              >
                {averageRating.toFixed(1)}
              </div>
              <div className="mt-2 flex justify-center">
                <StarRating rating={Math.round(averageRating)} size="md" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {reviews.length} {t.product.reviews.toLowerCase()}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-3 text-sm">{rating}</span>
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full rounded-full bg-gold"
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-write-review">
                  {t.product.writeReview}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif">
                    {t.product.writeReview}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your name"
                              data-testid="input-review-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.review.rating}</FormLabel>
                          <FormControl>
                            <div className="py-2">
                              <StarRating
                                rating={field.value}
                                interactive
                                size="lg"
                                onSelect={(rating) => field.onChange(rating)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.review.title}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Summarize your review"
                              data-testid="input-review-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.review.content}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Share your experience with this product..."
                              rows={4}
                              data-testid="input-review-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        {t.common.cancel}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        data-testid="button-submit-review"
                      >
                        {t.review.submit}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40" data-testid="select-review-sort">
                <SelectValue placeholder={t.review.sortBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">{t.review.mostRecent}</SelectItem>
                <SelectItem value="highest">{t.review.highestRated}</SelectItem>
                <SelectItem value="lowest">{t.review.lowestRated}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence mode="popLayout">
            {sortedReviews.length > 0 ? (
              <div className="space-y-4">
                {sortedReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {review.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="font-medium"
                                data-testid={`text-reviewer-${review.id}`}
                              >
                                {review.userName}
                              </span>
                              <StarRating rating={review.rating} />
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <h4
                              className="mt-2 font-medium"
                              data-testid={`text-review-title-${review.id}`}
                            >
                              {review.title}
                            </h4>
                            <p
                              className="mt-1 text-sm text-muted-foreground"
                              data-testid={`text-review-content-${review.id}`}
                            >
                              {review.content}
                            </p>

                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                data-testid={`button-helpful-${review.id}`}
                              >
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                {t.review.helpful} ({review.helpful})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <User className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
