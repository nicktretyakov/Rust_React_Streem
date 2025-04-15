"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type WebSocketStatus = "connecting" | "open" | "closing" | "closed"

interface UseWebSocketReturn {
  connected: boolean
  status: WebSocketStatus
  sendMessage: (message: string | ArrayBuffer) => void
  lastMessage: MessageEvent | null
  error: Event | null
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [status, setStatus] = useState<WebSocketStatus>("closed")
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [error, setError] = useState<Event | null>(null)
  const webSocketRef = useRef<WebSocket | null>(null)

  // Initialize WebSocket connection
  useEffect(() => {
    // For demo purposes, we'll simulate the WebSocket connection
    const simulatedWebSocket = {
      send: (message: string | ArrayBuffer) => {
        console.log("Sending message:", message)

        // Simulate receiving a response after a short delay
        setTimeout(() => {
          const mockResponse = {
            timestamp: Date.now(),
            detections: [
              {
                class_name: "person",
                confidence: 0.92,
                bbox: [100, 100, 200, 300],
                is_threat: false,
              },
              {
                class_name: "suspicious_object",
                confidence: 0.85,
                bbox: [300, 200, 350, 250],
                is_threat: true,
              },
            ],
            processing_time_ms: 120,
          }

          // Simulate the MessageEvent
          const mockEvent = {
            data: JSON.stringify(mockResponse),
            type: "message",
            target: simulatedWebSocket,
          } as unknown as MessageEvent

          setLastMessage(mockEvent)
        }, 500)
      },
      close: () => {
        setStatus("closed")
      },
    } as unknown as WebSocket

    // In a real implementation, we would create an actual WebSocket
    // const socket = new WebSocket(url)
    const socket = simulatedWebSocket

    webSocketRef.current = socket
    setStatus("connecting")

    // Simulate connection opening
    setTimeout(() => {
      setStatus("open")
    }, 300)

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close()
      }
    }
  }, [url])

  // Send message function
  const sendMessage = useCallback(
    (message: string | ArrayBuffer) => {
      if (webSocketRef.current && status === "open") {
        webSocketRef.current.send(message)
      } else {
        console.warn("WebSocket is not connected")
      }
    },
    [status],
  )

  return {
    connected: status === "open",
    status,
    sendMessage,
    lastMessage,
    error,
  }
}
