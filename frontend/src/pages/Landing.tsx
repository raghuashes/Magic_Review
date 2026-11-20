import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Smartphone, QrCode, Globe, Star, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { cn } from '../utils/helpers';

const features = [
  {
    icon: QrCode,
    title: 'QR Code Based',
    description: 'Generate unique QR codes for each store. Customers scan and review instantly — no app download needed.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Optimized for mobile screens. Customers can write reviews on the go with a smooth, native feel.',
  },
  {
    icon: Globe,
    title: '3 Indian Language Styles',
    description: 'Support for English, Telugu+English mix, and Hinglish — all in Latin script for maximum compatibility.',
  },
  {
    icon: Shield,
    title: 'Ethical & Transparent',
    description: 'Zero fake reviews. Customers retain 100% control — they edit and post manually to Google.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹299',
    period: '/month',
    description: 'Perfect for small shops and salons',
    features: [
      'Up to 3 stores',
      '100 reviews/month',
      'Custom branding',
      'QR code downloads',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹699',
    period: '/month',
    description: 'For growing chains and clinics',
    features: [
      'Up to 15 stores',
      'Unlimited reviews',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      'API access',
    ],
    cta: 'Get Started',
    popular: true,
  },
];

const faqs = [
  {
    q: 'Does Magic Review post reviews automatically to Google?',
    a: 'No. We generate a review draft that the customer copies and manually posts to Google. We never auto-post.',
  },
  {
    q: 'Can I filter negative reviews?',
    a: 'No. We don\'t support review gating. All feedback — positive or negative — reaches the customer equally.',
  },
  {
    q: 'What languages are supported?',
    a: 'Exactly three: English, Telugu + English mix (Roman script), and Hindi + English mix (Hinglish, Roman script). No native scripts.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! Both plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    q: 'How does the QR code work?',
    a: 'Each store gets a unique QR code linking to /s/{slug}. Customers scan, select their experience, choose language style, and get an AI-generated draft.',
  },
  {
    q: 'What happens if I don\'t have a Gemini API key?',
    a: 'The system automatically falls back to Demo Mode with pre-built templates — perfect for testing and development.',
  },
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI Review Generation for Local Indian Businesses</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Turn Happy Customers Into{' '}
              <span className="text-primary-600 dark:text-primary-400">Google Reviews</span>
              {' '}Automatically
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Magic Review helps jewellers, restaurants, salons, clinics & shops get more authentic Google reviews
              via QR codes & AI-generated drafts in your customers' preferred language.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Local Indian Businesses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to collect more reviews, ethically.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to more Google reviews.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Setup Your Store',
                description: 'Add your business details, Google Review link, categories, and experience attributes. Customize colors and logo.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Display QR Code',
                description: 'Print and display the QR code at your counter, on tables, or receipts. Customers scan with their phone camera.',
                icon: QrCode,
              },
              {
                step: '03',
                title: 'Get Reviews',
                description: 'Customers select category, attributes, language style, and get an AI draft. They copy, tap Google link, and paste.',
                icon: Star,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-2xl font-bold px-4 py-1 rounded-full">{item.step}</span>
                </div>
                <div className="pt-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative p-8 bg-white dark:bg-gray-800 rounded-2xl border transition-all',
                  plan.popular
                    ? 'border-primary-500 shadow-lg shadow-primary-500/10 ring-2 ring-primary-500/20'
                    : 'border-gray-200 dark:border-gray-700'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{plan.description}</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-gray-950" id="faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-8">{faq.q}</h3>
                  <svg className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 animate-fade-in">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get More Reviews?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join hundreds of local businesses collecting authentic Google reviews with Magic Review.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Magic Review</span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI review generation for local Indian businesses. Ethical, transparent, and customer-controlled.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/pricing" className="hover:text-primary-600 dark:hover:text-primary-400">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-primary-600 dark:hover:text-primary-400">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 Magic Review. All rights reserved.
          </div>
        </div>
        </footer>
    </div>
  );
}