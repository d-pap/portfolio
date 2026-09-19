import { socialLinks } from "app/config";
import { Arrow } from "./arrow";
export default function Footer() {
  return <footer className="site-footer site-shell" id="contact">
    <div><p>have something in mind?</p><a className="text-link" href={socialLinks.email}>derek@derekpapierski.com <Arrow /></a></div>
    <div className="footer-credit"><span>Michigan, USA</span><span>© {new Date().getFullYear()} Derek Papierski</span></div>
  </footer>;
}
