import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { invalidateUserCache } from '../services/authService';
import axios from 'axios';
import './Success.css';

const Success = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifySubscription = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');

      if (!sessionId) {
        if (isMounted) {
          setError(t('subscription.noSessionId'));
          setLoading(false);
        }
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${apiUrl}/api/stripe/success`, {
          params: { session_id: sessionId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success && isMounted) {
          const updatedUser = response.data.user;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (setUser) setUser(updatedUser);
          invalidateUserCache();
          try {
            await refreshUser();
          } catch (e) {
            if (e.name !== 'AbortError') throw e;
          }
          setLoading(false);
          setTimeout(() => navigate('/'), 3000);
        } else if (!response.data.success) {
          throw new Error('Subscription verification failed');
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(t('subscription.verificationError') || 'Error verifying subscription');
          setLoading(false);
        }
      }
    };

    verifySubscription();
    return () => { isMounted = false; };
  }, [location, navigate, t, refreshUser, setUser]);

  return (
    <div className="success-container">
      <h1>{t('subscription.paymentSuccess')}</h1>
      <p>{t('subscription.thankYou')}</p>
      {loading && <p>{t('subscription.processing')}</p>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <p>{t('subscription.redirecting')}</p>
      )}
    </div>
  );
};

export default Success;
