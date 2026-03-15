import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { createAdminClient } from '@/lib/supabase';
import type { ProfileRow } from '@/lib/database.types';
import { Users, Shield, Zap, Search, Filter, ShieldCheck, Mail, Phone, Calendar, ArrowUpDown } from 'lucide-react';

interface MembersPageProps {
  initialMembers: ProfileRow[];
}

export default function MembersPage({ initialMembers }: MembersPageProps) {
  const [members, setMembers] = useState<ProfileRow[]>(initialMembers);
  const [secret, setSecret] = useState('');
  const [isPrompting, setIsPrompting] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if secret is in URL on mount
    const urlParams = new URLSearchParams(window.location.search);
    const secretParam = urlParams.get('secret');
    if (secretParam) {
      setSecret(secretParam);
      setIsPrompting(false);
    }
  }, []);

  const handleUpdateTier = async (userId: string, newTier: 'free' | 'premium') => {
    if (!secret) return;
    setUpdatingId(userId);

    try {
      const res = await fetch('/api/admin/update-tier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ userId, tier: newTier }),
      });

      if (res.ok) {
        setMembers(prev =>
          prev.map(m => (m.id === userId ? { ...m, membership_tier: newTier } : m))
        );
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Failed to update tier'}`);
      }
    } catch (err) {
      alert('Failed to connect to API');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm);
    
    const matchesFilter = tierFilter === 'all' || m.membership_tier === tierFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (isPrompting && !secret) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1E293B] rounded-xl border border-white/10 p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-swiss-red/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-swiss-red" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-white text-center mb-2">Admin Access</h1>
          <p className="text-slate-400 text-center mb-8">Please enter the admin secret to continue.</p>
          <form onSubmit={(e) => { e.preventDefault(); setIsPrompting(false); }} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F172A] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swiss-red transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-swiss-red hover:bg-swiss-red/90 text-white font-medium rounded-lg transition-colors"
            >
              Verify Identity
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6 lg:p-10">
      <Head>
        <title>Member Management | CLB Kết nối tri thức Admin</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-swiss-red" />
              Member Management
            </h1>
            <p className="text-slate-400">Manage community members and membership tiers.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#1E293B] px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Admin Session Active
            </div>
          </div>
        </header>

        {/* Stats & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1E293B] p-6 rounded-xl border border-white/10">
            <p className="text-slate-400 text-sm mb-1">Total Members</p>
            <p className="text-3xl font-serif text-white">{members.length}</p>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-xl border border-white/10">
            <p className="text-slate-400 text-sm mb-1">Premium Members</p>
            <p className="text-3xl font-serif text-white">
              {members.filter(m => m.membership_tier === 'premium').length}
            </p>
          </div>
          <div className="md:col-span-2 bg-[#1E293B] p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-swiss-red/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as any)}
                className="bg-[#0F172A] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-swiss-red/50"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-[#1E293B] rounded-xl border border-white/10 overflow-hidden shadow-xl text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-white/10">
                  <th className="px-6 py-4 font-medium text-slate-400 uppercase tracking-wider text-xs">Member</th>
                  <th className="px-6 py-4 font-medium text-slate-400 uppercase tracking-wider text-xs">Contact</th>
                  <th className="px-6 py-4 font-medium text-slate-400 uppercase tracking-wider text-xs">Tier</th>
                  <th className="px-6 py-4 font-medium text-slate-400 uppercase tracking-wider text-xs text-center items-center">Downloads</th>
                  <th className="px-6 py-4 font-medium text-slate-400 uppercase tracking-wider text-xs">Joined</th>
                  <th className="px-6 py-4 font-medium text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-white/10">
                          {member.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.full_name || 'Anonymous User'}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                        member.membership_tier === 'premium' 
                          ? 'bg-swiss-red/10 text-swiss-red border-swiss-red/30' 
                          : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                      }`}>
                        {member.membership_tier}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-block px-3 py-1 bg-[#0F172A] rounded border border-white/5">
                        <span className="text-white font-mono">{member.downloads_this_month}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-400 italic">
                      {new Date(member.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {member.membership_tier === 'free' ? (
                          <button
                            onClick={() => handleUpdateTier(member.id, 'premium')}
                            disabled={updatingId === member.id}
                            className="bg-swiss-red hover:bg-swiss-red/90 text-white px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1 shadow-lg shadow-swiss-red/20 disabled:opacity-50"
                          >
                            <Zap className="w-3 h-3" />
                            Upgrade Premium
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateTier(member.id, 'free')}
                            disabled={updatingId === member.id}
                            className="bg-[#0F172A] hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded text-xs font-medium border border-white/10 transition-all flex items-center gap-1 disabled:opacity-50"
                          >
                            Downgrade Free
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredMembers.length === 0 && (
            <div className="p-12 text-center text-slate-500 italic">
              No members found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
        .font-serif {
          font-family: 'Libre+Baskerville', serif;
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const secret = context.query.secret || context.req.cookies.admin_secret;
  
  // Validation against env secret
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    // If we're strictly enforcing secret in the URL or cookie for the page load
    // but the task says return notFound: true on failure
    return { notFound: true };
  }

  try {
    const admin = createAdminClient();
    const { data: members, error } = await admin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      props: {
        initialMembers: members || [],
      },
    };
  } catch (err) {
    console.error('[Admin Members] getServerSideProps error:', err);
    return { notFound: true };
  }
};
