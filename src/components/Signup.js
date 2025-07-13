import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [island, setIsland] = useState('Tarawa');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      title: 'Join Kiribati Connect',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password (6+ characters)',
      button: 'Sign Up',
      success: 'Account created! Mauri!'
    },
    gil: {
      title: 'I buokia ni Kiribati Connect',
      emailPlaceholder: 'Imeira',
      passwordPlaceholder: 'Password (6+ aika)',
      button: 'I buokia',
      success: 'Tiaki ae e kabongana! Mauri!'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        island,
        createdAt: new Date(),
        languagePreference: language
      });
      alert(translations[language].success);
    } catch (error) {
      setError(error.message);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button 
          onClick={() => setLanguage(lang => lang === 'en' ? 'gil' : 'en')}
          style={{ padding: '5px 10px' }}
        >
          {language === 'en' ? 'Te taetae ni Kiribati' : 'Switch to English'}
        </button>
      </div>
      
      <h2>{translations[language].title}</h2>
      
      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={translations[language].emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        />
        <input
          type="password"
          placeholder={translations[language].passwordPlaceholder}
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
          disabled={loading}
          style={{ 
            background: '#4285F4', 
            color: 'white', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px',
            width: '100%',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '...' : translations[language].button}
        </button>
      </form>
    </div>
  );
}
