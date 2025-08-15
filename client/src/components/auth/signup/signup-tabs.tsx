import FormOTP from "@/components/auth/opt-tab";
import SignupForm from "@/components/auth/signup/signup-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export type FormTabs = "form-details" | "form-otp";

export default function SignUpFormTabs() {
  const [tab, setTab] = useState<FormTabs>("form-details");

  function handleTabSwitch(value: FormTabs) {
    setTab(value);
  }

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as FormTabs)}>
      <TabsList className="hidden">
        <TabsTrigger value="form-details">Form Details</TabsTrigger>
        <TabsTrigger value="form-otp">Form OTP</TabsTrigger>
      </TabsList>

      <TabsContent value="form-details">
        <SignupForm onHandleTabSwitch={handleTabSwitch} />
      </TabsContent>

      <TabsContent value="form-otp">
        <FormOTP />
      </TabsContent>
    </Tabs>
  );
}
