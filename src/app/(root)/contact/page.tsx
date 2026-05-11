import React from 'react'
import ContactPage from '@/modules/contact/ContactPage';
import { Metadata } from 'next';    

export const metadata: Metadata = {
  title: "Contact Us | iffa",
  description: "Get in touch with us for any inquiries or support.",
};

function page() {
  return (
    <div>
        <ContactPage />
    </div>
  )
}

export default page
