import BrandMark from './BrandMark';
import UiGlyph from './UiGlyph';

function LandingPage({ data, isLoading = false, onStartCheckout, brandSources }) {
  const offers = data?.offres || [];

  return (
    <main className="page-shell">
      <div className="poster-shell poster-shell-simple">
        <section className="landing-simple-header" aria-label="Partenariat">
          <div className="landing-logo-block">
            <BrandMark
              sources={brandSources}
              alt="BN"
              fallbackType="drden"
              brand="drden"
            />
          </div>
          <p>Votre accès Internet <strong>BN RDC</strong></p>
        </section>

        <section className="landing-simple-hero">
          <span className="landing-simple-kicker">
            <UiGlyph type="network" />
            Forfaits Internet
          </span>
          <h1>Restez Connecté Sans Limites</h1>
          <p>
            Choisissez un forfait. Vous serez redirigé vers la page de paiement BN pour finaliser votre commande.
          </p>
          {isLoading && <p className="landing-loading-note">Chargement des forfaits...</p>}
          <button
            type="button"
            className="hero-cta"
            onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Voir les forfaits
          </button>
        </section>

        <section className="card-grid" id="offers">
          {offers.map((offre) => (
            <article key={offre.id} className="offer-card">
              <div className="offer-top">
                <span className="offer-charge">{offre.tier === 'pro' || offre.tier === 'max' || offre.tier === 'unlimited' ? '4G+' : '4G'}</span>
                {offre.badge && <span className={`offer-badge ${offre.badgeClass}`}>{offre.badge}</span>}
              </div>
              <div className="offer-body">
                <span className="offer-amount">{offre.title}</span>
                <span className="offer-duration">{offre.subtitle}</span>
              </div>
              <div className="offer-price">
                <span className="offer-currency">{offre.currency}</span>
                <span className="offer-value">{offre.price.toFixed(2)}</span>
              </div>
              <button type="button" onClick={() => onStartCheckout(offre)}>
                <UiGlyph type="arrowRight" />
                Choisir ce forfait
              </button>
            </article>
          ))}
          {!offers.length && isLoading && (
            <article className="offer-card offer-card-loading" aria-live="polite">
              <div className="offer-body">
                <span className="offer-amount">Chargement...</span>
                <span className="offer-duration">Veuillez patienter pendant la recuperation des offres.</span>
              </div>
            </article>
          )}
        </section>

        <section className="airdata-trust" aria-label="Avantages">
          <article>
            <UiGlyph type="lightning" />
            <strong>Activation instantanee</strong>
          </article>
          <article>
            <UiGlyph type="shield" />
            <strong>Paiement securise</strong>
          </article>
        </section>

        <footer className="airdata-footer">© 2026 BN RDC. Tous droits réservés.</footer>
      </div>
    </main>
  );
}

export default LandingPage;
