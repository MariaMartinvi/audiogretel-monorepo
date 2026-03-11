// Caso de éxito: AudioGretel + RankCoworker (estilo BabyLoveGrowth / Samwell)
import React from 'react';
import { useTranslation } from 'react-i18next';
import './SuccessStoryPage.css';
import SEO from '../SEO';

const SuccessStoryPage = () => {
  const { i18n } = useTranslation();
  const isEs = i18n.language && i18n.language.startsWith('es');

  const content = isEs
    ? {
        title: 'Caso de éxito',
        metaTitle: 'Caso de éxito AudioGretel y RankCoworker - Crecimiento orgánico',
        metaDesc: 'Cómo AudioGretel aumentó su visibilidad orgánica y tráfico sostenible con la estrategia de contenido y SEO de RankCoworker.',
        headline: 'Cómo AudioGretel logró más visibilidad orgánica, tráfico cualificado y familias usuarias',
        sub: 'Audiocuentos personalizados para niños · Contenido SEO y crecimiento orgánico',
        launched: 'En marcha desde 2024',
        sector: 'EdTech · Audiocuentos personalizados',
        location: 'España',
        description: 'AudioGretel es una plataforma de audiocuentos personalizados en español e inglés que ayuda a familias y educadores a fomentar el aprendizaje de idiomas y la imaginación de los niños a través de historias con sus nombres y gustos.',
        verify: 'Verificar resultados',
        metric1: 'aumento tráfico orgánico',
        metric2: 'familias nuevas',
        metric3: 'ingresos estimados',
        metric4: 'usuarios activos',
        challengeTitle: 'El reto',
        challenge1Title: 'Competencia fuerte',
        challenge1Text: 'Portales de educación y grandes marcas acaparaban las búsquedas, dejando a AudioGretel con poca visibilidad en Google.',
        challenge2Title: 'Falta de tiempo',
        challenge2Text: 'El equipo no tenía tiempo para definir qué contenido crear ni publicar de forma constante.',
        challenge3Title: 'Falta de expertise',
        challenge3Text: 'Faltaba experiencia en SEO y redacción orientada a búsquedas para competir en orgánico.',
        challenge4Title: 'Dependencia del tráfico de pago',
        challenge4Text: 'El crecimiento dependía sobre todo de campañas de pago, sin un canal orgánico estable que escalara de forma sostenible.',
        quote1: 'Antes de RankCoworker, el contenido era irregular y imposible de escalar. Los artículos planificados y el enfoque SEO lo cambiaron todo: el tráfico creció, las suscripciones también y por fin teníamos inercia.',
        quote1Author: 'Eva',
        quote1Role: 'AudioGretel',
        strategyTitle: 'La estrategia',
        strategy1: 'Contenido publicado de forma constante',
        strategy1Desc: 'Flujo continuo de artículos (listas, guías, cómo hacer) que responden a las búsquedas de familias y educadores.',
        strategy2: 'Blog con marca y SEO',
        strategy2Desc: 'Artículos optimizados para SEO alineados con la intención de búsqueda: cuentos por edad, moraleja, personalizados, aulas digitales.',
        strategy3: 'Señales de autoridad',
        strategy3Desc: 'Mejora del perfil de enlaces y menciones en contextos relevantes para educación e infancia.',
        strategy4: 'Auditoría técnica',
        strategy4Desc: 'Revisión del sitio para que Google indexe y posicione correctamente las páginas clave.',
        strategy5: 'Presencia en búsqueda conversacional',
        strategy5Desc: 'Contenido preparado para aparecer cuando familias y docentes buscan ayuda en buscadores y asistentes.',
        resultsTitle: 'Los resultados',
        resultTraffic: 'Tráfico orgánico',
        resultSignups: 'Nuevas familias',
        resultRevenue: 'Retorno de inversión',
        resultDAU: 'Usuarios activos',
        roiLabel: 'Coste RankCoworker',
        roiValue: '7 meses',
        roiValue2: 'Valor estimado de suscripciones orgánicas',
        quote2: 'Los resultados fueron medibles: más visibilidad, más clics y usuarios orgánicos que convertían mejor. Por primera vez el SEO se convirtió en un canal de crecimiento fiable.',
        quote2Author: 'Equipo AudioGretel',
        quote3: 'Es como tener un equipo de SEO interno. Con artículos pensados para búsquedas reales hemos podido escalar el blog y el posicionamiento sin dejar de lado el producto.',
        quote3Author: 'AudioGretel',
        ctaTitle: '¿Quieres crecer en orgánico?',
        ctaSub: 'Configuración rápida · Cancela cuando quieras',
        ctaButton: 'Conocer RankCoworker',
        ctaLink: 'https://www.rankcoworker.com',
      }
    : {
        title: 'Success story',
        metaTitle: 'AudioGretel and RankCoworker success story - Organic growth',
        metaDesc: 'How AudioGretel increased organic visibility and sustainable traffic with RankCoworker’s content and SEO strategy.',
        headline: 'How AudioGretel achieved more organic visibility, qualified traffic, and family sign-ups',
        sub: 'Personalized audio stories for children · SEO content and organic growth',
        launched: 'Running since 2024',
        sector: 'EdTech · Personalized audiostories',
        location: 'Spain',
        description: 'AudioGretel is a platform for personalized audio stories in Spanish and English, helping families and educators support language learning and children’s imagination through stories with their names and interests.',
        verify: 'Verify results',
        metric1: 'organic traffic increase',
        metric2: 'new families',
        metric3: 'estimated revenue',
        metric4: 'active users',
        challengeTitle: 'The challenge',
        challenge1Title: 'Strong competition',
        challenge1Text: 'Education portals and big brands dominated search results, leaving AudioGretel with little visibility on Google.',
        challenge2Title: 'Lack of time',
        challenge2Text: 'The team didn’t have time to decide what content to create or publish consistently.',
        challenge3Title: 'Lack of expertise',
        challenge3Text: 'No in-house SEO or search-focused content experience to compete organically.',
        challenge4Title: 'Reliance on paid traffic',
        challenge4Text: 'Growth depended mostly on paid campaigns, with no stable organic channel to scale sustainably.',
        quote1: 'Before RankCoworker, content was inconsistent and impossible to scale. The planned articles and SEO focus changed everything—traffic grew, sign-ups grew, and we finally had momentum.',
        quote1Author: 'Eva',
        quote1Role: 'AudioGretel',
        strategyTitle: 'The strategy',
        strategy1: 'Content published consistently',
        strategy1Desc: 'Steady flow of articles (listicles, guides, how-tos) that answer families’ and educators’ search queries.',
        strategy2: 'Branded, SEO blog',
        strategy2Desc: 'SEO-optimized articles aligned with search intent: stories by age, morals, personalized, digital classrooms.',
        strategy3: 'Authority signals',
        strategy3Desc: 'Improved link profile and relevant placements in education and children’s content.',
        strategy4: 'Technical audit',
        strategy4Desc: 'Site review so Google can index and rank key pages properly.',
        strategy5: 'Conversational search presence',
        strategy5Desc: 'Content ready to appear when families and teachers search in engines and assistants.',
        resultsTitle: 'The results',
        resultTraffic: 'Organic traffic',
        resultSignups: 'New families',
        resultRevenue: 'Return on investment',
        resultDAU: 'Active users',
        roiLabel: 'RankCoworker cost',
        roiValue: '7 months',
        roiValue2: 'Est. value of organic sign-ups',
        quote2: 'Results were measurable: more visibility, more clicks, and organic users converting better. For the first time, SEO became a reliable growth channel.',
        quote2Author: 'AudioGretel team',
        quote3: 'It’s like having an in-house SEO team. With content designed for real searches we’ve been able to scale the blog and rankings without neglecting the product.',
        quote3Author: 'AudioGretel',
        ctaTitle: 'Want to grow organically?',
        ctaSub: 'Quick setup · Cancel anytime',
        ctaButton: 'Learn about RankCoworker',
        ctaLink: 'https://www.rankcoworker.com',
      };

  const t = content;

  return (
    <div className="success-story-page">
      <SEO
        title={t.metaTitle}
        description={t.metaDesc}
        keywords={['caso de éxito', 'RankCoworker', 'AudioGretel', 'SEO', 'crecimiento orgánico', 'audiocuentos']}
        lang={i18n.language}
      />

      <header className="success-story-hero">
        <div className="success-story-hero-badges">
          <span className="success-story-badge">AudioGretel</span>
          <span className="success-story-badge success-story-badge-partner">× RankCoworker</span>
        </div>
        <h1 className="success-story-headline">{t.headline}</h1>
        <p className="success-story-sub">{t.sub}</p>
        <div className="success-story-meta">
          <span>{t.launched}</span>
          <span>{t.sector}</span>
          <span>{t.location}</span>
        </div>
        <p className="success-story-desc">{t.description}</p>
        <a href={t.ctaLink} target="_blank" rel="noopener noreferrer" className="success-story-verify">
          {t.verify} →
        </a>
      </header>

      <section className="success-story-metrics">
        <div className="success-story-metric">
          <span className="success-story-metric-value">+320%</span>
          <span className="success-story-metric-label">{t.metric1}</span>
        </div>
        <div className="success-story-metric">
          <span className="success-story-metric-value">2.100+</span>
          <span className="success-story-metric-label">{t.metric2}</span>
        </div>
        <div className="success-story-metric">
          <span className="success-story-metric-value">28k+ €</span>
          <span className="success-story-metric-label">{t.metric3}</span>
        </div>
        <div className="success-story-metric">
          <span className="success-story-metric-value">3×</span>
          <span className="success-story-metric-label">{t.metric4}</span>
        </div>
      </section>

      <section className="success-story-section success-story-challenge">
        <h2 className="success-story-section-title">{t.challengeTitle}</h2>
        <div className="success-story-cards">
          <div className="success-story-card">
            <h3>{t.challenge1Title}</h3>
            <p>{t.challenge1Text}</p>
          </div>
          <div className="success-story-card">
            <h3>{t.challenge2Title}</h3>
            <p>{t.challenge2Text}</p>
          </div>
          <div className="success-story-card">
            <h3>{t.challenge3Title}</h3>
            <p>{t.challenge3Text}</p>
          </div>
          <div className="success-story-card">
            <h3>{t.challenge4Title}</h3>
            <p>{t.challenge4Text}</p>
          </div>
        </div>
        <blockquote className="success-story-quote">
          <p>"{t.quote1}"</p>
          <footer><strong>{t.quote1Author}</strong> · {t.quote1Role}</footer>
        </blockquote>
      </section>

      <section className="success-story-section success-story-strategy">
        <h2 className="success-story-section-title">{t.strategyTitle}</h2>
        <ol className="success-story-steps">
          <li>
            <span className="success-story-step-num">01</span>
            <div>
              <h3>{t.strategy1}</h3>
              <p>{t.strategy1Desc}</p>
            </div>
          </li>
          <li>
            <span className="success-story-step-num">02</span>
            <div>
              <h3>{t.strategy2}</h3>
              <p>{t.strategy2Desc}</p>
            </div>
          </li>
          <li>
            <span className="success-story-step-num">03</span>
            <div>
              <h3>{t.strategy3}</h3>
              <p>{t.strategy3Desc}</p>
            </div>
          </li>
          <li>
            <span className="success-story-step-num">04</span>
            <div>
              <h3>{t.strategy4}</h3>
              <p>{t.strategy4Desc}</p>
            </div>
          </li>
          <li>
            <span className="success-story-step-num">05</span>
            <div>
              <h3>{t.strategy5}</h3>
              <p>{t.strategy5Desc}</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="success-story-section success-story-results">
        <h2 className="success-story-section-title">{t.resultsTitle}</h2>
        <div className="success-story-results-grid">
          <div className="success-story-result-item">
            <span className="success-story-result-value">+320%</span>
            <span className="success-story-result-label">{t.resultTraffic}</span>
          </div>
          <div className="success-story-result-item">
            <span className="success-story-result-value">2.100+</span>
            <span className="success-story-result-label">{t.resultSignups}</span>
          </div>
          <div className="success-story-result-item">
            <span className="success-story-result-value">3×</span>
            <span className="success-story-result-label">{t.resultDAU}</span>
          </div>
          <div className="success-story-result-item success-story-roi">
            <span className="success-story-result-value">45×</span>
            <span className="success-story-result-label">{t.resultRevenue}</span>
            <div className="success-story-roi-detail">
              <span>{t.roiLabel}</span>
              <span>{t.roiValue}</span>
              <span>{t.roiValue2}</span>
              <span><strong>28k+ €</strong></span>
            </div>
          </div>
        </div>
        <blockquote className="success-story-quote">
          <p>"{t.quote2}"</p>
          <footer><strong>{t.quote2Author}</strong></footer>
        </blockquote>
      </section>

      <section className="success-story-section success-story-final">
        <blockquote className="success-story-quote success-story-quote-large">
          <p>"{t.quote3}"</p>
          <footer><strong>{t.quote3Author}</strong></footer>
        </blockquote>
      </section>

      <section className="success-story-cta">
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaSub}</p>
        <a href={t.ctaLink} target="_blank" rel="noopener noreferrer" className="success-story-cta-btn">
          {t.ctaButton}
        </a>
      </section>
    </div>
  );
};

export default SuccessStoryPage;
