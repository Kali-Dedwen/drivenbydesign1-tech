import { Link } from 'react-router-dom'

export default function ThankYou() {
  return (
    <div style={{
      background: '#0A1628',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        color: '#FAF9F8',
        fontWeight: '600',
        marginBottom: '1.5rem',
        letterSpacing: '0.02em',
      }}>
        Thank you.
      </h1>

      <p style={{
        color: '#A0AEC0',
        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
        maxWidth: '480px',
        lineHeight: '1.75',
        marginBottom: '2.5rem',
      }}>
        Your information has been received by the M2M~Inc. team. 
        A member of our team will be in touch within 48 hours 
        to explore next steps.
      </p>

      <p style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.25rem',
        color: '#C9A84C',
        fontStyle: 'italic',
        marginBottom: '3rem',
      }}>
        To the work.
      </p>

      <Link
        to="/"
        style={{
          color: '#C9A84C',
          fontSize: '0.875rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
          paddingBottom: '2px',
        }}
      >
        Return to Home
      </Link>
    </div>
  )
}
