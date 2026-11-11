import { getProjectsSnapshot } from "@/lib/mock/projects"
import { getStaffSnapshot } from "@/lib/mock/staff"
import type {
  CreateSiteInstructionFormValues,
  SiteInstruction,
} from "@/lib/types/consultants"

type StoredSiteInstruction = Omit<
  SiteInstruction,
  "projectName" | "responsibleName"
>

// In-memory stand-in for a site instructions API. Changes last until the page reloads.
let instructions: StoredSiteInstruction[] = [
  {
    id: "kilimani-window-b3",
    date: "2026-08-05",
    projectId: "kilimani-residence",
    discipline: "Site Engineer",
    issuer: "Eng. Njoroge",
    instruction:
      "Revise the window opening at Grid B3 to match the approved architectural detail.",
    responsibleStaffId: "peter-mwangi",
    deadline: "2026-08-08",
    status: "Open",
  },
]

export function getSiteInstructionsSnapshot(): SiteInstruction[] {
  const projects = getProjectsSnapshot()
  const staff = getStaffSnapshot()

  return (
    instructions
      .map((item) => ({
        ...item,
        projectName:
          projects.find((project) => project.id === item.projectId)?.name ??
          "Removed project",
        responsibleName:
          staff.find((member) => member.id === item.responsibleStaffId)
            ?.fullName ?? "Former staff member",
      }))
      // Oldest first; ISO dates sort as text.
      .sort((a, b) => a.date.localeCompare(b.date))
  )
}

export async function listSiteInstructions() {
  return getSiteInstructionsSnapshot()
}

export async function createSiteInstruction(
  data: CreateSiteInstructionFormValues
) {
  const instruction: StoredSiteInstruction = {
    id: crypto.randomUUID(),
    ...data,
    status: "Open",
  }
  instructions = [...instructions, instruction]
  return instruction
}
