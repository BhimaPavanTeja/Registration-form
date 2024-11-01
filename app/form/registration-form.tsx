"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const registrationFormSchema = z.object({
  fullName: z
    .string({ required_error: "Name is required." })
    .min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z
    .string({ required_error: "Phone number is required." })
    .length(10, { message: "Phone number must be 10 digits." }),
  title: z
    .string({ required_error: "Title is required." })
    .min(2, { message: "Title must be at least 2 characters." }),
  organization: z
    .string({ required_error: "Organization is required." })
    .min(2, { message: "Organization must be at least 2 characters." }),
  areaOfInterest: z.enum([
    "Technology",
    "Entrepreneurship",
    "Innovation",
    "Higher Studies",
    "Content Creation",
    "Management",
  ]),
  expectations: z.string().max(160).min(4),
  paymentId: z
    .string()
    .length(12, "Invalid UTR No. / UPI Ref")
    .regex(/^\d+$/, "Invalid UTR No. / UPI Ref"),
});

const imgUrl = `/1.jpg`;

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const defaultValues: RegistrationFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  title: "",
  organization: "",
  areaOfInterest: "Technology",
  expectations: "",
  paymentId: "",
};

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    console.log(data);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data, null, 2),
      });

      const result = await response.json();
      if (result.success) {
        router.push("/form/result");
      } else {
        console.error("Error submitting form:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} className="border-zinc-300" />
              </FormControl>
              <FormDescription>
                Please enter your full name. This will go on your certificates.
              </FormDescription>
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
                <Input {...field} className="border-zinc-300" />
              </FormControl>
              <FormDescription>
                Please enter your email address. This will be used to send you
                updates.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} className="border-zinc-300" />
              </FormControl>
              <FormDescription>
                Please enter your phone number in 10 digits
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} className="border-zinc-300" />
              </FormControl>
              <FormDescription>
                Please enter your title (founder/employee/student/faculty etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input {...field} className="border-zinc-300" />
              </FormControl>
              <FormDescription>
                Please enter your organization&apos;s name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="areaOfInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area of Interest</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <select 
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-[200px] appearance-none font-normal border-zinc-300"
                    )}
                    {...field}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Higher Studies">Higher Studies</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Management">Management</option>
                  </select>
                </FormControl>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>
                Please select your area of interest.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you expecting from the workshop?</FormLabel>
              <FormControl>
                <Textarea className="border-zinc-300"
                  placeholder="what you're looking forward to learning and/or doing in the workshop?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please enter your expectations from the workshop.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="full  text-center">
          <h3 className="text-md font-medium mb-2 -mt-4">Payment</h3>
          <Image
            width={250}
            height={250}
            src={imgUrl}
            alt=""
            className="mx-auto"
          />
          <p className="text-muted-foreground text-[13px] mt-2">
            Scan the above QR Code with <span className="text-sm font-bold text-green-600">Google Pay</span> and make a payment of{" "}
            <span className="text-sm font-semibold text-blue-600">
              Rs. 649/-
            </span>
          </p>
          <p className="text-gray-500">
            (or pay with)
          </p>
          <FormDescription>
            <span className="font-semibold">UPI ID: </span> 9652724755@ybl 
            <span className="font-semibold ml-2">Number: </span> 9652724755
          </FormDescription>
        </div>
        <FormField
          control={form.control}
          name="paymentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment ID</FormLabel>
              <FormControl>
                <Input {...field} className="border-zinc-300" />
              </FormControl>
              <FormDescription>
                Please enter the UTR No. / UPI Ref no. of the payment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
