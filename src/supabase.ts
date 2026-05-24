import { createClient } from '@supabase/supabase-js';

// Retrieve and sanitize the Supabase URL
let rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://ncdslxxepufzkksurijh.supabase.co';

if (rawUrl) {
  rawUrl = rawUrl.trim();
  // Strip trailing slashes
  rawUrl = rawUrl.replace(/\/+$/, '');
  // Strip any accidental Rest/v1 suffixes from the URL to prevent API gateway Kong errors
  if (rawUrl.toLowerCase().endsWith('/rest/v1')) {
    rawUrl = rawUrl.substring(0, rawUrl.length - 8);
  }
  rawUrl = rawUrl.replace(/\/+$/, '');
}

const SUPABASE_URL = rawUrl;
const SUPABASE_ANON_KEY = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();

// Initialize client with high resilience helper
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Helper types
export interface DBProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  bhk: string;
  type: string;
  image: string;
  purpose: 'Buy' | 'Rent';
  is_blurred?: boolean;
}

// -------------------------------------------------------------
// 1. PROFILES & USER ACCOUNTS
// -------------------------------------------------------------
export async function getSupabaseUsers(): Promise<Record<string, { pw: string; name: string; email: string; role: string }> | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.warn('Error reading profiles from Supabase, operating offline:', error.message);
      return null;
    }

    const map: Record<string, { pw: string; name: string; email: string; role: string }> = {};
    if (data) {
      data.forEach(user => {
        map[user.id] = {
          pw: user.pw,
          name: user.name,
          email: user.email,
          role: user.role || 'Normal User'
        };
      });
    }
    return map;
  } catch (err) {
    console.warn('Runtime exception fetching profiles, operating offline.', err);
    return null;
  }
}

export async function insertSupabaseUser(user: { id: string; pw: string; name: string; email: string; role?: string }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        pw: user.pw,
        name: user.name,
        email: user.email,
        role: user.role || 'Normal User'
      });

    if (error) {
      console.error('Error inserting profile in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception saving profile:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. PROPERTIES (BUY/RENT CATALOG LISTINGS)
// -------------------------------------------------------------
export async function getSupabaseProperties(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error reading properties from Supabase, operating offline:', error.message);
      return null;
    }

    if (data) {
      // Map to correct frontend casing keys
      return data.map(p => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: p.price,
        bhk: p.bhk,
        type: p.type,
        image: p.image,
        purpose: p.purpose,
        isBlurred: p.is_blurred
      }));
    }
    return [];
  } catch (err) {
    console.warn('Runtime exception fetching properties, operating offline.', err);
    return null;
  }
}

export async function insertSupabaseProperty(prop: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .upsert({
        id: prop.id,
        title: prop.title,
        location: prop.location,
        price: prop.price,
        bhk: prop.bhk,
        type: prop.type,
        image: prop.image,
        purpose: prop.purpose,
        is_blurred: prop.isBlurred || false
      });

    if (error) {
      console.error('Error inserting property in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception saving property:', err);
    return false;
  }
}

export async function deleteSupabaseProperty(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception deleting property:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 3. SELL PAGE PROPOSALS
// -------------------------------------------------------------
export async function getSupabaseSellRequests(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('sell_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error reading sell requests from Supabase:', error.message);
      return null;
    }

    if (data) {
      return data.map(r => ({
        id: r.id,
        title: r.title,
        locality: r.locality,
        city: r.city,
        price: r.price,
        bhk: r.bhk,
        propertyType: r.property_type,
        purpose: r.purpose,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        status: r.status,
        image: r.image,
        userId: r.user_id
      }));
    }
    return [];
  } catch (err) {
    console.warn('Runtime exception fetching sell requests.', err);
    return null;
  }
}

export async function insertSupabaseSellRequest(proposal: any, currentUserId: string | null): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sell_requests')
      .upsert({
        id: proposal.id,
        title: proposal.title,
        locality: proposal.locality,
        city: proposal.city,
        price: proposal.price,
        bhk: proposal.bhk,
        property_type: proposal.propertyType,
        purpose: proposal.purpose,
        full_name: proposal.fullName,
        email: proposal.email,
        phone: proposal.phone,
        status: proposal.status || 'Pending',
        image: proposal.image,
        user_id: currentUserId || proposal.userId
      });

    if (error) {
      console.error('Error inserting sell request in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception saving sell request:', err);
    return false;
  }
}

export async function updateSupabaseSellRequestStatus(id: string, status: 'Approved' | 'Rejected'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sell_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating sell request in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception updating sell request:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 4. LOCATION UNLOCK REQUESTS
// -------------------------------------------------------------
export async function getSupabaseUnlockRequests(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('unlock_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error reading unlock requests from Supabase:', error.message);
      return null;
    }

    if (data) {
      return data.map(u => ({
        id: u.id,
        propertyName: u.property_name,
        inquirerName: u.inquirer_name,
        inquirerEmail: u.inquirer_email,
        message: u.message,
        date: u.date,
        status: u.status,
        userId: u.user_id,
        propertyId: u.property_id
      }));
    }
    return [];
  } catch (err) {
    console.warn('Runtime exception fetching unlock requests.', err);
    return null;
  }
}

export async function insertSupabaseUnlockRequest(req: any, currentUserId: string | null): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('unlock_requests')
      .upsert({
        id: req.id,
        property_name: req.propertyName,
        inquirer_name: req.inquirerName,
        inquirer_email: req.inquirerEmail,
        message: req.message,
        date: req.date,
        status: req.status || 'Pending',
        user_id: currentUserId || req.userId,
        property_id: req.propertyId
      });

    if (error) {
      console.error('Error inserting unlock request in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception saving unlock request:', err);
    return false;
  }
}

export async function updateSupabaseUnlockRequestStatus(id: string, status: 'Approved' | 'Declined'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('unlock_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating unlock request in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception updating unlock request:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 5. HELP REQUESTS (CONTACT MESSAGES)
// -------------------------------------------------------------
export async function getSupabaseHelpRequests(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error reading help requests:', error.message);
      return null;
    }

    if (data) {
      return data.map(h => ({
        id: h.id,
        name: h.name,
        email: h.email,
        message: h.message,
        date: h.date,
        status: h.status
      }));
    }
    return [];
  } catch (err) {
    return null;
  }
}

export async function insertSupabaseHelpRequest(req: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('help_requests')
      .upsert({
        id: req.id,
        name: req.name,
        email: req.email,
        message: req.message,
        date: req.date,
        status: req.status || 'Open'
      });

    if (error) {
      console.error('Error inserting help request in Supabase:', error.message, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception saving help request:', err);
    return false;
  }
}

export async function updateSupabaseHelpRequestStatus(id: string, status: 'Resolved' | 'Open'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('help_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating help request status in Supabase:', error.message, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception updating help request status:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 6. NEWSLETTER SUBSCRIPTIONS
// -------------------------------------------------------------
export async function getSupabaseNewsletters(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }

    return data || [];
  } catch (err) {
    return null;
  }
}

export async function insertSupabaseNewsletter(req: { id: string; email: string; date: string }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .upsert({
        id: req.id,
        email: req.email,
        date: req.date
      }, { onConflict: 'email' });

    if (error) {
      console.error('Error inserting newsletter subscription in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Runtime exception saving newsletter subscription:', err);
    return false;
  }
}

export async function deleteSupabaseNewsletter(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .delete()
      .eq('id', id);

    return !error;
  } catch (err) {
    return false;
  }
}
