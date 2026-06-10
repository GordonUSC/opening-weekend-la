/* Opening Weekend live companion · knows where you should be right now.
   All times are fixed-offset PT (-07:00) so it reads correctly on any phone. */
(function () {
  "use strict";

  var KICKOFF_USA = new Date("2026-06-12T18:00:00-07:00");

  var EVENTS = [
    { t: "2026-06-11T09:00:00-07:00", now: "Early entry · US Soccer House, Venice", d: "Opening Ceremonies at 9. Claim the spot by the main screen.", href: "thursday.html" },
    { t: "2026-06-11T10:30:00-07:00", now: "Boardwalk + coffee", d: "Intelligentsia, Eggslut, or Menotti's. Doors already yours.", href: "thursday.html" },
    { t: "2026-06-11T12:00:00-07:00", now: "LIVE · Mexico v South Africa", d: "The opener at the Azteca. Scout Giménez and Álvarez.", href: "thursday.html", live: true },
    { t: "2026-06-11T14:00:00-07:00", now: "Final whistle · Venice afternoon", d: "Boardwalk, Venice sign photo, send Caryn a picture.", href: "thursday.html" },
    { t: "2026-06-11T19:00:00-07:00", now: "AO Night Before Party + Son Heung-Min", d: "The Meeting Spot, Inglewood. South Korea v Czechia on the screens.", href: "thursday.html", live: true },
    { t: "2026-06-11T23:00:00-07:00", now: "Sleep. Tomorrow is SoFi.", d: "Friday is the USA opener and Quinn's seat is waiting.", href: "friday.html" },

    { t: "2026-06-12T09:00:00-07:00", now: "Easy morning", d: "Big day. Canada v Bosnia at noon is the warm-up act.", href: "friday.html" },
    { t: "2026-06-12T12:00:00-07:00", now: "LIVE · Canada v Bosnia", d: "Nine MLS players in red. The league's team, on your TV.", href: "mls.html", live: true },
    { t: "2026-06-12T12:30:00-07:00", now: "Send Quinn off → AO Pre-game Party", d: "1231 District Dr, Inglewood. Tacos, churros, every Outlaw he knows.", href: "friday.html" },
    { t: "2026-06-12T16:00:00-07:00", now: "QUINN: LEAVE THE PARTY NOW", d: "Seat by 5:00 or the board says your name to an empty chair.", href: "friday.html", urgent: true },
    { t: "2026-06-12T17:00:00-07:00", now: "QUINN: IN YOUR SEAT · PHONE OUT", d: "The shoutout runs once in the pre-match show. No replay.", href: "friday.html", urgent: true },
    { t: "2026-06-12T17:30:00-07:00", now: "Pre-match ceremony", d: "Anthems, the show, and somewhere in it: QUINN HOVEY.", href: "friday.html", urgent: true },
    { t: "2026-06-12T18:00:00-07:00", now: "LIVE · USA v PARAGUAY", d: "Quinn at SoFi. Gordon at Gym Bar. One match, two cathedrals.", href: "friday.html", live: true },
    { t: "2026-06-12T20:00:00-07:00", now: "Final whistle · stay 20 minutes", d: "Let the crowd thin, then Lyft to Gordon's. Or dance: Trinix, Abbey, Sound.", href: "friday.html" },

    { t: "2026-06-13T08:00:00-07:00", now: "Text Mason the birthday meme", d: "First thing. The early text and the toast are two different gifts.", href: "saturday.html" },
    { t: "2026-06-13T10:30:00-07:00", now: "Drag brunch · Hamburger Mary's WeHo", d: "8288 Santa Monica Blvd. Leg glass in Mason's hand early.", href: "saturday.html" },
    { t: "2026-06-13T15:00:00-07:00", now: "LIVE · Brazil v Morocco", d: "Coliseum big screen or Gym Bar. Vinícius Jr time.", href: "saturday.html", live: true },
    { t: "2026-06-13T18:00:00-07:00", now: "LIVE · Haiti v Scotland", d: "Haiti's first World Cup in 52 years. The romance slot.", href: "mls.html", live: true },
    { t: "2026-06-13T20:30:00-07:00", now: "Capital Cities closes the Fan Fest", d: "Safe and Sound at sunset, then the scouting nightcap at 9.", href: "saturday.html" },
    { t: "2026-06-13T21:00:00-07:00", now: "LIVE · Australia v Türkiye", d: "Both face the USA this group. Take notes for June 19 and 25.", href: "saturday.html", live: true },

    { t: "2026-06-14T09:00:00-07:00", now: "Pride day · pick your order", d: "Pop-up doors 10, parade steps off 11. Germany v Curaçao is coffee TV.", href: "sunday.html" },
    { t: "2026-06-14T10:00:00-07:00", now: "FIFA game pop-up · 6021 Hollywood Blvd", d: "First-play access before the parade peaks. Try the USMNT roster.", href: "sunday.html" },
    { t: "2026-06-14T11:00:00-07:00", now: "LA Pride parade steps off", d: "Hollywood Blvd, Highland to Cahuenga. The city throws the afterparty.", href: "sunday.html" },
    { t: "2026-06-14T13:00:00-07:00", now: "Netherlands v Japan · backdrop", d: "Fan Fest or wherever the afternoon takes you.", href: "sunday.html" },
    { t: "2026-06-14T16:00:00-07:00", now: "Gym Bar wind-down", d: "Ivory Coast v Ecuador. Last pours of the weekend.", href: "watch.html" },
    { t: "2026-06-14T19:00:00-07:00", now: "Sweden v Tunisia + the send-off", d: "Couch match. Long hug. Caryn's thank-you note before he drives.", href: "sunday.html", live: true },
    { t: "2026-06-14T21:30:00-07:00", now: "That was the weekend.", d: "Four days, twelve matches, one name on the SoFi board.", href: "play.html" }
  ];

  function fmtCountdown(ms) {
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    if (d > 0) return d + "d " + h + "h " + m + "m";
    if (h > 0) return h + "h " + m + "m";
    return m + "m";
  }

  function state(nowDate) {
    var first = new Date(EVENTS[0].t);
    var last = new Date(EVENTS[EVENTS.length - 1].t);
    if (nowDate < first) {
      return {
        cls: "",
        label: "Countdown",
        title: "Opening Ceremonies in " + fmtCountdown(first - nowDate),
        d: "Thursday 9 AM · US Soccer House, Venice. USA v Paraguay in " + fmtCountdown(KICKOFF_USA - nowDate) + ".",
        href: "thursday.html"
      };
    }
    if (nowDate >= new Date(last.getTime() + 2 * 3600e3)) {
      return {
        cls: "",
        label: "Keepsake",
        title: "That was opening weekend.",
        d: "Made for Gordon + Quinn. The badges are on the Play page.",
        href: "play.html"
      };
    }
    var cur = EVENTS[0], next = null;
    for (var i = 0; i < EVENTS.length; i++) {
      if (new Date(EVENTS[i].t) <= nowDate) cur = EVENTS[i];
      else { next = EVENTS[i]; break; }
    }
    var out = {
      cls: cur.urgent ? "urgent" : (cur.live ? "live" : ""),
      label: cur.urgent ? "Right now · go" : (cur.live ? "On now" : "Now"),
      title: cur.now,
      d: cur.d,
      href: cur.href
    };
    if (next) {
      var nd = new Date(next.t);
      out.d += " Next: " + next.now + " in " + fmtCountdown(nd - nowDate) + ".";
    }
    if (nowDate < KICKOFF_USA && !cur.urgent) {
      out.d += " USA kickoff in " + fmtCountdown(KICKOFF_USA - nowDate) + ".";
    }
    return out;
  }

  function render() {
    var s = state(new Date());
    var bar = document.getElementById("companion-bar");
    if (!bar) {
      bar = document.createElement("a");
      bar.id = "companion-bar";
      bar.className = "companion";
      document.body.appendChild(bar);
    }
    bar.href = s.href;
    bar.className = "companion" + (s.cls ? " " + s.cls : "");
    bar.innerHTML =
      '<span class="c-dot"></span>' +
      '<span class="c-text"><span class="c-label">' + s.label + "</span>" +
      '<span class="c-title">' + s.title + "</span>" +
      '<span class="c-detail">' + s.d + "</span></span>" +
      '<span class="c-go">→</span>';
  }

  render();
  setInterval(render, 30000);

  /* Reveal-on-scroll: motion with intent, skipped for reduced-motion users */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".fact-card, .itinerary > div, .day-card, .callout, .match-card");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
