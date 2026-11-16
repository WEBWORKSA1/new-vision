# -*- coding: utf-8 -*-
"""Daily auto-refresh (run by .github/workflows/daily-refresh.yml).
Rotates the daily prompt, affirmation, featured guide and video into data/daily.json and refreshes sitemap lastmod."""
import json, datetime, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
today = datetime.date.today()
n = today.toordinal()
PROMPTS = ["Describe one ordinary Tuesday in your ideal life a year from now. What are you doing at 10am?","What would you attempt this year if you knew you could not fail?","Which single habit, done daily, would make every other goal easier?","Name three people you want to spend more time with next year — and why.","What do you want to stop doing, so you have room for what you want to start?","Picture yourself on December 31st, proud. What did you finish?","Which area of your life gets the least attention right now? Give it one small action today.","What would your future self thank you for doing this week?","Write the headline you'd love to read about yourself 12 months from now.","What skill, learned this year, would change your income or your options?","Where do you want to wake up on your next birthday?","What does 'enough' look like for you — in money, work and time?","Which fear is quietly making your decisions for you?","What is one promise you can keep to yourself every day for 30 days?","Describe the home you want to come back to every evening.","Who do you need to become to reach your biggest goal?","What would you do with one extra free hour every day?","List five small wins from the past month. What pattern do they share?","Which goal are you holding only because someone else expects it?","What does a healthy, energetic version of you do before breakfast?","If your year had a one-word theme, what would it be?","What is one conversation you've been avoiding that would change everything?","Which tile on your vision board needs a next action today?","What would make today a 10/10 — and what is the first step?","What did you learn this week that you want to remember in a year?"]
AFFS = ["I build my future with small actions I take today.","I am allowed to want more and to work calmly toward it.","My focus is a choice, and today I choose what matters.","I keep promises to myself, one day at a time.","Progress, not perfection, is my standard.","I am becoming the person my goals require.","My life is getting clearer every time I act.","I welcome new opportunities and I am ready for them.","I can feel uncertain and still take the next step.","I protect my time like it is valuable — because it is."]
arts = json.load(open(os.path.join(ROOT, "data/articles.json")))
vids = json.load(open(os.path.join(ROOT, "data/videos.json")))
data = {"date": today.isoformat(), "prompt": PROMPTS[n % len(PROMPTS)], "affirmation": AFFS[(n * 3) % len(AFFS)],
        "featured": arts[n % len(arts)], "video": vids[n % len(vids)], "days_to_new_year": (datetime.date(today.year + 1, 1, 1) - today).days}
json.dump(data, open(os.path.join(ROOT, "data/daily.json"), "w"), indent=1, ensure_ascii=False)
sm = os.path.join(ROOT, "sitemap.xml")
s = open(sm).read()
s = re.sub(r"<lastmod>[^<]+</lastmod>", f"<lastmod>{today.isoformat()}</lastmod>", s, count=1)  # homepage changes daily
open(sm, "w").write(s)
print("refreshed", data["date"])
