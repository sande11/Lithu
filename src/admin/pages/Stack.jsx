import { useDraft } from '../store.jsx';
import { PageHead, Card, StringList, SaveBar } from '../ui.jsx';

export default function Stack() {
  const d = useDraft('stack');
  return <>
    <PageHead title="Tech stack" intro="The “stack we ship with” row on the home page, in this order. Each service page has its own list of tools, edited under Services." />
    <Card>
      <StringList label="Technologies" items={d.draft} onChange={(v) => d.update(v)} max={40} itemMax={40}
        placeholder="Add a technology, e.g. TypeScript" issue={d.issue} prefix="" error={d.issue('')} />
    </Card>
    <Card title="Preview" intro="How the row reads on the home page.">
      <div className="a-stack-preview"><span className="a-muted">The stack we ship with</span>{d.draft.map((s, i) => <span key={`${s}-${i}`}>{s || '…'}</span>)}</div>
    </Card>
    <SaveBar d={d} />
  </>;
}
