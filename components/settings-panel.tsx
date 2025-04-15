"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"

export function SettingsPanel() {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "RTTDS v1.0",
    autoStart: true,
    darkMode: false,
    notifications: true,
    soundAlerts: true,
  })

  const [detectionSettings, setDetectionSettings] = useState({
    confidenceThreshold: 70,
    motionSensitivity: 50,
    processingInterval: 1000,
    enableEdgeDetection: true,
    enableFaceDetection: true,
    enableObjectDetection: true,
    enableWeaponDetection: true,
  })

  const [alertSettings, setAlertSettings] = useState({
    emailAlerts: true,
    emailRecipients: "admin@example.com",
    smsAlerts: false,
    smsRecipients: "",
    webhookUrl: "",
    minSeverity: "medium",
  })

  const [cameraSettings, setCameraSettings] = useState({
    defaultCamera: "0",
    resolution: "640x480",
    frameRate: 30,
    autoExposure: true,
  })

  const handleGeneralChange = (key: string, value: any) => {
    setGeneralSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleDetectionChange = (key: string, value: any) => {
    setDetectionSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleAlertChange = (key: string, value: any) => {
    setAlertSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleCameraChange = (key: string, value: any) => {
    setCameraSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>

        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="detection">Detection</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={generalSettings.systemName}
                  onChange={(e) => handleGeneralChange("systemName", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoStart">Auto-start on system boot</Label>
                <Switch
                  id="autoStart"
                  checked={generalSettings.autoStart}
                  onCheckedChange={(checked) => handleGeneralChange("autoStart", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <Switch
                  id="darkMode"
                  checked={generalSettings.darkMode}
                  onCheckedChange={(checked) => handleGeneralChange("darkMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={generalSettings.notifications}
                  onCheckedChange={(checked) => handleGeneralChange("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="soundAlerts">Sound Alerts</Label>
                <Switch
                  id="soundAlerts"
                  checked={generalSettings.soundAlerts}
                  onCheckedChange={(checked) => handleGeneralChange("soundAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detection" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Settings</CardTitle>
              <CardDescription>Configure threat detection parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidenceThreshold">
                    Confidence Threshold ({detectionSettings.confidenceThreshold}%)
                  </Label>
                </div>
                <Slider
                  id="confidenceThreshold"
                  min={0}
                  max={100}
                  step={1}
                  value={[detectionSettings.confidenceThreshold]}
                  onValueChange={(value) => handleDetectionChange("confidenceThreshold", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="motionSensitivity">Motion Sensitivity ({detectionSettings.motionSensitivity}%)</Label>
                </div>
                <Slider
                  id="motionSensitivity"
                  min={0}
                  max={100}
                  step={1}
                  value={[detectionSettings.motionSensitivity]}
                  onValueChange={(value) => handleDetectionChange("motionSensitivity", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingInterval">Processing Interval (ms)</Label>
                <Input
                  id="processingInterval"
                  type="number"
                  value={detectionSettings.processingInterval}
                  onChange={(e) => handleDetectionChange("processingInterval", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-medium">Detection Features</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableEdgeDetection"
                    checked={detectionSettings.enableEdgeDetection}
                    onCheckedChange={(checked) => handleDetectionChange("enableEdgeDetection", checked)}
                  />
                  <Label htmlFor="enableEdgeDetection">Enable Edge Detection</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableFaceDetection"
                    checked={detectionSettings.enableFaceDetection}
                    onCheckedChange={(checked) => handleDetectionChange("enableFaceDetection", checked)}
                  />
                  <Label htmlFor="enableFaceDetection">Enable Face Detection</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableObjectDetection"
                    checked={detectionSettings.enableObjectDetection}
                    onCheckedChange={(checked) => handleDetectionChange("enableObjectDetection", checked)}
                  />
                  <Label htmlFor="enableObjectDetection">Enable Object Detection</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableWeaponDetection"
                    checked={detectionSettings.enableWeaponDetection}
                    onCheckedChange={(checked) => handleDetectionChange("enableWeaponDetection", checked)}
                  />
                  <Label htmlFor="enableWeaponDetection">Enable Weapon Detection</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure how alerts are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailAlerts">Email Alerts</Label>
                <Switch
                  id="emailAlerts"
                  checked={alertSettings.emailAlerts}
                  onCheckedChange={(checked) => handleAlertChange("emailAlerts", checked)}
                />
              </div>

              {alertSettings.emailAlerts && (
                <div className="space-y-2">
                  <Label htmlFor="emailRecipients">Email Recipients</Label>
                  <Input
                    id="emailRecipients"
                    placeholder="email@example.com, another@example.com"
                    value={alertSettings.emailRecipients}
                    onChange={(e) => handleAlertChange("emailRecipients", e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="smsAlerts">SMS Alerts</Label>
                <Switch
                  id="smsAlerts"
                  checked={alertSettings.smsAlerts}
                  onCheckedChange={(checked) => handleAlertChange("smsAlerts", checked)}
                />
              </div>

              {alertSettings.smsAlerts && (
                <div className="space-y-2">
                  <Label htmlFor="smsRecipients">SMS Recipients</Label>
                  <Input
                    id="smsRecipients"
                    placeholder="+1234567890, +0987654321"
                    value={alertSettings.smsRecipients}
                    onChange={(e) => handleAlertChange("smsRecipients", e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://example.com/webhook"
                  value={alertSettings.webhookUrl}
                  onChange={(e) => handleAlertChange("webhookUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minSeverity">Minimum Alert Severity</Label>
                <Select
                  value={alertSettings.minSeverity}
                  onValueChange={(value) => handleAlertChange("minSeverity", value)}
                >
                  <SelectTrigger id="minSeverity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Camera Settings</CardTitle>
              <CardDescription>Configure camera parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultCamera">Default Camera</Label>
                <Select
                  value={cameraSettings.defaultCamera}
                  onValueChange={(value) => handleCameraChange("defaultCamera", value)}
                >
                  <SelectTrigger id="defaultCamera">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Default Camera</SelectItem>
                    <SelectItem value="1">External Webcam</SelectItem>
                    <SelectItem value="2">IP Camera 1</SelectItem>
                    <SelectItem value="3">IP Camera 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Select
                  value={cameraSettings.resolution}
                  onValueChange={(value) => handleCameraChange("resolution", value)}
                >
                  <SelectTrigger id="resolution">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="320x240">320x240</SelectItem>
                    <SelectItem value="640x480">640x480</SelectItem>
                    <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                    <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frameRate">Frame Rate</Label>
                <Select
                  value={cameraSettings.frameRate.toString()}
                  onValueChange={(value) => handleCameraChange("frameRate", Number.parseInt(value))}
                >
                  <SelectTrigger id="frameRate">
                    <SelectValue placeholder="Select frame rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 FPS</SelectItem>
                    <SelectItem value="24">24 FPS</SelectItem>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="60">60 FPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoExposure">Auto Exposure</Label>
                <Switch
                  id="autoExposure"
                  checked={cameraSettings.autoExposure}
                  onCheckedChange={(checked) => handleCameraChange("autoExposure", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
