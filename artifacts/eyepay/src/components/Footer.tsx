import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-white pt-16 pb-8 text-sm">
      <div className="container max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary text-primary-foreground p-1 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <span className="font-bold text-lg text-foreground">EyePay</span>
            </div>
            <p className="text-muted-foreground">
              The world's leading cryptocurrency exchange platform.
            </p>
            <div className="pt-4 space-y-2">
              <h4 className="font-semibold text-foreground">Subscribe to our Newsletter</h4>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">About Us</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Announcements</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">News</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Products</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Exchange</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Buy Crypto</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pay</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Academy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Live</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tax</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gift Card</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Launchpad</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Service</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Downloads</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Desktop Application</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Buy Crypto</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Institutional & VIP Services</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">OTC Trading</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Referral</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Affiliate</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">BNB</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li><a href="#" className="hover:text-primary transition-colors">24/7 Chat Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Product Feedback & Suggestions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Fees</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">APIs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trading Rules</a></li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h5 className="font-medium text-foreground mb-2">Trade on the go</h5>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs">iOS</Button>
                <Button variant="outline" size="sm" className="w-full text-xs">Android</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground gap-4">
          <p>EyePay © 2026</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Reddit</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
