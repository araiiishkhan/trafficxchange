import { useState, useEffect } from "react";
import { Play, Pause, Plus, Grid2X2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

interface DesktopAppEmulatorProps {
  exchangeModeActive: boolean;
  setExchangeModeActive: (active: boolean) => void;
  clientId: string;
}

export default function DesktopAppEmulator({
  exchangeModeActive,
  setExchangeModeActive,
  clientId
}: DesktopAppEmulatorProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [points, setPoints] = useState(0);
  const [hits, setHits] = useState(0);

  const { data: sessions } = useQuery({
    queryKey: ["/api/sessions"],
    refetchInterval: 5000,
  });

  // Simulate earning hits and points
  useEffect(() => {
    if (exchangeModeActive) {
      const interval = setInterval(() => {
        setHits(prev => prev + 1);
        setPoints(prev => prev + 2);
      }, 60000); // Update every 60 seconds
      
      return () => clearInterval(interval);
    }
  }, [exchangeModeActive]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-8 right-8">
        <Button
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsMinimized(false)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="flex flex-col rounded-lg shadow-xl overflow-hidden w-96 bg-slate-800 border border-slate-700">
        <div className="flex-shrink-0 bg-blue-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-white mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-medium">TrafficXchange App v5.0.0 - Connected</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              className="h-6 w-6 p-0 text-white opacity-75 hover:opacity-100"
              onClick={() => setIsMinimized(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900 text-white p-4">
          <div className="flex justify-between mb-4">
            <div className="flex space-x-1">
              <Button size="sm" className="bg-slate-700 hover:bg-slate-600 h-7 w-7 p-0">
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button size="sm" className="bg-slate-700 hover:bg-slate-600 h-7 w-7 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-amber-500 text-white">Hits: {hits}</Badge>
              <Badge className="bg-green-500 text-white">Points: {points}</Badge>
            </div>
          </div>
          
          <div className="overflow-hidden rounded border border-slate-700 mb-4">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <Checkbox className="h-3 w-3" checked />
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Act
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {sessions && sessions.length > 0 ? (
                  sessions.map((session: any) => (
                    <tr key={session.id} className="hover:bg-slate-700">
                      <td className="px-2 py-2 whitespace-nowrap text-xs">
                        <Checkbox className="h-3 w-3" checked />
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs">
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-4 w-4 p-0 text-green-500 hover:text-green-400"
                            disabled={session.active}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-4 w-4 p-0 text-red-500 hover:text-red-400"
                            disabled={!session.active}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs font-mono">
                        {session.clientId}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs">
                        <Badge 
                          variant="outline" 
                          className={session.active 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {session.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-2 py-4 text-center text-xs text-slate-400">
                      No sessions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between">
            <Button 
              size="sm" 
              variant={exchangeModeActive ? "default" : "secondary"}
              className={exchangeModeActive ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700"}
              onClick={() => setExchangeModeActive(!exchangeModeActive)}
            >
              Exchange Mode
            </Button>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setExchangeModeActive(true)}
                disabled={exchangeModeActive}
              >
                Start All
              </Button>
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setExchangeModeActive(false)}
                disabled={!exchangeModeActive}
              >
                Stop All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
