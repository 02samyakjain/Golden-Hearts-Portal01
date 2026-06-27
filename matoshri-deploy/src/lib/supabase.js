import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://twgfgtypzbrgocmdjsxt.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_GCSXNjYyP--Bmu0cf98dQg_-neyLxxC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const ORG = {
  name: 'Matoshri Anandashram',
  address: 'Savkheda Shivar, Tal & Dist. Jalgaon',
  phone1: '0257 2281327',
  phone2: '9423574806',
  whatsapp: '919004184333',
  mapUrl: 'https://maps.app.goo.gl/z2Vm1eRvBHp5wX6U9',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724!2d75.5!3d21.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMatoshri+Anandashram!5e0!3m2!1sen!2sin!4v1234567890',
};
