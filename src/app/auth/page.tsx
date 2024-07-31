"use client";

import { getAuth } from "@/utils/get-auth";
import { setAuth } from "@/utils/set-auth";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const router = useRouter();
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const fullName = formData.get("fullName");
    const user = {
      username: username as string,
      fullName: fullName as string,
    };
    setAuth(user);
    router.push("/chat");
  };

  useEffect(() => {
    if (getAuth()) router.push("/chat");
  }, []);

  return (
    <div className="container py-12">
      <form onSubmit={onSubmit}>
        <Card className="mx-auto flex max-w-lg flex-col gap-1">
          <Label htmlFor="Full Name" value="Full Name" />
          <TextInput name="fullName" id="Full Name" type="text" placeholder="e.g. John Cena" required />
          <Label htmlFor="Username" value="Username" />
          <TextInput name="username" id="Username" type="text" placeholder="e.g. johncena" required />
          <Button type="submit">Get In Chat</Button>
        </Card>
      </form>
    </div>
  );
}
