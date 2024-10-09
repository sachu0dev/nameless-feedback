"use client";

import React, { useState } from "react";
import { Loader2, Star as StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the SDK
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { ThemeToggleMode } from "@/components/theme/ThemeToggleMode";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();

  const [completion, setCompletion] = useState<string>(initialMessageString);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const fixedPrompt = `Create a list of three open-ended and engaging feedback suggestions formatted as a single string. Each suggestion should be separated by '||'. These messages should be suitable for a diverse audience and can cover various aspects of performance, creativity, or improvements. Ensure the suggestions are positive, encouraging, and foster a constructive environment for sharing feedback. For example, your output could be structured like this: 'What aspects of the product do you find most valuable?||How can we improve your experience with our service?||What are some features you would love to see in the future?'. The messages should invite thoughtful responses and contribute to a welcoming dialogue.`;

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(fixedPrompt);
      setCompletion(result.response.text());
    } catch (error) {
      toast({
        title: "Error",
        description: (error as string) ?? "Failed to get suggested messages",
        variant: "destructive",
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      rating: -1,
    },
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (value: number) => {
    form.setValue("rating", value);
  };

  return (
    <div className="relative container mx-auto my-8 p-6 rounded max-w-4xl">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggleMode />
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Send Message</h3>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Star Rating Input */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-center text-xl font-bold tracking-wide">
                      Rate your experience with {username}
                    </FormLabel>
                    <FormControl>
                      <div className="flex space-x-2 justify-center">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <StarIcon
                            key={value}
                            className={`h-6 w-6 cursor-pointer ${
                              (field.value ?? -1) >= value
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                            onClick={() => handleStarClick(value)} // Set the rating on click
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Anonymous Message Input */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading || !messageContent}>
                    Send It
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 whitespace-normal text-center"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
