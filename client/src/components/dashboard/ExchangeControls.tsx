import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExchangeControlsProps {
  user: User | null;
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function ExchangeControls({ user, active, setActive }: ExchangeControlsProps) {
  const [proxy, setProxy] = useState("System");
  
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const sessions = await queryClient.getQueryData<any[]>(["/api/sessions"]);
      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        await apiRequest("PUT", `/api/sessions/${session.id}/status`, { status });
        return status;
      }
      throw new Error("No session found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    }
  });
  
  const restartSessionMutation = useMutation({
    mutationFn: async () => {
      const sessions = await queryClient.getQueryData<any[]>(["/api/sessions"]);
      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        await apiRequest("PUT", `/api/sessions/${session.id}/status`, { status: "Restarting" });
        // Simulate restart by changing status after a delay
        setTimeout(async () => {
          await apiRequest("PUT", `/api/sessions/${session.id}/status`, { status: active ? "Ready" : "Paused" });
          queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
        }, 2000);
        return true;
      }
      throw new Error("No session found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    }
  });

  const toggleExchangeMode = async (checked: boolean) => {
    setActive(checked);
    
    try {
      const sessions = await queryClient.getQueryData<any[]>(["/api/sessions"]);
      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        await apiRequest("PUT", `/api/sessions/${session.id}/active`, { active: checked });
        queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      }
    } catch (error) {
      console.error("Failed to toggle exchange mode:", error);
    }
  };

  const handleProxyChange = (value: string) => {
    setProxy(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Exchange Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="exchange-mode" className="text-sm font-medium text-gray-700">
              Exchange Mode
            </Label>
            <Switch
              id="exchange-mode"
              checked={active}
              onCheckedChange={toggleExchangeMode}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            When enabled, your traffic exchange will be active.
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="client-id" className="block text-sm font-medium text-gray-700">
            Client ID
          </Label>
          <div className="mt-1">
            <Input
              type="text"
              id="client-id"
              value={user?.clientId || ""}
              readOnly
              className="font-mono"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">Your unique client identifier</p>
        </div>

        <div className="mb-6">
          <Label htmlFor="proxy" className="block text-sm font-medium text-gray-700">
            Proxy
          </Label>
          <div className="mt-1">
            <Select value={proxy} onValueChange={handleProxyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select proxy configuration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Manual">Manual Configuration</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-xs text-gray-500">Select your proxy configuration</p>
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Current Status
          </Label>
          <Alert className={active ? "bg-green-100 border-green-400 text-green-700" : "bg-yellow-100 border-yellow-400 text-yellow-700"}>
            <AlertDescription>
              {active ? "Ready" : "Paused"}
            </AlertDescription>
          </Alert>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button
            className="flex items-center"
            onClick={() => restartSessionMutation.mutate()}
            disabled={restartSessionMutation.isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
