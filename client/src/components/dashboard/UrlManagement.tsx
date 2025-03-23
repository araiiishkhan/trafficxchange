import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Edit2Icon, Trash2Icon, ClockIcon, ExternalLinkIcon } from "lucide-react";
import { Url } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface UrlManagementProps {
  urls: Url[];
}

const urlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  minVisitTime: z.coerce.number().min(5, { message: "Minimum visit time must be at least 5 seconds" }),
});

type UrlFormValues = z.infer<typeof urlSchema>;

export default function UrlManagement({ urls }: UrlManagementProps) {
  const [user, setUser] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<Url | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // Fetch current user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    
    fetchUserData();
  }, []);
  
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      minVisitTime: 20,
    },
  });
  
  const addUrlMutation = useMutation({
    mutationFn: async (values: UrlFormValues) => {
      // Make sure user is loaded before attempting to submit
      if (!user?.id) {
        throw new Error("User must be logged in to add URLs");
      }
      
      const res = await apiRequest("POST", "/api/urls", {
        ...values,
        userId: user.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setShowAddDialog(false);
      form.reset();
    },
  });
  
  const deleteUrlMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/urls/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setShowDeleteDialog(false);
      setDeletingUrl(null);
    },
  });
  
  function onAddSubmit(values: UrlFormValues) {
    addUrlMutation.mutate(values);
  }
  
  function openDeleteDialog(url: Url) {
    setDeletingUrl(url);
    setShowDeleteDialog(true);
  }
  
  function confirmDelete() {
    if (deletingUrl) {
      deleteUrlMutation.mutate(deletingUrl.id);
    }
  }

  function formatDate(dateString: Date) {
    return format(new Date(dateString), 'MMM dd, yyyy');
  }

  // Mobile URL card component
  const UrlCard = ({ url }: { url: Url }) => (
    <div className="border border-gray-200 rounded-md p-3 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-primary text-sm break-all">{url.url}</div>
          <div className="text-xs text-gray-500 mt-1">Added on {formatDate(url.createdAt)}</div>
        </div>
        <div className="flex space-x-1">
          <a 
            href={url.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="h-7 w-7 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
            onClick={() => openDeleteDialog(url)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs bg-gray-100 rounded-md px-2 py-1 flex items-center mt-2 w-fit">
        <ClockIcon className="h-3 w-3 text-gray-500 mr-1" />
        <span>{url.minVisitTime} sec min. visit</span>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs font-medium text-gray-500">Total Hits</div>
          <div className="mt-0.5 text-lg font-semibold text-gray-900">{url.hits}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs font-medium text-gray-500">Today</div>
          <div className="mt-0.5 text-lg font-semibold text-gray-900">{url.todayHits}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs font-medium text-gray-500">Points Used</div>
          <div className="mt-0.5 text-lg font-semibold text-gray-900">{url.pointsUsed}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <div className="text-xs font-medium text-gray-500">Status</div>
          <div className="mt-0.5">
            <Badge variant="outline" className={`text-xs ${url.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
              {url.active ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Your URLs</CardTitle>
          <Button onClick={() => setShowAddDialog(true)} size={isMobile ? "sm" : "default"}>
            <PlusIcon className={`${isMobile ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} /> 
            {isMobile ? "Add URL" : "Add New URL"}
          </Button>
        </CardHeader>
        <CardContent>
          {urls.length > 0 ? (
            <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
              {isMobile ? (
                // Mobile layout - cards
                urls.map((url) => (
                  <UrlCard key={url.id} url={url} />
                ))
              ) : (
                // Desktop layout - detailed cards
                urls.map((url) => (
                  <div key={url.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-2 md:mb-0">
                        <h4 className="font-medium text-primary">{url.url}</h4>
                        <p className="text-sm text-gray-500">Added on {formatDate(url.createdAt)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm bg-gray-100 rounded-md px-3 py-1 flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{url.minVisitTime} sec min. visit</span>
                        </div>

                        <div className="flex">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit2Icon className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => openDeleteDialog(url)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium text-gray-500">Total Hits</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-900">{url.hits}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium text-gray-500">Today</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-900">{url.todayHits}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium text-gray-500">Points Used</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-900">{url.pointsUsed}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium text-gray-500">Status</div>
                        <div className="mt-1">
                          <Badge variant="outline" className={url.active ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                            {url.active ? "Active" : "Paused"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">{isMobile ? "No URLs added yet" : "You haven't added any URLs yet."}</p>
              <Button onClick={() => setShowAddDialog(true)} size={isMobile ? "sm" : "default"}>
                <PlusIcon className={`${isMobile ? 'mr-1 h-3 w-3' : 'mr-2 h-4 w-4'}`} /> 
                {isMobile ? "Add URL" : "Add Your First URL"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add URL Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className={isMobile ? "w-[90vw] rounded-md p-4" : ""}>
          <DialogHeader>
            <DialogTitle>Add New URL</DialogTitle>
            <DialogDescription>
              Enter the URL you want to receive traffic to, along with visit settings.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minVisitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Visit Time (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" min={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                  className={isMobile ? "w-full" : ""}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addUrlMutation.isPending}
                  className={isMobile ? "w-full" : ""}
                >
                  {addUrlMutation.isPending ? "Adding..." : "Add URL"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className={isMobile ? "w-[90vw] rounded-md p-4" : ""}>
          <DialogHeader>
            <DialogTitle>Delete URL</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this URL? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deletingUrl && (
            <div className="py-4">
              <p className="text-muted-foreground mb-2">URL to be deleted:</p>
              <p className="font-medium break-all">{deletingUrl.url}</p>
            </div>
          )}
          
          <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className={isMobile ? "w-full" : ""}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteUrlMutation.isPending}
              className={isMobile ? "w-full" : ""}
            >
              {deleteUrlMutation.isPending ? "Deleting..." : "Delete URL"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
