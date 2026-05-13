import React from 'react'
import { SubmitFilmForm } from '@/modules/AboutUs/SubmitFilmForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Film ',
};

export default function SubmitFilm() {
  return (
    <div>
        <SubmitFilmForm />
      
    </div>
  )
}
