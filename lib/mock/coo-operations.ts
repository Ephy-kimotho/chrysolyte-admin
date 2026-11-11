import { isBefore, parseISO, startOfToday } from "date-fns"

import type {
  CreateOfficeTaskFormValues,
  OfficeTask,
} from "@/lib/types/coo-operations"

type StoredOfficeTask = Omit<OfficeTask, "status">

// In-memory stand-in for an office tasks API. Changes last until the page reloads.
let tasks: StoredOfficeTask[] = [
  {
    id: "weekly-cost-report",
    category: "Finance",
    task: "Prepare weekly project cost report",
    owner: "Anne Wambui",
    deadline: "2026-11-13",
    progress: 70,
  },
  {
    id: "staff-statutory-records",
    category: "Administration",
    task: "Update staff files and statutory records",
    owner: "Office Administrator",
    deadline: "2026-11-20",
    progress: 40,
  },
  {
    id: "november-payroll",
    category: "Finance",
    task: "Process November payroll",
    owner: "Anne Wambui",
    deadline: "2026-11-27",
    progress: 10,
  },
  {
    id: "nca-renewal",
    category: "Compliance",
    task: "Renew NCA contractor registration",
    owner: "Peter Otieno",
    deadline: "2026-11-06",
    progress: 60,
  },
  {
    id: "cement-supplier-quotes",
    category: "Procurement",
    task: "Collect three quotes for cement supply to Malaba Suites",
    owner: "James Mwangi",
    deadline: "2026-11-09",
    progress: 100,
  },
]

function withStatus(task: StoredOfficeTask): OfficeTask {
  const status =
    task.progress >= 100
      ? "Completed"
      : isBefore(parseISO(task.deadline), startOfToday())
        ? "Overdue"
        : "Active"
  return { ...task, status }
}

/** The current tasks, synchronously, for seeding the query cache. Soonest deadline first. */
export function getOfficeTasksSnapshot() {
  return [...tasks]
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .map(withStatus)
}

export async function listOfficeTasks() {
  return getOfficeTasksSnapshot()
}

export async function createOfficeTask(data: CreateOfficeTaskFormValues) {
  const task: StoredOfficeTask = {
    id: crypto.randomUUID(),
    category: data.category,
    task: data.task.trim(),
    owner: data.owner.trim(),
    deadline: data.deadline,
    progress: data.progress,
  }
  tasks = [...tasks, task]
  return withStatus(task)
}
