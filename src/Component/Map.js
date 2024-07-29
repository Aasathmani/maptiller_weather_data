// src/components/MapComponent.js
import React, { useEffect } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilersdk from '@maptiler/sdk';
import * as maptilerweather from '@maptiler/weather';
import { MAPTILER_KEY } from '../config';

const MapComponent = () => {
  useEffect(() => {
    maptilersdk.config.apiKey = MAPTILER_KEY;

    const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.BACKDROP,
      zoom: 1,
      center: [-15.5, 15.2],
      hash: true,
    });

    const timeTextDiv = document.getElementById("time-text");
    const pointerDataDiv = document.getElementById("pointer-data");
    let pointerLngLat = null;

    const weatherLayer = new maptilerweather.PressureLayer({
      opacity: 0.8,
    });

    weatherLayer.on("tick", () => {
      refreshTime();
      updatePointerValue(pointerLngLat);
    });

    map.on('load', () => {
      map.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.4)");
      map.addLayer(weatherLayer, 'Water');
      weatherLayer.animateByFactor(3600);
    });

    map.on('mouseout', (evt) => {
      if (!evt.originalEvent.relatedTarget) {
        pointerDataDiv.innerText = "";
        pointerLngLat = null;
      }
    });

    function refreshTime() {
      const d = weatherLayer.getAnimationTimeDate();
      timeTextDiv.innerText = d.toString();
    }

    function updatePointerValue(lngLat) {
      if (!lngLat) return;
      pointerLngLat = lngLat;
      const value = weatherLayer.pickAt(lngLat.lng, lngLat.lat);
      if (!value) {
        pointerDataDiv.innerText = "";
        return;
      }
      pointerDataDiv.innerText = `${value.value.toFixed(1)} hPa`;
    }

    map.on('mousemove', (e) => {
      updatePointerValue(e.lngLat);
    });
  }, []);

  return (
    <>
      <div id="time-info">
        <span id="time-text"></span>
      </div>
      <div id="variable-name">Pressure</div>
      <div id="pointer-data"></div>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    </>
  );
};

export default MapComponent;