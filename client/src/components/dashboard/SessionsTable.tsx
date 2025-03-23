import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Session } from "@shared/schema";
import { Play, Pause, Search, ChevronRight, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SessionsTableProps {
  sessions: Session[];
  exchangeModeActive: boolean;
}

export default function SessionsTable({ sessions, exchangeModeActive }: SessionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const isMobile = useIsMobile();
  
  const updateSessionActivity = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      await apiRequest("PUT", `/api/sessions/${id}/active`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    }
  });

  const toggleSessionSelection = (id: number) => {
    setSelectedSessions(prev => 
      prev.includes(id)
        ? prev.filter(sessionId => sessionId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSessions.length === sessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(sessions.map(session => session.id));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSessions = sessions.filter(session => 
    session.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (session.note && session.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSessionActive = (id: number, active: boolean) => {
    updateSessionActivity.mutate({ id, active });
  };

  // Mobile session card component
  const SessionCard = ({ session }: { session: Session }) => (
    <div className="border rounded-md p-3 mb-3 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedSessions.includes(session.id)}
            onCheckedChange={() => toggleSessionSelection(session.id)}
          />
          <Badge 
            variant="outline" 
            className={
              session.status === "Ready" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : session.status === "Paused"
                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {session.status}
          </Badge>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedSession(session)}
            >
              <InfoIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <div className="flex justify-between pb-1 border-b">
                <span className="text-sm font-medium">Client ID:</span>
                <span className="text-sm font-mono">{session.clientId}</span>
              </div>
              <div className="flex justify-between pb-1 border-b">
                <span className="text-sm font-medium">Note:</span>
                <span className="text-sm">{session.note || "-"}</span>
              </div>
              <div className="flex justify-between pb-1 border-b">
                <span className="text-sm font-medium">Proxy:</span>
                <span className="text-sm">{session.proxy}</span>
              </div>
              <div className="flex justify-between pb-1 border-b">
                <span className="text-sm font-medium">Points:</span>
                <span className="text-sm">{session.points}</span>
              </div>
              <div className="flex justify-between pb-1 border-b">
                <span className="text-sm font-medium">Hits:</span>
                <span className="text-sm">{session.hits}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs font-mono truncate max-w-[200px]">{session.clientId}</div>
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className={session.active ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
            onClick={() => toggleSessionActive(session.id, true)}
            disabled={session.active}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className={!session.active ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-gray-600"}
            onClick={() => toggleSessionActive(session.id, false)}
            disabled={!session.active}
          >
            <Pause className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <div>Points: {session.points}</div>
        <div>Hits: {session.hits}</div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Card>
        <CardHeader className="flex flex-col space-y-2 pb-2">
          <CardTitle className="text-lg">Exchange Activity</CardTitle>
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions"
              className="pl-8 text-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-6">
              No sessions found.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start justify-between p-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-medium">{filteredSessions.length}</span> of{" "}
            <span className="font-medium">{sessions.length}</span> sessions
          </div>
          <div className="flex w-full justify-between">
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Desktop table view
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Exchange Activity</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium text-sm text-gray-700 w-12">
                <Checkbox
                  checked={selectedSessions.length === sessions.length && sessions.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 text-left font-medium text-sm text-gray-700 w-16">ACT</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">ID</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">NOTE</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">PROXY</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">CLIENT</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">POINTS</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">HITS</th>
              <th className="p-3 text-left font-medium text-sm text-gray-700">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <tr key={session.id}>
                  <td className="p-3">
                    <Checkbox
                      checked={selectedSessions.includes(session.id)}
                      onCheckedChange={() => toggleSessionSelection(session.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={session.active ? "text-green-500 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                        onClick={() => toggleSessionActive(session.id, true)}
                        disabled={session.active}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={!session.active ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-gray-600"}
                        onClick={() => toggleSessionActive(session.id, false)}
                        disabled={!session.active}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{session.clientId}</td>
                  <td className="p-3">{session.note || ""}</td>
                  <td className="p-3">
                    <Badge variant="outline">{session.proxy}</Badge>
                  </td>
                  <td className="p-3"></td>
                  <td className="p-3">{session.points}</td>
                  <td className="p-3">{session.hits}</td>
                  <td className="p-3">
                    <Badge 
                      variant="outline" 
                      className={
                        session.status === "Ready" 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : session.status === "Paused"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {session.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-muted-foreground">
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredSessions.length}</span> of{" "}
          <span className="font-medium">{sessions.length}</span> sessions
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" disabled>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
