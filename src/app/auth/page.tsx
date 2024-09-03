"use client";

import useHttp from "@/hooks/useHttp";
import { ProfileDto } from "@/types/global";
import { getAuth } from "@/utils/get-auth";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { setAuth } from "@/utils/set-auth";

export default function page() {
  const router = useRouter();
  const http = useHttp();
  const [form, setForm] = useState<ProfileDto>({
    email: "",
    password: "",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await http.post<{ name: string; email: string; role: string }>("/v1/auth/sign-in", form);
      const user = {
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };
      setAuth(user);
      if (response.data.role) router.push("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event: any) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    if (getAuth()) router.push("/chat");
  }, []);

  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const username = formData.get("username");
  //   const fullName = formData.get("fullName");
  //   const user = {
  //     username: username as string,
  //     fullName: fullName as string,
  //   };
  //   setAuth(user);
  //   router.push("/chat");
  // };

  return (
    <div className="container py-12">
      <form onSubmit={onSubmit}>
        <Card className="mx-auto flex max-w-lg flex-col gap-1">
          <Label htmlFor="email" value="Email" />
          <TextInput name="email" onChange={onChange} id="email" type="text" placeholder="e.g. johnCena@gmail.com" required />
          <Label htmlFor="password" value="password" />
          <TextInput name="password" onChange={onChange} id="password" type="password" required />
          <Button type="submit">Login</Button>
        </Card>
      </form>
    </div>
  );
}
