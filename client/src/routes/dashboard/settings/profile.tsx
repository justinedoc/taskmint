import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard/settings/profile")({
  component: ProfileForm,
});

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  fullname: z
    .string()
    .min(2, { message: "Fullname must be at least 2 characters." })
    .max(60, { message: "Fullname must not be longer than 60 characters." }),
  email: z.email({ error: "Please enter an email." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data, isLoading, isError } = useUser();
  const user = data?.data;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      });
    }
  }, [user, form]);

  function onSubmit(data: ProfileFormValues) {
    console.log("Submitted data:", data);
    alert(JSON.stringify(data, null, 2));
  }

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (isError || !user) {
    return <div>Could not load user profile.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input placeholder="Your fullname" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email" {...field} />
                </FormControl>
                <FormDescription>
                  We will use this email for notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  );
}
