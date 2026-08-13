"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2 } from "lucide-react";
import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { FIELD_KEYS } from "@/lib/email/field-keys";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().min(5, { message: "Please enter a valid phone number." }),
  address: z.string().min(2, { message: "City/State is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await sendConfirmationEmails({
        formType: "contact",
        submitterEmail: values.email,
        submitterName: values.fullName,
        fields: {
          [FIELD_KEYS.FULL_NAME]: values.fullName,
          [FIELD_KEYS.PHONE_NUMBER]: values.phoneNumber,
          [FIELD_KEYS.CITY_STATE]: values.address,
          [FIELD_KEYS.EMAIL]: values.email,
          [FIELD_KEYS.MESSAGE]: values.message,
        },
      });

      setShowSuccessModal(true);
      form.reset();
    } catch (error) {
      alert("Failed to send message, please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    if (!formRef.current) return;
    const elements = formRef.current.querySelectorAll(":scope > *");
    const tl = gsap.timeline();
    tl.from(elements, {
      y: 40,
      opacity: 0,
      stagger: {
        each: 0.05,
        from: "start",
      },
    });
  }, { scope: formRef });

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-24 relative overflow-hidden">
      {/* Decorative gradient blur in background matches the About Us page */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#a98c4a]/10 to-transparent -z-10 pointer-events-none" />

      <div ref={formRef} className="max-w-3xl mx-auto flex flex-col gap-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#a98c4a]">
            Contact Us
          </h1>
          <div className="w-20 h-1 bg-[#a98c4a] mx-auto rounded-full opacity-80" />
          <p className="text-muted-foreground mt-4 text-lg md:text-xl max-w-xl mx-auto">
            Got a question? We'd love to hear from you! Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 md:p-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-lg">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="bg-black/50 border-white/10 focus-visible:ring-[#a98c4a]/50 text-white text-lg py-6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-lg">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 234 567 8900"
                          type="tel"
                          className="bg-black/50 border-white/10 focus-visible:ring-[#a98c4a]/50 text-white text-lg py-6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-lg">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          className="bg-black/50 border-white/10 focus-visible:ring-[#a98c4a]/50 text-white text-lg py-6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-lg">City/State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Los Angeles, CA"
                          className="bg-black/50 border-white/10 focus-visible:ring-[#a98c4a]/50 text-white text-lg py-6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-lg">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How can we help you?"
                        className="min-h-[150px] resize-none bg-black/50 border-white/10 focus-visible:ring-[#a98c4a]/50 text-white text-lg p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-base" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-[#a98c4a] hover:bg-[#8b733b] text-black font-semibold tracking-wide px-8 text-lg py-6"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Message Sent!
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Thank you for contacting IFFA Awards. We have received your message and will
                respond as soon as possible.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#a98c4a] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#8b733b] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
