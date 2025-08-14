import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <div>Hello "/_dashboard/"!</div>
}
