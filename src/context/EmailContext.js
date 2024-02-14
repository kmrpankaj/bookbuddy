// EmailContext.js
import React, { createContext, useContext } from 'react';

const host = "http://localhost:3001"
// Create a context
const EmailContext = createContext();

// This is the provider component
export function EmailProvider({ children }) {
  async function sendEmail({ to, subject, html }) {
    try {
      const response = await fetch(`${host}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, html }),
      });

      if (!response.ok) {
        throw new Error(`Email sending failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // The value passed to the provider includes the sendEmail function
  return (
    <EmailContext.Provider value={{ sendEmail }}>
      {children}
    </EmailContext.Provider>
  );
}

// Custom hook to use the context
export function useEmail() {
  return useContext(EmailContext);
}
