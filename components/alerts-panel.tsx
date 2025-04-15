"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, Filter, Search, XCircle } from "lucide-react"

// Mock alert data
const mockAlerts = [
  {
    id: "alert-1",
    title: "Suspicious Object Detected",
    description: "Camera 1 detected a suspicious object in the lobby area.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    status: "active",
    severity: "high",
    location: "Lobby",
    camera: "Camera 1",
  },
  {
    id: "alert-2",
    title: "Unauthorized Access",
    description: "Camera 3 detected an unauthorized person in the server room.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    status: "active",
    severity: "critical",
    location: "Server Room",
    camera: "Camera 3",
  },
  {
    id: "alert-3",
    title: "Motion Detected After Hours",
    description: "Camera 2 detected motion in the office area after business hours.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    status: "investigating",
    severity: "medium",
    location: "Office Area",
    camera: "Camera 2",
  },
  {
    id: "alert-4",
    title: "Potential Weapon Detected",
    description: "Camera 5 detected a potential weapon in the parking lot.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    status: "resolved",
    severity: "high",
    location: "Parking Lot",
    camera: "Camera 5",
  },
  {
    id: "alert-5",
    title: "Unusual Behavior",
    description: "Camera 4 detected unusual behavior in the reception area.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: "false_alarm",
    severity: "low",
    location: "Reception",
    camera: "Camera 4",
  },
]

export function AlertsPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter alerts based on search query and active tab
  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && alert.status === activeTab
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "investigating":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Resolved
          </Badge>
        )
      case "false_alarm":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            False Alarm
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500">High</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Security Alerts</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search alerts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="false_alarm">False Alarms</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <XCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No alerts found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {alert.title}
                          {getSeverityBadge(alert.severity)}
                        </CardTitle>
                        <CardDescription>{alert.description}</CardDescription>
                      </div>
                      {getStatusBadge(alert.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Camera:</span>
                        <span className="text-sm">{alert.camera}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatTimestamp(alert.timestamp)}
                    </div>
                    <div className="flex gap-2">
                      {alert.status === "active" && (
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                      )}
                      {(alert.status === "active" || alert.status === "investigating") && (
                        <Button size="sm">Resolve</Button>
                      )}
                      {alert.status === "resolved" && (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Resolved
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
