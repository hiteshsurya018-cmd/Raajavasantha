"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LocateFixed } from "lucide-react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { TrustProject } from "@/data/projects";
import {
  getProjectDateLabel,
  getProjectLocationLabel,
} from "@/lib/project-format";

type Props = {
  projects: TrustProject[];
};

function MapController({
  projects,
}: {
  projects: TrustProject[];
}) {
  const map = useMap();

  useEffect(() => {
    if (projects.length === 0) return;

    const bounds = L.latLngBounds(
      projects.map((project) => [
        project.latitude as number,
        project.longitude as number,
      ]),
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 10,
    });
  }, [map, projects]);

  return null;
}

function createMarkerIcon() {
  return L.divIcon({
    className: "rajavasantha-map-marker",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 9999px;
        background: #c8a85a;
        border: 3px solid #ffffff;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: #063d2b;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

export function LeafletProjectMap({ projects }: Props) {
  const mappableProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          typeof project.latitude === "number" &&
          typeof project.longitude === "number",
      ),
    [projects],
  );

  const [selectedSlug, setSelectedSlug] = useState(
    mappableProjects[0]?.slug ?? "",
  );

  const selectedProject =
    mappableProjects.find(
      (project) => project.slug === selectedSlug,
    ) ?? null;

  const markerIcon = useMemo(() => createMarkerIcon(), []);

  if (mappableProjects.length === 0) {
    return (
      <div className="flex min-h-[32rem] items-center justify-center bg-forest-deep px-6 text-center text-ivory">
        <div className="max-w-lg">
          <LocateFixed
            className="mx-auto h-10 w-10 text-gold"
            aria-hidden="true"
          />

          <h2 className="mt-5 font-display text-3xl">
            No verified coordinates yet.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-ivory/70">
            The interactive map is ready, but no project records currently
            contain approved latitude and longitude values.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-forest-deep/15">
      <div className="h-[32rem] w-full">
        <MapContainer
          center={[
            mappableProjects[0].latitude as number,
            mappableProjects[0].longitude as number,
          ]}
          zoom={7}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController projects={mappableProjects} />

          {mappableProjects.map((project) => {
            const latitude = project.latitude as number;
            const longitude = project.longitude as number;

            return (
              <Marker
                key={project.slug}
                position={[latitude, longitude]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setSelectedSlug(project.slug),
                }}
              >
                <Popup>
                  <div className="min-w-[220px]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {project.category}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {project.shortDescription}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      <p>
                        <strong>Location:</strong>{" "}
                        {getProjectLocationLabel(project)}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {getProjectDateLabel(project)}
                      </p>
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-forest-deep"
                    >
                      View project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {selectedProject && (
        <div className="border-t border-forest-deep/10 bg-card p-6">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-forest-soft uppercase">
            Selected project
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl text-forest-deep">
                {selectedProject.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {getProjectLocationLabel(selectedProject)}
              </p>
            </div>

            <Link
              href={`/projects/${selectedProject.slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-forest-deep uppercase hover:text-gold"
            >
              View project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}