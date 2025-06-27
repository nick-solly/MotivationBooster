import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart, RefreshCw, History, Quote, User, AlertTriangle } from "lucide-react";
import type { Message } from "@shared/schema";

export default function Home() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch random message
  const {
    data: currentMessage,
    isLoading: isLoadingMessage,
    error: messageError,
  } = useQuery<Message>({
    queryKey: ["/api/messages/random"],
    staleTime: 0, // Always refetch to get truly random messages
  });

  // Fetch recent messages for history
  const {
    data: recentMessages = [],
    isLoading: isLoadingHistory,
  } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  // Mutation to fetch new random message
  const fetchNewMessage = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/messages/random", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch new message");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/random"] });
      toast({
        title: "New message loaded!",
        description: "Here's your fresh dose of inspiration ✨",
      });
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong",
        description: "We couldn't fetch your motivational message right now.",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteMessage = (messageId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(messageId)) {
      newFavorites.delete(messageId);
      toast({
        title: "Removed from favorites",
        description: "Message removed from your favorites.",
      });
    } else {
      newFavorites.add(messageId);
      toast({
        title: "Added to favorites! ❤️",
        description: "This message has been saved to your favorites.",
      });
    }
    setFavorites(newFavorites);
  };

  const LoadingState = () => (
    <div className="animate-pulse-gentle text-center">
      <Heart className="h-12 w-12 text-primary mb-4 mx-auto" />
      <p className="text-slate-600">Finding your perfect message...</p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-4">We couldn't fetch your motivational message right now.</p>
      <Button 
        onClick={() => fetchNewMessage.mutate()} 
        variant="outline" 
        className="bg-amber-500 text-white hover:bg-amber-600"
      >
        Try Again
      </Button>
    </div>
  );

  const MessageContent = ({ message }: { message: Message }) => (
    <div className="animate-fade-in text-center">
      <div className="mb-6">
        <Quote className="h-8 w-8 text-primary/30 mb-4 mx-auto" />
      </div>
      
      <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-800 leading-relaxed mb-6">
        "{message.text}"
      </blockquote>
      
      <div className="flex items-center justify-center space-x-2 text-slate-600">
        <User className="h-5 w-5 text-primary" />
        <cite className="text-lg font-medium">
          {message.author}
        </cite>
      </div>
      
      <div className="mt-6">
        <Quote className="h-8 w-8 text-primary/30 mx-auto rotate-180" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            <Heart className="inline-block h-8 w-8 text-primary mr-3" />
            Daily Motivation
          </h1>
          <p className="text-slate-600 text-lg">Find inspiration in every moment</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Message Card */}
        <div className="relative mb-8">
          {/* Background decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
          
          {/* Main message container */}
          <Card className="relative bg-white/80 backdrop-blur-sm border-white/20 shadow-xl animate-slide-up">
            <CardContent className="p-8 md:p-12">
              {isLoadingMessage && <LoadingState />}
              {messageError && <ErrorState />}
              {currentMessage && <MessageContent message={currentMessage} />}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => fetchNewMessage.mutate()}
            disabled={fetchNewMessage.isPending}
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            size="lg"
          >
            <RefreshCw className={`mr-3 h-5 w-5 transition-transform duration-500 ${fetchNewMessage.isPending ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            {fetchNewMessage.isPending ? 'Loading...' : 'Get New Message'}
          </Button>
          
          {currentMessage && (
            <Button
              onClick={() => handleFavoriteMessage(currentMessage.id)}
              variant="outline"
              className="group bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300 px-6 py-4"
              size="lg"
            >
              <Heart className={`mr-2 h-5 w-5 transition-all duration-300 ${
                favorites.has(currentMessage.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'group-hover:fill-red-500 group-hover:text-red-500'
              }`} />
              {favorites.has(currentMessage.id) ? 'Saved!' : 'Save to Favorites'}
            </Button>
          )}
        </div>

        {/* Message History */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <History className="h-6 w-6 text-primary mr-3" />
              Recent Messages
            </h3>
            
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-white/50 rounded-xl border border-slate-100">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.slice(0, 3).map((message) => (
                  <div
                    key={message.id}
                    className="p-4 bg-white/50 rounded-xl border border-slate-100 hover:bg-white/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      // Update current message to this one
                      queryClient.setQueryData(["/api/messages/random"], message);
                    }}
                  >
                    <p className="text-slate-700 font-medium line-clamp-2 group-hover:text-slate-900 transition-colors">
                      "{message.text}"
                    </p>
                    <p className="text-sm text-slate-500 mt-2">— {message.author}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-slate-500">
            Start each day with inspiration • 
            <Heart className="inline-block h-4 w-4 text-red-400 mx-2" />
            Made with motivation in mind
          </p>
        </div>
      </footer>
    </div>
  );
}
