import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signin')({
  component: Signin,
})

function Signin() {
  return <div>Hello "/_auth/sigin-in"!</div>
}
