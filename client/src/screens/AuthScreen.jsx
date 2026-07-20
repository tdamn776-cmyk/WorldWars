import React, { useState } from 'react';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';

export default function AuthScreen() {
  const { login } = usePlayerStore();
  const { setScreen } = useGameStore();

  const [username, setUsername] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (!day || !month || !year) {
      setError('Please enter your full date of birth.');
      return;
    }

    const birthDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(birthDate.getTime())) {
      setError('Invalid date.');
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setError('You must be at least 13 years old to play.');
      return;
    }

    // Success
    login(username, birthDate.toISOString(), age);
    setScreen('mainMenu');
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'url(/textures/tank-bg.jpg) center/cover no-repeat, #0a0a0f',
      backgroundBlendMode: 'overlay',
      padding: '20px'
    }}>
      
      <div className="animate-slide-up" style={{
        background: 'rgba(26, 26, 46, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-glow-gold)'
      }}>
        <h1 style={{ textAlign: 'center', color: 'var(--color-accent-gold)', marginBottom: '30px', fontFamily: 'var(--font-display)', fontSize: '32px' }}>
          WORLDWARS
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>COMMANDER NAME</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              maxLength={15}
              style={{
                width: '100%', padding: '15px',
                background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)', fontSize: '18px', color: 'white',
                fontFamily: 'var(--font-heading)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>DATE OF BIRTH</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" placeholder="DD" value={day} onChange={(e) => setDay(e.target.value)}
                min="1" max="31"
                style={{ flex: 1, padding: '15px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
              />
              <input 
                type="number" placeholder="MM" value={month} onChange={(e) => setMonth(e.target.value)}
                min="1" max="12"
                style={{ flex: 1, padding: '15px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
              />
              <input 
                type="number" placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)}
                min="1900" max="2024"
                style={{ flex: 1.5, padding: '15px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'white' }}
              />
            </div>
          </div>

          {error && <div style={{ color: 'var(--color-accent-red)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <button 
            type="submit"
            style={{
              background: 'var(--color-accent-gold)',
              color: 'black',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '20px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            ENTER WARZONE
          </button>
        </form>
      </div>

    </div>
  );
}
