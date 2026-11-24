import { useEffect } from 'react';
import { useStore } from '../store.jsx';
import { PageHead, Card, Notice, Icon, ago, when } from '../ui.jsx';

export default function Dashboard() {
  const { summary, loadSummary } = useStore();
  useEffect(() => { loadSummary(); }, [loadSummary]);
  if (!summary) return <><PageHead title="Dashboard" /><p className="a-muted">Loading…</p></>;
  const { enquiries, content, publish } = summary;
  const hidden = (x) => x.total - x.visible;
  return <>
    <PageHead title="Dashboard" intro="What’s on the site, what’s waiting to be published and what’s come in.">
      <button type="button" className="a-btn ghost" onClick={loadSummary}><Icon n="refresh" />Refresh</button>
    </PageHead>

    <div className="a-stats">
      <a className="a-stat" href="#/enquiries"><span><Icon n="inbox" />Enquiries this week</span><strong>{enquiries.lastWeek}</strong><small>{enquiries.total} in total</small></a>
      <a className="a-stat" href="#/products"><span><Icon n="box" />Products on the site</span><strong>{content.products.visible}</strong><small>{hidden(content.products) ? `${hidden(content.products)} hidden` : 'None hidden'}</small></a>
      <a className="a-stat" href="#/services"><span><Icon n="layers" />Service pages</span><strong>{content.services.visible}</strong><small>{hidden(content.services) ? `${hidden(content.services)} hidden` : 'None hidden'}</small></a>
      <a className="a-stat" href="#/stack"><span><Icon n="code" />Technologies</span><strong>{content.stack}</strong><small>In the home page stack row</small></a>
    </div>

    <div className="a-grid2">
      <Card title="Publishing">
        {publish.pending
          ? <p><strong>You have unpublished changes</strong> (last saved {ago(publish.lastEditAt)}). Press <strong>Publish</strong> at the top right to rebuild the live site with them.</p>
          : <p>The live site has every saved change.</p>}
        <p className="a-muted">{publish.last ? `Last published ${when(publish.last.at)} by ${publish.last.by}${publish.last.ok ? '' : ' (Netlify refused it)'}.` : 'Nothing has been published from the admin yet.'}</p>
        {!publish.configured && <Notice tone="warn">Publishing isn’t connected to Netlify yet, so saved changes go live with the next Netlify deploy. To publish from here, create a build hook in Netlify (Project configuration › Build &amp; deploy › Continuous deployment › Build hooks) and add it as NETLIFY_BUILD_HOOK_URL.</Notice>}
      </Card>
      <Card title="Working hours">
        <p className="a-big-line">{content.hours}</p>
        <a className="a-link" href="#/hours">Change working hours</a>
      </Card>
    </div>

    <Card title="Latest enquiries">
      {enquiries.recent.length
        ? <ul className="a-recent">{enquiries.recent.map((q) => <li key={q.id}><a href="#/enquiries">
            <span><strong>{q.name}</strong>{q.company && <span className="a-muted"> · {q.company}</span>}</span>
            <span className="a-tag">{q.engagement}</span>
            <time dateTime={q.createdAt}>{ago(q.createdAt)}</time>
          </a></li>)}</ul>
        : <p className="a-muted">No enquiries yet. They appear here as soon as someone sends the contact form.</p>}
      <a className="a-link" href="#/enquiries">Open the inbox</a>
    </Card>
  </>;
}
