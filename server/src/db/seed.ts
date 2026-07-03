// Run this AFTER creating the tables via Supabase SQL editor.
// Usage: npx tsx src/db/seed.ts

import 'dotenv/config';
import { supabaseAdmin } from './supabase.js';

const uid = () => crypto.randomUUID();

const pwHash = '$2a$10$I8cdZGQ4hGuhkx1dHAwLVO4iOPux5BM0UnLLTSx.NvX0eIkyFAqwa'; // "password"
const adminHash = '$2a$10$rL7y4qSOtDiPPn2pkiZ2zeyJ8aQUJdnjrlCH3i2w0roj8l76KOmQq'; // "admin123"
const clientHash = '$2a$10$Tk.FQ.xk9LJRtEHj9LhD8.RudZu5GNPYrxSzr9EM3H0bKoP3vUBhK'; // "password123"

async function seed() {
  console.log('Seeding database...\n');

  // Admin
  const { error: adminErr } = await supabaseAdmin.from('users').upsert({
    id: uid(), name: 'Eventa Admin', email: 'admin@eventa.ng',
    password_hash: adminHash, role: 'admin',
  }, { onConflict: 'email' });
  if (adminErr) return console.error('Admin error:', adminErr.message);
  console.log('✓ Admin user (admin@eventa.ng / admin123)');

  // Client
  const { error: clientErr } = await supabaseAdmin.from('users').upsert({
    id: uid(), name: 'Chioma Okafor', email: 'chioma@example.com',
    password_hash: clientHash, role: 'client',
  }, { onConflict: 'email' });
  if (clientErr) return console.error('Client error:', clientErr.message);
  console.log('✓ Client user (chioma@example.com / password123)');

  // 8 vendors
  const vendors = [
    { name: 'Luxe Catering Co.', category: 'catering', location: 'Lagos', bio: 'Premium catering for luxury events across Nigeria. Our award-winning chefs create unforgettable culinary experiences using the finest ingredients sourced from around the world.', price: '500,000 - 2,000,000', phone: '+234 801 234 5678', email: 'info@luxecatering.ng', tags: ['Weddings', 'Corporate Events', 'Private Dining'], rating: 4.8, review_count: 24 },
    { name: 'Prestige Photography', category: 'photography', location: 'Abuja', bio: 'Capturing your most precious moments with artistic excellence. We specialize in high-end event photography and cinematography.', price: '300,000 - 1,500,000', phone: '+234 802 345 6789', email: 'hello@prestigephoto.ng', tags: ['Weddings', 'Portraits', 'Events'], rating: 4.9, review_count: 31 },
    { name: 'Grandeur Halls', category: 'venue', location: 'Lagos', bio: 'Exquisite event venues designed for unforgettable celebrations. From intimate gatherings to grand galas, our spaces epitomize luxury.', price: '1,000,000 - 5,000,000', phone: '+234 803 456 7890', email: 'bookings@grandeurhalls.ng', tags: ['Weddings', 'Galas', 'Corporate Events'], rating: 4.7, review_count: 18 },
    { name: 'Elegance Decor', category: 'decor', location: 'Lagos', bio: 'Transforming spaces into breathtaking works of art. Our design team creates bespoke decor concepts that reflect your unique vision.', price: '200,000 - 1,000,000', phone: '+234 804 567 8901', email: 'info@elegancedecor.ng', tags: ['Weddings', 'Corporate Events', 'Parties'], rating: 4.6, review_count: 15 },
    { name: 'Harmony Strings', category: 'music', location: 'Lagos', bio: 'World-class live music entertainment for discerning clients. From string quartets to full orchestras, we set the perfect mood.', price: '150,000 - 800,000', phone: '+234 805 678 9012', email: 'bookings@harmonystrings.ng', tags: ['Weddings', 'Corporate Events', 'Private Parties'], rating: 4.9, review_count: 27 },
    { name: 'Radiance Beauty', category: 'beauty', location: 'Abuja', bio: 'Premium beauty services for your special day. Our team of expert stylists and makeup artists ensure you look and feel magnificent.', price: '100,000 - 500,000', phone: '+234 806 789 0123', email: 'hello@radiancebeauty.ng', tags: ['Bridal', 'Events', 'Photoshoots'], rating: 4.7, review_count: 22 },
    { name: 'Royal Rides', category: 'transportation', location: 'Lagos', bio: 'Luxury transportation for VIP guests and wedding parties. Featuring a fleet of Rolls-Royce, Mercedes-Benz, and Range Rover.', price: '250,000 - 2,000,000', phone: '+234 807 890 1234', email: 'info@royalrides.ng', tags: ['Weddings', 'VIP Transport', 'Events'], rating: 4.5, review_count: 12 },
    { name: 'Celebrity MCs', category: 'mc', location: 'Lagos', bio: 'Nigeria\'s finest master of ceremonies for luxury events. Charismatic, eloquent, and professional — we make your event unforgettable.', price: '200,000 - 1,000,000', phone: '+234 808 901 2345', email: 'bookings@celebritymcs.ng', tags: ['Weddings', 'Corporate Events', 'Galas'], rating: 4.8, review_count: 33 },
  ];

  for (const v of vendors) {
    const { error } = await supabaseAdmin.from('vendors').upsert({
      id: uid(), ...v, password_hash: pwHash, avatar: '', color: '#C9A84C',
    }, { onConflict: 'email' });
    if (error) console.error(`  ✗ ${v.name}: ${error.message}`);
    else console.log(`  ✓ ${v.name}`);
  }

  console.log('\n✓ Seed complete!');
}

seed().catch(console.error);
