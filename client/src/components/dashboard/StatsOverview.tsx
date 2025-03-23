import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EyeIcon, CoinsIcon, MonitorIcon, GlobeIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatsProps {
  stats: {
    totalHits: number;
    availablePoints: number;
    activeSessions: number;
    activeUrls: number;
  } | undefined;
}

export default function StatsOverview({ stats }: StatsProps) {
  const isMobile = useIsMobile();
  
  // Simplified card for mobile view
  const StatCard = ({ 
    icon, 
    title, 
    value, 
    color, 
    action
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: number; 
    color: string;
    action: string;
  }) => (
    <Card>
      <CardContent className={`pt-${isMobile ? '4' : '6'}`}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color} rounded-md p-${isMobile ? '2' : '3'}`}>
            {icon}
          </div>
          <div className="ml-4 w-0 flex-1">
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 truncate`}>{title}</div>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
              {value}
            </div>
          </div>
        </div>
      </CardContent>
      {!isMobile && (
        <CardFooter className="bg-gray-50 px-4 py-4">
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-blue-700">
              {action}
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
  
  return (
    <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-${isMobile ? '3' : '5'} mb-${isMobile ? '6' : '8'}`}>
      {/* Total Hits Card */}
      <StatCard 
        icon={<EyeIcon className={`h-${isMobile ? '5' : '6'} w-${isMobile ? '5' : '6'} text-white`} />}
        title="Total Hits"
        value={stats?.totalHits || 0}
        color="bg-primary"
        action="View all"
      />

      {/* Points Card */}
      <StatCard 
        icon={<CoinsIcon className={`h-${isMobile ? '5' : '6'} w-${isMobile ? '5' : '6'} text-white`} />}
        title="Available Points"
        value={stats?.availablePoints || 0}
        color="bg-green-500"
        action="Buy points"
      />

      {/* Active Sessions Card */}
      <StatCard 
        icon={<MonitorIcon className={`h-${isMobile ? '5' : '6'} w-${isMobile ? '5' : '6'} text-white`} />}
        title="Active Sessions"
        value={stats?.activeSessions || 0}
        color="bg-amber-500"
        action="View details"
      />

      {/* URL/Sites Card */}
      <StatCard 
        icon={<GlobeIcon className={`h-${isMobile ? '5' : '6'} w-${isMobile ? '5' : '6'} text-white`} />}
        title="Active URLs"
        value={stats?.activeUrls || 0}
        color="bg-indigo-500"
        action="Manage URLs"
      />
    </div>
  );
}
