import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [island, setIsland] = useState('Tarawa'); // Default island

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        island: island,
        createdAt: new Date()
      });

      alert('Account created! Mauri!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Join Kiribati Connect</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        />
        <input
          type="password"
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        />
        <select 
          value={island} 
          onChange={(e) => setIsland(e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        >
          <option value="Tarawa">Tarawa</option>
          <option value="Kiritimati">Kiritimati</option>
          <option value="Abaiang">Abaiang</option>
        </select>
        <button 
          type="submit" 
          style={{ 
            background: '#4285F4', 
            color: 'white', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px',
            width: '100%'
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
