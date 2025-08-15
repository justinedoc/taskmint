import ForgotPasswordForm from "@/components/auth/forgot-password/forgot-password-form";
import FormOTP from "@/components/auth/opt-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export type FormTabs = "form-details" | "form-otp";

export default function ForgotPasswordTab() {
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
        <ForgotPasswordForm onHandleTabSwitch={handleTabSwitch} />
      </TabsContent>

      <TabsContent value="form-otp">
        <FormOTP />
      </TabsContent>
    </Tabs>
  );
}
