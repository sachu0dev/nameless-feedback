"use client";
import { ThemeToggleMode } from "@/components/theme/ThemeToggleMode";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "sushil",
      password: "123456",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    setIsSubmitting(false);
    if (result?.error) {
      console.log(result?.error);
      toast({
        title: "Login failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-slate-950">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggleMode />
      </div>
      <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>

      <div className="w-full max-w-md p-8 m-8 space-y-8 bg-white dark:bg-[#191919] rounded-lg shadow-md dark:shadow-l dark:shadow-slate-950">
        <div className="text-center flex w-full items-center flex-col">
          <Image
            src="/logo/namelessDark.png"
            alt="Nameless Feedback"
            width={180}
            height={180}
            className="w-[150px] h-[150px] dark:invert"
          />
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">
            Welcome Back
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="lGkKX@example.com"
                      {...field}
                      icon={<Mail size={16} color="#626262" />}
                      className="dark:bg-[#121212] dark:border-[#1B1B1B]   dark:placeholder-[#626262] shadow-inner dark:shadow-[inset_0_2px_2px_rgba(0,0,0,0.6)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      icon={<Lock size={16} color="#626262" />}
                      className="mb-4 dark:bg-[#121212] dark:border-[#1B1B1B]   dark:placeholder-[#626262] shadow-inner dark:shadow-[inset_0_2px_2px_rgba(0,0,0,0.6)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`mb-4 bg-[#0173DC] w-full dark:bg-[#005bb5] dark:text-white text-white font-semibold 
              py-2 px-4 rounded-lg transition-all duration-200 transform 
              shadow-[0_4px_6px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.1)] 
              hover:shadow-[0_6px_8px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.2)] 
              active:translate-y-1 active:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.1)]`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-sm text-[#626262]">
            Don&lsquo;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
