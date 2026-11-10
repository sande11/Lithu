// All site images with descriptive file names, alt text and real dimensions
// (width/height stop the layout jumping while images load).
import bestFit from './assets/images/vepifind-best-fit-job-matches-screen.webp';
import saved from './assets/images/vepifind-saved-jobs-and-alerts-screen.webp';
import letter from './assets/images/vepifind-ai-cover-letter-screen.webp';
import prep from './assets/images/vepifind-interview-practice-screen.webp';
import track from './assets/images/vepifind-application-tracker-screen.webp';
import tips from './assets/images/vepifind-interview-tips-screen.webp';
import vepiIcon from './assets/images/vepifind-job-search-app-icon.webp';
import beloIcon from './assets/images/belo-ecommerce-app-icon.webp';
import hosprIcon from './assets/images/hospr-hospital-management-app-icon.webp';

const screen = (src, alt) => ({ src, alt, width: 600, height: 1336 });
const icon = (src, alt) => ({ src, alt, width: 192, height: 192 });

export const IMG = {
  bestFit: screen(bestFit, 'VepiFind home screen showing best-fit job matches for the user'),
  saved: screen(saved, 'VepiFind saved jobs screen with job alerts'),
  letter: screen(letter, 'VepiFind AI cover letter generator showing a drafted letter'),
  prep: screen(prep, 'VepiFind interview practice screen with role-specific questions'),
  track: screen(track, 'VepiFind application tracker listing jobs applied for'),
  tips: screen(tips, 'VepiFind interview tips screen with short expert guides'),
  vepiIcon: icon(vepiIcon, 'VepiFind job search app icon'),
  beloIcon: icon(beloIcon, 'Belo e-commerce app icon'),
  hosprIcon: icon(hosprIcon, 'Hospr hospital management app icon'),
};

// <Img img={IMG.x} /> with optional decorative mode (alt="") for images that repeat nearby text.
export const Img = ({ img, decorative, className, lazy = true, ...rest }) =>
  <img src={img.src} alt={decorative ? '' : img.alt} width={img.width} height={img.height} className={className} loading={lazy ? 'lazy' : undefined} decoding="async" {...rest} />;
