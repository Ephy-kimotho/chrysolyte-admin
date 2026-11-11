import { getProjectsSnapshot } from "@/lib/mock/projects"
import type {
  ContractType,
  CreateTransactionFormValues,
  Financials,
  FinancialTransaction,
} from "@/lib/types/financials"

type StoredTransaction = Omit<FinancialTransaction, "projectName">

type ProjectContract = {
  contractType: ContractType
  budget: number
  weeklyWagesDue: number
}

// In-memory stand-in for a financials API. Changes last until the page reloads.
// Figures match the board analysis mock.
const contracts: Record<string, ProjectContract> = {
  "kilimani-residence": {
    contractType: "Full Contract",
    budget: 12_500_000,
    weeklyWagesDue: 26_200,
  },
  "westlands-corporate-office": {
    contractType: "Design Only",
    budget: 3_800_000,
    weeklyWagesDue: 0,
  },
  "malaba-suites": {
    contractType: "Full Contract",
    budget: 18_000_000,
    weeklyWagesDue: 0,
  },
}

let transactions: StoredTransaction[] = [
  {
    id: "kilimani-mobilisation",
    date: "2026-07-05",
    projectId: "kilimani-residence",
    type: "Client receipt",
    description: "Mobilisation payment",
    amount: 4_200_000,
  },
  {
    id: "kilimani-cement",
    date: "2026-08-02",
    projectId: "kilimani-residence",
    type: "Project cost",
    description: "Cement and reinforcement",
    amount: 1_250_000,
  },
  {
    id: "kilimani-labour",
    date: "2026-08-05",
    projectId: "kilimani-residence",
    type: "Project cost",
    description: "Labour and site welfare",
    amount: 420_000,
  },
  {
    id: "westlands-deposit",
    date: "2026-09-10",
    projectId: "westlands-corporate-office",
    type: "Client receipt",
    description: "Design fee deposit",
    amount: 1_900_000,
  },
  {
    id: "westlands-survey",
    date: "2026-09-28",
    projectId: "westlands-corporate-office",
    type: "Project cost",
    description: "Topographical survey",
    amount: 180_000,
  },
  {
    id: "westlands-structural",
    date: "2026-10-14",
    projectId: "westlands-corporate-office",
    type: "Project cost",
    description: "Structural engineering consultant",
    amount: 240_000,
  },
  {
    id: "malaba-mobilisation",
    date: "2026-10-22",
    projectId: "malaba-suites",
    type: "Client receipt",
    description: "Mobilisation payment",
    amount: 2_700_000,
  },
]

function sumAmounts(items: StoredTransaction[]) {
  return items.reduce((total, item) => total + item.amount, 0)
}

/** Per-project totals are derived from the transactions so they always agree. */
export function getFinancialsSnapshot(): Financials {
  const projects = getProjectsSnapshot()

  return {
    projects: projects.map((project) => {
      const contract = contracts[project.id]
      const projectTransactions = transactions.filter(
        (item) => item.projectId === project.id
      )
      const clientPaid = sumAmounts(
        projectTransactions.filter((item) => item.type === "Client receipt")
      )
      const recordedCosts = sumAmounts(
        projectTransactions.filter((item) => item.type === "Project cost")
      )
      const budget = contract?.budget ?? null

      return {
        projectId: project.id,
        code: project.code,
        name: project.name,
        contractType: contract?.contractType ?? null,
        budget,
        clientPaid,
        recordedCosts,
        weeklyWagesDue: contract?.weeklyWagesDue ?? 0,
        budgetRemaining: budget === null ? null : budget - recordedCosts,
        clientBalance: budget === null ? null : budget - clientPaid,
      }
    }),
    transactions: transactions
      .map((item) => ({
        ...item,
        projectName:
          projects.find((project) => project.id === item.projectId)?.name ??
          "Removed project",
      }))
      // Oldest first; ISO dates sort as text.
      .sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export async function getFinancials() {
  return getFinancialsSnapshot()
}

export async function createTransaction(data: CreateTransactionFormValues) {
  const transaction: StoredTransaction = {
    id: crypto.randomUUID(),
    date: data.date,
    projectId: data.projectId,
    type: data.type,
    description: data.description,
    amount: data.amount,
  }
  transactions = [...transactions, transaction]
  return transaction
}
