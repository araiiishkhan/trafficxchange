import MainLayout from "@/components/layouts/MainLayout";
import StatsOverview from "@/components/dashboard/StatsOverview";
import ExchangeControls from "@/components/dashboard/ExchangeControls";
import SessionsTable from "@/components/dashboard/SessionsTable";
import UrlManagement from "@/components/dashboard/UrlManagement";
import DesktopAppEmulator from "@/components/dashboard/DesktopAppEmulator";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [exchangeModeActive, setExchangeModeActive] = useState(true);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user data directly
  useEffect(() => {
    async function fetchUser() {
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
    
    fetchUser();
  }, []);
  
  // Define types for API responses
  type StatsResponse = {
    totalHits: number;
    availablePoints: number;
    activeSessions: number;
    activeUrls: number;
  };
  
  type SessionsResponse = {
    id: number;
    clientId: string;
    points: number;
    hits: number;
    status: string;
    userId: number;
    note: string | null;
    proxy: string;
    proxyConfig: string | null;
    active: boolean;
  }[];
  
  type UrlsResponse = {
    id: number;
    hits: number;
    userId: number;
    active: boolean;
    url: string;
    minVisitTime: number;
    todayHits: number;
    pointsUsed: number;
    createdAt: Date;
  }[];

  const { data: stats } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const { data: sessions } = useQuery<SessionsResponse>({
    queryKey: ["/api/sessions"],
    refetchInterval: 30000,
  });
  
  const { data: urls } = useQuery<UrlsResponse>({
    queryKey: ["/api/urls"],
    refetchInterval: 30000,
  });

  // Render mobile or desktop layout based on screen size
  if (isMobile) {
    return (
      <MainLayout>
        <div className="w-full px-2">
          {/* Mobile Tabs UI */}
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="exchange">Exchange</TabsTrigger>
              <TabsTrigger value="urls">URLs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <StatsOverview stats={stats} />
              
              {/* Mobile Desktop App Emulator */}
              <div className="mt-4">
                <DesktopAppEmulator 
                  exchangeModeActive={exchangeModeActive}
                  setExchangeModeActive={setExchangeModeActive}
                  clientId={user?.clientId || "client-" + (Math.random().toString(36).substring(2, 10))}
                />
              </div>
            </TabsContent>

            <TabsContent value="exchange" className="mt-4">
              <ExchangeControls 
                user={user}
                active={exchangeModeActive}
                setActive={setExchangeModeActive}
              />
              
              <div className="mt-4">
                <SessionsTable 
                  sessions={sessions || []} 
                  exchangeModeActive={exchangeModeActive}
                />
              </div>
            </TabsContent>

            <TabsContent value="urls" className="mt-4">
              <UrlManagement urls={urls || []} />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    );
  }

  // Desktop layout
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Overview Cards */}
        <StatsOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Exchange Control Panel */}
          <div className="lg:col-span-1">
            <ExchangeControls 
              user={user}
              active={exchangeModeActive}
              setActive={setExchangeModeActive}
            />
          </div>

          {/* Sessions Table */}
          <div className="lg:col-span-2">
            <SessionsTable 
              sessions={sessions || []} 
              exchangeModeActive={exchangeModeActive}
            />
          </div>
        </div>

        {/* URL Management Panel */}
        <UrlManagement urls={urls || []} />
      </div>
      
      {/* Desktop App Emulator for demo purposes */}
      <DesktopAppEmulator 
        exchangeModeActive={exchangeModeActive}
        setExchangeModeActive={setExchangeModeActive}
        clientId={user?.clientId || "client-" + (Math.random().toString(36).substring(2, 10))}
      />
    </MainLayout>
  );
}
