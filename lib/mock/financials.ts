import { getProjectsSnapshot } from "@/lib/mock/projects"
import { getWeeklyWagesDue } from "@/lib/mock/wages"
import type {
  CreateTransactionFormValues,
  Financials,
  FinancialTransaction,
} from "@/lib/types/financials"

type StoredTransaction = Omit<FinancialTransaction, "projectName">

// In-memory stand-in for a financials API. Changes last until the page reloads.
// Budgets and contract types come from the projects.
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
      const projectTransactions = transactions.filter(
        (item) => item.projectId === project.id
      )
      const clientPaid = sumAmounts(
        projectTransactions.filter((item) => item.type === "Client receipt")
      )
      const recordedCosts = sumAmounts(
        projectTransactions.filter((item) => item.type === "Project cost")
      )

      return {
        projectId: project.id,
        code: project.code,
        name: project.name,
        contractType: project.contractType,
        budget: project.budget,
        clientPaid,
        recordedCosts,
        // Net wages due this Friday, from the site wage projection.
        weeklyWagesDue: getWeeklyWagesDue(project.id),
        budgetRemaining: project.budget - recordedCosts,
        clientBalance: project.budget - clientPaid,
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
