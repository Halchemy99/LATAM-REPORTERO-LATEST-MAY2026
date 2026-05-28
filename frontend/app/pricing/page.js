'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Users, ArrowRight, Clock } from 'lucide-react';

// /pricing is taken offline per strategy doc — single $5/mo community tier launches
// when community infrastructure is ready. This page redirects reader intent to
// the two things that are live: free newsletter and community waitlist.

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />

      <main className="flex-1 flex items-center">
        <div className="container py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h1
              className="font-serif text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4 leading-tight"
              
            >
              Membership is coming.
            </h1>
            <p className="text-[#666666] text-base leading-relaxed mb-8">
              We&apos;re building the community before charging for it. Member calls, Signal groups, direct access to reporters across LATAM. We&apos;ll open it when it&apos;s ready, not before.
            </p>
            <p className="text-sm text-[#666666] mb-10">
              In the meantime, the newsletter is free. Always. No account, no card, no catch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/newsletter">
                <Button className="rounded-none bg-[#1a1a1a] hover:bg-[#6111ff] text-white gap-2 w-full sm:w-auto transition-colors">
                  <Mail className="h-4 w-4" />
                  Get the free newsletter
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="rounded-none border-[#1a1a1a]/20 gap-2 w-full sm:w-auto">
                  <Users className="h-4 w-4" />
                  Join the waitlist
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
