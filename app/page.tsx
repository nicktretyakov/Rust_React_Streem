"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VideoStream } from "@/components/video-stream"
import { ThreatDashboard } from "@/components/threat-dashboard"
import { AlertsPanel } from "@/components/alerts-panel"
import { SettingsPanel } from "@/components/settings-panel"
import { AlertCircle, Camera, BarChart2, Bell, Settings } from "lucide-react"

export default function RTTDSPage() {
  const [activeTab, setActiveTab] = useState("live")
  const [isConnected, setIsConnected] = useState(false)
  const [threatDetected, setThreatDetected] = useState(false)

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="flex items-center space-x-2" href="/">
              <AlertCircle className="h-6 w-6" />
              <span className="font-bold">RTTDS</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="flex items-center">
              {isConnected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <Tabs defaultValue="live" orientation="vertical" onValueChange={setActiveTab} className="h-full">
              <TabsList className="flex flex-col items-stretch justify-start h-full space-y-1">
                <TabsTrigger value="live" className="justify-start">
                  <Camera className="mr-2 h-4 w-4" />
                  Live Stream
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="justify-start">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="alerts" className="justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="settings" className="justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </aside>

        <div className="flex flex-col space-y-6">
          {threatDetected && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Threat Detected!</AlertTitle>
              <AlertDescription>
                A potential security threat has been detected. Please review the details below.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex-1">
            {activeTab === "live" && (
              <VideoStream onConnectionChange={setIsConnected} onThreatDetected={setThreatDetected} />
            )}
            {activeTab === "dashboard" && <ThreatDashboard />}
            {activeTab === "alerts" && <AlertsPanel />}
            {activeTab === "settings" && <SettingsPanel />}
          </div>
        </div>
      </div>
    </main>
  )
}
