export const TRIP = {
  title: 'NYC 2026',
  dates: { start: '2026-06-09', end: '2026-06-12' },
  hotel: {
    name: 'Cloud One New York-Downtown',
    address: '133 Greenwich Street, New York, NY 10006',
    bookings: [
      { id: '964286110', checkIn: 'Jun 9, 3:00 PM', checkOut: 'Jun 11, 12:00 PM', note: 'Non-refundable' },
      { id: '975687382', checkIn: 'Jun 11, 3:00 PM', checkOut: 'Jun 12, 12:00 PM', note: 'Non-refundable · Breakfast included' },
    ],
    note: 'Room merge confirmed — spoke with Damien (Front Office Manager). On Jun 11, go to front desk to re-check in — no need to move luggage.',
  },
};

export const TRAVELERS = ['Michael', 'Arly', 'Avaya', 'Kinsley'];

export const FLIGHTS = {
  outbound: {
    flight: 'AA 1056',
    route: 'DFW → LGA',
    leaveHome: '~6:30 AM CST',
    boarding: '8:00 AM CST',
    departs: '8:30 AM CST (DFW)',
    arrives: '12:59 PM EST (LGA)',
    date: 'Tuesday, June 9',
    confirmation: 'WIYGNP',
  },
  return: {
    flight: 'AA 4787',
    route: 'LGA → GSP → DFW',
    boarding: '2:39 PM EST',
    leg1: 'LGA 3:09 PM → GSP 5:26 PM EST',
    layover: 'GSP ~1hr 29min',
    leg2: 'GSP 7:55 PM EST → DFW 9:40 PM CST',
    arrivesDFW: '9:40 PM CST',
    date: 'Friday, June 12',
    confirmation: 'WIYGNP',
  },
};

export const DAYS = [
  {
    id: 'jun9',
    date: '2026-06-09',
    label: 'Tuesday, June 9',
    theme: 'Arrival Day',
    emoji: '✈️',
    color: 'blue',
    events: [
      { time: '~6:30 AM', title: 'Leave Home → DFW', detail: 'Uber XL from home · ~45 min to DFW · Drop off at departures', status: 'free' },
      { time: '~7:15 AM', title: 'Arrive DFW — Check in & Security', detail: 'Check bags · Through security · Gate TBD', status: 'free' },
      { time: '8:00 AM', title: 'Board AA 1056 at DFW', detail: 'Boarding begins · DFW → LGA · Have tickets ready', status: 'booked', ref: 'WIYGNP' },
      { time: '8:30 AM', title: 'Depart DFW — AA 1056', detail: 'Wheels up · In-flight ~2h 29m · Arrives LGA 12:59 PM EST', status: 'booked' },
      { time: '12:59 PM', title: 'Arrive LGA — AA 1056', detail: 'Black Car NYC (TNV-20260524-0YLM) · Cadillac Escalade ESV · Meet & Greet sign: "Arly, Avaya, Kinsley"', status: 'booked', ref: 'TNV-20260524-0YLM',
        disguise: { revealAt: '2026-06-09T12:14:00', title: 'Arrive LGA — AA 1056', detail: 'Uber Black XL pickup at LaGuardia Airport · Head to the hotel' } },
      { time: '~2:00 PM', title: 'Check in — Cloud One Hotel', detail: '133 Greenwich St · Booking 964286110 · Drop bags, freshen up', status: 'booked', ref: '964286110' },
      { time: '~3:15 PM', title: 'Head to Pier 25', detail: 'Hudson River Park · Short Uber or walk · Meet at the Golf sign', status: 'free' },
      { time: '4:00 PM', title: 'Private Luxury Boat Tour', detail: 'Statue of Liberty Sail-Around · 2 hours · Private group of 4 · Golden hour views', status: 'booked', ref: '1783988471', tip: '👙 Wear your swim suit!',
        disguise: { revealAt: '2026-06-09T15:30:00', title: 'Statue of Liberty Ferry', detail: 'Ferry to see the Statue of Liberty from the water · Meet near Pier 25' } },
      { time: '~6:30 PM', title: 'Dinner Downtown', detail: 'Near Pier 25 or hotel — Girls pick!', status: 'plan', mealId: 'jun9-dinner' },
      { time: '~8:00 PM', title: 'Times Square at Night', detail: 'Best after dark — lights, energy, great first NYC moment!', status: 'free' },
    ],
  },
  {
    id: 'jun10',
    date: '2026-06-10',
    label: 'Wednesday, June 10',
    theme: 'History + Art + Heights',
    emoji: '🏙️',
    color: 'purple',
    events: [
      { time: '10:00 AM', title: '9/11 Memorial & Museum', detail: 'CityPASS Ref 6444733 · Allow 2–3 hours', status: 'booked', ref: '6444733' },
      { time: '~12:30 PM', title: 'Lunch Downtown', detail: 'Near the Memorial — Girls pick!', status: 'plan', mealId: 'jun10-lunch' },
      { time: '~2:00 PM', title: 'Uber to Upper East Side', detail: '~15 min to Guggenheim / Central Park area', status: 'free' },
      { time: '~2:30 PM', title: 'Guggenheim Museum', detail: '1071 5th Ave · CityPASS code 5FJ-ZDN-XQY7 · Frank Lloyd Wright spiral · Closes 5:30 PM', status: 'booked', ref: '5FJ-ZDN-XQY7' },
      { time: '~4:00 PM', title: 'Central Park Stroll', detail: 'Enter at 5th Ave & 85th St, right next to the Guggenheim', status: 'free' },
      { time: '~5:30 PM', title: 'Dinner — Midtown', detail: 'Near Empire State Building — Girls pick!', status: 'plan', mealId: 'jun10-dinner' },
      { time: '7:30 PM', title: 'Empire State Building', detail: '86th floor · CityPASS Ref JGYJDMMS · Arrive at reserved time — no early entry', status: 'booked', ref: 'JGYJDMMS', warning: 'Arrive at 7:30 PM exactly — no rainchecks after scan.' },
      { time: '8:30 PM+', title: 'ESB Bonus Visit', detail: 'Free same-night return to 86th floor · No reservation needed · Until midnight!', status: 'bonus' },
    ],
  },
  {
    id: 'jun11',
    date: '2026-06-11',
    label: 'Thursday, June 11',
    theme: 'Architecture + Water + Music',
    emoji: '🎵',
    color: 'amber',
    events: [
      { time: '~9:00 AM', title: 'Slow Morning', detail: 'Sleep in · Hotel breakfast included (Booking 975687382)', status: 'free' },
      { time: '~10:30 AM', title: 'Grand Central Terminal', detail: '89 E 42nd St · Free · Look up at the celestial ceiling!', status: 'free' },
      { time: '~11:15 AM', title: 'Chrysler Building Lobby', detail: '405 Lexington Ave · Free · Stunning Art Deco interior · 5 min walk from Grand Central', status: 'free' },
      { time: '~12:00 PM', title: 'Lunch — Midtown', detail: 'Near Grand Central / Chrysler area — Girls pick!', status: 'plan', mealId: 'jun11-lunch' },
      { time: '2:00 PM', title: 'Intrepid Museum', detail: 'Pier 86, W 46th St · CityPASS Ref 4089128 · Arrive SHARP — 30-min window · Space Shuttle Enterprise, Concorde, USS Growler', status: 'booked', ref: '4089128', warning: 'Arrive at 2:00 PM sharp — tickets valid within 30-minute window only' },
      { time: '~5:30 PM', title: 'Dinner — Near MSG', detail: 'Penn Station / 7th Ave area — Girls pick!', status: 'plan', mealId: 'jun11-dinner' },
      { time: '6:15 PM', title: 'Arrive at MSG', detail: 'Madison Square Garden · Cashless venue — download tickets to phone before arriving', status: 'booked' },
      { time: '7:00 PM', title: 'Forrest Frank @ MSG', detail: 'Stubhub #632757459 · Section 119, Row 11, Seats 13–16', status: 'booked', ref: '632757459' },
    ],
  },
  {
    id: 'jun12',
    date: '2026-06-12',
    label: 'Friday, June 12',
    theme: 'Departure Day',
    emoji: '🏠',
    color: 'green',
    events: [
      { time: 'By 11:00 AM', title: 'Check out — Cloud One Hotel', detail: 'Booking 975687382 · Breakfast included · Ask hotel to hold bags if needed', status: 'booked', ref: '975687382' },
      { time: '12:30 PM', title: 'Uber XL or Black Car → LGA', detail: 'Request no later than 12:30 PM · Allow 45 min + security for 3:09 PM flight', status: 'plan' },
      { time: '2:39 PM', title: 'Board AA 4787 at LGA', detail: 'Boarding begins 30 min before departure · Have tickets ready', status: 'booked', ref: 'WIYGNP' },
      { time: '3:09 PM', title: 'Depart LGA — AA 4787', detail: 'LGA → GSP (arr 5:26 PM EST) · First leg', status: 'booked' },
      { time: '5:26 PM EST', title: 'Land at GSP — Greenville-Spartanburg', detail: '~1 hr 29 min layover · Stretch your legs · Gate change likely', status: 'booked' },
      { time: '7:55 PM EST', title: 'Depart GSP — Final leg home', detail: 'GSP → DFW · ~1 hr 45 min flight', status: 'booked' },
      { time: '9:40 PM CST', title: 'Land at DFW — Welcome home! 🏠', detail: '~45 min Uber XL home from DFW · Conf. WIYGNP', status: 'booked', ref: 'WIYGNP' },
    ],
  },
];

export const QUICK_REF = [
  { label: 'AA Confirmation', value: 'WIYGNP', category: 'flights' },
  { label: 'Black Car NYC', value: '(347) 321-9929', secondary: 'TNV-20260524-0YLM', category: 'transport', link: 'tel:3473219929',
    disguise: { revealAt: '2026-06-09T12:14:00', label: 'Uber Black XL', value: 'Request via Uber app', secondary: null, link: null } },
  { label: 'Black Car Email', value: 'info@truenorthvip.com', category: 'transport', link: 'mailto:info@truenorthvip.com' },
  { label: 'Boat Tour — Viator', value: '(888) 203-8968', secondary: 'Conf. 1783988471', category: 'activities', link: 'tel:8882038968' },
  { label: 'Hotel — Cloud One', value: '133 Greenwich St', category: 'hotel' },
  { label: 'Hotel Booking 1 (Jun 9–11)', value: '#964286110', category: 'hotel' },
  { label: 'Hotel Booking 2 (Jun 11–12)', value: '#975687382', category: 'hotel' },
  { label: 'CityPASS', value: 'Order #7156243', secondary: '(208) 787-4300', category: 'activities' },
  { label: '9/11 Museum', value: 'CityPASS Ref 6444733', category: 'activities' },
  { label: 'Guggenheim', value: 'CityPASS code 5FJ-ZDN-XQY7', category: 'activities' },
  { label: 'Intrepid Museum', value: 'CityPASS Ref 4089128', secondary: '(212) 245-0072', category: 'activities', link: 'tel:2122450072' },
  { label: 'Empire State Building', value: 'CityPASS Ref JGYJDMMS', secondary: 'esbnyc.com', category: 'activities' },
  { label: 'Forrest Frank / Stubhub', value: 'Order #632757459', secondary: 'Sec 119 · Row 11 · Seats 13–16', category: 'activities' },
];

export const TICKETS = [
  { name: 'Joe (Michael) Bryant', ticket: '0012334091525' },
  { name: 'Avaya Bryant', ticket: '0012334091527' },
  { name: 'Arly Bryant', ticket: '0012334091528' },
  { name: 'Kinsley Batchelor', ticket: '0012334091529' },
];

export const CITYPASS = [
  { name: 'Michael Bryant', type: 'Adult', qr: '3084580300042700032' },
  { name: 'Arly Bryant', type: 'Child', qr: '3084580310049549530' },
  { name: 'Avaya Bryant', type: 'Child', qr: '3084580310041181738' },
  { name: 'Kinsley Batchelor', type: 'Child', qr: '3084580310048974036' },
];
