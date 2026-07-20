import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden grid-bg">

      {/* Glow orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 text-center">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            Your Complete Placement Prep Ecosystem
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
            Crack Your
            <br />
            <span className="text-primary glow-text">Dream Placement</span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Master DSA, Aptitude, OS, CN, OOPs & DBMS with structured sheets,
            an integrated code editor, contests, and progress tracking — all in one place.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-purple">
              <Link to="/dsa">
                Start DSA Sheet <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-border hover:bg-secondary">
              <Link to="/aptitude">
                Practice Aptitude <Brain className="h-4 w-4 ml-1" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary">
              <Link to="/subjects">Explore Subjects</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary">
              <Link to="/videos">Watch Lectures</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground flex-wrap">

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>450+ Problems</span>
            </div>

            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-yellow-400" />
              <span>500+ Aptitude Questions</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span>10k+ Students</span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-medium" />
              <span>Weekly Contests</span>
            </div>
          </div>

          {/* 🔥 Company Logos Section */}
          <div className="pt-10">

            <p className="text-sm text-muted-foreground mb-4">
              Trusted by students preparing for
            </p>

            <div className="flex items-center justify-center gap-10 flex-wrap">

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                alt="Google"
                className="h-8 object-contain opacity-80 hover:opacity-100 hover:scale-110 transition duration-300"
              />

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                className="h-8 object-contain opacity-80 hover:opacity-100 hover:scale-110 transition duration-300"
              />

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft"
                className="h-8 object-contain opacity-80 hover:opacity-100 hover:scale-110 transition duration-300"
              />

             

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;