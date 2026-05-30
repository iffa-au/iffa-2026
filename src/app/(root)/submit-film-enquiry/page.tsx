import React from 'react'
import SubmitFilmEnquiryForm from '@/modules/AboutUs/SubmitFilmEnquiryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Film ',
};

export default function SubmitFilm() {
  return (
    <div>
        <SubmitFilmEnquiryForm />
      
    </div>
  )
}
