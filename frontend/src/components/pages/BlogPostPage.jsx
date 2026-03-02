import React, { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getPostByLegacyId, getPosts, LEGACY_ID_TO_SLUG } from '../../data/blogPosts';
import '../../styles/blogNew.css';

const publicUrl = process.env.PUBLIC_URL || '';

export default function BlogPostPage() {
  const { slugOrId } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'es';

  const post = useMemo(() => {
    if (LEGACY_ID_TO_SLUG[Number(slugOrId)]) {
      return getPostByLegacyId(lang, slugOrId);
    }
    return getPostBySlug(lang, slugOrId);
  }, [lang, slugOrId]);

  const allPosts = useMemo(() => getPosts(lang), [lang]);
  const related = useMemo(
    () =>
      post
        ? allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3)
        : [],
    [allPosts, post]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slugOrId, lang]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <article className="blog-new-post">
      <nav className="blog-new-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">{t('navbar.home')}</Link>
        {' › '}
        <Link to="/blog">{t('blog.title')}</Link>
        {' › '}
        <span>{post.title}</span>
      </nav>

      <header>
        <h1 className="blog-new-post-title">{post.title}</h1>
        <div className="blog-new-post-meta">
          <span>{post.author}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>3 min</span>
        </div>
      </header>

      <div className="blog-new-post-featured-image">
        <img
          src={`${publicUrl}${post.featuredImage}`}
          alt=""
          width="800"
          height="450"
          onError={(e) => {
            e.target.src = `${publicUrl}/images/blog/placeholder.svg`;
          }}
        />
      </div>

      <div className="blog-new-post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {related.length > 0 && (
        <aside className="blog-new-related">
          <h2 className="blog-new-related-title">{t('blog.relatedPosts')}</h2>
          <ul className="blog-new-related-list">
            {related.map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/post/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <section className="blog-new-cta">
        <h2 className="blog-new-cta-title">
          {lang === 'es' ? '¿Te gustan los audiocuentos?' : 'Like audio stories?'}
        </h2>
        <p className="blog-new-cta-desc">
          {lang === 'es'
            ? 'Crea tus propios cuentos personalizados en inglés con AudioGretel.'
            : 'Create your own personalized stories in English with AudioGretel.'}
        </p>
        <Link to="/contact" className="blog-new-cta-button">
          {lang === 'es' ? 'Probar gratis' : 'Try for free'}
        </Link>
      </section>
    </article>
  );
}
