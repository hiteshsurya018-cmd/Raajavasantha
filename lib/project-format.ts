import type { TrustProject } from "@/data/projects";

export function getProjectDateLabel(project: TrustProject) {
  if (project.startDate && project.endDate) {
    return `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`;
  }

  if (project.startDate) {
    return `Started ${formatDate(project.startDate)}`;
  }

  return String(project.year);
}

export function getProjectLocationLabel(project: TrustProject) {
  return [project.location, project.district, project.state, project.country]
    .filter(Boolean)
    .join(", ");
}

export function getStatusLabel(status: TrustProject["status"]) {
  const labels: Record<TrustProject["status"], string> = {
    active: "Active",
    completed: "Completed",
    paused: "Paused",
    pending: "Pending verification",
    planning: "Planning",
  };

  return labels[status];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
