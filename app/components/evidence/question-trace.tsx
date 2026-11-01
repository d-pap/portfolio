"use client";

import { useEffect, useRef, useState } from "react";
import { Q01, traceCounts } from "app/lib/question-trace";
import "./question-trace.css";

const trace = Q01;
const counts = traceCounts(trace);

/** Where the four stops sit along the route, as fractions of its width. */
const STOPS = [0, 0.245, 0.512, 1];
/** Candidate marks and kept rows in the selection drawing (px, unscaled). */
const MARK_GAP = 11;
const markY = (candidate: number) => 17 + MARK_GAP * (candidate - 1);
const rowY = (rank: number) => 31 + 60 * rank;
const PLAY_MS = 6800;

const passagesPerSource = trace.sources.map((_, i) => trace.passages.filter((passage) => passage.source === i + 1).length);

/**
 * One saved question traveling through Sprout: classified, searched, narrowed to four passages, answered with
 * citations. The still is the figure; "replay trace" walks the route once. Only opacity and transform move.
 */
export function QuestionTrace() {
  const route = useRef<HTMLDivElement>(null);
  const token = useRef<HTMLSpanElement>(null);
  const threads = useRef<SVGGElement>(null);
  const rows = useRef<(HTMLElement | SVGElement | null)[]>([]);
  const moving = useRef<(SVGRectElement | null)[]>([]);
  const answer = useRef<HTMLElement>(null);
  const running = useRef<Animation[]>([]);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    running.current.forEach((animation) => animation.cancel());
    running.current = [];
    setPlaying(false);
  };

  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      running.current.forEach((animation) => animation.cancel());
    };
  }, []);

  const play = async () => {
    if (playing) return stop();
    const width = route.current?.clientWidth ?? 0;
    const at = (index: number) => `translateX(${STOPS[index] * width}px)`;
    const run = (el: Element | null | undefined, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!el) return null;
      const animation = el.animate(frames, { fill: "both", ...options });
      running.current.push(animation);
      return animation;
    };
    setPlaying(true);
    run(token.current, [
      { transform: at(0), opacity: 0, offset: 0 }, { transform: at(0), opacity: 1, offset: 0.05 },
      { transform: at(1), opacity: 1, offset: 0.19 }, { transform: at(1), opacity: 1, offset: 0.29 },
      { transform: at(2), opacity: 1, offset: 0.43 }, { transform: at(2), opacity: 1, offset: 0.76 },
      { transform: at(3), opacity: 1, offset: 0.94 }, { transform: at(3), opacity: 0, offset: 1 },
    ], { duration: PLAY_MS, easing: "linear" });
    run(threads.current, [{ opacity: 0, offset: 0 }, { opacity: 0, offset: 0.47 }, { opacity: 1, offset: 0.79 }, { opacity: 1, offset: 1 }], { duration: PLAY_MS });
    trace.passages.forEach((passage, i) => {
      const from = 0.5 + i * 0.065;
      const frames = [{ opacity: 0.16, offset: 0 }, { opacity: 0.16, offset: from }, { opacity: 1, offset: from + 0.1 }, { opacity: 1, offset: 1 }];
      rows.current.filter((el) => el?.dataset.rank === String(i)).forEach((el) => run(el, frames, { duration: PLAY_MS }));
      // A kept candidate's mark travels to its row and shortens into the rank tick.
      const dy = rowY(i) - markY(passage.candidate);
      run(moving.current[i], [
        { transform: "translate(0px, 0px) scaleX(1)", opacity: 0, offset: 0 },
        { transform: "translate(0px, 0px) scaleX(1)", opacity: 1, offset: 0.01 },
        { transform: `translate(144px, ${dy}px) scaleX(.333)`, opacity: 1, offset: 0.93 },
        { transform: `translate(144px, ${dy}px) scaleX(.333)`, opacity: 0, offset: 1 },
      ], { duration: 1050, delay: 3150 + i * 420, easing: "cubic-bezier(.22, 1, .36, 1)" });
    });
    const last = run(answer.current, [{ opacity: 0.2, offset: 0 }, { opacity: 0.2, offset: 0.79 }, { opacity: 1, offset: 0.94 }, { opacity: 1, offset: 1 }], { duration: PLAY_MS });
    try {
      await last?.finished;
      stop();
    } catch {
      // Cancelled by stop().
    }
  };

  const keep = (el: HTMLElement | SVGElement | null) => { if (el && !rows.current.includes(el)) rows.current.push(el); };

  return (
    <figure className="fig fig-trace">
      <figcaption className="label fig-caption">How Sprout answers a question.</figcaption>
      <div className="fig-stage stage qt">
        <div className="qt-top label"><span>Question</span></div>
        <p className="qt-question">{trace.question}</p>

        <div className="qt-route" ref={route} role="img" aria-label="The question is classified as a health question, so it is searched and answered with sources; conversational turns take a direct branch instead.">
          <svg className="qt-lines" viewBox="0 0 816 114" preserveAspectRatio="none" aria-hidden="true">
            <path className="qt-bypass" d="M200 33 V66 Q200 82 216 82 H790 Q804 82 804 68 V33" />
            <path className="qt-path" d="M4 33 H812" />
          </svg>
          {STOPS.map((stop, i) => <span key={i} className="qt-dot" style={{ left: `${stop * 100}%` }} />)}
          <span className="qt-token" ref={token} />
          {["message", "classify", "retrieve", "reply"].map((name, i) => (
            <span key={name} className="qt-stop" style={i === 3 ? { right: 0 } : { left: `${STOPS[i] * 100}%` }}>{name}</span>
          ))}
          <span className="label qt-intent">{trace.intent}</span>
          <span className="label qt-branch">direct response [other turns]</span>
        </div>

        <dl className="qt-search"><dt className="label">Rewritten search</dt><dd>{trace.search}</dd></dl>

        <div className="qt-evidence">
          <section>
            <p className="qt-head">Rerank <span className="label">{counts.passages} of {counts.candidates} passages kept</span></p>
            <div className="qt-selection">
              <svg className="qt-marks" viewBox="0 0 172 240" width="172" height="240" aria-hidden="true">
                <g className="qt-threads" ref={threads}>
                  {trace.passages.map((passage, i) => {
                    const y0 = markY(passage.candidate), y1 = rowY(i);
                    return <path key={passage.chunk} d={`M70 ${y0} C108 ${y0} 110 ${y1} 148 ${y1}`} />;
                  })}
                </g>
                {Array.from({ length: trace.candidates }, (_, i) => (
                  <path key={i} className={trace.passages.some((passage) => passage.candidate === i + 1) ? "qt-mark is-kept" : "qt-mark"} d={`M4 ${markY(i + 1)} H70`} />
                ))}
                {trace.passages.map((passage, i) => (
                  <rect key={`tick-${passage.chunk}`} ref={keep} data-rank={i} className="qt-tick" x="148" y={rowY(i) - 1} width="22" height="2" />
                ))}
                {trace.passages.map((passage, i) => (
                  <rect key={`move-${passage.chunk}`} ref={(el) => { moving.current[i] = el; }} className="qt-moving" x="4" y={markY(passage.candidate) - 1} width="66" height="2" style={{ transformOrigin: `4px ${markY(passage.candidate)}px` }} />
                ))}
              </svg>
              <ol className="qt-kept">
                {trace.passages.map((passage, i) => (
                  <li key={passage.chunk} ref={keep} data-rank={i} style={{ top: rowY(i) - 13 }}>
                    {passage.heading}
                    <span className="label">[{passage.source}] passage {passage.chunk}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="label qt-note">from {trace.candidateDocuments} documents, {counts.documents} kept</p>
          </section>

          <section ref={answer}>
            <p className="qt-head">Reply</p>
            <blockquote className="qt-reply">
              <p>The sources I have say certain systemic-sclerosis-specific autoantibodies can appear <mark>several months to years before the clinical onset</mark> of systemic sclerosis. <span className="qt-cite">[1]</span></p>
              <p>What the sources don’t provide is a single “typical” time interval from antibodies to symptoms for most people.</p>
            </blockquote>
          </section>
        </div>

        <ol className="qt-sources" aria-label="documents supplied to the reply">
          {trace.sources.map((title, i) => (
            <li key={title} className={trace.cited.includes(i + 1) ? "is-cited" : undefined}>
              <span className="qt-index">[{i + 1}]</span>
              <span>{title}<span className="label qt-use">{passagesPerSource[i]} {passagesPerSource[i] === 1 ? "passage" : "passages"}, {trace.cited.includes(i + 1) ? "cited" : "not cited"}</span></span>
            </li>
          ))}
        </ol>

        <div className="qt-foot">
          <button type="button" className="label qt-replay" onClick={play}><span aria-hidden="true">↻</span> {playing ? "stop" : "replay trace"}</button>
        </div>
      </div>
    </figure>
  );
}
