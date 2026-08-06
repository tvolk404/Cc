# Brand Appart — website clone

A responsive, animation-driven recreation of the [Brand Appart](https://www.brandappart.com/)
studio site — *"design studio for bold startups."* Built with plain HTML, CSS and
vanilla JavaScript (no build step, no dependencies).

## Features

- **Preloader** with animated word reveal + progress counter
- **Custom cursor** with a lagging follower and hover/"View" states
- **Magnetic buttons** that pull toward the pointer
- **Scroll-reveal** headings (line masks) and elements via `IntersectionObserver`
- **Word-by-word highlight** on the big statement + testimonial as you scroll
- **Infinite marquee** of client categories
- **Count-up statistics**
- **Sticky header** that hides on scroll-down and turns solid on scroll
- **Scroll progress** bar
- **Animated portfolio grid** with gradient artwork and hover zoom
- **Full mobile menu** with clip-path reveal
- **Fully responsive** (desktop → tablet → phone) and `prefers-reduced-motion` aware

## Run

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html      # markup / sections
css/style.css   # all styling, effects, responsive rules
js/main.js      # cursor, reveals, marquee, counters, menu
```

> This is an independent tribute/recreation for demonstration. All brand
> names and copy are placeholders.
