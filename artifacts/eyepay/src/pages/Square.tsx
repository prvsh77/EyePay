import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";
import { Eye, Image, BarChart2, FileText, Link2, MessageCircle, Repeat2, Heart, Bookmark, Share, CheckCircle2, UserPlus, UserCheck, X } from "lucide-react";
import { CryptoLogo } from "../components/CryptoLogo";

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

const initialFeedPosts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: "Web3 Explorer",
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

function CoinDot({ symbol, color }: { symbol: string; color: string }) {
  return <CryptoLogo symbol={symbol} color={color} className="w-5 h-5" />;
}

export default function Square() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Dynamic States
  const [postText, setPostText] = useState("");
  const [activeTab, setActiveTab] = useState("For You");
  const [feed, setFeed] = useState(initialFeedPosts);
  
  // Follow/Unfollow list
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  
  // Likes/Retweets/Bookmarks lists
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [retweetedPosts, setRetweetedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);

  // Modals
  const [showSquareRegister, setShowSquareRegister] = useState(false);

  const handlePostSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postText.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Post",
        description: "Please type some content before publishing.",
      });
      return;
    }

    const newPost = {
      id: Date.now(),
      name: user?.name || "Demo Visitor",
      handle: user ? `@${user.name.toLowerCase().replace(/\s/g, "")}` : "@demovisitor",
      time: "Just now",
      verified: false,
      color: "#1E63FF",
      content: postText,
      hasChart: false,
      replies: 0,
      retweets: 0,
      likes: 0,
      views: "1"
    };

    setFeed([newPost, ...feed]);
    setPostText("");
    toast({
      title: "Post Published",
      description: "Your message is live on EyePay Square!",
    });
  };

  const handleFollowToggle = (handle: string) => {
    const isFollowing = followedCreators.includes(handle);
    const updated = isFollowing
      ? followedCreators.filter(h => h !== handle)
      : [...followedCreators, handle];
    setFollowedCreators(updated);
    toast({
      title: isFollowing ? "Unfollowed Creator" : "Following Creator",
      description: `${handle} creator watchlist updated.`,
    });
  };

  const handleLike = (id: number) => {
    const isLiked = likedPosts.includes(id);
    const updated = isLiked
      ? likedPosts.filter(pid => pid !== id)
      : [...likedPosts, id];
    setLikedPosts(updated);
    toast({
      title: isLiked ? "Post Unliked" : "Post Liked",
      description: isLiked ? "Removed like metric." : "Post liked and logged.",
    });
  };

  const handleRetweet = (id: number) => {
    const isRt = retweetedPosts.includes(id);
    const updated = isRt
      ? retweetedPosts.filter(pid => pid !== id)
      : [...retweetedPosts, id];
    setRetweetedPosts(updated);
    toast({
      title: isRt ? "Repost Removed" : "Reposted",
      description: isRt ? "Removed repost metric." : "Shared with followers list.",
    });
  };

  const handleBookmark = (id: number) => {
    const isBm = bookmarkedPosts.includes(id);
    const updated = isBm
      ? bookmarkedPosts.filter(pid => pid !== id)
      : [...bookmarkedPosts, id];
    setBookmarkedPosts(updated);
    toast({
      title: isBm ? "Removed Bookmark" : "Bookmarked",
      description: isBm ? "Wiped from private saves." : "Saved to your private references list.",
    });
  };

  const handleSquareCTA = () => {
    setShowSquareRegister(true);
    toast({
      title: "Square Community",
      description: "Ready to setup your developer profiles.",
    });
  };

  return (
    <div className="bg-transparent min-h-screen text-foreground relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left sidebar */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div className="glass-card rounded-2xl p-5 sticky top-24 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-white p-1 rounded-md">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="font-bold text-foreground">EyePay Square</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Stay informed with everything crypto</p>
              <nav className="space-y-1 mb-6">
                {sidebarLinks.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => toast({ title: l.label, description: `Loading ${l.label.toLowerCase()} hub feed...` })}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted text-sm font-medium transition-colors text-foreground"
                    data-testid={`square-nav-${l.label.toLowerCase()}`}
                  >
                    <span>{l.icon}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </nav>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold mb-1 text-foreground">Join the community</p>
                <p className="text-[10px] text-muted-foreground mb-3 leading-normal">Share ideas, follow top voices, and stay updated.</p>
                <Button size="sm" onClick={handleSquareCTA} className="w-full text-xs font-semibold" data-testid="button-join-square">Join Square</Button>
              </div>
            </div>
          </div>

          {/* Main feed */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 space-y-5">
            {/* Post composer */}
            <div className="glass-card rounded-2xl p-5 border border-border/50 shadow">
              <form onSubmit={handlePostSubmit}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user?.name ? user.name[0].toUpperCase() : "D"}
                  </div>
                  <input
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    placeholder="What's happening in crypto?"
                    className="flex-1 text-sm focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                    data-testid="input-post-composer"
                  />
                </div>
                <div className="flex items-center gap-2 border-t border-border/40 pt-3">
                  {[
                    { icon: <Image className="w-4 h-4" />, label: "Image" },
                    { icon: <BarChart2 className="w-4 h-4" />, label: "Poll" },
                    { icon: <FileText className="w-4 h-4" />, label: "Article" },
                    { icon: <Link2 className="w-4 h-4" />, label: "Link" },
                  ].map((a, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toast({ title: a.label, description: `Composer media attachments active.` })}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                      data-testid={`compose-${a.label.toLowerCase()}`}
                    >
                      {a.icon} {a.label}
                    </button>
                  ))}
                  <Button type="submit" size="sm" className="ml-auto font-semibold px-5" data-testid="button-post">Post</Button>
                </div>
              </form>
            </div>

            {/* Top Stories */}
            <div className="glass-card rounded-2xl p-5 border border-border/50 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">Top Stories</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Top Stories", description: "Displaying hot global stories." }); }} className="text-sm text-primary hover:underline font-medium">View all</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                {topStories.map((story, i) => (
                  <div
                    key={i}
                    onClick={() => toast({ title: story.category, description: story.title })}
                    className={`rounded-xl bg-gradient-to-br ${story.gradient} p-4 cursor-pointer h-32 flex flex-col justify-end shadow-sm hover:scale-[1.02] transition-transform`}
                    data-testid={`story-${i}`}
                  >
                    <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{story.category}</span>
                    <p className="text-xs font-bold text-white mt-0.5 line-clamp-2 leading-snug">{story.title}</p>
                    <span className="text-[9px] text-white/70 mt-1 font-mono">{story.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed tabs */}
            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              <div className="flex border-b border-border/50 bg-muted/10">
                {["For You", "Following", "Trending", "Latest"].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTab(t);
                      toast({ title: t, description: `Filter set to show ${t.toLowerCase()} square index.` });
                    }}
                    className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === t ? "text-primary border-b-2 border-primary bg-background/40" : "text-muted-foreground hover:text-foreground"}`}
                    data-testid={`feed-tab-${t.replace(" ", "-").toLowerCase()}`}
                  >{t}</button>
                ))}
              </div>

              {/* Posts */}
              <div className="divide-y divide-border/30">
                {feed.map((post, pi) => {
                  const isLiked = likedPosts.includes(post.id);
                  const isRt = retweetedPosts.includes(post.id);
                  const isBm = bookmarkedPosts.includes(post.id);
                  
                  return (
                    <div key={post.id} className="p-5 hover:bg-muted/20 transition-colors" data-testid={`feed-post-${pi}`}>
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: post.color }}>
                          {post.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="font-bold text-sm text-foreground">{post.name}</span>
                            {post.verified && <span className="text-xs text-primary font-bold">✓</span>}
                            <span className="text-xs text-muted-foreground font-mono">{post.handle}</span>
                            
                            {followedCreators.includes(post.handle) && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold font-mono">Following</span>
                            )}
                            
                            <span className="text-xs text-muted-foreground ml-auto font-mono">{post.time}</span>
                          </div>
                          
                          <p className="text-sm whitespace-pre-line mb-3 text-foreground leading-relaxed">{post.content}</p>
                          
                          {post.hasChart && (
                            <div className="bg-slate-900 dark:bg-slate-950 border border-border/40 rounded-xl h-28 mb-3 flex items-center justify-center p-2">
                              <svg viewBox="0 0 200 80" className="w-full h-full px-4" preserveAspectRatio="none">
                                <polyline points="0,60 30,55 60,50 90,45 120,35 150,30 180,20 200,15" fill="none" stroke="#22c55e" strokeWidth="2" />
                              </svg>
                            </div>
                          )}
                          
                          {post.hasTvl && (
                            <div className="border border-border/40 rounded-xl p-3 mb-3 bg-muted/10">
                              <div className="text-[10px] text-muted-foreground uppercase font-semibold">Total Value Locked (TVL)</div>
                              <div className="text-lg font-extrabold text-foreground font-mono">$120.45B</div>
                              <div className="text-green-500 text-xs font-semibold font-mono">+3.42% (24h)</div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground max-w-sm pt-1">
                            <button
                              onClick={() => toast({ title: "Comment Thread", description: "Displaying post replies..." })}
                              className="flex items-center gap-1.5 hover:text-primary transition-colors"
                              data-testid={`post-action-${pi}-0`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </button>
                            
                            <button
                              onClick={() => handleRetweet(post.id)}
                              className={`flex items-center gap-1.5 hover:text-green-500 transition-colors ${isRt ? "text-green-500" : ""}`}
                              data-testid={`post-action-${pi}-1`}
                            >
                              <Repeat2 className="w-4 h-4" />
                              <span>{isRt ? post.retweets + 1 : post.retweets}</span>
                            </button>
                            
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${isLiked ? "text-red-500" : ""}`}
                              data-testid={`post-action-${pi}-2`}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                              <span>{isLiked ? post.likes + 1 : post.likes}</span>
                            </button>
                            
                            <button
                              onClick={() => handleBookmark(post.id)}
                              className={`flex items-center gap-1.5 hover:text-yellow-500 transition-colors ${isBm ? "text-yellow-500" : ""}`}
                              data-testid={`post-action-${pi}-3`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBm ? "fill-current" : ""}`} />
                            </button>
                            
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`https://eyepay.com/square/post/${post.id}`);
                                toast({ title: "Link Copied", description: "Post URL saved to clipboard." });
                              }}
                              className="flex items-center gap-1.5 hover:text-primary transition-colors"
                              data-testid={`post-action-${pi}-4`}
                            >
                              <Share className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 text-center">
                <button
                  onClick={() => {
                    toast({ title: "Fetch Feed", description: "Loading archived social logs..." });
                  }}
                  className="text-xs text-primary hover:underline font-semibold"
                  data-testid="button-load-more-posts"
                >
                  Load more posts
                </button>
              </div>
            </div>

            {/* Explore by Category */}
            <div className="glass-card rounded-2xl p-5 border border-border/50 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">Explore by Category</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Explore", description: "Categories optimized." }); }} className="text-xs text-primary hover:underline font-medium">View all categories</a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => toast({ title: c.label, description: c.desc })}
                    className="border border-border/60 bg-background/30 rounded-xl p-3.5 hover:shadow-sm hover:border-primary/30 transition-all cursor-pointer"
                    data-testid={`category-${i}`}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <div className="font-semibold text-xs mt-1 text-foreground">{c.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Blogs */}
            <div className="glass-card rounded-2xl p-5 border border-border/50 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">Featured Blogs & Research</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Blogs", description: "Loading developer news index..." }); }} className="text-xs text-primary hover:underline font-medium">View all</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredBlogs.map((blog, i) => (
                  <div key={i} onClick={() => toast({ title: blog.type, description: blog.title })} className="cursor-pointer group" data-testid={`blog-${i}`}>
                    <div className={`rounded-xl bg-gradient-to-br ${blog.gradient} h-28 mb-2 group-hover:opacity-90 transition-opacity`} />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold text-primary tracking-wide">{blog.type}</span>
                      <span className="text-[9px] text-muted-foreground font-mono">{blog.time}</span>
                    </div>
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug">{blog.title}</p>
                    <div className="text-[10px] text-muted-foreground mt-1">EyePay Research</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden xl:block col-span-3 space-y-5">
            {/* Market Overview */}
            <div className="glass-card rounded-2xl p-5 sticky top-24 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-foreground">Market Overview</h4>
                <a href="/markets" className="text-xs text-primary hover:underline font-medium">View all</a>
              </div>
              <div className="flex gap-2 mb-3">
                {["Favorites", "Crypto"].map(t => (
                  <button key={t} onClick={() => toast({ title: t, description: "Filter overview." })} className="text-[10px] px-2.5 py-1 rounded-full bg-muted/40 hover:bg-muted/80 text-muted-foreground font-medium font-mono">{t}</button>
                ))}
              </div>
              <div className="space-y-2">
                {marketOverview.map((coin, i) => (
                  <div key={i} className="flex items-center gap-2" data-testid={`overview-coin-${i}`}>
                    <CoinDot symbol={coin.symbol} color={coin.color} />
                    <span className="flex-1 text-[10px] font-semibold text-foreground font-mono">{coin.symbol}</span>
                    <span className="text-[10px] font-bold text-foreground font-mono">{coin.price}</span>
                    <span className={`text-[10px] font-semibold font-mono ${coin.up ? "text-green-500" : "text-red-500"}`}>{coin.change}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="glass-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-foreground">Trending Topics</h4>
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Topics", description: "Refreshing global indices..." }); }} className="text-xs text-primary hover:underline font-medium">View all</a>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((t, i) => (
                  <div key={i} onClick={() => toast({ title: "Trending Tag", description: `Loading feed for ${t.tag}` })} className="cursor-pointer hover:bg-muted/40 rounded-lg px-2 py-1.5 -mx-2 transition-colors" data-testid={`trending-${i}`}>
                    <div className="font-bold text-xs text-primary font-mono">{t.tag}</div>
                    <div className="text-[9px] text-muted-foreground font-mono">{t.posts}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Creators */}
            <div className="glass-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-foreground">Top Creators</h4>
                <a href="#" onClick={(e) => { e.preventDefault(); toast({ title: "Creators Index", description: "Loading top publishers..." }); }} className="text-xs text-primary hover:underline font-medium">View all</a>
              </div>
              <div className="space-y-3">
                {topCreators.map((c, i) => {
                  const isFollowing = followedCreators.includes(c.handle);
                  return (
                    <div key={i} className="flex items-center gap-2.5" data-testid={`creator-${i}`}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: c.color }}>{c.name[0].toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-foreground truncate">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate">{c.handle}</div>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(c.handle)}
                        className={`text-[9px] border px-3 py-1 rounded-full font-bold transition-colors ${
                          isFollowing
                            ? "bg-primary border-primary text-white hover:bg-primary/80"
                            : "border-primary text-primary hover:bg-primary/10"
                        }`}
                        data-testid={`follow-${i}`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Square Registration Modal */}
      {showSquareRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-foreground">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6 relative text-center">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground" onClick={() => setShowSquareRegister(false)}>
              <X className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Join EyePay Square</h3>
            <p className="text-xs text-muted-foreground mb-4">Setup your personal developer credentials to post articles, research, and technical charts on the feed.</p>
            <Button onClick={() => { setShowSquareRegister(false); toast({ title: "Profile Initialized", description: "Virtual profile registered successfully." }); }} className="w-full font-bold">Accept & Activate Profile</Button>
          </div>
        </div>
      )}
    </div>
  );
}
