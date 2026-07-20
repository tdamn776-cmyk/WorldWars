import React, { useState } from 'react';
import usePlayerStore from '../stores/usePlayerStore';
import useGameStore from '../stores/useGameStore';
import TANKS from '../utils/tankData';
import { ADMIN_SECRET } from '../utils/constants';

export default function AdminScreen() {
  const playerStore = usePlayerStore();
  const { setScreen } = useGameStore();

  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(playerStore.isAdmin);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      playerStore.loginAsAdmin();
      setUnlocked(true);
    } else {
      alert("INCORRECT SECURITY CLEARANCE");
    }
  };

  const showMsg = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const unlockAllTanks = () => {
    TANKS.forEach(t => {
      if (!playerStore.hasTank(t.id)) playerStore.unlockTank(t.id);
    });
    showMsg("ALL TANKS UNLOCKED");
  };

  const addMillionBp = () => {
    playerStore.addBp(1000000);
    showMsg("+1,000,000 BP ADDED");
  };

  const setLevelMax = () => {
    playerStore.addXp(1000000); // Guarantees level 100
    showMsg("LEVEL MAXED OUT");
  };

  const resetAccount = () => {
    if(window.confirm("ARE YOU SURE? THIS WIPES EVERYTHING.")) {
      localStorage.removeItem('worldwars-player-storage');
      window.location.reload();
    }
  };

  if (!unlocked) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <form onSubmit={handleLogin} style={{ background: '#1a1a2e', padding: '30px', borderRadius: '12px', border: '2px solid red' }}>
          <h2 style={{ color: 'red', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>RESTRICTED AREA</h2>
          <input 
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', background: 'black', color: 'red', border: '1px solid red', marginBottom: '15px' }}
            placeholder="ENTER OVERRIDE CODE"
          />
          <button type="submit" style={{ width: '100%', background: 'red', color: 'black', padding: '10px', fontWeight: 'bold' }}>ACCESS</button>
          <button type="button" onClick={() => setScreen('mainMenu')} style={{ width: '100%', background: 'transparent', color: 'white', padding: '10px', marginTop: '10px' }}>CANCEL</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a0f', color: '#4cff4c', padding: '20px', fontFamily: 'monospace' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #4cff4c', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>SYSTEM OVERRIDE PANEL (ADMIN)</h1>
        <button onClick={() => setScreen('mainMenu')} style={{ background: 'transparent', color: '#4cff4c', border: '1px solid #4cff4c', padding: '5px 15px' }}>
          CLOSE TERMINAL
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px' }}>
        
        <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: 'white' }}>CURRENCY & PROGRESSION</h3>
          <button onClick={addMillionBp} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px', background: '#333', color: '#ffc850', fontWeight: 'bold' }}>
            +1,000,000 BP
          </button>
          <button onClick={setLevelMax} style={{ display: 'block', width: '100%', padding: '10px', background: '#333', color: '#3b8bff', fontWeight: 'bold' }}>
            MAX LEVEL (100)
          </button>
        </div>

        <div style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: 'white' }}>CONTENT UNLOCKS</h3>
          <button onClick={unlockAllTanks} style={{ display: 'block', width: '100%', padding: '10px', background: '#333', color: '#4cff4c', fontWeight: 'bold' }}>
            UNLOCK ALL 52 TANKS
          </button>
        </div>

        <div style={{ border: '1px solid red', padding: '15px', borderRadius: '8px', gridColumn: 'span 2' }}>
          <h3 style={{ marginTop: 0, color: 'red' }}>DANGER ZONE</h3>
          <button onClick={resetAccount} style={{ background: 'red', color: 'black', fontWeight: 'bold', padding: '10px', width: '100%' }}>
            NUKE ACCOUNT (RESET TO ZERO)
          </button>
        </div>

      </div>

      {successMsg && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#4cff4c', color: 'black', padding: '10px 20px', fontWeight: 'bold' }}>
          SUCCESS: {successMsg}
        </div>
      )}

    </div>
  );
}
