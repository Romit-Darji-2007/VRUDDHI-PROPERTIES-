/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  getSupabaseUsers,
  insertSupabaseUser,
  getSupabaseProperties,
  insertSupabaseProperty,
  deleteSupabaseProperty,
  getSupabaseSellRequests,
  insertSupabaseSellRequest,
  updateSupabaseSellRequestStatus,
  getSupabaseUnlockRequests,
  insertSupabaseUnlockRequest,
  updateSupabaseUnlockRequestStatus,
  getSupabaseHelpRequests,
  insertSupabaseHelpRequest,
  updateSupabaseHelpRequestStatus,
  getSupabaseNewsletters,
  insertSupabaseNewsletter,
  deleteSupabaseNewsletter
} from './supabase';
import { 
  Heart, 
  Search, 
  MapPin, 
  Home as HomeIcon, 
  Key, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  Menu, 
  X, 
  Mail, 
  MessageSquare, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Instagram, 
  Twitter, 
  Linkedin,
  Phone,
  Filter,
  EyeOff,
  Eye,
  Clock,
  Database,
  Users,
  LogOut,
  Shield,
  Trash2,
  Check,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type View = 'Home' | 'Buy' | 'Rent' | 'Sell' | 'Help' | 'Wishlist' | 'Localities' | 'Auth' | 'AdminDashboard' | 'UserDashboard';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bhk: string;
  type: string;
  image: string;
  purpose: 'Buy' | 'Rent';
  isBlurred?: boolean;
}

// Mock Data
const PROPERTIES: Property[] = [
  { id: '1', title: 'Skyline Penthouse', location: 'Worli, Mumbai', price: '₹12.5 Cr', bhk: '4 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Buy', isBlurred: true },
  { id: '2', title: 'Serene Villa', location: 'Whitefield, Bangalore', price: '₹4.8 Cr', bhk: '5 BHK', type: 'Villa', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Buy', isBlurred: true },
  { id: '3', title: 'Modern Studio', location: 'Gurgaon, Sector 42', price: '₹1.2 Cr', bhk: '1 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Buy', isBlurred: true },
  { id: '4', title: 'Luxury Loft', location: 'Bandra West, Mumbai', price: '₹85,000/mo', bhk: '2 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Rent' },
  { id: '5', title: 'Garden Retreat', location: 'Salt Lake, Kolkata', price: '₹45,000/mo', bhk: '3 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Rent' },
  { id: '6', title: 'Executive Suites', location: 'Cyber City, Hyderabad', price: '₹2.1 Cr', bhk: '3 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Buy' },
  { id: '7', title: 'Coastal Manor', location: 'Alibaug, Maharashtra', price: '₹18 Cr', bhk: '6 BHK', type: 'Villa', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Buy' },
  { id: '8', title: 'Urban Vista', location: 'Pune, Hinjewadi', price: '₹35,000/mo', bhk: '2 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Rent' },
  { id: '9', title: 'Heritage Plot', location: 'Jaipur, Rajasthan', price: '₹3.2 Cr', bhk: 'Plot', type: 'Plot', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Buy' },
  { id: '10', title: 'High-Rise Haven', location: 'Navi Mumbai', price: '₹60,000/mo', bhk: '3 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Rent' },
  { id: '11', title: 'Royal Residency', location: 'South Delhi', price: '₹25 Cr', bhk: '5 BHK', type: 'Villa', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', purpose: 'Buy' },
  { id: '12', title: 'Tech Hub Pod', location: 'Whitefield, Bangalore', price: '₹25,000/mo', bhk: '1 BHK', type: 'Flat', image: 'https://images.unsplash.com/photo-1536376074432-8d63d5929230?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', purpose: 'Rent' },
];

// Helper Components
const parsePrice = (price: string): number => {
  const clean = price.replace(/[^\d.]/g, '');
  const val = parseFloat(clean) || 0;
  if (price.includes('Cr')) {
    return val * 100; // Value in Lakhs
  }
  if (price.includes('Lakh') || price.includes('L')) {
    return val;
  }
  return val / 100000; // Value in Lakhs from absolute Rupees
};

const parseRent = (price: string): number => {
  const clean = price.replace(/[^\d.]/g, '');
  return parseFloat(clean) || 0;
};

const Container = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Navbar = ({ 
  activeView, 
  setView, 
  wishlistCount, 
  onOpenMobileWishlist,
  currentUser,
  onLogout,
  registeredUsers
}: { 
  activeView: View, 
  setView: (v: View) => void, 
  wishlistCount: number,
  onOpenMobileWishlist: () => void,
  currentUser: string | null,
  onLogout: () => void,
  registeredUsers: Record<string, { pw: string; name: string; email: string }>
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: View[] = ['Home', 'Buy', 'Rent', 'Sell', 'Help'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-5'}`}>
      <div className="bg-emerald-600 text-white text-[10px] sm:text-xs py-1 text-center font-medium tracking-wide">
        EXACT PROPERTY DETAILS REVEALED ONLY AFTER INQUIRY APPROVAL
      </div>
      <Container className="flex items-center justify-between mt-1">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => { setView('Home'); window.scrollTo(0, 0); }}
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">V</div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">VRUDDHI <span className="text-emerald-600 font-medium">PROPERTIES</span></span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => { setView(item); window.scrollTo(0, 0); }}
              className={`text-sm font-semibold tracking-wide transition-colors hover:text-emerald-600 ${activeView === item ? 'text-emerald-600' : 'text-slate-600'}`}
            >
              {item}
            </button>
          ))}
          {currentUser === 'Admin_2007' && (
            <button
              onClick={() => { setView('AdminDashboard'); window.scrollTo(0, 0); }}
              className={`text-sm font-bold tracking-wide transition-colors flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100`}
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <button 
            onClick={() => { setView('Wishlist'); window.scrollTo(0, 0); }}
            className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors mr-1"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {currentUser ? (
            currentUser === 'Admin_2007' ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 uppercase font-mono">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Admin
                </span>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 transition-all outline-none"
                >
                  Sign Out
                </button>
              </div>
            ) : (() => {
              const userObj = registeredUsers && registeredUsers[currentUser];
              const name = userObj ? userObj.name : currentUser;
              const initial = name.trim().charAt(0).toUpperCase();

              return (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { setView('UserDashboard'); window.scrollTo(0, 0); }}
                    className={`text-sm font-bold tracking-wide transition-colors hover:text-emerald-600 ${activeView === 'UserDashboard' ? 'text-emerald-600' : 'text-slate-600'}`}
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => { setView('UserDashboard'); window.scrollTo(0, 0); }}
                    className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-emerald-100/60 hover:scale-105 active:scale-95 transition-transform shrink-0 outline-none select-none cursor-pointer"
                    title={`Dashboard: ${name}`}
                    id="userAvatarHeader"
                  >
                    {initial}
                  </button>
                </div>
              );
            })()
          ) : (
            <button 
              onClick={() => { setView('Auth'); window.scrollTo(0, 0); }}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-sm cursor-pointer outline-none"
              id="signInHeaderBtn"
            >
              Sign In
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Heart (Wishlist) Icon */}
          <button 
            onClick={onOpenMobileWishlist}
            className="relative p-2 text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer outline-none"
          >
            <Heart className={`w-6 h-6 ${wishlistCount > 0 ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-emerald-600 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button className="p-2 text-slate-900 cursor-pointer outline-none" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-slate-50 z-[100] flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">VRUDDHI <span className="text-emerald-600 font-medium font-sans text-xs uppercase tracking-wide font-bold">Menu</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-800 outline-none"><X className="w-8 h-8" /></button>
            </div>
            
            <div className="flex flex-col gap-6 text-left">
              {navItems.map(item => (
                <button
                  key={item}
                  onClick={() => { setView(item); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                  className={`text-3xl font-extrabold text-left transition-colors outline-none cursor-pointer ${activeView === item ? 'text-emerald-600' : 'text-slate-950'}`}
                >
                  {item}
                </button>
              ))}
              {currentUser === 'Admin_2007' && (
                <button
                  onClick={() => { setView('AdminDashboard'); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                  className={`text-3xl font-bold text-left text-emerald-600 outline-none cursor-pointer`}
                >
                  Admin Panel
                </button>
              )}
            </div>
            
            <div className="mt-auto pt-8 border-t border-slate-200 flex flex-col gap-4 text-left">
              {currentUser ? (
                currentUser === 'Admin_2007' ? (
                  <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 text-sm font-bold flex items-center justify-center rounded-xl font-mono uppercase">ADM</div>
                      <div className="text-left">
                        <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Logged In As</span>
                        <span className="text-sm font-extrabold text-slate-800 block">Administrator</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      className="w-full py-4 bg-slate-950 text-white rounded-2xl font-extrabold text-lg transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 outline-none cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (() => {
                  const userObj = registeredUsers && registeredUsers[currentUser];
                  const name = userObj ? userObj.name : currentUser;
                  const initial = name.trim().charAt(0).toUpperCase();

                  return (
                    <div className="space-y-4">
                      <button 
                        onClick={() => { setView('UserDashboard'); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                        className="w-full bg-white p-4 rounded-[1.5rem] flex items-center gap-4 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer outline-none text-left"
                      >
                        <div className="w-12 h-12 bg-emerald-600 text-white text-lg font-black flex items-center justify-center rounded-full border border-emerald-50 shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs text-emerald-600 font-extrabold block uppercase tracking-wider">Personal Dashboard ➜</span>
                          <span className="text-base font-black text-slate-900 block truncate">{name}</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                        className="w-full py-4 bg-slate-950 text-white rounded-2xl font-extrabold text-lg transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 outline-none cursor-pointer"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  );
                })()
              ) : (
                <>
                  <button 
                    onClick={() => { setView('Auth'); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-extrabold text-lg shadow-lg active:scale-95 transition-transform cursor-pointer outline-none"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setView('Auth'); setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-extrabold text-lg active:scale-95 transition-transform shadow-sm cursor-pointer outline-none"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PropertyCard = ({ 
  property, 
  isWishlisted, 
  onToggleWishlist, 
  onViewDetails,
  isAdmin,
  onDelete
}: { 
  property: Property, 
  isWishlisted: boolean, 
  onToggleWishlist: () => void, 
  onViewDetails?: (p: Property) => void,
  isAdmin?: boolean,
  onDelete?: (id: string) => void,
  key?: string 
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer relative"
      onClick={() => onViewDetails?.(property)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null; 
            e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        
        {/* Heart Overlay */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:scale-110 active:scale-90 transition-all"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-emerald-600 text-emerald-600' : 'text-slate-900'}`} />
        </button>

        {/* Purpose Tag */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider text-slate-900 uppercase">
          For {property.purpose}
        </div>

        {/* Blurred Map Overlay */}
        {property.isBlurred && (
          <div className="absolute inset-x-4 bottom-4 z-10 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <EyeOff className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-tight">
                Exact Address Restricted
              </p>
              <p className="text-white/60 text-[9px] mt-1 font-medium">Inquire to view pinpoint on map</p>
            </div>
            {/* Mock map background */}
            <div className="w-full h-24 bg-slate-200 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{property.title}</h3>
            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-emerald-600">{property.price}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-slate-50 mt-4 mb-5">
          <div className="flex items-center gap-1.5">
            <HomeIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">{property.bhk}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            <span className="text-xs font-semibold text-slate-600">{property.type}</span>
          </div>
          <div className="ml-auto">
             <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">VERIFIED</span>
          </div>
        </div>

        <div className="flex gap-2">
          {showConfirmDelete ? (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="w-full flex items-center justify-between bg-slate-900 border border-slate-850 text-white rounded-2xl p-1.5 h-[50px] animate-fade-in"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-2.5 shrink-0">Delete property?</span>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete?.(property.id); 
                    setShowConfirmDelete(false); 
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer outline-none transition-all"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowConfirmDelete(false); 
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer outline-none transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onViewDetails?.(property); }}
                className={`py-3.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-900 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn ${isAdmin && onDelete ? 'flex-1' : 'w-full'}`}
              >
                View Details
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
              {isAdmin && onDelete && (
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowConfirmDelete(true); 
                  }}
                  className="p-3.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 transition-all cursor-pointer outline-none flex items-center justify-center shrink-0"
                  title="Delete this property"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TrustBanner = ({ title, items }: { title: string, items: { text: string }[] }) => (
  <div className="bg-slate-900 py-12 text-white overflow-hidden relative">
    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[120px] rounded-full"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full"></div>
    <Container>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-wide text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </div>
);

const SearchBar = ({ purpose, onSearch }: { purpose: string, onSearch: (city: string, type: string, range: string) => void }) => {
  const [openDropdown, setOpenDropdown] = useState<'location' | 'type' | 'budget' | null>(null);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Properties');
  const [selectedRange, setSelectedRange] = useState('Any Range');

  const cities = ['All Cities', 'Mumbai', 'Bangalore', 'Gurgaon', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur', 'Delhi'];
  const types = ['All Properties', 'Flat / Apartment', 'Villa / House', 'Residential Plot', 'Commercial Office'];
  const budgets = purpose === 'Rent' 
    ? ['Any Range', 'Under ₹20,000', '₹20k - ₹50k', '₹50k - ₹1 Lakh', 'Above ₹1 Lakh']
    : ['Any Range', 'Under ₹50 Lakhs', '₹50 Lakhs - ₹2 Cr', '₹2 Cr - ₹5 Cr', 'Above ₹5 Cr'];

  const handleSearch = () => {
    onSearch(selectedCity, selectedType, selectedRange);
  };

  return (
    <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-slate-100 max-w-4xl mx-auto -mt-10 relative z-20">
      {/* Location Dropdown */}
      <div className="flex-1 w-full md:w-auto px-6 py-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100 group relative">
        <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
        <div 
          className="flex flex-col flex-1 cursor-pointer"
          onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</span>
          <span className="text-sm font-bold text-slate-800 flex items-center justify-between">
            {selectedCity}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
          </span>
        </div>
        
        <AnimatePresence>
          {openDropdown === 'location' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-y-auto max-h-60"
            >
              {cities.map(c => (
                <button 
                  key={c}
                  onClick={() => { setSelectedCity(c); setOpenDropdown(null); }}
                  className="w-full px-6 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  {c}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Type Dropdown */}
      <div className="flex-1 w-full md:w-auto px-6 py-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100 group relative">
        <HomeIcon className="w-5 h-5 text-emerald-600 shrink-0" />
        <div 
          className="flex flex-col flex-1 cursor-pointer"
          onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
          <span className="text-sm font-bold text-slate-800 flex items-center justify-between">
            {selectedType}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
          </span>
        </div>
        
        <AnimatePresence>
          {openDropdown === 'type' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden"
            >
              {types.map(t => (
                <button 
                  key={t}
                  onClick={() => { setSelectedType(t); setOpenDropdown(null); }}
                  className="w-full px-6 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  {t}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Budget/Rent Dropdown */}
      <div className="flex-1 w-full md:w-auto px-6 py-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100 group relative">
        <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
        <div 
          className="flex flex-col flex-1 cursor-pointer"
          onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{purpose === 'Rent' ? 'Rent' : 'Budget'}</span>
          <span className="text-sm font-bold text-slate-800 flex items-center justify-between">
            {selectedRange}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDropdown === 'budget' ? 'rotate-180' : ''}`} />
          </span>
        </div>

        <AnimatePresence>
          {openDropdown === 'budget' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden"
            >
              {budgets.map(b => (
                <button 
                  key={b}
                  onClick={() => { setSelectedRange(b); setOpenDropdown(null); }}
                  className="w-full px-6 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  {b}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-2 py-2 flex items-center gap-2 w-full md:w-auto">
        <button className="flex items-center gap-2 px-4 py-3 text-slate-500 hover:text-emerald-600 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-bold">More</span>
        </button>
        <button 
          onClick={handleSearch}
          className="flex-1 md:flex-none px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all font-sans"
        >
          Search
        </button>
      </div>
    </div>
  );
};

// Views
const HomeView = ({ onSetView, wishlist, onToggleWishlist, onViewDetails, properties, isAdmin, onDeleteProperty }: { onSetView: (v: View) => void, wishlist: string[], onToggleWishlist: (id: string) => void, onViewDetails: (p: Property) => void, properties: Property[], isAdmin?: boolean, onDeleteProperty?: (id: string) => void }) => (
  <div className="pt-20">
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden py-24">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[120%] bg-emerald-50 rounded-l-[100px] -skew-x-6 -z-10 translate-x-32"></div>
      <div className="absolute top-[20%] left-[-10%] w-64 h-64 bg-emerald-600/5 blur-[120px] rounded-full"></div>
      
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              INDIA'S FIRST PRIVACY-CENTRIC MARKETPLACE
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold leading-[1.1] text-slate-900 mb-8">
              Properties <br />
              With <span className="text-emerald-600 underline decoration-slate-200 underline-offset-8">Discretion.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
              Find your next home without exposing your search. Exact locations and contact details 
              are revealed only after mutual interest and approval.
            </p>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">How It Works</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: Search, title: "Discover", desc: "Browse specs & localities" },
                  { icon: MessageSquare, title: "Inquire", desc: "Submit secure interest" },
                  { icon: Key, title: "Connect", desc: "Unlock full address" }
                ].map((step, idx) => (
                  <div key={idx} className="group flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center transition-all group-hover:bg-emerald-600 group-hover:text-white">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <button 
                onClick={() => onSetView('Buy')}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all text-lg"
              >
                Browse Listings
              </button>
              <button 
                onClick={() => onSetView('Sell')}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold shadow-sm hover:border-emerald-600 hover:text-emerald-600 transition-all text-lg"
              >
                List Your Property
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] text-right mb-6">Featured Collections</h2>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-6 pt-12">
                   {properties.slice(0, 1).map(p => (
                     <PropertyCard key={p.id} property={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={() => onToggleWishlist(p.id)} onViewDetails={onViewDetails} isAdmin={isAdmin} onDelete={onDeleteProperty} />
                   ))}
                 </div>
                 <div className="space-y-6">
                   {properties.slice(1, 3).map(p => (
                     <PropertyCard key={p.id} property={p} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={() => onToggleWishlist(p.id)} onViewDetails={onViewDetails} isAdmin={isAdmin} onDelete={onDeleteProperty} />
                   ))}
                 </div>
              </div>
            </div>
            {/* Visual Accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/10 blur-[60px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-600/5 blur-[80px] rounded-full"></div>
          </motion.div>
        </div>
      </Container>
    </section>

    <Container className="pb-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Trending Near You</h2>
          <p className="text-slate-500 font-medium">Handpicked premium properties in top localities.</p>
        </div>
        <button onClick={() => onSetView('Buy')} className="group flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
          View All <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.slice(3, 9).map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            isWishlisted={wishlist.includes(property.id)} 
            onToggleWishlist={() => onToggleWishlist(property.id)} 
            onViewDetails={onViewDetails}
            isAdmin={isAdmin}
            onDelete={onDeleteProperty}
          />
        ))}
      </div>
    </Container>

    <TrustBanner 
      title="Why Trust Vruddhi?"
      items={[
        { text: "Privacy-Hidden Locations" },
        { text: "Verified Direct Sellers" },
        { text: "No Public Contact Exposure" },
        { text: "Secure Inquiry System" }
      ]}
    />
  </div>
);

const BuyView = ({ wishlist, onToggleWishlist, onViewDetails, properties, isAdmin, onDeleteProperty }: { wishlist: string[], onToggleWishlist: (id: string) => void, onViewDetails: (p: Property) => void, properties: Property[], isAdmin?: boolean, onDeleteProperty?: (id: string) => void }) => {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Properties');
  const [selectedRange, setSelectedRange] = useState('Any Range');

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (p.purpose !== 'Buy') return false;
      
      // City matching
      if (selectedCity !== 'All Cities') {
        if (!p.location.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      // Type matching
      if (selectedType !== 'All Properties') {
        const typeMap: Record<string, string> = {
          'Flat / Apartment': 'Flat',
          'Villa / House': 'Villa',
          'Residential Plot': 'Plot'
        };
        const propType = typeMap[selectedType];
        if (propType && p.type !== propType) {
          return false;
        }
      }

      // Budget matching
      if (selectedRange !== 'Any Range') {
        const parsedPrice = parsePrice(p.price); // parsed in lakhs
        if (selectedRange === 'Under ₹50 Lakhs' && parsedPrice >= 50) return false;
        if (selectedRange === '₹50 Lakhs - ₹2 Cr' && (parsedPrice < 50 || parsedPrice > 200)) return false;
        if (selectedRange === '₹2 Cr - ₹5 Cr' && (parsedPrice < 200 || parsedPrice > 500)) return false;
        if (selectedRange === 'Above ₹5 Cr' && parsedPrice <= 500) return false;
      }

      return true;
    });
  }, [properties, selectedCity, selectedType, selectedRange]);

  const handleSearch = (city: string, type: string, budget: string) => {
    setSelectedCity(city);
    setSelectedType(type);
    setSelectedRange(budget);
  };

  return (
    <div className="pt-20">
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Buy Your Property <br />
              <span className="text-emerald-500 italic">In Minutes.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Discover thousands of premium homes, villas, and residential plots across India. 
              The exact address stays private until you decide to take the next step.
            </p>
          </motion.div>
        </Container>
      </section>

      <Container>
        <SearchBar purpose="Buy" onSearch={handleSearch} />
      </Container>

      <Container className="py-24">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{filtered.length} Properties Found</h2>
            {(selectedCity !== 'All Cities' || selectedType !== 'All Properties' || selectedRange !== 'Any Range') && (
              <p className="text-sm text-emerald-600 font-bold mt-1">
                Filters: {selectedCity} • {selectedType} • {selectedRange}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500">Sort by:</span>
            <select className="bg-white border-slate-200 text-sm font-bold rounded-xl px-4 py-2 cursor-pointer focus:ring-emerald-600">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isWishlisted={wishlist.includes(property.id)} 
                onToggleWishlist={() => onToggleWishlist(property.id)} 
                onViewDetails={onViewDetails}
                isAdmin={isAdmin}
                onDelete={onDeleteProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No properties match your search</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Try adjusting your filters, location, or configurations to browse more off-market listings.</p>
            <button 
              onClick={() => { setSelectedCity('All Cities'); setSelectedType('All Properties'); setSelectedRange('Any Range'); }}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>

      <TrustBanner 
        title="Why Buy with Us?" 
        items={[
          { text: "Verified Residential Listings" },
          { text: "No Broker Spam" },
          { text: "Encrypted Privacy" },
          { text: "Direct Interaction Management" }
        ]}
      />
    </div>
  );
};

const RentView = ({ wishlist, onToggleWishlist, onViewDetails, properties, isAdmin, onDeleteProperty }: { wishlist: string[], onToggleWishlist: (id: string) => void, onViewDetails: (p: Property) => void, properties: Property[], isAdmin?: boolean, onDeleteProperty?: (id: string) => void }) => {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Properties');
  const [selectedRange, setSelectedRange] = useState('Any Range');

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (p.purpose !== 'Rent') return false;
      
      // City matching
      if (selectedCity !== 'All Cities') {
        if (!p.location.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      // Type matching
      if (selectedType !== 'All Properties') {
        const typeMap: Record<string, string> = {
          'Flat / Apartment': 'Flat',
          'Villa / House': 'Villa',
          'Residential Plot': 'Plot'
        };
        const propType = typeMap[selectedType];
        if (propType && p.type !== propType) {
          return false;
        }
      }

      // Budget matching
      if (selectedRange !== 'Any Range') {
        const rentAmount = parseRent(p.price);
        if (selectedRange === 'Under ₹20,000' && rentAmount >= 20000) return false;
        if (selectedRange === '₹20k - ₹50k' && (rentAmount < 20000 || rentAmount > 50000)) return false;
        if (selectedRange === '₹50k - ₹1 Lakh' && (rentAmount < 50000 || rentAmount > 100000)) return false;
        if (selectedRange === 'Above ₹1 Lakh' && rentAmount <= 100000) return false;
      }

      return true;
    });
  }, [properties, selectedCity, selectedType, selectedRange]);

  const handleSearch = (city: string, type: string, budget: string) => {
    setSelectedCity(city);
    setSelectedType(type);
    setSelectedRange(budget);
  };

  return (
    <div className="pt-20">
      <section className="bg-emerald-600 py-24 relative overflow-hidden">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Rent Your Property <br />
              <span className="text-slate-900">In Minutes.</span>
            </h1>
            <p className="text-lg text-emerald-50 font-medium leading-relaxed">
              Exclusively verified rental listings from top cities. Your privacy is our priority, 
              connecting tenants and landlords with maximum security.
            </p>
          </motion.div>
        </Container>
      </section>

      <Container>
        <SearchBar purpose="Rent" onSearch={handleSearch} />
      </Container>

      <Container className="py-24">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{filtered.length} Rental Units</h2>
            {(selectedCity !== 'All Cities' || selectedType !== 'All Properties' || selectedRange !== 'Any Range') && (
              <p className="text-sm text-emerald-600 font-bold mt-1">
                Filters: {selectedCity} • {selectedType} • {selectedRange}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500">Filters:</span>
            <div className="flex gap-2">
               {['Bachelors', 'Family', 'Company'].map(tag => (
                 <button key={tag} className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all">
                   {tag}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isWishlisted={wishlist.includes(property.id)} 
                onToggleWishlist={() => onToggleWishlist(property.id)} 
                onViewDetails={onViewDetails}
                isAdmin={isAdmin}
                onDelete={onDeleteProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No rentals match your search</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Try adjusting your filters, location, or rent amount to find more off-market verified listings.</p>
            <button 
              onClick={() => { setSelectedCity('All Cities'); setSelectedType('All Properties'); setSelectedRange('Any Range'); }}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>

      <TrustBanner 
        title="Why Rent with Us?" 
        items={[
           { text: "Verified Landlords" },
           { text: "Tenant Privacy Shield" },
           { text: "Secure Agreement Flow" },
           { text: "Zero Fake Listings Policy" }
        ]} 
      />
    </div>
  );
};

const SellView = ({ onAddListingRequest }: { onAddListingRequest: (req: any) => void }) => {
  const [purpose, setPurpose] = useState<'Sell' | 'Rent'>('Sell');
  const [propertyType, setPropertyType] = useState('Flat / Apartment');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('3 BHK');
  const [price, setPrice] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; preview: string }[]>([]);

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files) as File[];
      const newAttached = filesArr.map(file => ({
        name: file.name,
        preview: URL.createObjectURL(file)
      }));
      setAttachedFiles(prev => [...prev, ...newAttached]);
      
      // Use the first attached file preview as the listing image
      if (newAttached.length > 0) {
        setImageUrl(newAttached[0].preview);
      }
    }
  };

  const removeAttachedFile = (idx: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setAttachedFiles(prev => {
      const filtered = prev.filter((_, i) => i !== idx);
      if (filtered.length > 0) {
        setImageUrl(filtered[0].preview);
      } else {
        setImageUrl('');
      }
      return filtered;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a descriptive Property Title.');
      return;
    }
    if (!city.trim() || !locality.trim()) {
      setError('Both City and Locality details are required.');
      return;
    }
    if (!price.trim()) {
      setError('Expected pricing details are required (e.g. ₹1.5 Cr).');
      return;
    }
    if (!fullName.trim()) {
      setError('Your Full Name is required for private admin verification.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid Email Address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit Phone Number.');
      return;
    }

    onAddListingRequest({
      title,
      purpose,
      propertyType,
      city,
      locality,
      bhk,
      price,
      fullName,
      email,
      phone,
      image: imageUrl.trim()
    });

    setSubmitted(true);
  };

  return (
    <div className="pt-20">
    <section className="bg-slate-50 py-24 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
              Sell or Rent <br />
              <span className="text-emerald-600 underline underline-offset-8 decoration-emerald-100">Directly.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
              Join 50,000+ owners who list their properties with complete peace of mind. 
              No spam calls. No public snooping. Just verified inquiries.
            </p>

            <div className="space-y-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Why List with Vruddhi?</h3>
              {[
                { icon: ShieldCheck, title: "Verified Buyers Only", desc: "Every inquiry is manual-checked for authenticity before reaching you." },
                { icon: Phone, title: "No Spam Calls", desc: "Your contact details are never public. We use masked connecting." },
                { icon: EyeOff, title: "Privacy Protection", desc: "Hide your exact unit number and house name till approval." },
                { icon: CheckCircle2, title: "Fast Visibility", desc: "AI-driven matching connects you with the right leads instantly." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                   <div className="shrink-0 w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8 text-emerald-600">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Response Submitted! 🎉</h2>
                <div className="bg-emerald-50 text-emerald-800 rounded-3xl p-6 mb-8 text-sm font-semibold max-w-md mx-auto leading-relaxed border border-emerald-100">
                  Your off-market {propertyType.toLowerCase()} proposal <strong>"{title}"</strong> has been queued for verification. Our security administrators will review your credentials and approve your listing within 2 hours.
                </div>
                <p className="text-slate-500 text-sm mb-8 font-medium">
                  A verification email was sent to <strong>{email}</strong>. Please check your inbox shortly.
                </p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setTitle('');
                    setCity('');
                    setLocality('');
                    setPrice('');
                    setFullName('');
                    setEmail('');
                    setPhone('');
                  }}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-sm transition-all shadow-lg"
                >
                  List Another Property
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white"><Plus className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Listing</h2>
                </div>
                
                {error && (
                  <div className="p-4 mb-6 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">I want to...</label>
                      <div className="grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl">
                        <button 
                          type="button" 
                          onClick={() => setPurpose('Sell')}
                          className={`py-3 rounded-xl font-bold text-sm transition-all ${purpose === 'Sell' ? 'bg-white text-emerald-600 border shadow-sm' : 'text-slate-500'}`}
                        >
                          Sell
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPurpose('Rent')}
                          className={`py-3 rounded-xl font-bold text-sm transition-all ${purpose === 'Rent' ? 'bg-white text-emerald-600 border shadow-sm' : 'text-slate-500'}`}
                        >
                          Rent
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Type</label>
                      <select 
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option>Flat / Apartment</option>
                        <option>Villa / House</option>
                        <option>Residential Plot</option>
                        <option>Commercial Office</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 3BHK Luxury Flat in Bandra West" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none" 
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location Details</label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="City" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="Locality / Area" 
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 px-1">Note: Exact map pinpointing is disabled by default for your privacy.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">BHK</label>
                      <select 
                        value={bhk}
                        onChange={(e) => setBhk(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option>1 BHK</option>
                        <option>2 BHK</option>
                        <option>3 BHK</option>
                        <option>4 BHK</option>
                        <option>5+ BHK</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bathrooms</label>
                      <select className="bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Furnishing</label>
                      <select className="bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 outline-none">
                        <option>Unfurnished</option>
                        <option>Semi-Furnished</option>
                        <option>Fully Furnished</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carpet Area (sq.ft)</label>
                      <input type="number" placeholder="e.g. 1200" className="bg-slate-50 border-none rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Age (Years)</label>
                      <input type="number" placeholder="e.g. 5" className="bg-slate-50 border-none rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Price / Rent</label>
                      <input 
                        type="text" 
                        placeholder={purpose === 'Sell' ? "e.g. ₹1.5 Cr" : "e.g. ₹45,000/mo"} 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                     <input type="checkbox" id="negotiable" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 outline-none" />
                     <label htmlFor="negotiable" className="text-sm font-bold text-slate-700">Price is Negotiable</label>
                  </div>

                  <div className="space-y-4">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="hidden" 
                    />

                    <div 
                      onClick={handleDropzoneClick}
                      className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer relative"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors mb-3 shadow-sm">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">Drop/select photos here</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1">Accepts PNG, JPG, WEBP (Multiple allowed)</span>
                      
                      {attachedFiles.length > 0 && (
                        <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-3 w-full" onClick={e => e.stopPropagation()}>
                          {attachedFiles.map((file, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group/thumb border border-slate-200 shadow-sm">
                              <img src={file.preview} alt="attached thumbnail" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => removeAttachedFile(idx, e)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[10px] font-black shadow-md cursor-pointer outline-none select-none"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h3 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Secure Admin Verification Credentials
                    </h3>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Your Full Name" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-emerald-100 rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none" 
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white border border-emerald-100 rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none" 
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-white border border-emerald-100 rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none" 
                        />
                      </div>
                      <div className="flex items-start gap-3 mt-2">
                        <div className="shrink-0 w-5 h-5 rounded border border-emerald-200 bg-white flex items-center justify-center text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] sm:text-xs text-emerald-700/70 leading-relaxed font-semibold">
                          This information is STRICTLY for Admin verification purposes. 
                          We will never display your contact details publicly. 
                          Buyers connect via our secure messaging system.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                    <div className="shrink-0 text-slate-400">
                      <ArrowRight className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-sm font-bold text-slate-900 mb-1">List & Connect Safely</p>
                      <p className="text-xs text-slate-400 font-medium">Get inquiries, approve profiles, and sell fast.</p>
                    </div>
                    <button type="submit" className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all outline-none">
                      List Property
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  </div>
  );
};

const HelpView = ({ onAddHelpRequest }: { onAddHelpRequest: (req: any) => void }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Form States
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportText, setSupportText] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [docPopup, setDocPopup] = useState<{ title: string, content: string } | null>(null);

  const categories = [
    { 
      id: 'safety', 
      icon: ShieldCheck, 
      title: "Account & Safety", 
      color: "text-emerald-600 bg-emerald-50",
      info: "At Vruddhi, we use multi-factor authentication and bank-grade encryption to protect your data. Every listing is manually reviewed to prevent fraud.",
      fullDoc: "Security Best Practices & Verified Accounts Guidelines.\n\nTo safeguard against identity theft and scammers, Vruddhi maintains an end-to-end encrypted database. Here is how to stay absolutely safe:\n\n1. Never transfer search deposits or reservation token fees before physically viewing the estate and verifying credentials.\n2. Keep all buyer-seller chat correspondence directly on the Vruddhi platform. Our administrators monitor text logs to isolate scam activity.\n3. Report any seller account demanding unexpected premium verification deposits outside our automated plans.\n\nYour account is actively defended 24/7 by our security analysts."
    },
    { 
      id: 'listing', 
      icon: HomeIcon, 
      title: "Listing Guide", 
      color: "text-blue-600 bg-blue-50",
      info: "To get the best leads, upload high-resolution images, provide accurate BHK/Carpet area details, and verify your ID for the 'Verified Seller' badge.",
      fullDoc: "A Complete Guide to High-Converting Privacy Listings.\n\nPresenting properties anonymously requires accurate specifications to filter out bad matches. Follow these optimization steps:\n\n1. Highlight key connectivity: Mention proximity to popular metro lines, corporate tech hubs, and high-end malls instead of specific street names.\n2. Fill out detailed specifications: State exact carpet size, water connection source, society amenities, and expected furnishing quality.\n3. Request the 'Verified Direct Owner Badge' by uploading your regional property tax records. Listings with this indicator receive 5x higher premium score matching."
    },
    { 
      id: 'inquiry', 
      icon: MessageSquare, 
      title: "Inquiry System", 
      color: "text-purple-600 bg-purple-50",
      info: "Interested parties must submit a formal inquiry. You can see their profile and previous verified deals before revealing your property's exact address.",
      fullDoc: "Unlocking Exact Locations: Our Privacy-First Inquiry Protocol.\n\nWhen a candidate buyer wants to check out your listed property:\n\n1. They are prompted to submit a official secure inquiry explaining their requirements.\n2. You receive an alert detailing their verified background record, secure budget approval, and activity history. Your identity stays anonymous.\n3. Clicking 'Approve' will instantly unlock the encrypted address pinpoint on Google maps and share your masked contact details with them automatically."
    },
    { 
      id: 'premium', 
      icon: TrendingUp, 
      title: "Premium Plans", 
      color: "text-amber-600 bg-amber-50",
      info: "Subscribe to our priority visibility plans to get 5x more clicks. Featured properties stay at the top of search results in their specific localities.",
      fullDoc: "Unlock Maximum Reach with Premium Visibility Packages.\n\nAre you looking to close transactions rapidly? Vruddhi handles high-converting priority placements safely:\n\n1. Gold Plan (₹1,999 for 30 days): Puts your listing on 3 popular locality search highlights.\n2. Platinum Plan (₹4,999 for 45 days): Grants a dedicated real estate verified relationship manager, priority matching alerts, and pins your anonymous apartment to our high-exposure listing sliders."
    }
  ];

  const faqs = [
    { q: "Why is the exact property location hidden?", a: "To prevent unauthorized walk-ins and common real estate scams, we hide exact house numbers/pinpoints until the owner approves your inquiry. This ensures both parties are serious and privacy is maintained." },
    { q: "How do I see the full property address?", a: "Submit an inquiry for the property. Once the owner reviews your profile and approves the interest, the exact address, landmark, and unit details will be unlocked for you." },
    { q: "How is my contact data protected?", a: "Vruddhi never displays your phone number or email publicly. All initial communication happens through our secure bridging system. You control who gets to see your contact details." },
    { q: "Can I list my property for free?", a: "Yes, currently we offer basic free listings for individual owners to promote direct peer-to-peer real estate transactions without high brokerage costs." },
    { q: "What does 'Verified Direct Seller' mean?", a: "It means our team has manually cross-checked the ownership documents of the property to ensure you are dealing with the actual owner or their authorized legal representative." },
    { q: "What should I do if a buyer/seller seems suspicious?", a: "Immediately report the profile using the 'Report' button on their message or listing. Our safety team investigates all reports within 4 working hours." }
  ];

  const handleSupportForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');

    if (!supportName.trim() || !supportEmail.trim() || !supportText.trim() || !supportEmail.includes('@')) {
      setFormStatus('error');
      return;
    }

    onAddHelpRequest({
      name: supportName,
      email: supportEmail,
      message: supportText
    });

    setFormStatus('success');
  };

  return (
    <div className="pt-20">
      <section className="bg-slate-900 py-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <Container className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight font-sans">How Can We <span className="text-emerald-500">Secure</span> You?</h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Your privacy is our priority. We never expose exact location or 
              personal contact details publicly without your explicit consent.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`p-10 rounded-[2.5rem] border transition-all text-center group ${activeCategory === cat.id ? 'bg-white border-emerald-600 shadow-xl ring-2 ring-emerald-500/20' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
              >
                 <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all ${activeCategory === cat.id ? 'bg-emerald-600 text-white' : cat.color}`}>
                   <cat.icon className="w-8 h-8" />
                 </div>
                 <h3 className={`text-lg font-bold transition-colors ${activeCategory === cat.id ? 'text-emerald-600' : 'text-slate-800'}`}>{cat.title}</h3>
                 <div className={`mt-4 h-0.5 w-8 mx-auto rounded-full transition-all ${activeCategory === cat.id ? 'bg-emerald-500 w-12' : 'bg-slate-100'}`}></div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-16 overflow-hidden"
              >
                <div className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 text-left">
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600">
                       {React.createElement(categories.find(c => c.id === activeCategory)?.icon || ShieldCheck, { className: "w-6 h-6" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900 mb-3">{categories.find(c => c.id === activeCategory)?.title} Details</h3>
                      <p className="text-emerald-800 font-medium leading-relaxed max-w-3xl">
                        {categories.find(c => c.id === activeCategory)?.info}
                      </p>
                      <button 
                        onClick={() => {
                          const catObj = categories.find(c => c.id === activeCategory);
                          if (catObj) {
                            setDocPopup({ title: catObj.title, content: catObj.fullDoc });
                          }
                        }}
                        className="mt-6 flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all cursor-pointer font-sans text-sm"
                      >
                        Read full documentation <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detailed Documentation Popup Modal */}
          <AnimatePresence>
            {docPopup && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 sm:p-12 shadow-2xl relative text-left"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-extrabold text-slate-900">{docPopup.title} - Full Guide</h3>
                    <button 
                      onClick={() => setDocPopup(null)}
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-slate-600 space-y-4 max-h-[50vh] overflow-y-auto pr-2 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                    {docPopup.content}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                    <button 
                      onClick={() => setDocPopup(null)}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Got It, Thanks
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-20 text-left">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-10 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                Frequently Asked 
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={`overflow-hidden rounded-3xl border transition-all ${openFaq === idx ? 'bg-white border-emerald-600 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between outline-none"
                    >
                      <span className="font-bold text-slate-800 leading-tight pr-4">{faq.q}</span>
                      {openFaq === idx ? <ChevronUp className="w-5 h-5 shrink-0 text-emerald-600" /> : <ChevronDown className="w-5 h-5 shrink-0 text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="px-8 pb-8"
                        >
                          <p className="text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-6">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-14 text-white overflow-hidden relative sticky top-32">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-600/20 blur-[100px] rounded-full"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-extrabold mb-4">Still Need Help?</h2>
                  <p className="text-slate-400 font-medium mb-10">Our 24/7 dedicated support team is here to assist you with any concerns.</p>
                  
                  <div className="mb-10">
                    <div className="flex items-center gap-4 p-8 bg-white/5 rounded-3xl border border-white/10">
                       <Mail className="w-8 h-8 text-emerald-400 shrink-0" />
                       <div>
                         <span className="font-bold text-white block">Email Support Channel</span>
                         <span className="text-xs text-slate-400 font-semibold block mt-1">Direct escalation desk (support@vruddhi.in)</span>
                       </div>
                    </div>
                  </div>

                  {formStatus === 'success' ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-emerald-950/80 border border-emerald-500/25 rounded-3xl"
                    >
                      <span className="text-4xl mb-4 block">✓</span>
                      <h4 className="text-lg font-bold text-white mb-2">Response submitted!</h4>
                      <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                        Your problem has been noted and will be solved soon. Our lead support engineer is investigating your inquiry.
                      </p>
                      <button 
                        onClick={() => {
                          setSupportName('');
                          setSupportEmail('');
                          setSupportText('');
                          setFormStatus('idle');
                        }}
                        className="mt-6 px-4 py-2 bg-white text-slate-900 font-bold rounded-xl text-xs"
                      >
                        Submit Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSupportForm}>
                      {formStatus === 'error' && (
                        <p className="text-rose-400 text-xs font-bold bg-rose-950/60 p-3 rounded-xl border border-rose-500/25">
                          ⚠️ Please enter valid credentials.
                        </p>
                      )}
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={supportName}
                        onChange={(e) => setSupportName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                      />
                      <textarea 
                        placeholder="How can we help?" 
                        rows={4} 
                        value={supportText}
                        onChange={(e) => setSupportText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                      />
                      <button type="submit" className="w-full py-5 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-extrabold shadow-lg transition-all outline-none">Submit Case</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

const LocalitiesView = ({ onSetView }: { onSetView: (v: View) => void }) => {
  const localitiesList = [
    { city: "Mumbai", area: "Bandra West", listings: 12, desc: "Bandra West is Mumbai's premier beachfront lifestyle suburb, offering immediate proximity to high-end designer stores, stellar sea-views, and unmatched connectivity.", tags: ["Elite Suburb", "Sea Proximity", "Celebrity Neighborhood"] },
    { city: "Mumbai", area: "Worli", listings: 8, desc: "A prestigious commercial and high-density residential zone in South Mumbai, Worli is defined by elite high-rise skyscrapers, unobstructed vistas of the Arabian Sea, and corporate accessibility.", tags: ["Marina Views", "Ultra Luxury", "Financial Hub"] },
    { city: "Delhi NCR", area: "South Delhi", listings: 15, desc: "Distinguished by secure diplomatic avenues, lush green parks, and high-heritage designer boutiques, South Delhi remains the absolute peak of legacy residential prestige.", tags: ["Legacy Estates", "Abundant Greenery", "Elite Address"] },
    { city: "Bangalore", area: "Whitefield", listings: 19, desc: "A robust global information technology ecosystem paired with exquisite gated high-rise layouts, Whitefield represents Bangalore's first-choice sanctuary for corporate personnel.", tags: ["IT Corridor", "Gated Communities", "Modern Lifestyle"] },
    { city: "Hyderabad", area: "Cyber City / Gachibowli", listings: 14, desc: "Hyderabad's fast-scaling technological and financial epicenter. Gachibowli offers modern high-density flats, fast expressways, and state-of-the-art office spaces.", tags: ["Tech Hub", "Expressway Access", "Rapid Development"] },
    { city: "Kolkata", area: "Salt Lake", listings: 7, desc: "A meticulously planned, spacious suburban landscape lined with quiet tree-shaded lanes, beautiful water bodies, and secure community blocks.", tags: ["Planned Suburb", "Serene Lanes", "Safe Community"] }
  ];

  return (
    <div className="pt-24 pb-24 bg-slate-50 font-sans text-left">
      <section className="bg-slate-900 py-24 text-center text-white relative overflow-hidden mb-16 rounded-b-[4rem]">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1.5px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <Container className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Popular <span className="text-emerald-500">Localities</span></h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
              Explore the most sought-after off-market neighborhoods in India's top metropolitan cities. Filter and secure exclusive real estate discreetly.
            </p>
          </motion.div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localitiesList.map((loc, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">{loc.city}</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">{loc.listings} Verified Proposals</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{loc.area}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{loc.desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {loc.tags.map(t => (
                    <span key={t} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => { onSetView('Buy'); window.scrollTo(0, 0); }}
                className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white hover:text-white rounded-2xl font-bold text-sm transition-all shadow-sm outline-none"
              >
                Explore {loc.area} Listings
              </button>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};

const Footer = ({ 
  setView, 
  onOpenInfoModal, 
  onAddNewsletterRequest 
}: { 
  setView: (v: View) => void, 
  onOpenInfoModal: (topic: string) => void,
  onAddNewsletterRequest?: (email: string) => void 
}) => {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim() && newsEmail.includes('@')) {
      onAddNewsletterRequest?.(newsEmail);
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-white border-t border-white/5 font-sans relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 px-4 text-left">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer group" onClick={() => { setView('Home'); window.scrollTo(0, 0); }}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">V</div>
              <span className="font-extrabold text-xl tracking-tight">VRUDDHI <span className="text-emerald-500 font-medium">PROPERTIES</span></span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-xs">
              India's most trusted privacy-first marketplace for premium residential and commercial 
              properties. Authentically verified, securely inquiry-gated.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-600 transition-colors flex items-center justify-center"><Twitter className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-600 transition-colors flex items-center justify-center"><Instagram className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-600 transition-colors flex items-center justify-center"><Linkedin className="w-4 h-4" /></button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Marketplace</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li>
                <button className="hover:text-emerald-500 transition-colors outline-none cursor-pointer" onClick={() => { setView('Buy'); window.scrollTo(0, 0); }}>
                  Buy Properties
                </button>
              </li>
              <li>
                <button className="hover:text-emerald-500 transition-colors outline-none cursor-pointer" onClick={() => { setView('Rent'); window.scrollTo(0, 0); }}>
                  Rent Homes
                </button>
              </li>
              <li>
                <button className="hover:text-emerald-500 transition-colors outline-none cursor-pointer" onClick={() => { setView('Sell'); window.scrollTo(0, 0); }}>
                  List Property
                </button>
              </li>
              <li>
                <button className="hover:text-emerald-500 transition-colors outline-none cursor-pointer" onClick={() => { setView('Localities'); window.scrollTo(0, 0); }}>
                  Featured Locality
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map(topic => (
                <li key={topic}>
                  <button className="hover:text-emerald-500 transition-colors outline-none cursor-pointer" onClick={() => onOpenInfoModal(topic)}>
                    {topic}
                  </button>
                </li>
              ))}
              <li>
                <button className="hover:text-emerald-500 transition-colors outline-none cursor-pointer" onClick={() => { setView('Help'); window.scrollTo(0, 0); }}>
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="text-lg font-bold mb-4 text-white">Newsletter</h4>
            <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">Get weekly updates on exclusive off-market property listings.</p>
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl"
              >
                Response Submitted ✓
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                 <input 
                   type="email" 
                   required
                   placeholder="Email Address" 
                   value={newsEmail}
                   onChange={(e) => setNewsEmail(e.target.value)}
                   className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full" 
                 />
                 <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all outline-none">
                   Subscribe Now
                 </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2026 VRUDDHI PROPERTIES. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-xs font-bold text-slate-500">
            <button className="hover:text-emerald-500 transition-colors outline-none" onClick={() => onOpenInfoModal('Privacy Policy')}>PRIVACY POLICY</button>
            <button className="hover:text-emerald-500 transition-colors outline-none" onClick={() => onOpenInfoModal('About Us')}>SITEMAP</button>
            <button className="hover:text-emerald-500 transition-colors outline-none" onClick={() => onOpenInfoModal('Terms of Service')}>LEGAL</button>
          </div>
        </div>
      </Container>
    </footer>
  );
};

const WishlistView = ({ wishlist, onToggleWishlist, onViewDetails, properties, isAdmin, onDeleteProperty }: { wishlist: string[], onToggleWishlist: (id: string) => void, onViewDetails: (p: Property) => void, properties: Property[], isAdmin?: boolean, onDeleteProperty?: (id: string) => void }) => {
  const wishlistedProperties = properties.filter(p => wishlist.includes(p.id));

  return (
    <div className="pt-40 pb-24 min-h-[80vh] text-left">
      <Container>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Wishlist</h1>
            <p className="text-slate-500 font-medium">You have {wishlistedProperties.length} properties saved.</p>
          </div>
          <Heart className="w-10 h-10 text-emerald-600 fill-emerald-600 opacity-20" />
        </div>

        {wishlistedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistedProperties.map(p => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                isWishlisted={true} 
                onToggleWishlist={() => onToggleWishlist(p.id)} 
                onViewDetails={onViewDetails}
                isAdmin={isAdmin}
                onDelete={onDeleteProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No properties saved yet</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Start browsing properties and click the heart icon to save them for later.</p>
            <button onClick={() => { window.scrollTo(0,0); }} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md">Browse Now</button>
          </div>
        )}
      </Container>
    </div>
  );
};

const AuthView = ({ onLogin, onRegister, setView }: { onLogin: (userId: string, pw: string) => boolean | string | Promise<boolean | string>, onRegister: (userId: string, pw: string, name: string, email: string) => boolean | string | Promise<boolean | string>, setView: (v: View) => void }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUserId, setRegUserId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginUserId.trim() || !loginPassword.trim()) {
      setError('Please enter both User ID and Password.');
      return;
    }
    
    const result = await onLogin(loginUserId, loginPassword);
    if (result !== true) {
      setError(typeof result === 'string' ? result : 'Invalid User ID or Password. Correct credentials are required.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!regName.trim() || !regEmail.trim() || !regUserId.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }
    
    if (!regEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const regResult = await onRegister(regUserId, regPassword, regName, regEmail);
    if (regResult !== true) {
      setError(typeof regResult === 'string' ? regResult : 'Registration failed.');
      return;
    }
    
    setSuccess('Account created successfully! You can now sign in.');
    setMode('login');
    setLoginUserId(regUserId);
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegUserId('');
    setRegPassword('');
    setRegConfirmPassword('');
    setShowRegPassword(false);
    setShowRegConfirmPassword(false);
  };

  return (
    <div className="pt-36 pb-24 min-h-[90vh] bg-slate-50 font-sans flex items-center justify-center relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #10b981 1.5px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <Container className="w-full max-w-md relative z-10">
        <motion.div 
          layout
          className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-2xl relative text-left"
        >
          <button 
            onClick={() => { setView('Home'); window.scrollTo(0, 0); }}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer outline-none"
          >
            ✕
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-2">
              {mode === 'login' ? 'Access India\'s elite private portal' : 'Get access to hidden verified properties'}
            </p>
          </div>

          <div className="grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl mb-8">
            <button 
              type="button" 
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${mode === 'login' ? 'bg-white text-emerald-600 border shadow-sm' : 'text-slate-500'}`}
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${mode === 'register' ? 'bg-white text-emerald-600 border shadow-sm' : 'text-slate-500'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xs text-rose-500 font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 mb-6 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping shrink-0"></span>
              <span className="leading-tight">{error}</span>
            </motion.p>
          )}

          {success && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-6 flex items-center gap-1.5"
            >
              ✓ {success}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLoginSubmit} 
                className="space-y-5"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter User ID (e.g. Rohan_Sharma)" 
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-5 pr-12 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors pointer-events-auto cursor-pointer select-none"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer outline-none"
                >
                  Confirm Sign In
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="signup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegisterSubmit} 
                className="space-y-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-4 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-4 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desired User ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Create a safe User ID (e.g. Rohan_Sharma)" 
                    value={regUserId}
                    onChange={(e) => setRegUserId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-4 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input 
                      type={showRegPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-4 pr-10 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors pointer-events-auto cursor-pointer select-none"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showRegConfirmPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••" 
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-4 pr-10 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors pointer-events-auto cursor-pointer select-none"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer outline-none"
                >
                  Create Account
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
};

const UserDashboardView = ({
  currentUser,
  registeredUsers,
  sellRequests,
  unlockRequests,
  properties,
  onLogout,
  setView
}: {
  currentUser: string | null,
  registeredUsers: Record<string, { pw: string; name: string; email: string }>,
  sellRequests: any[],
  unlockRequests: any[],
  properties: Property[],
  onLogout: () => void,
  setView: (v: View) => void
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'unlocks'>('listings');
  const [selectedUnlockAddress, setSelectedUnlockAddress] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // User Profile
  const userObj = currentUser ? registeredUsers[currentUser] : null;
  const displayName = userObj && typeof userObj !== 'string' ? userObj.name : (currentUser || '');
  const displayEmail = userObj && typeof userObj !== 'string' ? userObj.email : '';
  const firstLetter = displayName ? displayName.trim().charAt(0).toUpperCase() : '?';

  // Filter listings
  const myListings = useMemo(() => {
    return sellRequests.filter(req => req.userId === currentUser || req.email === displayEmail);
  }, [sellRequests, currentUser, displayEmail]);

  // Filter unlocks
  const myUnlocks = useMemo(() => {
    return unlockRequests.filter(req => req.userId === currentUser || req.inquirerEmail === displayEmail);
  }, [unlockRequests, currentUser, displayEmail]);

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate nice coordinates and exact address based on property name or id
  const getMockedAddress = (propertyName: string) => {
    const lat = (12.9 + Math.random() * 0.1).toFixed(4);
    const lng = (77.5 + Math.random() * 0.1).toFixed(4);
    
    let baseAddr = "Flat 402, Signature Towers, Sector 4, Whitefield, Bangalore, Karnataka - 560066";
    if (propertyName.toLowerCase().includes('mumbai') || propertyName.toLowerCase().includes('worli') || propertyName.toLowerCase().includes('bandra')) {
      baseAddr = "Tower B, 18th Floor, Sea View Apartments, Worli Sea Face, Mumbai, Maharashtra - 400030";
    } else if (propertyName.toLowerCase().includes('delhi')) {
      baseAddr = "Villa No. 18, Block K, Royal Heritage Estates, Greater Kailash, South Delhi - 110048";
    } else if (propertyName.toLowerCase().includes('jaipur')) {
      baseAddr = "Plot 104, Royal Gardens Phase 2, Mansarovar Extension, Jaipur, Rajasthan - 302020";
    }
    
    return {
      address: baseAddr,
      lat,
      lng,
      pin: `${lat}° N, ${lng}° E`
    };
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 font-sans pb-16">
      <Container className="py-12">
        {/* Header Profile Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-150/30 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-emerald-100 animate-fade-in select-none shrink-0">
              {firstLetter}
            </div>
            <div className="space-y-1 min-w-0 text-left">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                Verified Resident Account
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1 truncate max-w-sm sm:max-w-md">{displayName}</h1>
              <p className="text-sm font-semibold text-slate-400 flex flex-wrap items-center gap-1.5 font-mono">
                ID: {currentUser} • {displayEmail}
              </p>
            </div>
          </div>
          <div className="flex gap-4 self-center md:self-auto">
            <button
              onClick={() => setView('Sell')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 outline-none"
            >
              + List New Property
            </button>
            <button
              onClick={onLogout}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold cursor-pointer transition-transform active:scale-95 outline-none"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar / Top-tab Grid Layout */}
        <div className="grid lg:grid-cols-4 gap-8 items-start text-left">
          {/* Navigation Control Panel */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-lg lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Member Panel</h3>
            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left font-bold text-sm transition-all outline-none cursor-pointer ${activeTab === 'listings' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 animate-pulse" />
                My Listings
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${activeTab === 'listings' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                {myListings.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('unlocks')}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left font-bold text-sm transition-all outline-none cursor-pointer ${activeTab === 'unlocks' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="flex items-center gap-3">
                <Eye className="w-5 h-5" />
                Unlocked Locations
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${activeTab === 'unlocks' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                {myUnlocks.length}
              </span>
            </button>
          </div>

          {/* Active Panel Content */}
          <div className="lg:col-span-3 text-left">
            <AnimatePresence mode="wait">
              {activeTab === 'listings' ? (
                <motion.div
                  key="listingsTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-lg">
                    <div className="mb-6 flex justify-between items-center flex-wrap gap-4 text-left">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">My Listed Properties</h2>
                        <span className="text-xs font-semibold text-slate-400">Manage listings currently in review or broadcasted live.</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{myListings.length} Total</span>
                    </div>

                    {myListings.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                          <ClipboardList className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No property listed yet</h3>
                        <p className="text-xs text-slate-404 mb-6 max-w-xs leading-relaxed font-semibold text-slate-400">Want to sell or rent off-market with total privacy? Broadcast your listing now.</p>
                        <button
                          onClick={() => setView('Sell')}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer outline-none active:scale-95 transition-all shadow-md"
                        >
                          List Your Property
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-150 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                              <th className="pb-4 pt-1 font-extrabold">Property Information</th>
                              <th className="pb-4 pt-1 font-extrabold text-center">Config</th>
                              <th className="pb-4 pt-1 font-extrabold text-center">Value</th>
                              <th className="pb-4 pt-1 font-extrabold text-right">Status Badge</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myListings.map(listing => (
                              <tr key={listing.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 font-bold text-slate-800 flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-150/45 shadow-sm">
                                    <img 
                                      src={listing.image} 
                                      alt={listing.title} 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-sm font-black truncate block text-slate-900 max-w-[200px] sm:max-w-[280px]">{listing.title}</span>
                                    <span className="text-xs font-semibold text-slate-400 block mt-0.5 truncate max-w-[180px]">{listing.locality}, {listing.city}</span>
                                  </div>
                                </td>
                                <td className="py-5 text-center whitespace-nowrap">
                                  <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">{listing.bhk} • {listing.propertyType || listing.type}</span>
                                </td>
                                <td className="py-5 text-center font-extrabold text-emerald-600 text-xs whitespace-nowrap">
                                  {listing.price}
                                </td>
                                <td className="py-5 text-right whitespace-nowrap">
                                  {listing.status === 'Approved' ? (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-emerald-750 bg-emerald-50 border border-emerald-100/80 px-3.5 py-1.5 rounded-full shadow-sm">
                                      <span className="w-2 h-2 rounded-full bg-emerald-600 border border-white shrink-0 animate-pulse" />
                                      Live / Approved
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 border border-amber-100 px-3.5 py-1.5 rounded-full shadow-sm">
                                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shrink-0" />
                                      Verification Process
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocksTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-lg">
                    <div className="mb-6 flex justify-between items-center flex-wrap gap-4 text-left">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Location Unlock Requests</h2>
                        <span className="text-xs font-semibold text-slate-400">Secure matching status for property spatial files.</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{myUnlocks.length} Total</span>
                    </div>

                    {myUnlocks.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                          <Eye className="w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No unlock requests yet</h3>
                        <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed font-semibold">Browse hot off-market properties and submit matching credentials to unlock their spatial files.</p>
                        <button
                          onClick={() => setView('Buy')}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer outline-none active:scale-95 transition-all shadow-md mt-1"
                        >
                          Find Premium Properties
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 text-left">
                        {myUnlocks.map(req => (
                          <div key={req.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-shadow">
                            <div className="space-y-1 max-w-md text-left">
                              <h4 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                                <span className="bg-emerald-105 text-emerald-700 bg-emerald-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">Requested</span>
                                {req.propertyName}
                              </h4>
                              <p className="text-xs text-slate-500 font-semibold leading-relaxed">Inquirer Msg: "{req.message || 'Verification profile submitted.'}"</p>
                              <span className="text-[10px] text-slate-400 block font-bold font-mono">SUBMITTED ON: {req.date}</span>
                            </div>
                            <div className="shrink-0 self-start sm:self-auto">
                              {req.status === 'Approved' ? (
                                <button
                                  onClick={() => setSelectedUnlockAddress(req)}
                                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 hover:scale-[1.02] cursor-pointer outline-none flex items-center gap-1.5"
                                >
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  Unlocked - View Location
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl shadow-sm cursor-help" title="Pending administrator verification">
                                  <Clock className="w-3.5 h-3.5 shrink-0 animate-spin text-amber-605" />
                                  Waiting Admin Approval
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>

      {/* 📍 POPUP MODAL FOR UNLOCKED LOCATION DETAILS */}
      <AnimatePresence>
        {selectedUnlockAddress && (() => {
          const mockLocDet = getMockedAddress(selectedUnlockAddress.propertyName);
          return (
            <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl relative border border-slate-100 overflow-hidden"
              >
                {/* Visual Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-8 pb-12 flex items-center justify-between">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] bg-white/20 text-white font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider border border-white/10">Location Unlocked</span>
                    <h3 className="text-2xl font-black tracking-tight">{selectedUnlockAddress.propertyName}</h3>
                    <p className="text-xs text-white/80 font-bold font-mono">Approved Address Pass</p>
                  </div>
                  <button
                    onClick={() => { setSelectedUnlockAddress(null); setCopied(false); }}
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center font-semibold text-sm transition-colors cursor-pointer outline-none"
                  >
                    ✕
                  </button>
                </div>

                {/* Body details */}
                <div className="p-8 -mt-6 bg-white rounded-t-[2.5rem] relative space-y-6 text-left">
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    🚨 <strong>Private Security Policy:</strong> This information is strictly confidential. Standard non-disclosure agreements prohibit distribution of unblurred geographical assets.
                  </p>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150/50 space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registered Address</h4>
                      <p className="text-sm font-extrabold text-slate-800 leading-normal">{mockLocDet.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Geographic Pins</h4>
                        <span className="text-xs font-mono font-bold text-slate-600 block">{mockLocDet.pin}</span>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Method</h4>
                        <span className="text-xs font-bold text-emerald-600 block bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg w-max uppercase text-[10px] tracking-wide">Direct Key Tour</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Google Map Embed */}
                  <div className="h-44 bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden relative flex items-center justify-center group shadow-inner">
                    <div className="absolute inset-0 bg-cover bg-center brightness-[0.93]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')" }}></div>
                    <div className="absolute inset-0 bg-emerald-950/25 group-hover:bg-emerald-950/15 transition-colors"></div>
                    <div className="relative z-10 bg-white/95 backdrop-blur-sm shadow-md rounded-2xl px-5 py-4 flex flex-col items-center max-w-xs text-center border border-slate-200">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 shadow-sm">📍</div>
                      <span className="text-xs font-black text-slate-900">Map Pin Synchronized</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-0.5">Coordinates: {mockLocDet.pin}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => handleCopyAddress(mockLocDet.address)}
                      className="flex-1 py-3.5 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                          Address Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardList className="w-4 h-4" />
                          Copy Physical Address
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => { setSelectedUnlockAddress(null); setView('Help'); }}
                      className="px-6 py-3.5 bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-extrabold transition-colors cursor-pointer outline-none"
                    >
                      Support Desk
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboardView = ({
  unlockRequests,
  setUnlockRequests,
  sellRequests,
  setSellRequests,
  newsletterRequests,
  setNewsletterRequests,
  helpRequests,
  setHelpRequests,
  onLogout,
  onApprovePropertyListing
}: {
  unlockRequests: any[],
  setUnlockRequests: React.Dispatch<React.SetStateAction<any[]>>,
  sellRequests: any[],
  setSellRequests: React.Dispatch<React.SetStateAction<any[]>>,
  newsletterRequests: any[],
  setNewsletterRequests: React.Dispatch<React.SetStateAction<any[]>>,
  helpRequests: any[],
  setHelpRequests: React.Dispatch<React.SetStateAction<any[]>>,
  onLogout: () => void,
  onApprovePropertyListing: (listing: any) => void
}) => {
  const [activeTab, setActiveTab] = useState<'unlocks' | 'listings' | 'newsletters' | 'help'>('unlocks');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Approve of Unlock Request
  const handleApproveUnlock = (id: string) => {
    setUnlockRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    updateSupabaseUnlockRequestStatus(id, 'Approved').catch(console.error);
  };

  // Handle Decline of Unlock Request
  const handleDeclineUnlock = (id: string) => {
    setUnlockRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Declined' } : req));
    updateSupabaseUnlockRequestStatus(id, 'Declined').catch(console.error);
  };

  // Handle Approve of Property Listing Request
  const handleApproveListing = (id: string) => {
    const req = sellRequests.find(r => r.id === id);
    if (req) {
      setSellRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
      updateSupabaseSellRequestStatus(id, 'Approved').catch(console.error);
      onApprovePropertyListing(req);
    }
  };

  // Handle Reject of Property Listing Request
  const handleRejectListing = (id: string) => {
    setSellRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    updateSupabaseSellRequestStatus(id, 'Rejected').catch(console.error);
  };

  // Handle Resolve Help support cases
  const handleResolveHelp = (id: string) => {
    setHelpRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Resolved' } : req));
    updateSupabaseHelpRequestStatus(id, 'Resolved').catch(console.error);
  };

  // Handle Remove Newsletter email
  const handleRemoveNewsletter = (id: string) => {
    setNewsletterRequests(prev => prev.filter(req => req.id !== id));
    deleteSupabaseNewsletter(id).catch(console.error);
  };

  const unlockCount = unlockRequests.filter(r => r.status === 'Pending').length;
  const listingCount = sellRequests.filter(r => r.status === 'Pending').length;
  const helpCount = helpRequests.filter(r => r.status === 'Open').length;
  const totalSubscribers = newsletterRequests.length;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 font-sans">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Side navigation panel */}
          <div className="w-full lg:w-72 bg-slate-900 text-slate-100 rounded-[2.5rem] p-6 shadow-xl space-y-8 shrink-0 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-500 font-bold" />
                <span className="font-extrabold text-white text-base tracking-tight uppercase">Vruddhi Private Desk</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Admin Secure Supervisor Node</p>
            </div>

            <nav className="flex flex-col gap-2 w-full">
              <button
                onClick={() => { setActiveTab('unlocks'); setSearchTerm(''); }}
                className={`w-full text-left py-3.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none ${activeTab === 'unlocks' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-white/5 text-slate-400'}`}
              >
                <span className="flex items-center gap-3">
                  <Database className="w-4 h-4" />
                  Unlock Requests
                </span>
                {unlockCount > 0 && <span className="bg-emerald-500 font-mono text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{unlockCount}</span>}
              </button>

              <button
                onClick={() => { setActiveTab('listings'); setSearchTerm(''); }}
                className={`w-full text-left py-3.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none ${activeTab === 'listings' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-white/5 text-slate-400'}`}
              >
                <span className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4" />
                  Listing Proposals
                </span>
                {listingCount > 0 && <span className="bg-emerald-50 font-mono text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-bold">{listingCount}</span>}
              </button>

              <button
                onClick={() => { setActiveTab('newsletters'); setSearchTerm(''); }}
                className={`w-full text-left py-3.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none ${activeTab === 'newsletters' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-white/5 text-slate-400'}`}
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  Newsletter Subs
                </span>
                <span className="text-slate-400 text-[10px] font-mono font-bold">{totalSubscribers}</span>
              </button>

              <button
                onClick={() => { setActiveTab('help'); setSearchTerm(''); }}
                className={`w-full text-left py-3.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none ${activeTab === 'help' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-white/5 text-slate-400'}`}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  Support Cases
                </span>
                {helpCount > 0 && <span className="bg-rose-500 font-mono text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{helpCount}</span>}
              </button>
            </nav>

            <div className="pt-6 border-t border-white/10 w-full">
              <button
                onClick={onLogout}
                className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-rose-600/10 hover:text-rose-450 text-slate-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Disconnect Session
              </button>
            </div>
          </div>

          {/* Main workspace arena */}
          <div className="flex-1 w-full bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-xl text-left min-h-[60vh]">
            {/* Header counters and stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-extrabold tracking-widest flex items-center gap-1.5 mb-1.5 select-none font-mono">
                  <Clock className="w-4.5 h-4.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
                  Database Supervisor Access Enabled
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight capitalize select-none">{activeTab} Manager</h2>
              </div>
              
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-3 text-[10px] font-bold text-slate-450 hover:text-slate-900 outline-none">✕</button>
                )}
              </div>
            </div>

            {/* TAB CONTENT: UNLOCK REQUESTS */}
            {activeTab === 'unlocks' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pending Unlock Reviews</span>
                    <span className="text-2xl font-black text-amber-500">{unlockCount}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Permissions Approved</span>
                    <span className="text-2xl font-black text-emerald-600">{unlockRequests.filter(r => r.status === 'Approved').length}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Submissions</span>
                    <span className="text-2xl font-black text-slate-800">{unlockRequests.length}</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-[2rem]">
                  {unlockRequests.filter(req => 
                    req.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.inquirerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.inquirerEmail.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                          <th className="p-4 pl-6">Target Property</th>
                          <th className="p-4">Applicant Profile</th>
                          <th className="p-4">Applicant Requirements</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6 text-center">Inquiry Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        {unlockRequests.filter(req => 
                          req.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.inquirerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.inquirerEmail.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6 font-bold text-slate-900">
                              {req.propertyName}
                              <span className="block text-[10px] font-mono text-slate-400 font-semibold mt-0.5">{req.date}</span>
                            </td>
                            <td className="p-4">
                              <span className="block text-slate-850 font-extrabold">{req.inquirerName}</span>
                              <span className="block text-[10px] text-slate-400 font-medium font-mono">{req.inquirerEmail}</span>
                            </td>
                            <td className="p-4 max-w-xs text-slate-500 leading-relaxed font-semibold">
                              "{req.message || 'No special requirements listed.'}"
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                req.status === 'Declined' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6">
                              {req.status === 'Pending' ? (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleApproveUnlock(req.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] transition-all cursor-pointer outline-none"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleDeclineUnlock(req.id)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-rose-105 hover:text-rose-600 text-slate-500 rounded-lg font-bold text-[10px] transition-all cursor-pointer outline-none"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold uppercase text-center select-none font-mono">Processed</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <Database className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-800 font-bold mb-1">No unlock requests found</p>
                      <p className="text-slate-400 text-xs font-semibold">Ready for active workspace logs.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROPOSALS */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Queue Proposals</span>
                    <span className="text-2xl font-black text-amber-500">{listingCount}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Approved in Search</span>
                    <span className="text-2xl font-black text-emerald-600">{sellRequests.filter(r => r.status === 'Approved').length}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Submissions</span>
                    <span className="text-2xl font-black text-slate-800">{sellRequests.length}</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-[2rem]">
                  {sellRequests.filter(req => 
                    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.locality.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                          <th className="p-4 pl-6">Proposed Holding</th>
                          <th className="p-4">Spec sheet</th>
                          <th className="p-4">Seller Record</th>
                          <th className="p-4">Proposed Val</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6 text-center">Validation Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        {sellRequests.filter(req => 
                          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.locality.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6 font-bold text-slate-900 font-sans">
                              {req.title}
                              <span className="block text-[10px] font-semibold text-slate-400 font-mono mt-0.5">{req.locality}, {req.city}</span>
                            </td>
                            <td className="p-4">
                              <span className="block font-black text-slate-800">{req.bhk}</span>
                              <span className="block text-[10px] text-slate-400 font-bold">{req.propertyType}</span>
                              <span className="block text-[9px] font-bold text-amber-600 bg-amber-50 rounded-md px-1.5 py-0.5 border border-amber-100 mt-1 inline-block uppercase font-mono tracking-wider">For {req.purpose}</span>
                            </td>
                            <td className="p-4 font-mono">
                              <span className="block text-slate-850 font-extrabold font-sans text-xs">{req.fullName}</span>
                              <span className="block text-[10px] text-slate-400 font-semibold">{req.email}</span>
                              <span className="block text-[9px] text-slate-400 font-medium">{req.phone}</span>
                            </td>
                            <td className="p-4 font-extrabold text-slate-900 text-sm font-mono">
                              {req.price}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                req.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6">
                              {req.status === 'Pending' ? (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleApproveListing(req.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] font-sans flex items-center gap-1 transition-transform active:scale-95 cursor-pointer outline-none"
                                  >
                                    Accept Feed
                                  </button>
                                  <button
                                    onClick={() => handleRejectListing(req.id)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg font-bold text-[10px] transition-transform active:scale-95 cursor-pointer outline-none"
                                  >
                                    Deny
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold uppercase text-center select-none font-mono">
                                  {req.status === 'Approved' ? 'Active in Feed ✓' : 'Rejected'}
                                </p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-800 font-bold mb-1">No property proposals found</p>
                      <p className="text-slate-400 text-xs font-semibold">Audit lines clear.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: NEWSLETTER EMAILS */}
            {activeTab === 'newsletters' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-base mb-1">Secure Newsletter Registry</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">Encrypted emails enrolled safely through user actions.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Subscriber Registry size</span>
                    <span className="text-3xl font-black text-emerald-650">{totalSubscribers} Nodes</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-[2rem]">
                  {newsletterRequests.filter(req => 
                    req.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                          <th className="p-4 pl-6">Registry ID</th>
                          <th className="p-4">Subscriber Address</th>
                          <th className="p-4">Date Subscribed</th>
                          <th className="p-4 pr-6 text-center">Revoke Nodes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-705">
                        {newsletterRequests.filter(req => 
                          req.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((req, i) => (
                          <tr key={req.id || i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6 font-mono font-bold text-slate-400 uppercase select-none">
                              #N-{i + 1500}
                            </td>
                            <td className="p-4 font-bold text-slate-900 font-mono">
                              {req.email}
                            </td>
                            <td className="p-4 text-slate-400 font-mono text-[11px] font-semibold">
                              {req.date}
                            </td>
                            <td className="p-4 pr-6 text-center">
                              <button
                                onClick={() => handleRemoveNewsletter(req.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer outline-none"
                                title="Remove Email Node"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-800 font-bold mb-1">No subscribers registered</p>
                      <p className="text-slate-404 text-xs font-semibold">Database directory completely indexed.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: HELP CASES */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Support Claims</span>
                    <span className="text-2xl font-black text-rose-500">{helpCount}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Archived / Resolved</span>
                    <span className="text-2xl font-black text-emerald-650">{helpRequests.filter(r => r.status === 'Resolved').length}</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-[2rem]">
                  {helpRequests.filter(req => 
                    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    req.message.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                          <th className="p-4 pl-6">Client Profile</th>
                          <th className="p-4">Case Details</th>
                          <th className="p-4">Case Status</th>
                          <th className="p-4 pr-6 text-center">Case Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                        {helpRequests.filter(req => 
                          req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.message.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6">
                              <span className="block font-extrabold text-slate-900">{req.name}</span>
                              <span className="block text-[10px] text-slate-400 font-mono font-bold mt-0.5">{req.email}</span>
                              <span className="block text-[9px] text-slate-400 font-medium font-mono">{req.date}</span>
                            </td>
                            <td className="p-4 max-w-xs text-slate-500 font-semibold leading-relaxed">
                              "{req.message}"
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                'bg-rose-50 text-rose-500 border border-rose-100/50 animate-pulse'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-center">
                              {req.status === 'Open' ? (
                                <button
                                  onClick={() => handleResolveHelp(req.id)}
                                  className="px-3 py-1.5 bg-slate-900 text-white hover:bg-emerald-600 rounded-lg font-bold text-[10px] transition-all cursor-pointer outline-none"
                                >
                                  Close Ticket
                                </button>
                              ) : (
                                <p className="text-[10px] text-emerald-600 font-bold uppercase select-none font-mono">Resolved ✓</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-800 font-bold mb-1">No ticket logs found</p>
                      <p className="text-slate-404 text-xs font-semibold">Supervisor channel operating cleanly.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<View>('Home');
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const DEFAULT_REGISTERED_USERS = {
    'Rohan_Sharma': { pw: 'Rohan@123', name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com' },
    'Aishwarya_Sen': { pw: 'SereneVilla123', name: 'Aishwarya Sen', email: 'aishwarya.sen@outlook.com' },
    'User_2026': { pw: 'User@2026', name: 'User 2026', email: 'workspacelocaluser@gmail.com' }
  };

  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('vruddhi_properties');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse properties from localStorage:', e);
    }
    return PROPERTIES;
  });

  const [registeredUsers, setRegisteredUsers] = useState<Record<string, { pw: string; name: string; email: string }>>(() => {
    try {
      const saved = localStorage.getItem('vruddhi_registered_users');
      if (saved) {
        return { ...DEFAULT_REGISTERED_USERS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse registered users from localStorage:', e);
    }
    return DEFAULT_REGISTERED_USERS;
  });

  // Sync state modifications to disk instantly
  useEffect(() => {
    try {
      localStorage.setItem('vruddhi_properties', JSON.stringify(properties));
    } catch (e) {
      console.warn('Failed to save properties to localStorage:', e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('vruddhi_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Failed to save registered users to localStorage:', e);
    }
  }, [registeredUsers]);
  
  // Real authentication states
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('vruddhi_current_user');
    } catch {
      return null;
    }
  });

  // Database lists with localStorage backup and initial demo seed fallbacks
  const [unlockRequests, setUnlockRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('vruddhi_unlock_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse unlock requests from localStorage:', e);
    }
    return [
      {
        id: 'unlock-1',
        propertyName: 'Skyline Penthouse, Worli',
        inquirerName: 'Rohan Sharma',
        inquirerEmail: 'rohan.sharma@gmail.com',
        message: 'I am looking to buy immediately. Verified profile ready.',
        date: '2026-05-18',
        status: 'Pending',
        userId: 'Rohan_Sharma',
        propertyId: '1'
      },
      {
        id: 'unlock-2',
        propertyName: 'Serene Villa, Whitefield',
        inquirerName: 'Aishwarya Sen',
        inquirerEmail: 'aishwarya.sen@outlook.com',
        message: 'Would love to schedule a visit this Sunday if possible.',
        date: '2026-05-19',
        status: 'Approved',
        userId: 'Aishwarya_Sen',
        propertyId: '2'
      },
      {
        id: 'unlock-rohan-2',
        propertyName: 'Modern Studio, Gurgaon',
        inquirerName: 'Rohan Sharma',
        inquirerEmail: 'rohan.sharma@gmail.com',
        message: 'Looking for a secondary workspace. High budget clearance.',
        date: '2026-05-20',
        status: 'Approved',
        userId: 'Rohan_Sharma',
        propertyId: '3'
      }
    ];
  });

  const [sellRequests, setSellRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('vruddhi_sell_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse sell requests from localStorage:', e);
    }
    return [
      {
        id: 'sell-1',
        title: 'Majestic 4 BHK Bungalow',
        locality: 'Indiranagar',
        city: 'Bangalore',
        price: '₹5.5 Crore',
        bhk: '4 BHK',
        propertyType: 'Villa',
        purpose: 'Buy',
        fullName: 'Vikram Aditya',
        email: 'vikram.aditya@gmail.com',
        phone: '+91 98801 23456',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        userId: 'Vikram_Aditya'
      },
      {
        id: 'sell-rohan-1',
        title: 'Elegant 3 BHK Luxury Apartment',
        locality: 'Bandra West',
        city: 'Mumbai',
        price: '₹4.5 Crore',
        bhk: '3 BHK',
        propertyType: 'Flat',
        purpose: 'Buy',
        fullName: 'Rohan Sharma',
        email: 'rohan.sharma@gmail.com',
        phone: '+91 99201 98765',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        userId: 'Rohan_Sharma'
      },
      {
        id: 'sell-rohan-2',
        title: 'Panoramic Marina Suite',
        locality: 'Worli',
        city: 'Mumbai',
        price: '₹1.2 Lakh/mo',
        bhk: '2 BHK',
        propertyType: 'Flat',
        purpose: 'Rent',
        fullName: 'Rohan Sharma',
        email: 'rohan.sharma@gmail.com',
        phone: '+91 99201 98765',
        status: 'Approved',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        userId: 'Rohan_Sharma'
      },
      {
        id: 'sell-aishwarya-1',
        title: 'Serene Greenery Penthouse',
        locality: 'Whitefield',
        city: 'Bangalore',
        price: '₹6.2 Crore',
        bhk: '4 BHK',
        propertyType: 'Flat',
        purpose: 'Buy',
        fullName: 'Aishwarya Sen',
        email: 'aishwarya.sen@outlook.com',
        phone: '+91 98802 43210',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        userId: 'Aishwarya_Sen'
      },
      {
        id: 'sell-aishwarya-2',
        title: 'Contemporary Tech-Park Duplex',
        locality: 'Electronic City',
        city: 'Bangalore',
        price: '₹80,000/mo',
        bhk: '3 BHK',
        propertyType: 'Flat',
        purpose: 'Rent',
        fullName: 'Aishwarya Sen',
        email: 'aishwarya.sen@outlook.com',
        phone: '+91 98802 43210',
        status: 'Approved',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        userId: 'Aishwarya_Sen'
      }
    ];
  });

  // Local storage caching states (and fallbacks)
  const [newsletterRequests, setNewsletterRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('vruddhi_newsletter_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse newsletter requests from localStorage:', e);
    }
    return [
      { id: 'news-1', email: 'shubham.k@gmail.com', date: '2026-05-15' },
      { id: 'news-2', email: 'meera.iyer@pwc.com', date: '2026-05-17' }
    ];
  });

  const [helpRequests, setHelpRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('vruddhi_help_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse help requests from localStorage:', e);
    }
    return [
      {
        id: 'help-1',
        name: 'Aniket Gupta',
        email: 'aniket.gupta@inbox.com',
        message: 'I am not receiving the OTP code verification for location unlocking.',
        date: '2026-05-16',
        status: 'Open'
      },
      {
        id: 'help-2',
        name: 'Pooja Hegde',
        email: 'hegde.pooja@gmail.com',
        message: 'Excellent private design. Do you have premium options in Pune?',
        date: '2026-05-18',
        status: 'Resolved'
      }
    ];
  });

  // Local storage caching updates
  useEffect(() => {
    try {
      localStorage.setItem('vruddhi_unlock_requests', JSON.stringify(unlockRequests));
    } catch (e) {
      console.warn('Failed to save unlock requests to localStorage:', e);
    }
  }, [unlockRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('vruddhi_sell_requests', JSON.stringify(sellRequests));
    } catch (e) {
      console.warn('Failed to save sell requests to localStorage:', e);
    }
  }, [sellRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('vruddhi_newsletter_requests', JSON.stringify(newsletterRequests));
    } catch (e) {
      console.warn('Failed to save newsletter requests to localStorage:', e);
    }
  }, [newsletterRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('vruddhi_help_requests', JSON.stringify(helpRequests));
    } catch (e) {
      console.warn('Failed to save help requests to localStorage:', e);
    }
  }, [helpRequests]);

  // Load initial data from Supabase on mount with resilient fallbacks
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load users
        const dbUsers = await getSupabaseUsers();
        if (dbUsers) {
          setRegisteredUsers(prev => ({ ...prev, ...dbUsers }));

          // Automatically re-insert the local logged-in user profile to the Supabase backend
          // if it exists locally but is missing from the database (e.g. after deleting and starting the tables again)
          try {
            const savedUser = localStorage.getItem('vruddhi_current_user');
            if (savedUser && savedUser !== 'Admin_2007') {
              const savedUsersData = localStorage.getItem('vruddhi_registered_users');
              if (savedUsersData) {
                const parsedUsers = JSON.parse(savedUsersData);
                const currentUserObj = parsedUsers[savedUser];
                if (currentUserObj && !dbUsers[savedUser]) {
                  console.log('Local authenticated session user missing from Supabase profiles DB. Re-registering to database automatically...');
                  await insertSupabaseUser({
                    id: savedUser,
                    pw: currentUserObj.pw,
                    name: currentUserObj.name,
                    email: currentUserObj.email,
                    role: 'Normal User'
                  });
                  // Mutate in loaded object to skip redundant updates
                  dbUsers[savedUser] = {
                    pw: currentUserObj.pw,
                    name: currentUserObj.name,
                    email: currentUserObj.email,
                    role: 'Normal User'
                  };
                  setRegisteredUsers(prev => ({ ...prev, ...dbUsers }));
                }
              }
            }
          } catch (profileSyncErr) {
            console.warn('Silent issue auto-syncing cached user session profile with fresh Supabase tables:', profileSyncErr);
          }
        }

        // 2. Load properties (and auto-seed if empty database)
        const dbProperties = await getSupabaseProperties();
        if (dbProperties !== null) {
          if (dbProperties.length > 0) {
            setProperties(dbProperties);
          } else {
            console.log('No properties found in Supabase. Seeding default 12 properties into active database...');
            for (const item of PROPERTIES) {
              await insertSupabaseProperty(item);
            }
            setProperties(PROPERTIES);
          }
        }

        // 3. Load sell requests
        const dbSellRequests = await getSupabaseSellRequests();
        if (dbSellRequests !== null) {
          setSellRequests(dbSellRequests);
        }

        // 4. Load unlock requests
        const dbUnlockRequests = await getSupabaseUnlockRequests();
        if (dbUnlockRequests !== null) {
          setUnlockRequests(dbUnlockRequests);
        }

        // 5. Load help requests
        const dbHelpRequests = await getSupabaseHelpRequests();
        if (dbHelpRequests !== null) {
          let localHelp: any[] = [];
          try {
            const saved = localStorage.getItem('vruddhi_help_requests');
            if (saved) localHelp = JSON.parse(saved);
          } catch (err) {
            console.warn('Failed parsing local help requests:', err);
          }

          if (dbHelpRequests.length > 0) {
            const dbIds = new Set(dbHelpRequests.map(r => r.id));
            const unsyncedHelp = localHelp.filter(r => !dbIds.has(r.id));
            
            if (unsyncedHelp.length > 0) {
              console.log(`Syncing ${unsyncedHelp.length} unsynced local help requests to Supabase...`);
              for (const req of unsyncedHelp) {
                await insertSupabaseHelpRequest(req);
              }
              setHelpRequests([...unsyncedHelp, ...dbHelpRequests]);
            } else {
              setHelpRequests(dbHelpRequests);
            }
          } else {
            console.log('No help requests in database. Seeding initial help case nodes...');
            const defaultHelp = [
              {
                id: 'help-1',
                name: 'Aniket Gupta',
                email: 'aniket.gupta@inbox.com',
                message: 'I am not receiving the OTP code verification for location unlocking.',
                date: '2026-05-16',
                status: 'Open'
              },
              {
                id: 'help-2',
                name: 'Pooja Hegde',
                email: 'hegde.pooja@gmail.com',
                message: 'Excellent private design. Do you have premium options in Pune?',
                date: '2026-05-18',
                status: 'Resolved'
              }
            ];
            const seededIds = new Set(defaultHelp.map(r => r.id));
            const unsyncedHelp = localHelp.filter(r => !seededIds.has(r.id));

            for (const item of defaultHelp) {
              await insertSupabaseHelpRequest(item);
            }
            for (const item of unsyncedHelp) {
              await insertSupabaseHelpRequest(item);
            }
            setHelpRequests([...unsyncedHelp, ...defaultHelp]);
          }
        }

        // 6. Load newsletters
        const dbNewsletters = await getSupabaseNewsletters();
        if (dbNewsletters !== null) {
          let localNews: any[] = [];
          try {
            const saved = localStorage.getItem('vruddhi_newsletter_requests');
            if (saved) localNews = JSON.parse(saved);
          } catch (err) {
            console.warn('Failed parsing local newsletter requests:', err);
          }

          if (dbNewsletters.length > 0) {
            const formatted = dbNewsletters.map((sub: any) => ({
              id: sub.id,
              email: sub.email,
              date: sub.date
            }));
            const dbEmails = new Set(formatted.map(r => r.email.toLowerCase()));
            const unsyncedNews = localNews.filter(r => !dbEmails.has(r.email.toLowerCase()));

            if (unsyncedNews.length > 0) {
              console.log(`Syncing ${unsyncedNews.length} unsynced local newsletter registrations to Supabase...`);
              for (const req of unsyncedNews) {
                await insertSupabaseNewsletter(req);
              }
              setNewsletterRequests([...unsyncedNews, ...formatted]);
            } else {
              setNewsletterRequests(formatted);
            }
          } else {
            console.log('No newsletter subscriptions found in database. Seeding initial subscribers...');
            const defaultNews = [
              { id: 'news-1', email: 'shubham.k@gmail.com', date: '2026-05-15' },
              { id: 'news-2', email: 'meera.iyer@pwc.com', date: '2026-05-17' }
            ];
            const seededEmails = new Set(defaultNews.map(r => r.email.toLowerCase()));
            const unsyncedNews = localNews.filter(r => !seededEmails.has(r.email.toLowerCase()));

            for (const item of defaultNews) {
              await insertSupabaseNewsletter(item);
            }
            for (const item of unsyncedNews) {
              await insertSupabaseNewsletter(item);
            }
            setNewsletterRequests([...unsyncedNews, ...defaultNews]);
          }
        }
      } catch (e) {
        console.warn('Silent fallback to local cache during initialization. Database is offline.', e);
      }
    };
    
    loadData();
  }, [currentUser]);

  // Mobile wishlist open state
  const [mobileWishlistOpen, setMobileWishlistOpen] = useState(false);

  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [footerModal, setFooterModal] = useState<string | null>(null);
  
  // Detail Inquiry states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState(false);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(false);
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryEmail.includes('@')) {
      setInquiryError(true);
      return;
    }
    
    // Propagate unlock request to state
    if (selectedProperty) {
      const newReq = {
        id: `unlock-${Date.now()}`,
        propertyName: selectedProperty.title,
        inquirerName: inquiryName,
        inquirerEmail: inquiryEmail,
        message: inquiryMsg,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        userId: currentUser,
        propertyId: selectedProperty.id
      };
      setUnlockRequests(prev => [newReq, ...prev]);
      insertSupabaseUnlockRequest(newReq, currentUser).catch(console.error);
    }

    setInquirySuccess(true);
  };

  const closeDetailModal = () => {
    setSelectedProperty(null);
    setInquirySuccess(false);
    setInquiryError(false);
    setInquiryName('');
    setInquiryEmail('');
    setInquiryMsg('');
  };

  // Auth logins handler
  const handleLogin = async (userId: string, pw: string): Promise<boolean | string> => {
    if (userId === 'Admin_2007') {
      if (pw === 'Admin@2007') {
        setCurrentUser('Admin_2007');
        try {
          localStorage.setItem('vruddhi_current_user', 'Admin_2007');
        } catch {}
        setActiveView('AdminDashboard');
        window.scrollTo(0, 0);
        return true;
      }
      return 'Incorrect credentials for administrator access. Please enter valid credentials.';
    }
    
    if (registeredUsers[userId]) {
      if (registeredUsers[userId].pw === pw) {
        setCurrentUser(userId);
        try {
          localStorage.setItem('vruddhi_current_user', userId);
        } catch {}
        setActiveView('Home');
        window.scrollTo(0, 0);
        return true;
      } else {
        return 'Incorrect password. Please enter valid credentials.';
      }
    }
    
    return 'No account exists with this User ID. Please Sign Up first.';
  };

  const handleRegister = async (userId: string, pw: string, name: string, email: string): Promise<boolean | string> => {
    if (userId === 'Admin_2007') {
      return 'Cannot register with reserved administrator User ID.';
    }
    
    if (registeredUsers[userId]) {
      return 'This User ID is already taken. Please choose another.';
    }

    setRegisteredUsers(prev => ({
      ...prev,
      [userId]: { pw, name, email }
    }));

    try {
      await insertSupabaseUser({ id: userId, pw, name, email, role: 'Normal User' });
    } catch (e) {
      console.warn('Fallback to local state. Supabase registration insert failed:', e);
    }

    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vruddhi_current_user');
    } catch {}
    setActiveView('Home');
    window.scrollTo(0, 0);
  };

  // Add properties listing request
  const handleAddListingRequest = (proposal: any) => {
    const newProp = {
      id: `sell-${Date.now()}`,
      title: proposal.title,
      locality: proposal.locality,
      city: proposal.city,
      price: proposal.price,
      bhk: proposal.bhk,
      propertyType: proposal.propertyType,
      purpose: proposal.purpose,
      fullName: proposal.fullName,
      email: proposal.email,
      phone: proposal.phone,
      status: 'Pending',
      image: proposal.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      userId: currentUser
    };
    setSellRequests(prev => [newProp, ...prev]);
    insertSupabaseSellRequest(newProp, currentUser).catch(console.error);
  };

  // Callback to move listing into search pool once approved by administrator
  const handleApprovePropertyListing = (listing: any) => {
    const priceWithMo = listing.purpose === 'Rent' && !listing.price.includes('/mo') ? `${listing.price}/mo` : listing.price;
    
    // Choose beautiful premium images matching property type if the listing doesn’t have a specific custom one
    let finalImage = listing.image;
    const isPlaceholder = !finalImage || 
                        finalImage.trim() === '' || 
                        finalImage.startsWith('blob:') ||
                        finalImage.includes('photo-1564013799919-ab600027ffc6');
                        
    if (isPlaceholder) {
      const villaImages = [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
      ];
      const flatImages = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
      ];
      const plotImages = [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80'
      ];
      const officeImages = [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
      ];

      const propTypeLower = (listing.propertyType || '').toLowerCase();
      if (propTypeLower.includes('villa') || propTypeLower.includes('bungalow') || propTypeLower.includes('house') || propTypeLower.includes('manor')) {
        finalImage = villaImages[Math.floor(Math.random() * villaImages.length)];
      } else if (propTypeLower.includes('plot') || propTypeLower.includes('land')) {
        finalImage = plotImages[Math.floor(Math.random() * plotImages.length)];
      } else if (propTypeLower.includes('office') || propTypeLower.includes('commercial') || propTypeLower.includes('workspace')) {
        finalImage = officeImages[Math.floor(Math.random() * officeImages.length)];
      } else {
        finalImage = flatImages[Math.floor(Math.random() * flatImages.length)];
      }
    }

    // Direct mapping of the physical types to make sure of perfect filtering
    let approvedType = 'Flat';
    const propTypeLower = (listing.propertyType || '').toLowerCase();
    if (propTypeLower.includes('villa') || propTypeLower.includes('house') || propTypeLower.includes('bungalow')) {
      approvedType = 'Villa';
    } else if (propTypeLower.includes('plot') || propTypeLower.includes('land')) {
      approvedType = 'Plot';
    }

    const cleanProp: Property = {
      id: `approved-${Date.now()}`,
      title: listing.title,
      location: `${listing.locality}, ${listing.city}`,
      price: priceWithMo,
      bhk: listing.bhk,
      type: approvedType,
      image: finalImage,
      purpose: listing.purpose === 'Rent' ? 'Rent' : 'Buy'
    };
    setProperties(prev => [cleanProp, ...prev]);
    insertSupabaseProperty(cleanProp).catch(console.error);
  };

  // Add Contact Support claim
  const handleAddHelpRequest = (rawCase: any) => {
    const newCase = {
      id: `help-${Date.now()}`,
      name: rawCase.name,
      email: rawCase.email,
      message: rawCase.message,
      date: new Date().toISOString().split('T')[0],
      status: 'Open'
    };
    
    // Synchronously update local state and localStorage immediately to survive refreshes
    setHelpRequests(prev => {
      const updated = [newCase, ...prev];
      try {
        localStorage.setItem('vruddhi_help_requests', JSON.stringify(updated));
      } catch (err) {
        console.warn('Sync storage error:', err);
      }
      return updated;
    });

    insertSupabaseHelpRequest(newCase).catch(console.error);
  };

  // Add Newsletter subscribe node
  const handleAddNewsletterRequest = (email: string) => {
    const newSub = {
      id: `news-${Date.now()}`,
      email: email,
      date: new Date().toISOString().split('T')[0]
    };

    // Synchronously update local state and localStorage immediately to survive refreshes
    setNewsletterRequests(prev => {
      const updated = [newSub, ...prev];
      try {
        localStorage.setItem('vruddhi_newsletter_requests', JSON.stringify(updated));
      } catch (err) {
        console.warn('Sync storage error:', err);
      }
      return updated;
    });

    insertSupabaseNewsletter(newSub).catch(console.error);
  };

  // Callback to delete a property from the website (admin role only)
  const handleDeleteProperty = async (id: string) => {
    // Optimistic UI updates
    setProperties(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(wishId => wishId !== id));
    deleteSupabaseProperty(id).catch(console.error);
  };

  const mobileWishlistProperties = properties.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900 bg-white">
      <Navbar 
        activeView={activeView === 'Wishlist' || activeView === 'AdminDashboard' || activeView === 'Auth' || activeView === 'UserDashboard' ? 'Home' : activeView} 
        setView={setActiveView} 
        wishlistCount={wishlist.length} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenMobileWishlist={() => setMobileWishlistOpen(true)}
        registeredUsers={registeredUsers}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {activeView === 'Home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView onSetView={setActiveView} wishlist={wishlist} onToggleWishlist={toggleWishlist} onViewDetails={setSelectedProperty} properties={properties} isAdmin={currentUser === 'Admin_2007'} onDeleteProperty={handleDeleteProperty} />
            </motion.div>
          )}
          {activeView === 'Buy' && (
            <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BuyView wishlist={wishlist} onToggleWishlist={toggleWishlist} onViewDetails={setSelectedProperty} properties={properties} isAdmin={currentUser === 'Admin_2007'} onDeleteProperty={handleDeleteProperty} />
            </motion.div>
          )}
          {activeView === 'Rent' && (
            <motion.div key="rent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RentView wishlist={wishlist} onToggleWishlist={toggleWishlist} onViewDetails={setSelectedProperty} properties={properties} isAdmin={currentUser === 'Admin_2007'} onDeleteProperty={handleDeleteProperty} />
            </motion.div>
          )}
          {activeView === 'Sell' && (
            <motion.div key="sell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SellView onAddListingRequest={handleAddListingRequest} />
            </motion.div>
          )}
          {activeView === 'Help' && (
            <motion.div key="help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HelpView onAddHelpRequest={handleAddHelpRequest} />
            </motion.div>
          )}
          {activeView === 'Wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WishlistView wishlist={wishlist} onToggleWishlist={toggleWishlist} onViewDetails={setSelectedProperty} properties={properties} isAdmin={currentUser === 'Admin_2007'} onDeleteProperty={handleDeleteProperty} />
            </motion.div>
          )}
          {activeView === 'Localities' && (
            <motion.div key="localities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LocalitiesView onSetView={setActiveView} />
            </motion.div>
          )}
          {activeView === 'Auth' && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthView onLogin={handleLogin} onRegister={handleRegister} setView={setActiveView} />
            </motion.div>
          )}
          {activeView === 'UserDashboard' && (
            <motion.div key="user-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UserDashboardView 
                currentUser={currentUser}
                registeredUsers={registeredUsers}
                sellRequests={sellRequests}
                unlockRequests={unlockRequests}
                properties={properties}
                onLogout={handleLogout}
                setView={setActiveView}
              />
            </motion.div>
          )}
          {activeView === 'AdminDashboard' && currentUser === 'Admin_2007' && (
            <motion.div key="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminDashboardView 
                unlockRequests={unlockRequests}
                setUnlockRequests={setUnlockRequests}
                sellRequests={sellRequests}
                setSellRequests={setSellRequests}
                newsletterRequests={newsletterRequests}
                setNewsletterRequests={setNewsletterRequests}
                helpRequests={helpRequests}
                setHelpRequests={setHelpRequests}
                onLogout={handleLogout}
                onApprovePropertyListing={handleApprovePropertyListing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setActiveView} onOpenInfoModal={setFooterModal} onAddNewsletterRequest={handleAddNewsletterRequest} />
      
      {/* Global Quick Action */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-45 border-4 border-white cursor-pointer"
        onClick={() => { setActiveView('Help'); window.scrollTo(0, 0); }}
      >
        <MessageSquare className="w-8 h-8 font-bold" />
      </motion.button>

      {/* 🎒 REAL SLIDE-OUT MOBILE WISHLIST PANEL */}
      <AnimatePresence>
        {mobileWishlistOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            {/* Backdrop click tracker */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileWishlistOpen(false)}
              className="absolute inset-0 bg-slate-950 cursor-pointer"
            />
            
            {/* Side Drawer with glassmorphism */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-full h-full bg-white/95 backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between border-l border-slate-100 text-left z-20"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-base">Wishlist ({wishlist.length})</h3>
                  </div>
                  <button 
                    onClick={() => setMobileWishlistOpen(false)}
                    className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 cursor-pointer outline-none animate-pulse"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                  {mobileWishlistProperties.length > 0 ? (
                    mobileWishlistProperties.map(p => (
                      <div key={p.id} className="flex gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3 relative group">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-xl shrink-0" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{p.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{p.location}</p>
                          <p className="text-[11px] font-extrabold text-emerald-600 mt-1">{p.price}</p>
                        </div>
                        <button 
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white border border-slate-100 rounded-full shadow-sm flex items-center justify-center text-[10px] text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                      <p className="text-slate-800 font-bold text-sm">Wishlist is empty</p>
                      <p className="text-slate-400 text-[10px] max-w-[180px] mx-auto mt-1 font-semibold leading-relaxed">Tap the heart on property cards to save listings.</p>
                    </div>
                  )}
                </div>
              </div>

              {mobileWishlistProperties.length > 0 && (
                <button 
                  onClick={() => { setMobileWishlistOpen(false); setActiveView('Wishlist'); window.scrollTo(0,0); }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer outline-none text-center"
                >
                  Configure All Wishlists
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🏡 BEAUTIFUL COMPREHENSIVE PROPERTY DETAIL OVERLAY MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden my-8 relative text-left border border-slate-100"
            >
              {/* Image banner with dark gradients */}
              <div className="relative h-64 sm:h-80 w-full animate-fade-in">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <button 
                  onClick={closeDetailModal}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-950/50 hover:bg-slate-950 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer outline-none"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-8 right-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white bg-emerald-600 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-2 inline-block">Off-Market Listing</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{selectedProperty.title}</h2>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-medium text-slate-300">Expected Value</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{selectedProperty.price}</span>
                  </div>
                </div>
              </div>

              {/* Specs and form content */}
              <div className="p-8 sm:p-12 grid md:grid-cols-5 gap-12 max-h-[55vh] overflow-y-auto font-sans">
                <div className="md:col-span-3 space-y-8 text-left animate-fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">General Locality Area</h4>
                    <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      {selectedProperty.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Configuration</span>
                      <span className="text-sm font-bold text-slate-800">{selectedProperty.bhk}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</span>
                      <span className="text-sm font-bold text-slate-800">{selectedProperty.type}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Agreement</span>
                      <span className="text-sm font-bold text-slate-800">{selectedProperty.purpose === 'Buy' ? 'Buy Property' : 'For Rent'}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-left">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">Verified Direct Seller Statement</h4>
                    <p className="text-xs text-emerald-900/80 font-semibold leading-relaxed">
                      This property has been manually checked. Ownership tax credentials, spatial layouts, and title clear records are stored securely with our platform.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Discretion Safeguard</h4>
                    <div className="flex gap-4 items-start p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-left">
                      <EyeOff className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        To defend the occupant's absolute right to personal privacy, we mask the house/flat number and gate coordinates. Direct tours are schedule-unlocked once the listing owner accepts your background profile inquiry.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Matching inquiry box */}
                <div className="md:col-span-2 bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-col justify-between text-left">
                  {inquirySuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 h-full flex flex-col justify-center items-center"
                    >
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-extrabold text-2xl mb-4">✓</div>
                      <h4 className="font-extrabold text-slate-900 text-lg mb-2">Inquiry Submitted!</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Your profile was transferred to the direct owner. They will review and approve your meeting authorization within 4 business hours.
                      </p>
                      <button 
                        onClick={closeDetailModal}
                        className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-transform active:scale-95 outline-none"
                      >
                        Keep Browsing
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <h3 className="font-bold text-slate-900 text-base">Secure Profile Match</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Enter your background profile details to request listing access.</p>
                      {inquiryError && (
                        <p className="text-[10px] text-rose-500 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100 text-center select-none">
                          ⚠️ Enter valid credentials.
                        </p>
                      )}
                      <div>
                        <input 
                          type="text" 
                          placeholder="Your Full Name" 
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                        />
                      </div>
                      <div>
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none" 
                        />
                      </div>
                      <div>
                        <textarea 
                          placeholder="Your special requirements or timeline..." 
                          rows={3} 
                          value={inquiryMsg}
                          onChange={(e) => setInquiryMsg(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none" 
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer outline-none transition-transform active:scale-95"
                      >
                        Request Location Unlock
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📜 COMPANY INFORMATION MODAL */}
      <AnimatePresence>
        {footerModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 sm:p-12 shadow-2xl relative text-left border border-slate-100"
            >
              <div className="flex justify-between items-start mb-6 text-left">
                <h3 className="text-2xl font-extrabold text-slate-900">{footerModal} - Corporate Brief</h3>
                <button 
                  onClick={() => setFooterModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="text-slate-600 space-y-4 max-h-[50vh] overflow-y-auto pr-2 leading-relaxed text-sm whitespace-pre-line font-semibold text-left">
                {footerModal === 'About Us' && (
                  <div>
                    <p className="font-bold text-slate-800 text-base mb-2">Pioneering Discretion in Premium Real Estate</p>
                    <p className="mb-4">
                      Vruddhi Properties is Bengaluru's first privacy-centric luxury marketplace tailored to elite estate holdings. Founded in 2026, we specialize in off-market marketplace allocations keeping properties anonymous until serious interest profiles are cleared.
                    </p>
                    <p className="mb-4">
                      By eliminating public map pins and open contact catalogs, we prevent unsolicited trespassing, spam agent calls, and predatory underbidding.
                    </p>
                    <p className="font-bold text-slate-800">Our Pillars of Excellence:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>100% Direct Property Owners</li>
                      <li>Encrypted Secure Matching Databases</li>
                      <li>Zero Broker Solicitations or Margins</li>
                    </ul>
                  </div>
                )}

                {footerModal === 'Contact' && (
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-2">Reach Our Principal Desks</h4>
                    <p className="mb-4">Have an exclusive collection you'd like to transact off-market? Connect with our dedicated relation team.</p>
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                      <p className="text-xs"><strong>Corporate Office:</strong> Orbit Tech Square, 4th Floor, Sector-V, Whitefield, Bangalore, Karnataka, India - 560066</p>
                      <p className="text-xs"><strong>Email Desk:</strong> legal@vruddhi.in / help@vruddhi.in</p>
                      <p className="text-xs"><strong>Escalation Ring:</strong> +91 80 4920 1029</p>
                    </div>
                  </div>
                )}

                {footerModal === 'Privacy Policy' && (
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-2">Privacy-First Data Isolation Protocols</h4>
                    <p className="mb-4">
                      We consider non-exposure of private residence files an absolute constitutional right. When you list with Vruddhi, we execute the following security actions:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2">
                      <li>We strip metadata records and EXIF tags from property visual uploads automatically.</li>
                      <li>Your exact street directions, society gates, and floor numbers are strictly stored behind double-factor credentials.</li>
                      <li>No robot search harvesters are allowed to script or scrape listing pages on our domain.</li>
                    </ol>
                    <p className="mt-4">Your trust and anonymity are encrypted into everything we build.</p>
                  </div>
                )}

                {footerModal === 'Terms of Service' && (
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-2">Honest Declarations & Listing Obligations</h4>
                    <p className="mb-4 font-semibold">By using the Vruddhi platform, you agree to conform to high-integrity peer transactions:</p>
                    <p className="mb-2"><strong>1. Real Ownership:</strong> If listing an estate, you must upload matching property tax records or legal authorizations within 3 days showing verify clearance.</p>
                    <p className="mb-2"><strong>2. Accurate Dimensions:</strong> Providing incorrect super built-up area sizes or hiding legal encumbrances will cause instant proposal ban.</p>
                    <p className="mb-2"><strong>3. No External Agent Charging:</strong> Users are prohibited from transacting on behalf of external mass brokers under our 'owner' label option.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end font-sans">
                <button 
                  onClick={() => setFooterModal(null)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer outline-none"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

