"use client";

import { useEveAgent } from "eve/react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CarFront,
  Check,
  Compass,
  LoaderCircle,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { AgentMessage } from "./agent-message";

type SavedResearch = { id: string; title: string; text: string; date: string };
const STORAGE_KEY = "carscout-research-v1";

export function CarWorkspace({
  sessionId,
}: {
  readonly sessionId?: string;
  readonly sessionless?: boolean;
}) {
  const [tab, setTab] = useState<"discover" | "saved">("discover");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("30000");
  const [radius, setRadius] = useState("50");
  const [body, setBody] = useState("Any body style");
  const [preferences, setPreferences] = useState("");
  const [followup, setFollowup] = useState("");
  const [saved, setSaved] = useState<SavedResearch[]>([]);
  const [notice, setNotice] = useState("");
  const [localError, setLocalError] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const agent = useEveAgent({
    initialSession: sessionId ? { sessionId, streamIndex: 0 } : undefined,
    resume: Boolean(sessionId),
    onSessionChange(session) {
      if (!sessionId && session)
        History.prototype.replaceState.call(
          window.history,
          window.history.state,
          "",
          `/s/${encodeURIComponent(session.sessionId)}`,
        );
    },
  });
  const busy = agent.status === "submitted" || agent.status === "streaming";
  const disabled = busy || agent.status === "resuming";
  const reports = agent.data.messages.filter(
    (message) => message.role === "assistant",
  );
  const latestReport = reports.at(-1);
  const latestText =
    latestReport?.parts
      .flatMap((part) => (part.type === "text" ? [part.text] : []))
      .join("\n") ?? "";
  const hasMessages = agent.data.messages.length > 0;
  const lastUser = [...agent.data.messages]
    .reverse()
    .find((message) => message.role === "user");
  const researchTitle =
    lastUser?.parts
      .flatMap((part) => (part.type === "text" ? [part.text] : []))
      .join(" ") ?? "Car research";
  const alreadySaved = Boolean(
    latestReport && saved.some((item) => item.id === latestReport.id),
  );
  const turnFailure = (() => {
    for (let i = agent.events.length - 1; i >= 0; i--) {
      const event = agent.events[i];
      if (event.type === "turn.failed") return event.data.message;
      if (
        ["turn.completed", "turn.cancelled", "message.received"].includes(
          event.type,
        )
      )
        break;
    }
    return undefined;
  })();
  const error = localError || agent.error?.message || (!busy && turnFailure);

  useEffect(() => {
    try {
      const data: unknown = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      );
      if (Array.isArray(data))
        setSaved(
          data.filter((item): item is SavedResearch =>
            Boolean(
              item &&
                typeof item.id === "string" &&
                typeof item.title === "string" &&
                typeof item.text === "string" &&
                typeof item.date === "string",
            ),
          ),
        );
    } catch {
      setNotice("Saved research is unavailable in this browser.");
    }
    setStorageReady(true);
  }, []);

  function persist(items: SavedResearch[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setSaved(items);
    } catch {
      setNotice(
        "Could not save research. Browser storage may be full or disabled.",
      );
    }
  }

  async function send(text: string) {
    setLocalError("");
    setTab("discover");
    try {
      await agent.send(text);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "Could not start research. Please try again.",
      );
    }
  }

  return (
    <div className="sc-app">
      <aside className="sc-sidebar">
        <a href="/" className="sc-brand">
          <span className="sc-logo">
            <CarFront size={22} />
          </span>
          CarScout<span className="sc-brand-ai">AI</span>
        </a>
        <p className="sc-nav-label">YOUR WORKSPACE</p>
        <nav aria-label="Main navigation">
          <button
            className={tab === "discover" ? "sc-nav active" : "sc-nav"}
            onClick={() => setTab("discover")}
          >
            <Compass size={18} /> Discover cars <span>↗</span>
          </button>
          <button
            className={tab === "saved" ? "sc-nav active" : "sc-nav"}
            onClick={() => setTab("saved")}
          >
            <Bookmark size={18} /> Saved research <span>{saved.length}</span>
          </button>
        </nav>
        <div className="sc-sidebar-note">
          <ShieldCheck size={23} />
          <strong>On your side. Always.</strong>
          <p>Independent research. Clear sources. No invented listings.</p>
        </div>
        <div className="sc-sidebar-bottom">
          <span className="sc-online" /> Powered by your research agent
        </div>
      </aside>

      <main className="sc-main">
        <header className="sc-topbar">
          <span>
            Workspace <span className="sc-slash">/</span>{" "}
            <strong>
              {tab === "discover" ? "Discover" : "Saved research"}
            </strong>
          </span>
          <a className="sc-new" href="/s">
            <Plus size={16} /> New search
          </a>
        </header>
        <div className="sc-page">
          <div className="sc-page-heading">
            <div>
              <div className="sc-eyebrow">
                <span /> LESS GUESSWORK. BETTER DRIVES.
              </div>
              <h1>
                {tab === "discover"
                  ? "Find your next right car."
                  : "Your research, kept close."}
              </h1>
              <p>
                {tab === "discover"
                  ? "Tell us what matters. We’ll do the research, so you can enjoy the drive."
                  : "Research reports saved on this browser. Prices and availability may change."}
              </p>
            </div>
            <span className="sc-pill">
              <Sparkles size={14} /> AI-powered research
            </span>
          </div>
          {notice && (
            <div className="sc-notice" role="status">
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {tab === "saved" ? (
            <section className="sc-saved-grid" aria-label="Saved research">
              {!saved.length && (
                <div className="sc-empty">
                  <Bookmark size={32} />
                  <h2>A little room for your favorites.</h2>
                  <p>
                    Run a search and save a research report to revisit it here.
                  </p>
                  <button
                    className="sc-primary"
                    onClick={() => setTab("discover")}
                  >
                    Discover cars <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {saved.map((item) => (
                <article className="sc-panel sc-saved-card" key={item.id}>
                  <div className="sc-section-title">
                    <span>
                      <Bookmark size={16} /> RESEARCH REPORT
                    </span>
                    <button
                      className="sc-icon-button"
                      aria-label="Remove saved report"
                      onClick={() =>
                        persist(saved.filter((entry) => entry.id !== item.id))
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <h2>{item.title}</h2>
                  <small>
                    Saved {new Date(item.date).toLocaleDateString()}
                  </small>
                  <div className="sc-saved-text">{item.text}</div>
                </article>
              ))}
            </section>
          ) : (
            <div className="sc-workspace-grid">
              <aside className="sc-filter-column">
                <form
                  className="sc-panel sc-filters"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!location.trim()) {
                      setLocalError("Enter a city or ZIP code to start your search.");
                      return;
                    }
                    if (!disabled)
                      void send(
                        `Find used cars near ${location.trim()}, within ${radius} miles, with asking price at most $${budget} USD. Body style: ${body}. Additional requirements: ${preferences.trim() || "none; prioritize value and reliability"}. Return sourced candidates and explicitly identify unknown details. Budget is asking price, excluding taxes and fees.`,
                      );
                  }}
                >
                  <div className="sc-section-title">
                    <span>
                      <SlidersHorizontal size={17} /> YOUR SEARCH
                    </span>
                    <span className="sc-small-tag">Used cars</span>
                  </div>
                  <label className="sc-field">
                    Location
                    <div className="sc-input-icon">
                      <MapPin size={16} />
                      <input
                        required
                        maxLength={120}
                        placeholder="City or ZIP code"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        disabled={disabled}
                      />
                    </div>
                  </label>
                  <label className="sc-field">
                    Maximum budget <span>USD · before taxes & fees</span>
                    <div className="sc-input-icon">
                      <span>$</span>
                      <input
                        required
                        type="number"
                        min="1000"
                        max="10000000"
                        step="500"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        disabled={disabled}
                      />
                    </div>
                  </label>
                  <label className="sc-field">
                    Search radius
                    <select
                      value={radius}
                      onChange={(event) => setRadius(event.target.value)}
                      disabled={disabled}
                    >
                      {[25, 50, 100, 200, 500].map((value) => (
                        <option key={value} value={value}>
                          Within {value} miles
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="sc-field">
                    Body style
                    <select
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      disabled={disabled}
                    >
                      {[
                        "Any body style",
                        "Sedan",
                        "SUV",
                        "Hatchback",
                        "Truck",
                        "Coupe",
                        "Wagon",
                        "Minivan",
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                  <label className="sc-field">
                    What matters to you?
                    <textarea
                      value={preferences}
                      onChange={(event) => setPreferences(event.target.value)}
                      maxLength={2000}
                      rows={3}
                      placeholder="e.g. Toyota or Honda, hybrid, under 60k miles…"
                      disabled={disabled}
                    />
                  </label>
                  <button
                    className="sc-primary"
                    disabled={disabled}
                    type="submit"
                  >
                    {busy ? (
                      <LoaderCircle size={17} className="sc-spin" />
                    ) : (
                      <Search size={17} />
                    )}
                    {busy ? "Researching…" : "Find my next car"}
                    <ArrowRight size={16} />
                  </button>
                  <p className="sc-form-footnote">
                    Live research, not a dealership sales pitch.
                  </p>
                </form>
                <div className="sc-tip">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>A smarter shortlist.</strong>
                    <p>
                      We separate source-reported facts from estimates, and flag
                      what still needs checking.
                    </p>
                  </div>
                </div>
              </aside>

              <div className="sc-results-column">
                {!hasMessages ? (
                  <>
                    <section className="sc-hero">
                      <div className="sc-hero-copy">
                        <span className="sc-hero-kicker">
                          THE ROAD TO A BETTER BUY
                        </span>
                        <h2>
                          Your next chapter.
                          <br />
                          The right set of keys.
                        </h2>
                        <p>
                          Real listings. Thoughtful comparisons.
                          <br />A research partner that puts you first.
                        </p>
                        <div className="sc-hero-chips">
                          <span>
                            <Check size={13} /> Source-backed
                          </span>
                          <span>
                            <Check size={13} /> Built around you
                          </span>
                        </div>
                      </div>
                      <div className="sc-car-art" aria-hidden="true">
                        <div className="sc-art-sun" />
                        <CarFront strokeWidth={0.8} />
                        <span className="sc-road" />
                      </div>
                    </section>
                    <div className="sc-results-heading">
                      <div>
                        <h2>Start with what matters</h2>
                        <p>A few details are all it takes to get moving.</p>
                      </div>
                      <span className="sc-muted">01 — 03</span>
                    </div>
                    <div className="sc-feature-grid">
                      {[
                        {
                          icon: Search,
                          title: "Discover real options",
                          text: "Search marketplaces and dealer inventory around your location.",
                        },
                        {
                          icon: SlidersHorizontal,
                          title: "See the trade-offs",
                          text: "Compare price, mileage, and fit. Understand what’s still unknown.",
                        },
                        {
                          icon: Bookmark,
                          title: "Keep your research",
                          text: "Save useful reports in this browser for your next dealership visit.",
                        },
                      ].map(({ icon: Icon, title, text }, index) => (
                        <article className="sc-panel sc-feature" key={title}>
                          <span className="sc-feature-number">
                            0{index + 1}
                          </span>
                          <Icon size={22} />
                          <h3>{title}</h3>
                          <p>{text}</p>
                        </article>
                      ))}
                    </div>
                    <div className="sc-source-strip">
                      <span>RESEARCH ACROSS</span>
                      <strong>CARFAX</strong>
                      <strong>cars.com</strong>
                      <strong>CarGurus</strong>
                      <span>& local dealers</span>
                    </div>
                    <p className="sc-source-disclaimer">
                      Sources depend on access and availability. No marketplace
                      affiliation or guaranteed inventory.
                    </p>
                  </>
                ) : (
                  <section
                    className="sc-panel sc-research"
                    aria-label="Research results"
                    aria-busy={busy}
                  >
                    <div className="sc-research-header">
                      <div>
                        <div className="sc-eyebrow">YOUR BUYER’S BRIEF</div>
                        <h2>Research & recommendations</h2>
                      </div>
                      <button
                        className="sc-save"
                        disabled={
                          disabled ||
                          !latestText ||
                          alreadySaved ||
                          !storageReady
                        }
                        onClick={() => {
                          if (latestReport) {
                            persist([
                              {
                                id: latestReport.id,
                                title: researchTitle.slice(0, 180),
                                text: latestText,
                                date: new Date().toISOString(),
                              },
                              ...saved,
                            ]);
                          }
                        }}
                      >
                        {alreadySaved ? (
                          <Check size={16} />
                        ) : (
                          <Bookmark size={16} />
                        )}
                        {alreadySaved ? "Saved" : "Save report"}
                      </button>
                    </div>
                    <div className="sc-research-messages">
                      {agent.data.messages.map((message, index) => (
                        <div
                          className={
                            message.role === "user" ? "sc-request" : "sc-answer"
                          }
                          key={message.id}
                        >
                          <div className="sc-message-label">
                            {message.role === "user"
                              ? "YOUR REQUEST"
                              : "CARSCOUT RESEARCH"}
                          </div>
                          <AgentMessage
                            message={message}
                            isStreaming={
                              busy && index === agent.data.messages.length - 1
                            }
                            canRespond={!disabled}
                            onInputResponses={(responses) =>
                              agent.respond(responses)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {busy && (
                      <div className="sc-progress" role="status">
                        <LoaderCircle size={16} className="sc-spin" /> Research
                        in progress. Results will appear as they arrive.
                        <button
                          onClick={() => {
                            void agent
                              .cancel()
                              .catch(() =>
                                setLocalError(
                                  "Could not stop research. Please try again.",
                                ),
                              );
                          }}
                        >
                          Stop
                        </button>
                      </div>
                    )}
                    <form
                      className="sc-followup"
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (followup.trim() && !disabled) {
                          void send(followup.trim());
                          setFollowup("");
                        }
                      }}
                    >
                      <label className="sr-only" htmlFor="followup">
                        Refine your research
                      </label>
                      <input
                        id="followup"
                        placeholder="Compare options, refine your search, or paste a listing URL…"
                        value={followup}
                        onChange={(event) => setFollowup(event.target.value)}
                        disabled={disabled}
                        required
                        maxLength={4000}
                      />
                      <button
                        aria-label="Send follow-up"
                        disabled={disabled || !followup.trim()}
                      >
                        <ArrowRight size={19} />
                      </button>
                    </form>
                  </section>
                )}
                {error && (
                  <div className="sc-error" role="alert">
                    <strong>Research couldn’t finish.</strong>
                    <p>{error}</p>
                    <span>
                      Retry your search or start a new one. Partial results
                      above may be incomplete.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          <footer className="sc-footer">
            <span>
              CarScout AI <span>·</span> Find clarity before the test drive.
            </span>
            <span>
              Always confirm availability and arrange an independent inspection.
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
