import "./ending.css";

export function Ending() {
  return (
    <section className="ending" id="ending" aria-label="After the work">
      <p className="ending-copy" aria-live="polite" aria-atomic="true">
        <span>you’ve reached the bottom.</span>
        <span>we found some more bottom.</span>
        <span>it’s green.</span>
      </p>
      <button className="ending-next" type="button" aria-label="Continue to the personal pages" />
    </section>
  );
}
