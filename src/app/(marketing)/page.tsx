import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Shield, TrendingUp, Star, ArrowRight } from "lucide-react";

const testimonials = [
  { 
    name: "Aisha, Amazon FBA seller", 
    text: "Saved me 3 hours of manual research per product. ROI on the first day.",
    rating: 5
  },
  { 
    name: "Rohit, gadget reviewer", 
    text: "The Reddit sentiment summary is gold—found issues I hadn't seen in 100 reviews.",
    rating: 5
  },
  {
    name: "Priya, E-commerce Manager",
    text: "8-section analysis gives me everything I need to make confident product decisions.",
    rating: 5
  }
];

const features = [
  {
    icon: Search,
    title: "8-Section Deep Dive",
    description: "Executive summary, market position, customer sentiment, competitive analysis, technical specs, pricing, and recommendation."
  },
  {
    icon: Zap,
    title: "30-Second Results",
    description: "AI-powered research delivers comprehensive reports in under 30 seconds. No more hours of manual research."
  },
  {
    icon: Shield,
    title: "Source-Backed Intelligence",
    description: "Every insight backed by real data from Amazon reviews, Reddit discussions, and market analysis."
  },
  {
    icon: TrendingUp,
    title: "Pay-as-you-go",
    description: "Start with just ₹5 per search. No subscriptions, no commitments. Credits never expire."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ResearchPal Pro</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
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

          <Button asChild className="md:hidden">
            <Link href="/register">Start</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Live & Production Ready
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Deep-dive any product in{" "}
          <span className="text-primary">30 seconds</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get comprehensive 8-section intelligence reports for any product. 
          Pay-as-you-go research with source-backed insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
            <Link href="/pricing">
              Start Researching <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/testimonials">See Examples</Link>
          </Button>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Type Product Name</h3>
                <p className="text-gray-600 text-sm">Enter any product like "Sony WH-1000XM5" or "iPhone 15"</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Research</h3>
                <p className="text-gray-600 text-sm">Our AI analyzes reviews, market data, and competitive landscape</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Get 8-Section Report</h3>
                <p className="text-gray-600 text-sm">Receive comprehensive analysis with actionable insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need for product research</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive intelligence reports that give you the complete picture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by researchers worldwide</h2>
            <p className="text-gray-600">See what our users are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to supercharge your research?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of researchers who save hours every day
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/pricing">
                Get Started - From ₹39 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
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