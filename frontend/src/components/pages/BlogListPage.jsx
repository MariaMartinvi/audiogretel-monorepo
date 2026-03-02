import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../../data/blogPosts';
import '../../styles/blogNew.css';

const publicUrl = process.env.PUBLIC_URL || '';

export default function BlogListPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';

  const lang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'es';
  const allPosts = useMemo(() => getPosts(lang), [lang]);
  const categories = useMemo(() => [...new Set(allPosts.map((p) => p.category))].sort(), [allPosts]);
  const filteredPosts = useMemo(
    () => (categoryFilter ? allPosts.filter((p) => p.category === categoryFilter) : allPosts),
    [allPosts, categoryFilter]
  );
  const recentPosts = allPosts.slice(0, 5);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="blog-new">
      <header className="blog-new-header">
        <h1 className="blog-new-title">{t('blog.title')}</h1>
        <p className="blog-new-description">{t('blog.description')}</p>
      </header>

      <div className="blog-new-layout">
        <div className="blog-new-list-wrap">
          <div className="blog-new-list">
            {filteredPosts.length === 0 ? (
              <p className="blog-new-no-posts">{t('blog.noPosts')}</p>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.slug} className="blog-new-card" data-category={post.category}>
                  <Link to={`/blog/post/${post.slug}`} className="blog-new-card-link">
                    <div className="blog-new-card-image-wrap">
                      <img
                        src={`${publicUrl}${post.featuredImage}`}
                        alt=""
                        className="blog-new-card-image"
                        width="400"
                        height="220"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `${publicUrl}/images/blog/placeholder.svg`;
                        }}
                      />
                    </div>
                    <div className="blog-new-card-body">
                      <span className="blog-new-card-category">{post.category}</span>
                      <h2 className="blog-new-card-title">{post.title}</h2>
                      <p className="blog-new-card-excerpt">{post.excerpt}</p>
                      <footer className="blog-new-card-meta">
                        <span className="blog-new-card-author">{post.author}</span>
                        <span className="blog-new-card-date">{formatDate(post.date)}</span>
                        <span className="blog-new-card-time">3 min</span>
                      </footer>
                    </div>
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="blog-new-sidebar" aria-label="Sidebar">
          <div className="blog-new-sidebar-section">
            <h3 className="blog-new-sidebar-title">{t('blog.search')}</h3>
            <input
              type="search"
              placeholder={t('blog.searchPlaceholder')}
              className="blog-new-sidebar-input"
              aria-label={t('blog.search')}
            />
          </div>
          <div className="blog-new-sidebar-section">
            <h3 className="blog-new-sidebar-title">{t('blog.categoriesTitle')}</h3>
            <ul className="blog-new-sidebar-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={categoryFilter === cat ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                    className={`blog-new-sidebar-link ${categoryFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="blog-new-sidebar-section">
            <h3 className="blog-new-sidebar-title">{t('blog.recent')}</h3>
            <ul className="blog-new-sidebar-list">
              {recentPosts.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/post/${p.slug}`} className="blog-new-sidebar-link">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
