"use client";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Clipboard, Link, Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CopyBlock, dracula } from "react-code-blocks";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [isHtml, setIsHtml] = useState<boolean>(true);
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message acceptance status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) return <div>Please login</div>;

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied to clipboard",
      description: "Profile URL copied to clipboard",
    });
  };

  // Define HtmlData and JsxData inside the component
  const HtmlData = {
    code: `<iframe src="\`http://localhost:5000/embed/feedback?username=${username}\`" width="100%" height="500px" style="border:none;"></iframe>`,
    language: "html",
    showLineNumbers: true,
  };

  const JsxData = {
    step1: {
      code: `import React from 'react';
      
const FeedbackEmbed = () => {
    return (
        <iframe
            title="User Feedback"
            src={\`http://localhost:5000/embed/feedback?username=${username}\`}
            width="100%"
            height="500"
            style={{ border: 'none' }}
            allowFullScreen
        />
    );
};

export default FeedbackEmbed;
`,
      language: "jsx",
      showLineNumbers: true,
    },
    step2: {
      code: `<FeedbackEmbed />`,
      language: "jsx",
      showLineNumbers: true,
    },
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl border">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full pr-2 py-2 mr-2 bg-slate-100 dark:bg-slate-800 rounded-md"
            icon={<Link size={16} />}
          />
          <Button onClick={copyToClipboard}>
            <Clipboard size={16} className={"mr-2"} />
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <div className="my-4">
        <h1 className="text-2xl font-bold mb-4">
          Display Feedback on Your Website
        </h1>
        <p>
          You can embed feedback on your website in two ways: by using a simple
          HTML iframe or by integrating it into a React component. Follow the
          steps below to add feedback to your project.
        </p>

        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl border">
          <div className="w-full flex justify-center">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded m-5 p-1 gap-2">
              <div
                className={`bg-slate-200 dark:bg-slate-700 px-2 rounded w-[60px] flex justify-center items-center cursor-pointer ${
                  isHtml ? "font-bold" : "opacity-50"
                }`}
                onClick={() => setIsHtml(true)}
              >
                HTML
              </div>
              <div
                className={`bg-slate-200 dark:bg-slate-700 px-2 rounded w-[60px] flex justify-center items-center cursor-pointer ${
                  !isHtml ? "font-bold" : "opacity-50"
                }`}
                onClick={() => setIsHtml(false)}
              >
                JSX
              </div>
            </div>
          </div>

          {isHtml ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Step-by-Step Instructions for HTML
              </h2>
              <p>
                If you prefer to add feedback using HTML, follow these steps:
              </p>
              <ol className="list-decimal list-inside mb-4">
                <li>
                  Copy the HTML code below and paste it into the desired
                  location in your HTML file where you want the feedback to
                  appear.
                </li>
                <li>
                  Ensure that your website is able to embed the feedback by
                  adjusting any iframe restrictions.
                </li>
              </ol>

              <CopyBlock
                text={HtmlData.code}
                language={HtmlData.language}
                showLineNumbers={HtmlData.showLineNumbers}
                theme={dracula}
                wrapLongLines={true}
              />
              <p className="mt-4">
                Once you add this code to your website, the feedback section
                will be embedded and visible wherever you place it.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Step-by-Step Instructions for React
              </h2>
              <p>
                If you're using React, follow these steps to embed the feedback
                component:
              </p>
              <ol className="list-decimal list-inside mb-4">
                <li>
                  Create a new React component called <code>FeedbackEmbed</code>{" "}
                  that will be used to display the feedback.
                </li>
                <li>
                  Copy and paste the following code into your new{" "}
                  <code>FeedbackEmbed.js</code> or <code>.tsx</code> file:
                </li>
              </ol>

              <CopyBlock
                text={JsxData.step1.code}
                language={JsxData.step1.language}
                showLineNumbers={JsxData.step1.showLineNumbers}
                theme={dracula}
                wrapLongLines={true}
              />

              <p className="mt-4">
                Once you’ve created the <code>FeedbackEmbed</code> component,
                you can now use it in your main React file. Here's how you can
                use the component:
              </p>

              <CopyBlock
                text={JsxData.step2.code}
                language={JsxData.step2.language}
                showLineNumbers={JsxData.step2.showLineNumbers}
                theme={dracula}
                wrapLongLines={true}
              />

              <p className="mt-4">
                Now, the feedback section will be embedded in your React
                application wherever you use the <code>FeedbackEmbed</code>{" "}
                component.
              </p>
            </div>
          )}
        </div>
      </div>

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
