import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Image, BarChart2, FileText, Link2, MessageCircle, Repeat2, Heart, Bookmark, Share } from "lucide-react";

const trendingTopics = [
  { tag: "#Bitcoin", posts: "245K posts" },
  { tag: "#ETF", posts: "98.5K posts" },
  { tag: "#Ethereum", posts: "76.3K posts" },
  { tag: "#Solana", posts: "65.1K posts" },
  { tag: "#DeFi", posts: "52.7K posts" },
];

const topCreators = [
  { name: "CryptoAnalyst", handle: "@cryptoanalyst", color: "#1E63FF" },
  { name: "DeFi Daily", handle: "@defi_daily", color: "#F59E0B" },
  { name: "Web3 Explorer", handle: "@web3explorer", color: "#9945FF" },
  { name: "Altcoin Buzz", handle: "@altcoinbuzz", color: "#F7931A" },
  { name: "The Blockchainist", handle: "@blockchainist", color: "#26A17B" },
];

const marketOverview = [
  { symbol: "BTC/USDT", price: "$65,416.01", change: "-0.66%", up: false, color: "#F7931A" },
  { symbol: "ETH/USDT", price: "$1,767.61", change: "-1.80%", up: false, color: "#627EEA" },
  { symbol: "BNB/USDT", price: "$607.18", change: "-0.11%", up: false, color: "#F3BA2F" },
  { symbol: "SOL/USDT", price: "$73.43", change: "-0.85%", up: false, color: "#9945FF" },
  { symbol: "XRP/USDT", price: "$1.21", change: "-1.43%", up: false, color: "#00AAE4" },
];

const topStories = [
  { title: "Bitcoin Breaks $65K as BTC as ETF Inflows Surge", category: "MARKET UPDATE", time: "2h ago", gradient: "from-orange-400 to-yellow-500" },
  { title: "Ethereum Staking Hits New All-Time High", category: "ANALYSIS", time: "4h ago", gradient: "from-purple-500 to-blue-600" },
  { title: "Solana Ecosystem Shows Strong Growth", category: "ALTCOINS", time: "6h ago", gradient: "from-green-500 to-teal-600" },
];

const feedPosts = [
  {
    name: "CryptoAnalyst",
    handle: "@cryptoanalyst",
    time: "2h",
    verified: true,
    color: "#1E63FF",
    content: "The market structure for #BTC looks very bullish. Holding above $64K is key for the next leg up.",
    hasChart: true,
    replies: 42, retweets: 68, likes: 324, views: "21.6K",
  },
  {
    name: "DeFi Daily",
    handle: "@defi_daily",
    time: "3h",
    verified: true,
    color: "#F59E0B",
    content: "TVL in DeFi protocols just crossed $120B. DeFi summer 2.0 loading?",
    hasTvl: true,
    replies: 18, retweets: 37, likes: 196, views: "12.4K",
  },
  {
    name: "Web3Explorer",
    handle: "@web3explorer",
    time: "5h",
    verified: false,
    color: "#9945FF",
    content: "GM Square! Here are 5 web3 projects to watch this week:\n1. LayerZero (ZRO)\n2. EigenLayer (EIGEN)\n3. Wormhole (W)\n4. StarkNet (STRK)\n5. Arbitrum (ARB)\n\nDYOR as always. Not financial advice!",
    replies: 73, retweets: 41, likes: 215, views: "15.8K",
  },
];

const categories = [
  { icon: "📊", label: "Market Updates", desc: "Live prices, charts, and analysis" },
  { icon: "🏦", label: "DeFi", desc: "Decentralized finance news & insights" },
  { icon: "🎨", label: "NFT", desc: "Latest drops and NFT trends" },
  { icon: "🌐", label: "Web3", desc: "Web3 apps, tools and protocols" },
  { icon: "📈", label: "Trading", desc: "Strategies, tutorials and tips" },
  { icon: "⛓", label: "Blockchain", desc: "Technology, scaling and development" },
];

const featuredBlogs = [
  { title: "What BTC Halving Means for The Next Market Cycle", type: "BLOG", time: "2h ago", gradient: "from-orange-500 to-red-600" },
  { title: "Ethereum L2 Landscape Q2 2024 Report", type: "RESEARCH", time: "5h ago", gradient: "from-blue-500 to-purple-600" },
  { title: "Top 10 DeFi Protocols by Revenue in May 2024", type: "BLOG", time: "10h ago", gradient: "from-green-500 to-teal-600" },
];

const sidebarLinks = [
  { icon: "🔍", label: "Discover" },
  { icon: "📝", label: "Blog" },
  { icon: "🔬", label: "Research" },
];

function CoinDot({ color }: { color: string }) {
  return <span className="inline-block w-5 h-5 rounded-full flex-shrink-0" style={{ background: color }} />;
}

export default function Square() {
  const [postText, setPostText] = useState("");
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-white p-1 rounded-md">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="font-bold">EyePay Square</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Stay informed with everything crypto</p>
              <nav className="space-y-1 mb-6">
                {sidebarLinks.map((l, i) => (
                  <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors" data-testid={`square-nav-${l.label.toLowerCase()}`}>
                    <span>{l.icon}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </nav>
              <div className="bg-gradient-to-br from-[#EEF3FF] to-[#E0E8FF] rounded-xl p-4 text-center">
                <p className="text-xs font-medium mb-1">Join the global crypto community</p>
                <p className="text-xs text-muted-foreground mb-3">Share ideas, follow top voices, and stay updated in real-time.</p>
                <Button size="sm" className="w-full text-xs font-semibold" data-testid="button-join-square">Join EyePay Square</Button>
              </div>
            </div>
          </div>

          {/* Main feed */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 space-y-5">
            {/* Post composer */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#1E63FF] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">E</div>
                <input
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  placeholder="What's happening in crypto?"
                  className="flex-1 text-sm focus:outline-none bg-transparent"
                  data-testid="input-post-composer"
                />
              </div>
              <div className="flex items-center gap-2 border-t border-border pt-3">
                {[
                  { icon: <Image className="w-4 h-4" />, label: "Image" },
                  { icon: <BarChart2 className="w-4 h-4" />, label: "Poll" },
                  { icon: <FileText className="w-4 h-4" />, label: "Article" },
                  { icon: <Link2 className="w-4 h-4" />, label: "Link" },
                ].map((a, i) => (
                  <button key={i} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[#1E63FF] px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors" data-testid={`compose-${a.label.toLowerCase()}`}>
                    {a.icon} {a.label}
                  </button>
                ))}
                <Button size="sm" className="ml-auto font-semibold px-5" data-testid="button-post">Post</Button>
              </div>
            </div>

            {/* Top Stories */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Top Stories</h3>
                <a href="#" className="text-sm text-[#1E63FF] hover:underline font-medium">View all</a>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-2">
                {topStories.map((story, i) => (
                  <div key={i} className={`rounded-xl bg-gradient-to-br ${story.gradient} p-4 cursor-pointer h-32 flex flex-col justify-end`} data-testid={`story-${i}`}>
                    <span className="text-xs text-white/70 font-medium">{story.category}</span>
                    <p className="text-xs font-bold text-white mt-0.5 line-clamp-2">{story.title}</p>
                    <span className="text-xs text-white/60 mt-1">{story.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed tabs */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="flex border-b border-border">
                {["For You", "Following", "Trending", "Latest"].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === t ? "text-[#1E63FF] border-b-2 border-[#1E63FF]" : "text-muted-foreground hover:text-foreground"}`}
                    data-testid={`feed-tab-${t.replace(" ", "-").toLowerCase()}`}
                  >{t}</button>
                ))}
              </div>

              {/* Posts */}
              <div className="divide-y divide-border">
                {feedPosts.map((post, pi) => (
                  <div key={pi} className="p-5 hover:bg-gray-50 transition-colors" data-testid={`feed-post-${pi}`}>
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: post.color }}>
                        {post.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-bold text-sm">{post.name}</span>
                          {post.verified && <span className="text-xs text-[#1E63FF]">✓</span>}
                          <span className="text-xs text-muted-foreground">{post.handle}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{post.time}</span>
                        </div>
                        <p className="text-sm whitespace-pre-line mb-3">{post.content}</p>
                        {post.hasChart && (
                          <div className="bg-gray-900 rounded-xl h-28 mb-3 flex items-center justify-center">
                            <svg viewBox="0 0 200 80" className="w-full h-full px-4" preserveAspectRatio="none">
                              <polyline points="0,60 30,55 60,50 90,45 120,35 150,30 180,20 200,15" fill="none" stroke="#22c55e" strokeWidth="2" />
                              <polyline points="0,65 30,62 60,58 90,55 120,50 150,48 180,44 200,40" fill="none" stroke="#ef4444" strokeWidth="2" />
                            </svg>
                          </div>
                        )}
                        {post.hasTvl && (
                          <div className="border border-border rounded-xl p-3 mb-3">
                            <div className="text-xs text-muted-foreground">Total Value Locked (TVL)</div>
                            <div className="text-xl font-extrabold">$120.45B</div>
                            <div className="text-green-500 text-sm font-medium">+3.42% (24h)</div>
                          </div>
                        )}
                        <div className="flex items-center gap-5 text-xs text-muted-foreground">
                          {[
                            { icon: <MessageCircle className="w-4 h-4" />, count: post.replies },
                            { icon: <Repeat2 className="w-4 h-4" />, count: post.retweets },
                            { icon: <Heart className="w-4 h-4" />, count: post.likes },
                            { icon: <Bookmark className="w-4 h-4" />, count: post.views },
                            { icon: <Share className="w-4 h-4" />, count: null },
                          ].map((action, ai) => (
                            <button key={ai} className="flex items-center gap-1 hover:text-[#1E63FF] transition-colors" data-testid={`post-action-${pi}-${ai}`}>
                              {action.icon}
                              {action.count !== null && <span>{action.count}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 text-center">
                <button className="text-sm text-[#1E63FF] hover:underline font-medium" data-testid="button-load-more-posts">Load more posts</button>
              </div>
            </div>

            {/* Explore by Category */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Explore by Category</h3>
                <a href="#" className="text-xs text-[#1E63FF] hover:underline font-medium">View all categories</a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((c, i) => (
                  <div key={i} className="border border-border rounded-xl p-3.5 hover:shadow-sm hover:border-[#1E63FF]/30 transition-all cursor-pointer" data-testid={`category-${i}`}>
                    <span className="text-xl">{c.icon}</span>
                    <div className="font-semibold text-sm mt-1">{c.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Blogs */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Featured Blogs & Research</h3>
                <a href="#" className="text-xs text-[#1E63FF] hover:underline font-medium">View all</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredBlogs.map((blog, i) => (
                  <div key={i} className="cursor-pointer group" data-testid={`blog-${i}`}>
                    <div className={`rounded-xl bg-gradient-to-br ${blog.gradient} h-28 mb-2 group-hover:opacity-90 transition-opacity`} />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#1E63FF]">{blog.type}</span>
                      <span className="text-xs text-muted-foreground">{blog.time}</span>
                    </div>
                    <p className="text-sm font-semibold group-hover:text-[#1E63FF] transition-colors">{blog.title}</p>
                    <div className="text-xs text-muted-foreground mt-1">EyePay Research</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden xl:block col-span-3 space-y-5">
            {/* Market Overview */}
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Market Overview</h4>
                <a href="/markets" className="text-xs text-[#1E63FF] hover:underline font-medium">View all</a>
              </div>
              <div className="flex gap-2 mb-3">
                {["Favorites", "Crypto", "Indices"].map(t => (
                  <button key={t} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 font-medium" data-testid={`overview-tab-${t.toLowerCase()}`}>{t}</button>
                ))}
              </div>
              <div className="space-y-2">
                {marketOverview.map((coin, i) => (
                  <div key={i} className="flex items-center gap-2" data-testid={`overview-coin-${i}`}>
                    <CoinDot color={coin.color} />
                    <span className="flex-1 text-xs font-medium">{coin.symbol}</span>
                    <span className="text-xs font-semibold">{coin.price}</span>
                    <span className={`text-xs font-medium ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Trending Topics</h4>
                <a href="#" className="text-xs text-[#1E63FF] hover:underline font-medium">View all</a>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((t, i) => (
                  <div key={i} className="cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors" data-testid={`trending-${i}`}>
                    <div className="font-semibold text-sm text-[#1E63FF]">{t.tag}</div>
                    <div className="text-xs text-muted-foreground">{t.posts}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Creators */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Top Creators</h4>
                <a href="#" className="text-xs text-[#1E63FF] hover:underline font-medium">View all</a>
              </div>
              <div className="space-y-3">
                {topCreators.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5" data-testid={`creator-${i}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: c.color }}>{c.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.handle}</div>
                    </div>
                    <button className="text-xs border border-[#1E63FF] text-[#1E63FF] px-3 py-1 rounded-full hover:bg-[#1E63FF] hover:text-white transition-colors font-semibold" data-testid={`follow-${i}`}>Follow</button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#1E63FF] to-[#5B8DEF] rounded-2xl p-5 text-white">
              <h4 className="font-bold mb-1">Create. Share. Earn.</h4>
              <p className="text-xs text-blue-100 mb-3">Share your insights and grow your community. Top creators earn exclusive rewards.</p>
              <Button variant="secondary" size="sm" className="w-full font-semibold" data-testid="button-learn-more-square">Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
