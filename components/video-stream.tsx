"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, Loader2, AlertCircle } from "lucide-react"
import { useWasm } from "@/hooks/use-wasm"
import { useWebSocket } from "@/hooks/use-websocket"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface VideoStreamProps {
  onConnectionChange?: (connected: boolean) => void
  onThreatDetected?: (detected: boolean) => void
}

export function VideoStream({ onConnectionChange, onThreatDetected }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [detections, setDetections] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const { processFrame, wasmLoaded } = useWasm()
  const { connected, sendMessage, lastMessage } = useWebSocket("ws://localhost:8080/ws")

  // Update connection status
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(connected)
    }
  }, [connected, onConnectionChange])

  // Process WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    try {
      const data = JSON.parse(lastMessage.data)

      if (data.detections) {
        setDetections(data.detections)

        // Check if any threats were detected
        const hasThreat = data.detections.some((d: any) => d.is_threat)
        if (onThreatDetected) {
          onThreatDetected(hasThreat)
        }
      }
    } catch (e) {
      console.error("Failed to parse WebSocket message:", e)
    }

    setProcessing(false)
  }, [lastMessage, onThreatDetected])

  // Start video stream
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStreaming(true)
        setError(null)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Failed to access camera. Please ensure you have granted camera permissions.")
    }
  }

  // Stop video stream
  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setStreaming(false)
    }
  }

  // Process video frame
  const processVideoFrame = () => {
    if (!streaming || !wasmLoaded || processing || !connected) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for processing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    setProcessing(true)

    // Process frame with WebAssembly
    if (processFrame) {
      const processedData = processFrame(imageData.data)

      // Send processed frame to server via WebSocket
      if (connected) {
        // In a real implementation, we would send the actual processed data
        // For this example, we'll send a simple message
        sendMessage(
          JSON.stringify({
            type: "frame",
            timestamp: Date.now(),
            dimensions: {
              width: canvas.width,
              height: canvas.height,
            },
          }),
        )
      }
    }
  }

  // Process frames at regular intervals when streaming
  useEffect(() => {
    if (!streaming) return

    const intervalId = setInterval(processVideoFrame, 1000) // Process 1 frame per second

    return () => clearInterval(intervalId)
  }, [streaming, wasmLoaded, processing, connected])

  // Draw bounding boxes for detections
  useEffect(() => {
    if (!canvasRef.current || detections.length === 0) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Clear previous drawings (but keep the video frame)
    // context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bounding boxes
    detections.forEach((detection) => {
      const [x1, y1, x2, y2] = detection.bbox
      const width = x2 - x1
      const height = y2 - y1

      // Set style based on threat level
      if (detection.is_threat) {
        context.strokeStyle = "red"
        context.lineWidth = 3
      } else {
        context.strokeStyle = "green"
        context.lineWidth = 2
      }

      // Draw rectangle
      context.strokeRect(x1, y1, width, height)

      // Draw label
      context.fillStyle = detection.is_threat ? "red" : "green"
      context.font = "16px Arial"
      context.fillText(
        `${detection.class_name} ${Math.round(detection.confidence * 100)}%`,
        x1,
        y1 > 20 ? y1 - 5 : y1 + 20,
      )
    })
  }, [detections])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live Video Stream</CardTitle>
        <CardDescription>Real-time video analysis with threat detection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          {!wasmLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading WebAssembly module...</p>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

              {!streaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <CameraOff className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg mb-4">Camera is not active</p>
                    <Button onClick={startStream}>
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute bottom-4 left-4 right-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {processing && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Processing</span>
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-muted-foreground">{connected ? "Connected to server" : "Disconnected"}</span>
        </div>

        {streaming ? (
          <Button variant="destructive" onClick={stopStream}>
            <CameraOff className="mr-2 h-4 w-4" />
            Stop Camera
          </Button>
        ) : (
          <Button onClick={startStream} disabled={!wasmLoaded}>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
