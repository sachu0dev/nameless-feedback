"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Github, MoveUpRight } from "lucide-react";
import Link from "next/link";

const HomePageButtons = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="flex space-x-4">
      <Link
        href="https://github.com/sachu0dev/nameless-feedback"
        target="_blank"
      >
        <Button
          variant={"default"}
          size={"lg"}
          className="mt-4 flex-1 space-x-2"
        >
          <Github className="h-5 w-5" />
          <span>Code</span>
        </Button>
      </Link>
      {session && session.user ? (
        <Button
          variant={"outline"}
          size={"lg"}
          className="mt-4 flex-1 space-x-2"
          onClick={() => router.push("/dashboard")}
        >
          <span>Dashboard</span>
          <MoveUpRight className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant={"outline"}
          size={"lg"}
          className="mt-4 flex-1 space-x-2"
          onClick={() => router.push("/signup")}
        >
          <span>Sign Up</span>
          <MoveUpRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default HomePageButtons;
