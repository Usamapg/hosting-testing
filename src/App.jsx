import { useState, useEffect } from "react";
import { teams, matches, topPlayers, topBowlers } from "./data";
import "./App.css";

function Navbar({ activeTab, setActiveTab }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = ["Home", "Matches", "Standings", "Players", "Teams"];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">🏏</span>
        <span className="nav-title">Cricket<span className="accent">League</span></span>
      </div>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              className={`nav-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => { setActiveTab(tab); setMenuOpen(false); }}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>
    </nav>
  );
}

function LiveBadge() {
  const [dot, setDot] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => !d), 700);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="live-badge">
      <span className={`live-dot ${dot ? "on" : ""}`}></span> LIVE
    </span>
  );
}

function MatchCard({ match }) {
  return (
    <div className={`match-card ${match.status}`}>
      <div className="match-meta">
        <span className="match-date">📅 {match.date} • {match.time}</span>
        {match.status === "live" && <LiveBadge />}
        {match.status === "completed" && <span className="completed-badge">✅ Completed</span>}
        {match.status === "upcoming" && <span className="upcoming-badge">🕐 Upcoming</span>}
      </div>
      <div className="match-teams">
        <div className="match-team">
          <div className="team-pill" style={{ backgroundColor: match.team1Color }}>
            {match.team1Short}
          </div>
          <span className="team-name">{match.team1}</span>
          {match.team1Score && <span className="score">{match.team1Score}</span>}
        </div>
        <div className="vs-divider">
          <span>VS</span>
        </div>
        <div className="match-team right">
          <div className="team-pill" style={{ backgroundColor: match.team2Color }}>
            {match.team2Short}
          </div>
          <span className="team-name">{match.team2}</span>
          {match.team2Score && <span className="score">{match.team2Score}</span>}
        </div>
      </div>
      {match.winner && (
        <div className="match-result">🏆 {match.winner} won the match</div>
      )}
      {match.status === "live" && (
        <div className="match-result live-text">⚡ Match in progress — {match.team1} batting</div>
      )}
      <div className="match-venue">📍 {match.venue}</div>
    </div>
  );
}

function HomeTab() {
  const liveMatch = matches.find((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "upcoming").slice(0, 2);

  return (
    <div className="tab-content">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-sub">Season 2026 — Now Live</p>
          <h1 className="hero-title">Cricket<br /><span className="accent">Premier League</span></h1>
          <p className="hero-desc">The biggest T20 tournament in the country. 8 teams. 45 matches. One champion.</p>
          <div className="hero-stats">
            <div className="hstat"><span className="hstat-num">8</span><span className="hstat-label">Teams</span></div>
            <div className="hstat"><span className="hstat-num">45</span><span className="hstat-label">Matches</span></div>
            <div className="hstat"><span className="hstat-num">128</span><span className="hstat-label">Players</span></div>
          </div>
        </div>
        <div className="hero-ball">🏏</div>
      </section>

      {liveMatch && (
        <section className="section">
          <h2 className="section-title"><LiveBadge /> Live Match</h2>
          <MatchCard match={liveMatch} />
        </section>
      )}

      <section className="section">
        <h2 className="section-title">⏳ Upcoming Matches</h2>
        <div className="cards-grid">
          {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🏆 Top 3 Teams</h2>
        <div className="top-teams">
          {teams.slice(0, 3).map((team, i) => (
            <div key={team.id} className="top-team-card" style={{ borderColor: team.color }}>
              <div className="top-team-rank" style={{ backgroundColor: team.color }}>#{i + 1}</div>
              <div className="top-team-logo">{team.logo}</div>
              <div className="top-team-name">{team.name}</div>
              <div className="top-team-pts">{team.points} pts</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MatchesTab() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? matches : matches.filter((m) => m.status === filter);

  return (
    <div className="tab-content">
      <h2 className="page-title">📅 Match Schedule</h2>
      <div className="filter-bar">
        {["all", "live", "upcoming", "completed"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "live" ? "🔴 Live" : f === "upcoming" ? "🕐 Upcoming" : "✅ Completed"}
          </button>
        ))}
      </div>
      <div className="matches-list">
        {filtered.map((m) => <MatchCard key={m.id} match={m} />)}
      </div>
    </div>
  );
}

function StandingsTab() {
  return (
    <div className="tab-content">
      <h2 className="page-title">🏆 Points Table</h2>
      <div className="table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>L</th>
              <th>Pts</th>
              <th>NRR</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr key={team.id} className={i < 4 ? "qualifier" : ""}>
                <td>
                  <span className="rank-num" style={{ backgroundColor: i < 4 ? team.color : "#444" }}>
                    {i + 1}
                  </span>
                </td>
                <td>
                  <div className="table-team">
                    <span className="table-logo">{team.logo}</span>
                    <div>
                      <div className="table-team-name">{team.name}</div>
                      <div className="table-team-short">{team.short}</div>
                    </div>
                  </div>
                </td>
                <td>{team.wins + team.losses}</td>
                <td className="win-cell">{team.wins}</td>
                <td className="loss-cell">{team.losses}</td>
                <td><strong>{team.points}</strong></td>
                <td className={parseFloat(team.nrr) > 0 ? "positive-nrr" : "negative-nrr"}>{team.nrr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="qualifier-note">🟢 Top 4 teams qualify for playoffs</p>
    </div>
  );
}

function PlayersTab() {
  const [tab, setTab] = useState("batting");

  return (
    <div className="tab-content">
      <h2 className="page-title">⭐ Player Stats</h2>
      <div className="filter-bar">
        <button className={`filter-btn ${tab === "batting" ? "active" : ""}`} onClick={() => setTab("batting")}>🏏 Batting</button>
        <button className={`filter-btn ${tab === "bowling" ? "active" : ""}`} onClick={() => setTab("bowling")}>🎯 Bowling</button>
      </div>

      {tab === "batting" && (
        <div className="table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Team</th>
                <th>Runs</th>
                <th>Avg</th>
                <th>SR</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((p) => (
                <tr key={p.rank}>
                  <td><span className="rank-num" style={{ backgroundColor: p.color }}>{p.rank}</span></td>
                  <td><strong>{p.name}</strong><br /><small className="role-tag">{p.role}</small></td>
                  <td><span className="team-tag" style={{ backgroundColor: p.color }}>{p.team}</span></td>
                  <td><strong style={{ color: "#FFD700" }}>{p.runs}</strong></td>
                  <td>{p.avg}</td>
                  <td>{p.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "bowling" && (
        <div className="table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Team</th>
                <th>Wkts</th>
                <th>Econ</th>
                <th>Avg</th>
              </tr>
            </thead>
            <tbody>
              {topBowlers.map((p) => (
                <tr key={p.rank}>
                  <td><span className="rank-num" style={{ backgroundColor: p.color }}>{p.rank}</span></td>
                  <td><strong>{p.name}</strong><br /><small className="role-tag">{p.role}</small></td>
                  <td><span className="team-tag" style={{ backgroundColor: p.color }}>{p.team}</span></td>
                  <td><strong style={{ color: "#FFD700" }}>{p.wickets}</strong></td>
                  <td>{p.economy}</td>
                  <td>{p.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TeamsTab() {
  const [selected, setSelected] = useState(null);
  const team = selected !== null ? teams[selected] : null;

  return (
    <div className="tab-content">
      <h2 className="page-title">🦁 All Teams</h2>
      <div className="teams-grid">
        {teams.map((t, i) => (
          <div
            key={t.id}
            className={`team-card ${selected === i ? "selected" : ""}`}
            style={{ borderColor: t.color }}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <div className="team-card-logo">{t.logo}</div>
            <div className="team-card-name">{t.name}</div>
            <div className="team-card-short" style={{ color: t.color }}>{t.short}</div>
            <div className="team-card-pts">
              <span className="pts-badge" style={{ backgroundColor: t.color }}>{t.points} pts</span>
            </div>
          </div>
        ))}
      </div>

      {team && (
        <div className="team-detail" style={{ borderColor: team.color }}>
          <div className="team-detail-header" style={{ backgroundColor: team.color }}>
            <span className="team-detail-logo">{team.logo}</span>
            <div>
              <h3>{team.name}</h3>
              <p>{team.short}</p>
            </div>
          </div>
          <div className="team-detail-stats">
            <div className="dstat"><div className="dstat-val">{team.wins + team.losses}</div><div className="dstat-label">Matches</div></div>
            <div className="dstat"><div className="dstat-val" style={{ color: "#4CAF50" }}>{team.wins}</div><div className="dstat-label">Wins</div></div>
            <div className="dstat"><div className="dstat-val" style={{ color: "#e63946" }}>{team.losses}</div><div className="dstat-label">Losses</div></div>
            <div className="dstat"><div className="dstat-val" style={{ color: "#FFD700" }}>{team.points}</div><div className="dstat-label">Points</div></div>
            <div className="dstat">
              <div className={`dstat-val ${parseFloat(team.nrr) > 0 ? "positive-nrr" : "negative-nrr"}`}>{team.nrr}</div>
              <div className="dstat-label">NRR</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const renderTab = () => {
    switch (activeTab) {
      case "Home": return <HomeTab />;
      case "Matches": return <MatchesTab />;
      case "Standings": return <StandingsTab />;
      case "Players": return <PlayersTab />;
      case "Teams": return <TeamsTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main">{renderTab()}</main>
      <footer className="footer">
        <p>🏏 Cricket Premier League 2026 — All rights reserved</p>
      </footer>
    </div>
  );
}
