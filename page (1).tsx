import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { RegistrationForm } from "@/components/register/registration-form"

export default function RegisterPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <RegistrationForm />
      </div>
    </div>
  )
}
