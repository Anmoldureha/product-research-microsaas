import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Search, ArrowRight } from "lucide-react";

const packages = [
  {
    id: "10",
    name: "Starter",
    credits: 10,
    price: 39,
    priceUSD: 0.47,
    description: "Perfect for trying out the service",
    features: [
      "10 product research reports",
      "8-section comprehensive analysis",
      "Source-backed insights",
      "PDF download",
      "Email support"
    ],
    popular: false
  },
  {
    id: "50",
    name: "Professional",
    credits: 50,
    price: 179,
    priceUSD: 2.15,
    description: "Best value for regular researchers",
    features: [
      "50 product research reports",
      "8-section comprehensive analysis",
      "Source-backed insights",
      "PDF download",
      "Priority email support",
      "Advanced filtering"
    ],
    popular: true
  },
  {
    id: "200",
    name: "Enterprise",
    credits: 200,
    price: 599,
    priceUSD: 7.18,
    description: "For teams and heavy users",
    features: [
      "200 product research reports",
      "8-section comprehensive analysis",
      "Source-backed insights",
      "PDF download",
      "24/7 priority support",
      "Advanced filtering",
      "Team sharing"
    ],
    popular: false
  }
];

const faqs = [
  {
    question: "Do unused credits roll over?",
    answer: "Yes! Your credits never expire. Use them whenever you need product research."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept PhonePe (UPI & Wallet) for Indian customers and Stripe (cards) for international payments."
  },
  {
    question: "How accurate is the research?",
    answer: "Our AI analyzes thousands of reviews, market data, and competitive intelligence to provide comprehensive insights. Data is sourced from Amazon, Reddit, and other reliable platforms."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 7-day refund policy if you're not satisfied with the service quality."
  },
  {
    question: "Is there a free trial?",
    answer: "We don't offer free trials, but our starter package at ₹39 lets you test the service with 10 searches."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ResearchPal Pro</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/testimonials" className="text-gray-600 hover:text-gray-900">
              Testimonials
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Pay only for what you use. No subscriptions, no hidden fees. Credits never expire.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Best Value
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="text-base">{pkg.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">₹{pkg.price}</span>
                    <span className="text-gray-500 ml-2">(${pkg.priceUSD})</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {pkg.credits} search credits
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{(pkg.price / pkg.credits).toFixed(1)} per search
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className="w-full" 
                  variant={pkg.popular ? "default" : "outline"}
                >
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Secure payments powered by</p>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-2xl font-bold text-purple-600">PhonePe</div>
            <div className="text-2xl font-bold text-blue-600">Stripe</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-gray-600">Everything you need to know about ResearchPal Pro</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start researching?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who save hours on product research
          </p>
          
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Create Account <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-white">ResearchPal Pro</span>
              </div>
              <p className="text-sm">
                Deep-dive any product in 30 seconds with AI-powered research.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@researchpal.pro" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 ResearchPal Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}