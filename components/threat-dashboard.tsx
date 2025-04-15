"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DownloadIcon, RefreshCw } from "lucide-react"

export function ThreatDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("24h")
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Simulate loading data
  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    refreshData()
  }, [timeRange, date])

  // Mock data for charts
  const threatData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Threats Detected",
        data: [2, 0, 1, 5, 3, 7],
        backgroundColor: "rgba(220, 38, 38, 0.5)",
        borderColor: "rgb(220, 38, 38)",
      },
    ],
  }

  const objectData = {
    labels: ["Person", "Vehicle", "Suspicious Object", "Weapon", "Other"],
    datasets: [
      {
        label: "Objects Detected",
        data: [45, 23, 8, 2, 12],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(220, 38, 38, 0.5)",
          "rgba(107, 114, 128, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(220, 38, 38)",
          "rgb(107, 114, 128)",
        ],
      },
    ],
  }

  const processingData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Processing Time (ms)",
        data: [120, 115, 130, 145, 160, 140],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Threat Analytics Dashboard</h2>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button variant="outline" size="icon">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Threat Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <span className="text-3xl font-bold">18</span>
                <span className="text-sm text-muted-foreground">Total Threats</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-700 rounded-md">
                <span className="text-3xl font-bold">3</span>
                <span className="text-sm">Active Threats</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-amber-50 text-amber-700 rounded-md">
                <span className="text-3xl font-bold">7</span>
                <span className="text-sm">Warnings</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-700 rounded-md">
                <span className="text-3xl font-bold">8</span>
                <span className="text-sm">Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Gateway</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ML Service</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Kafka</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  Degraded
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">WebSocket</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Processing Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Frames Processed</span>
                <span className="font-medium">12,458</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg. Processing Time</span>
                <span className="font-medium">135ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Objects Detected</span>
                <span className="font-medium">1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">False Positives</span>
                <span className="font-medium">23 (1.8%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Model Version</span>
                <span className="font-medium">YOLOv8s-2.1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Threat Detection Timeline</CardTitle>
            <CardDescription>Number of threats detected over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart data={threatData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Object Detection Distribution</CardTitle>
            <CardDescription>Types of objects detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart data={objectData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Processing time and resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <LineChart data={processingData} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
