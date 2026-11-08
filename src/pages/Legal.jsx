import { Layout } from '../Layout.jsx';
import { legal } from '../content/legal.js';

export default function Legal({ route, doc }) {
  const d = legal[doc];
  const other = doc === 'privacy' ? ['VepiFind terms of service', '/products/vepifind/terms/'] : ['VepiFind privacy policy', '/products/vepifind/privacy-policy/'];
  return <Layout route={route}>
    <article className="legal">
      <header className="legal-head">
        <p className="eyebrow">VepiFind</p>
        <h1>{d.title.includes('VepiFind') ? d.title : `VepiFind ${d.title}`}</h1>
      </header>
      <div className="legal-body glass" dangerouslySetInnerHTML={{ __html: d.html }} />
      <p className="legal-links"><a className="link" href="/products/vepifind/">Back to the VepiFind app</a> <a className="link" href={other[1]}>{other[0]}</a></p>
    </article>
  </Layout>;
}
