"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface WebRTCOptions {
  roomId: string
  userId: string
  userName: string
  role: string
  onRemoteStream: (stream: MediaStream, userId: string) => void
  onUserDisconnected: (userId: string) => void
}

interface PeerConnection {
  userId: string
  connection: RTCPeerConnection
  stream?: MediaStream
}

export function useWebRTC({ roomId, userId, userName, role, onRemoteStream, onUserDisconnected }: WebRTCOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitiator, setIsInitiator] = useState(role === "doctor")
  const [peers, setPeers] = useState<PeerConnection[]>([])

  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const localStreamRef = useRef<MediaStream | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize media devices
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)
      localStreamRef.current = stream
      setIsConnected(true)
      return stream
    } catch (err: any) {
      console.error("Error accessing media devices:", err)
      setError(`Failed to access camera/microphone: ${err.message}`)
      return null
    }
  }, [])

  // Create a peer connection
  const createPeerConnection = useCallback(
    (targetUserId: string) => {
      try {
        const configuration = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
        }

        const peerConnection = new RTCPeerConnection(configuration)

        // Add local tracks to the connection
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStreamRef.current!)
          })
        }

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal({
              type: "ice-candidate",
              candidate: event.candidate,
              userId,
              targetUserId,
            })
          }
        }

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
            handlePeerDisconnect(targetUserId)
          }
        }

        // Handle remote tracks
        peerConnection.ontrack = (event) => {
          const remoteStream = new MediaStream()
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
          })
          onRemoteStream(remoteStream, targetUserId)
        }

        // Store the connection
        peerConnectionsRef.current.set(targetUserId, peerConnection)
        setPeers((prev) => [...prev, { userId: targetUserId, connection: peerConnection }])

        return peerConnection
      } catch (err) {
        console.error("Error creating peer connection:", err)
        setError("Failed to create peer connection")
        return null
      }
    },
    [userId, onRemoteStream],
  )

  // Send a signal to the server
  const sendSignal = useCallback(
    async (signal: any) => {
      try {
        await fetch("/api/rtc/signal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId,
            signal,
            targetUserId: signal.targetUserId,
          }),
        })
      } catch (err) {
        console.error("Error sending signal:", err)
      }
    },
    [roomId],
  )

  // Handle incoming signals
  const handleSignal = useCallback(
    async (signal: any) => {
      try {
        const { type, userId: senderId, targetUserId, candidate, sdp } = signal

        // Ignore our own signals
        if (senderId === userId) return

        // Handle different signal types
        switch (type) {
          case "join":
            // Someone joined, initiate connection if we're the initiator
            if (isInitiator) {
              const peerConnection = createPeerConnection(senderId)
              if (peerConnection) {
                const offer = await peerConnection.createOffer()
                await peerConnection.setLocalDescription(offer)
                sendSignal({
                  type: "offer",
                  sdp: peerConnection.localDescription,
                  userId,
                  targetUserId: senderId,
                })
              }
            }
            break

          case "offer":
            // Received an offer, create answer
            let peerConnection = peerConnectionsRef.current.get(senderId)
            if (!peerConnection) {
              peerConnection = createPeerConnection(senderId)
            }

            if (peerConnection) {
              await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
              const answer = await peerConnection.createAnswer()
              await peerConnection.setLocalDescription(answer)
              sendSignal({
                type: "answer",
                sdp: peerConnection.localDescription,
                userId,
                targetUserId: senderId,
              })
            }
            break

          case "answer":
            // Received an answer to our offer
            const existingPeerConnection = peerConnectionsRef.current.get(senderId)
            if (existingPeerConnection) {
              await existingPeerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
            }
            break

          case "ice-candidate":
            // Add ICE candidate
            const peerWithCandidate = peerConnectionsRef.current.get(senderId)
            if (peerWithCandidate) {
              await peerWithCandidate.addIceCandidate(new RTCIceCandidate(candidate))
            }
            break

          case "leave":
            // Peer left, clean up
            handlePeerDisconnect(senderId)
            break
        }
      } catch (err) {
        console.error("Error handling signal:", err)
      }
    },
    [userId, isInitiator, createPeerConnection, sendSignal],
  )

  // Poll for signals
  const pollSignals = useCallback(async () => {
    try {
      const response = await fetch(`/api/rtc/get-signals?roomId=${roomId}`)
      const data = await response.json()

      if (data.success && data.signals) {
        for (const signal of data.signals) {
          await handleSignal(signal.signal_data)
        }
      }
    } catch (err) {
      console.error("Error polling signals:", err)
    }
  }, [roomId, handleSignal])

  // Handle peer disconnect
  const handlePeerDisconnect = useCallback(
    (peerId: string) => {
      const peerConnection = peerConnectionsRef.current.get(peerId)
      if (peerConnection) {
        peerConnection.close()
        peerConnectionsRef.current.delete(peerId)
        setPeers((prev) => prev.filter((p) => p.userId !== peerId))
        onUserDisconnected(peerId)
      }
    },
    [onUserDisconnected],
  )

  // Join the room
  const joinRoom = useCallback(async () => {
    try {
      // Initialize media
      const stream = await initializeMedia()
      if (!stream) return

      // Send join signal
      await sendSignal({
        type: "join",
        userId,
        userName,
        role,
      })

      // Start polling for signals
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
      pollingIntervalRef.current = setInterval(pollSignals, 1000)
    } catch (err) {
      console.error("Error joining room:", err)
      setError("Failed to join room")
    }
  }, [userId, userName, role, initializeMedia, sendSignal, pollSignals])

  // Leave the room
  const leaveRoom = useCallback(async () => {
    try {
      // Send leave signal
      await sendSignal({
        type: "leave",
        userId,
      })

      // Close all peer connections
      peerConnectionsRef.current.forEach((connection) => {
        connection.close()
      })
      peerConnectionsRef.current.clear()
      setPeers([])

      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop()
        })
      }
      setLocalStream(null)
      localStreamRef.current = null

      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      setIsConnected(false)
    } catch (err) {
      console.error("Error leaving room:", err)
    }
  }, [userId, sendSignal])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioEnabled(audioTracks[0]?.enabled ?? false)
    }
  }, [])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled(videoTracks[0]?.enabled ?? false)
    }
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      leaveRoom()
    }
  }, [leaveRoom])

  return {
    localStream,
    isConnected,
    isAudioEnabled,
    isVideoEnabled,
    error,
    peers,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
  }
}
