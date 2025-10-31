'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Heart,
  ShoppingCart,
  Info,
  Truck,
  MessageSquare,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  Flag,
  Send,
  User,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle as XCircleIcon,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllReviews, updateReviewStatus } from '@/lib/reviews-api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedPurchase: boolean;
  helpful: any[];
  reported: any[];
  adminResponse?: {
    comment: string;
    respondedAt: string;
    respondedBy: {
      _id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminComment, setAdminComment] = useState('');

  const reviewsPerPage = 10;

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (searchTerm) params.search = searchTerm;
        params.page = currentPage;
        params.limit = 20;

        const response = await getAllReviews(params);
        if (response.success) {
          setReviews(response.data);
          setStats(response.stats);
        } else {
          console.error('Failed to load reviews:', response.message);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [currentPage, statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: 'approved' | 'rejected', comment?: string) => {
    try {
      setActionLoading(reviewId);

      const response = await updateReviewStatus(reviewId, newStatus, comment);

      if (response.success) {
        // Update the review in the local state
        setReviews(prev => prev.map(review =>
          review._id === reviewId
            ? {
                ...review,
                status: newStatus,
                adminResponse: comment ? {
                  comment,
                  respondedAt: new Date().toISOString(),
                  respondedBy: {
                    _id: 'admin',
                    name: 'Admin'
                  }
                } : review.adminResponse,
                updatedAt: new Date().toISOString()
              }
            : review
        ));

        // Update stats
        setStats(prev => ({
          ...prev,
          [newStatus]: prev[newStatus as keyof ReviewStats] + 1,
          pending: newStatus === 'approved' ? prev.pending - 1 : prev.pending
        }));

        setSelectedReview(null);
        setAdminComment('');
      } else {
        throw new Error(response.message || 'Failed to update review status');
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      alert(`Error updating review status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <PageHeader
        title="Review Management"
        description="Manage and moderate product reviews"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews by title, content, user, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reviews Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading reviews...</span>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{review.user.name}</h4>
                          <span className="text-sm text-gray-500">{review.user.email}</span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                fill={star <= review.rating ? 'currentColor' : 'none'}
                                strokeWidth={1.5}
                                className="h-4 w-4 text-yellow-400"
                              />
                            ))}
                          </div>
                          <Badge variant={getStatusColor(review.status)} className="flex items-center gap-1">
                            {getStatusIcon(review.status)}
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mb-3">
                          <h5 className="font-medium mb-1">{review.title}</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {review.product.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {review.helpful.length} helpful
                          </span>
                          {review.reported.length > 0 && (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              {review.reported.length} reports
                            </span>
                          )}
                        </div>

                        {/* Admin Response */}
                        {review.adminResponse && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-3">
                            <p className="text-sm font-medium text-blue-800 mb-1">
                              Admin Response by {review.adminResponse.respondedBy.name}
                            </p>
                            <p className="text-sm text-blue-700">{review.adminResponse.comment}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {new Date(review.adminResponse.respondedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {review.status === 'pending' && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                    disabled={actionLoading === review._id}
                                  >
                                    {actionLoading === review._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Review</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve this review? It will be visible to all customers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleStatusChange(review._id, 'approved')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Approve Review
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    disabled={actionLoading === review._id}
                                  >
                                    {actionLoading === review._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Review</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this review? It will not be visible to customers.
                                    </AlertDialogDescription>
                                    <div className="mt-4">
                                      <Label htmlFor="admin-comment">Admin Comment (Optional)</Label>
                                      <Textarea
                                        id="admin-comment"
                                        placeholder="Add a comment explaining the rejection..."
                                        value={adminComment}
                                        onChange={(e) => setAdminComment(e.target.value)}
                                        className="mt-2"
                                      />
                                    </div>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setAdminComment('')}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleStatusChange(review._id, 'rejected', adminComment)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Reject Review
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedReview(selectedReview?._id === review._id ? null : review)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {selectedReview?._id === review._id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
