"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LocateFixed, MapPin, Search } from "lucide-react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, MapGeoJSONFeature, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapFeatureCollection, MapProperties } from "@/lib/geography";

const INDIA_CENTER: [number, number] = [78.9629, 22.5937];
const SOURCE_ID = "impact-locations";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}

export function MapLibreImpactMap({ data }: { data: MapFeatureCollection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const filteredRef = useRef<MapFeatureCollection>(data);
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<MapProperties[]>(() => [...new Map(data.features.map((item) => [item.properties.projectId, item.properties])).values()]);
  const categories = useMemo(() => [...new Set(data.features.map((item) => item.properties.category).filter(Boolean))].sort(), [data]);
  const years = useMemo(() => [...new Set(data.features.map((item) => item.properties.year).filter((value): value is number => value !== null))].sort((a, b) => b - a), [data]);
  const filtered = useMemo<MapFeatureCollection>(() => {
    const needle = query.trim().toLowerCase();
    return { ...data, features: data.features.filter(({ properties }) =>
      (category === "all" || properties.category === category) &&
      (year === "all" || String(properties.year) === year) &&
      (!needle || [properties.title, properties.location, properties.category].join(" ").toLowerCase().includes(needle))
    ) };
  }, [category, data, query, year]);

  filteredRef.current = filtered;
  const updateVisible = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    const properties = filteredRef.current.features.filter(({ geometry }) => bounds.contains(geometry.coordinates as [number, number])).map((item) => item.properties);
    setVisible([...new Map(properties.map((item) => [item.projectId, item])).values()]);
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: INDIA_CENTER,
      zoom: 3.5,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => {
      map.addSource(SOURCE_ID, { type: "geojson", data, cluster: true, clusterMaxZoom: 13, clusterRadius: 56 });
      map.addLayer({ id: "clusters", type: "circle", source: SOURCE_ID, filter: ["has", "point_count"], paint: {
        "circle-color": ["step", ["get", "point_count"], "#c8a85a", 10, "#a8873e", 50, "#073b24"],
        "circle-radius": ["step", ["get", "point_count"], 20, 10, 26, 50, 34],
        "circle-stroke-width": 2, "circle-stroke-color": "#fffaf0",
      }});
      map.addLayer({ id: "cluster-count", type: "symbol", source: SOURCE_ID, filter: ["has", "point_count"], layout: {
        "text-field": ["get", "point_count_abbreviated"], "text-size": 13,
      }, paint: { "text-color": "#fffaf0" }});
      map.addLayer({ id: "individual-locations", type: "circle", source: SOURCE_ID, filter: ["!", ["has", "point_count"]], paint: {
        "circle-color": "#073b24", "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 7, 14, 12],
        "circle-stroke-width": 3, "circle-stroke-color": "#c8a85a",
      }});
      map.on("click", "clusters", async (event) => {
        const feature = map.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0];
        const clusterId = Number(feature?.properties?.cluster_id);
        const source = map.getSource(SOURCE_ID) as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
      });
      map.on("click", "individual-locations", (event) => {
        const feature = event.features?.[0] as MapGeoJSONFeature | undefined;
        if (!feature || feature.geometry.type !== "Point") return;
        const properties = feature.properties as MapProperties;
        const image = properties.thumbnail ? `<img src="${escapeHtml(properties.thumbnail)}" alt="" style="width:100%;height:110px;object-fit:cover;margin-bottom:10px" />` : "";
        new maplibregl.Popup({ offset: 16, maxWidth: "290px" }).setLngLat(feature.geometry.coordinates as [number, number]).setHTML(
          `<article>${image}<p style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8b6e28">${escapeHtml(properties.category)}</p><h3 style="font:600 20px Georgia,serif;margin:4px 0;color:#073b24">${escapeHtml(properties.title)}</h3><p style="font-size:13px;color:#52615a">${escapeHtml(properties.location)} · ${properties.photoCount} photos</p><a href="/projects/${encodeURIComponent(properties.slug)}" style="display:inline-block;margin-top:10px;font-size:12px;font-weight:700;color:#073b24">View project →</a></article>`
        ).addTo(map);
      });
      for (const layer of ["clusters", "individual-locations"]) {
        map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
      }
      map.on("moveend", updateVisible);
      const params = new URLSearchParams(window.location.search);
      const longitude = Number(params.get("lng")); const latitude = Number(params.get("lat")); const zoom = Number(params.get("zoom"));
      const selectedProject = params.get("project");
      const selectedFeature = selectedProject ? data.features.find((item) => item.properties.projectId === selectedProject || item.properties.slug === selectedProject) : undefined;
      if (selectedFeature) map.jumpTo({ center: selectedFeature.geometry.coordinates as [number, number], zoom: 14 });
      else if (Number.isFinite(longitude) && Number.isFinite(latitude)) map.jumpTo({ center: [longitude, latitude], zoom: Number.isFinite(zoom) ? zoom : 14 });
      else if (data.features.length) {
        const bounds = new maplibregl.LngLatBounds();
        data.features.forEach((item) => bounds.extend(item.geometry.coordinates as [number, number]));
        map.fitBounds(bounds, { padding: 70, maxZoom: 11 });
      }
      updateVisible();
    });
    return () => { map.remove(); mapRef.current = null; };
  }, [data, updateVisible]);

  useEffect(() => {
    const source = mapRef.current?.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    source?.setData(filtered);
    updateVisible();
  }, [filtered, updateVisible]);

  function locateVisitor() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => mapRef.current?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 12 }), () => undefined, { enableHighAccuracy: false, timeout: 8000 });
  }

  if (!data.features.length) return <EmptyMap />;
  return (
    <section className="bg-ivory pb-20">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <label className="relative"><span className="sr-only">Search locations and projects</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations, projects..." className="h-12 w-full border border-forest-deep/15 bg-white pl-11 pr-4 text-sm" /></label>
          <select aria-label="Filter category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 border border-forest-deep/15 bg-white px-4 text-sm"><option value="all">All focus areas</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Filter year" value={year} onChange={(event) => setYear(event.target.value)} className="h-12 border border-forest-deep/15 bg-white px-4 text-sm"><option value="all">All years</option>{years.map((item) => <option key={item}>{item}</option>)}</select>
          <button type="button" onClick={locateVisitor} className="inline-flex h-12 items-center justify-center gap-2 border border-forest-deep/20 px-4 text-sm font-semibold text-forest-deep"><LocateFixed className="h-4 w-4 text-gold" />Locate me</button>
        </div>
        <div className="relative overflow-hidden border border-forest-deep/15 bg-forest-deep">
          <div ref={containerRef} className="h-[62vh] min-h-[30rem] w-full lg:h-[68vh]" aria-label="Interactive map of public Rajavasantha project locations" />
          <div className="absolute bottom-4 left-4 z-10 bg-forest-deep/95 px-4 py-3 text-ivory shadow-xl"><strong>{visible.length}</strong> {visible.length === 1 ? "activity" : "activities"} in this area</div>
        </div>
        <div className="mt-8" aria-live="polite">
          <p className="eyebrow">Projects in this area</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.slice(0, 9).map((project) => <Link key={project.id} href={`/projects/${project.slug}`} className="flex items-center gap-3 border border-forest-deep/10 bg-white p-4 hover:border-gold"><MapPin className="h-5 w-5 shrink-0 text-gold" /><span><strong className="block font-display text-lg text-forest-deep">{project.title}</strong><span className="text-xs text-muted-foreground">{project.location}</span></span></Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyMap() {
  return <section className="bg-ivory px-5 pb-20"><div className="mx-auto max-w-[80rem] border border-forest-deep/15 bg-card px-6 py-20 text-center"><MapPin className="mx-auto h-10 w-10 text-gold" /><h2 className="mt-5 font-display text-4xl text-forest-deep">Our map is growing.</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">As Rajavasantha activities are documented and their locations are approved for public display, they will appear here.</p><Link href="/projects" className="mt-8 inline-flex bg-forest-deep px-6 py-3 text-sm font-semibold text-ivory">Explore projects</Link></div></section>;
}
