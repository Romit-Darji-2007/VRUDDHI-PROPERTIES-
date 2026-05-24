Vruddhi Properties tackles a major flaw in modern real estate portals: data privacy and spam. It operates as a "Blind Marketplace". Buyers can browse property specifications (BHK, pricing, amenities) and view a generalized locality, but the exact address and building coordinates are hidden behind a premium glassmorphism blur.

Exact locations and contact details are only revealed when a buyer submits a formal "Location Unlock Request" and the seller explicitly approves it from their dashboard.

✨ Key Features
👤 User Experience (Buyers & Sellers)
Seamless SPA Routing: Instant page switching between Buy, Rent, Sell, and Help pages without browser reloads, built entirely in Vanilla JavaScript.

Cinematic UI/UX: A luxury design system using slate-50 backgrounds, emerald-600 accents, and backdrop-blur-md for masked maps.

Smart Wishlist: A persistent, slide-out wishlist panel synced with interactive property cards (Heart icon).

Secure Listing Form: Sellers can upload properties with a visually distinct "Secure Zone" for contact info, ensuring data safety.

User Dashboard: Dedicated spaces for users to track their saved properties, active listings, and inbound/outbound location unlock requests.

🛡️ The Invisible Admin Dashboard
Credential Intercept: The site features a hidden Admin Command Center that does not exist in the public navigation.

Global Management: Once unlocked, the admin can view and manage Location Unlock Requests, Property Listings, Newsletter Subscriptions, and Help Inquiries.

🛠️ Tech Stack & Architecture
To maintain a lightweight, highly maintainable codebase, this project is architected as a pure frontend solution without complex build tools.

Core: HTML5, Vanilla JavaScript (ES6+), CSS3

Styling: Tailwind CSS (via CDN)

Typography & Icons: Plus Jakarta Sans (Google Fonts), Lucide/FontAwesome

State Management: Native DOM manipulation and localStorage to simulate backend persistence for the prototype.

Architecture: Single HTML file containing view templates, driven by a custom Vanilla JS router at the bottom of the document.
