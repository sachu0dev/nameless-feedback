"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { ThemeToggleMode } from "@/components/theme/ThemeToggleMode";
import Image from "next/image";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isChekingUsername, setIsChekingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const result = await signIn("google", { redirect: false });
    setIsSubmitting(false);
    if (result?.error) {
      console.log(result?.error);
      toast({
        title: "Login failed",
        description: "Unable to sign in with Google",
        variant: "destructive",
      });
    }
    if (result?.url) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    console.log("username", username);

    const checkUsernameUnique = async () => {
      if (username) {
        setIsChekingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsChekingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace(`/verify/${username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Error signing up";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-slate-950 overflow-x-hidden">
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
            Join Nameless Feedback
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
                      {...field}
                      icon={<Mail size={16} color="#626262" />}
                      className="dark:bg-[#121212] dark:border-[#1B1B1B]   dark:placeholder-[#626262] shadow-inner dark:shadow-[inset_0_2px_2px_rgba(0,0,0,0.6)]"
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isChekingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="lGkKX@example.com"
                      icon={<User size={16} color="#626262" />}
                      className="dark:bg-[#121212] dark:border-[#1B1B1B]   dark:placeholder-[#626262] shadow-inner dark:shadow-[inset_0_2px_2px_rgba(0,0,0,0.6)]"
                      {...field}
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
                      icon={<Lock size={16} color="#626262" />}
                      className="mb-4 dark:bg-[#121212] dark:border-[#1B1B1B]   dark:placeholder-[#626262] shadow-inner dark:shadow-[inset_0_2px_2px_rgba(0,0,0,0.6)]"
                      {...field}
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
                "Sign up"
              )}
            </Button>
            <span className="w-full flex justify-center">or</span>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              variant={"outline"}
              className={`mb-4  w-full bg-[] dark:bg-[#0D0D0D] text-black dark:text-white  font-semibold 
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
                <>
                  <Image
                    src="/logo/google.svg"
                    width={24}
                    height={24}
                    alt="google"
                  />
                  <span className="ml-2">Sign up with Google</span>
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-sm text-[#626262]">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
