import { useDraft } from '../store.jsx';
import { PageHead, Card, Field, Text, SaveBar } from '../ui.jsx';
import { DAY_NAMES, formatDays, formatOffset, hoursText, utcOffset } from '../../shared/hours.js';
import { isTimeZone } from '../../shared/content-schema.js';

const WEEK = [1, 2, 3, 4, 5, 6, 0]; // Monday first
const ZONES = (() => { try { return Intl.supportedValuesOf('timeZone'); } catch { return null; } })();

export default function Hours() {
  const d = useDraft('hours');
  const h = d.draft;
  const set = (k, v) => d.update((x) => ({ ...x, [k]: v }));
  const offset = isTimeZone(h.timeZone) ? utcOffset(new Date(), h.timeZone) : 0;
  const toggleDay = (n, on) => set('days', on ? [...h.days, n] : h.days.filter((x) => x !== n));
  return <>
    <PageHead title="Working hours" intro="Used by the live hours band (home, remote developers and outsourcing pages), the contact and about pages, and the opening hours Google reads." />

    <Card title="Days and times">
      <fieldset className="a-days">
        <legend>Working days</legend>
        {WEEK.map((n) => <label key={n} className={h.days.includes(n) ? 'on' : ''}>
          <input type="checkbox" checked={h.days.includes(n)} onChange={(e) => toggleDay(n, e.target.checked)} />{DAY_NAMES[n].slice(0, 3)}
        </label>)}
      </fieldset>
      {d.issue('days', { under: true }) && <p className="a-error">{d.issue('days', { under: true })}</p>}
      <div className="a-cols2">
        <Text label="Opens" type="time" value={h.open} onChange={(v) => set('open', v)} error={d.issue('open')} />
        <Text label="Closes" type="time" value={h.close} onChange={(v) => set('close', v)} error={d.issue('close')} />
      </div>
    </Card>

    <Card title="Time zone">
      {ZONES
        ? <Field label="Time zone" error={d.issue('timeZone')} hint={`Currently ${formatOffset(offset)}. Daylight saving is followed automatically.`}>
            {(id) => <select id={id} value={h.timeZone} onChange={(e) => set('timeZone', e.target.value)}>{ZONES.map((z) => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}</select>}
          </Field>
        : <Text label="Time zone" hint="An IANA name, e.g. Africa/Blantyre" value={h.timeZone} onChange={(v) => set('timeZone', v)} error={d.issue('timeZone')} />}
      <div className="a-cols3">
        <Text label="Short name" hint="Shown after times, e.g. CAT" value={h.zoneLabel} max={12} onChange={(v) => set('zoneLabel', v)} error={d.issue('zoneLabel')} />
        <Text label="Full name" hint="e.g. Central Africa Time" value={h.zoneName} max={60} onChange={(v) => set('zoneName', v)} error={d.issue('zoneName')} />
        <Text label="City" hint="Shown under the clock" value={h.city} max={60} onChange={(v) => set('city', v)} error={d.issue('city')} />
      </div>
    </Card>

    <Card title="How it reads on the site">
      <dl className="a-preview">
        <div><dt>Contact and about pages</dt><dd>{hoursText(h, offset)}</dd></div>
        <div><dt>Hours band</dt><dd>{formatDays(h.days)}, {h.open}–{h.close} {h.zoneName} ({formatOffset(offset)})</dd></div>
        <div><dt>Status before the clock loads</dt><dd>{formatDays(h.days, true)}, {h.open}–{h.close} {h.zoneLabel}</dd></div>
        <div><dt>Google opening hours</dt><dd>{WEEK.filter((n) => h.days.includes(n)).map((n) => DAY_NAMES[n]).join(', ')}: {h.open}–{h.close}</dd></div>
      </dl>
    </Card>
    <SaveBar d={d} />
  </>;
}
