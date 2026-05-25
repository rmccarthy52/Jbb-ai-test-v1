import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet's default icon asset resolution breaks with bundlers; supply manually.
const blueIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:   [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const goldIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px; height:18px;
    background:#F59E0B;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 6px rgba(0,0,0,0.5);
  "></div>`,
  iconSize:   [18, 18],
  iconAnchor: [9, 9],
})

const NYC_CENTER = [40.73, -74.0]
const NYC_ZOOM   = 11

export default function MapCanvas({ onGuess, guessLatLng, correctLatLng, submitted }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const guessMarker  = useRef(null)
  const correctMarker = useRef(null)
  const polylineRef  = useRef(null)

  // Init map once
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map(containerRef.current, {
      center: NYC_CENTER,
      zoom: NYC_ZOOM,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Click-to-guess handler (only when not submitted)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    function handleClick(e) {
      if (submitted) return
      onGuess({ lat: e.latlng.lat, lng: e.latlng.lng })
    }

    map.on('click', handleClick)
    return () => map.off('click', handleClick)
  }, [submitted, onGuess])

  // Update guess marker
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (guessMarker.current) {
      guessMarker.current.remove()
      guessMarker.current = null
    }

    if (guessLatLng) {
      guessMarker.current = L.marker([guessLatLng.lat, guessLatLng.lng], { icon: blueIcon })
        .addTo(map)
    }
  }, [guessLatLng])

  // Show correct marker + polyline after submission
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (correctMarker.current) {
      correctMarker.current.remove()
      correctMarker.current = null
    }
    if (polylineRef.current) {
      polylineRef.current.remove()
      polylineRef.current = null
    }

    if (submitted && correctLatLng && guessLatLng) {
      correctMarker.current = L.marker([correctLatLng.lat, correctLatLng.lng], { icon: goldIcon })
        .addTo(map)

      polylineRef.current = L.polyline(
        [
          [guessLatLng.lat, guessLatLng.lng],
          [correctLatLng.lat, correctLatLng.lng],
        ],
        { color: '#F59E0B', weight: 2, dashArray: '6 6', opacity: 0.8 }
      ).addTo(map)

      // Fit both markers in view
      const bounds = L.latLngBounds(
        [guessLatLng.lat, guessLatLng.lng],
        [correctLatLng.lat, correctLatLng.lng],
      )
      map.fitBounds(bounds.pad(0.3))
    }
  }, [submitted, correctLatLng, guessLatLng])

  // Reset map view between rounds (when guess is cleared)
  useEffect(() => {
    const map = mapRef.current
    if (!map || guessLatLng) return
    map.setView(NYC_CENTER, NYC_ZOOM)
  }, [guessLatLng])

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        minHeight: 0,
        cursor: submitted ? 'default' : 'crosshair',
      }}
    />
  )
}
