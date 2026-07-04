/* @ds-bundle: {"format":4,"namespace":"DevVachhaniDesignSystem_a1e1ac","components":[{"name":"ArticleCard","sourcePath":"components/cards/ArticleCard.jsx"},{"name":"ProjectCard","sourcePath":"components/cards/ProjectCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"TextLink","sourcePath":"components/core/TextLink.jsx"},{"name":"Reveal","sourcePath":"components/motion/Reveal.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteNav","sourcePath":"components/navigation/SiteNav.jsx"}],"sourceHashes":{"components/cards/ArticleCard.jsx":"9c8b6f738a5f","components/cards/ProjectCard.jsx":"654aa73f2041","components/core/Button.jsx":"751b59dddbbd","components/core/SectionHeading.jsx":"371b36b48883","components/core/Tag.jsx":"b4865a09a880","components/core/TextLink.jsx":"94136300e068","components/motion/Reveal.jsx":"551783759095","components/navigation/SiteFooter.jsx":"29554da54943","components/navigation/SiteNav.jsx":"535832b404f0","ui_kits/portfolio/Article.jsx":"7f3670e8eb08","ui_kits/portfolio/Home.jsx":"1dbb4b2c7ceb","ui_kits/portfolio/Projects.jsx":"13834f572692","ui_kits/portfolio/Writing.jsx":"47ecfc1bdac4","ui_kits/portfolio/data.jsx":"889e326cfb8d","ui_kits/portfolio/gsap-helpers.jsx":"054489651e5e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DevVachhaniDesignSystem_a1e1ac = window.DevVachhaniDesignSystem_a1e1ac || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/ArticleCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ArticleCard — a writing-index row. Bibliographic in feel: mono date + read
 * time on one line, serif headline, optional dek. Designed to stack in a
 * ruled list (top hairline per row). The headline underlines in cobalt on hover.
 */
function ArticleCard({
  title,
  dek,
  date,
  // "May 2025"
  readTime,
  // "8 min"
  category,
  // "Essay"
  href = '#',
  style,
  ...rest
}) {
  const onEnter = e => {
    const t = e.currentTarget.querySelector('[data-title]');
    if (t) {
      t.style.backgroundSize = '100% 1px';
      t.style.color = 'var(--text-accent)';
    }
  };
  const onLeave = e => {
    const t = e.currentTarget.querySelector('[data-title]');
    if (t) {
      t.style.backgroundSize = '0% 1px';
      t.style.color = 'var(--text-strong)';
    }
  };
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr)',
      gap: '12px',
      padding: '28px 0',
      borderTop: '1px solid var(--border-hairline)',
      textDecoration: 'none',
      color: 'var(--text-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '16px',
      alignItems: 'baseline',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, category && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-accent)'
    }
  }, category), date && /*#__PURE__*/React.createElement("span", null, date), readTime && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, readTime, " read")), /*#__PURE__*/React.createElement("h3", {
    "data-title": true,
    style: {
      fontSize: 'var(--t-lg)',
      fontWeight: 'var(--w-regular)',
      lineHeight: 'var(--lh-snug)',
      letterSpacing: 'var(--track-tight)',
      color: 'var(--text-strong)',
      maxWidth: '24ch',
      width: 'fit-content',
      backgroundImage: 'linear-gradient(currentColor, currentColor)',
      backgroundSize: '0% 1px',
      backgroundPosition: '0 100%',
      backgroundRepeat: 'no-repeat',
      transition: 'background-size var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
    }
  }, title), dek && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--t-body)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-normal)',
      maxWidth: '56ch'
    }
  }, dek));
}
Object.assign(__ds_scope, { ArticleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ArticleCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProjectCard — an index row/tile for a project. Archival by default: a
 * hairline-bordered block with a mono index number, serif title, one-line
 * summary, and discipline tags. On hover the whole block lifts and the title
 * shifts to cobalt. Works in a grid or as a full-width list row.
 */
function ProjectCard({
  index,
  // "01"
  title,
  summary,
  tags = [],
  year,
  href = '#',
  layout = 'tile',
  // 'tile' | 'row'
  style,
  ...rest
}) {
  const isRow = layout === 'row';
  const onEnter = e => {
    const c = e.currentTarget;
    c.style.background = 'var(--bg-surface)';
    c.style.borderColor = 'var(--border-strong)';
    const t = c.querySelector('[data-title]');
    if (t) t.style.color = 'var(--text-accent)';
    const a = c.querySelector('[data-arrow]');
    if (a) a.style.transform = 'translate(3px,-3px)';
  };
  const onLeave = e => {
    const c = e.currentTarget;
    c.style.background = 'transparent';
    c.style.borderColor = 'var(--border-hairline)';
    const t = c.querySelector('[data-title]');
    if (t) t.style.color = 'var(--text-strong)';
    const a = c.querySelector('[data-arrow]');
    if (a) a.style.transform = 'translate(0,0)';
  };
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    style: {
      display: isRow ? 'grid' : 'flex',
      gridTemplateColumns: isRow ? '64px 1fr auto' : undefined,
      flexDirection: isRow ? undefined : 'column',
      gap: isRow ? '28px' : '18px',
      alignItems: isRow ? 'start' : 'stretch',
      padding: isRow ? '26px 24px' : '24px',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--r-1)',
      background: 'transparent',
      textDecoration: 'none',
      color: 'var(--text-body)',
      transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-label)',
      color: 'var(--text-accent)'
    }
  }, index), !isRow && year && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-wide)',
      color: 'var(--text-faint)'
    }
  }, year)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    "data-title": true,
    style: {
      fontSize: isRow ? 'var(--t-lg)' : 'var(--t-md)',
      fontWeight: 'var(--w-regular)',
      lineHeight: 'var(--lh-snug)',
      letterSpacing: 'var(--track-tight)',
      color: 'var(--text-strong)',
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, title), summary && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--t-sm)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-normal)',
      maxWidth: '52ch'
    }
  }, summary), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '6px'
    }
  }, tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--r-1)',
      padding: '4px 8px'
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      justifySelf: isRow ? 'end' : undefined
    }
  }, isRow && year && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-meta)',
      color: 'var(--text-faint)'
    }
  }, year), /*#__PURE__*/React.createElement("span", {
    "data-arrow": true,
    "aria-hidden": "true",
    style: {
      fontSize: '1.25rem',
      color: 'var(--text-strong)',
      transition: 'transform var(--dur-base) var(--ease-out)',
      alignSelf: isRow ? 'center' : 'flex-start'
    }
  }, "\u2197")));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the system's action control. Sharp-cornered, hairline or solid ink,
 * with the cobalt accent reserved for the primary intent. Mono label, wide
 * tracking, uppercase — it reads like an index affordance, not a web button.
 */
function Button({
  children,
  variant = 'solid',
  // 'solid' | 'outline' | 'ghost' | 'accent'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  as = 'button',
  href,
  disabled = false,
  iconRight,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 14px',
      fontSize: 'var(--t-micro)'
    },
    md: {
      padding: '12px 20px',
      fontSize: 'var(--t-meta)'
    },
    lg: {
      padding: '16px 28px',
      fontSize: 'var(--t-sm)'
    }
  };
  const variants = {
    solid: {
      background: 'var(--ink-0)',
      color: 'var(--text-invert)',
      border: '1px solid var(--ink-0)'
    },
    accent: {
      background: 'var(--accent)',
      color: '#fff',
      border: '1px solid var(--accent)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid transparent'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--w-medium)',
    letterSpacing: 'var(--track-wide)',
    textTransform: 'uppercase',
    lineHeight: 1,
    borderRadius: 'var(--r-1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const onEnter = e => {
    if (disabled) return;
    if (variant === 'outline' || variant === 'ghost') {
      e.currentTarget.style.background = 'var(--ink-0)';
      e.currentTarget.style.color = 'var(--text-invert)';
    } else if (variant === 'accent') {
      e.currentTarget.style.background = 'var(--accent-press)';
    } else {
      e.currentTarget.style.background = 'var(--ink-1)';
    }
  };
  const onLeave = e => {
    if (disabled) return;
    e.currentTarget.style.background = variants[variant].background;
    e.currentTarget.style.color = variants[variant].color;
  };
  const onDown = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
  };
  const onUp = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(0)';
  };
  const Tag = href ? 'a' : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: href ? undefined : disabled,
    style: base,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
    onMouseUp: onUp
  }, rest), children, iconRight && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: '1.1em',
      lineHeight: 0
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionHeading — the archival section marker. A mono index number + eyebrow
 * sit above a serif title, divided from the content below by a full hairline
 * rule. This is the primary rhythm device across the site.
 */
function SectionHeading({
  index,
  // e.g. "01" — optional index numeral
  eyebrow,
  // mono label, e.g. "SELECTED WORK"
  title,
  align = 'left',
  // 'left' | 'center'
  rule = true,
  // draw the bottom hairline rule
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      textAlign: align,
      alignItems: align === 'center' ? 'center' : 'stretch',
      paddingBottom: rule ? '20px' : 0,
      borderBottom: rule ? '1px solid var(--border-strong)' : 'none',
      ...style
    }
  }, rest), (index || eyebrow) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      gap: '14px',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase'
    }
  }, index && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-accent)',
      fontWeight: 'var(--w-medium)'
    }
  }, index), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, eyebrow)), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--t-xl)',
      fontWeight: 'var(--w-regular)',
      lineHeight: 'var(--lh-snug)',
      letterSpacing: 'var(--track-tight)',
      color: 'var(--text-strong)',
      maxWidth: align === 'center' ? '18ch' : 'none'
    }
  }, title));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — a small mono label. Used for topic/discipline tags, statuses, and
 * index categories. Hairline-bordered by default; `filled` and `accent`
 * for emphasis.
 */
function Tag({
  children,
  variant = 'outline',
  // 'outline' | 'filled' | 'accent'
  style,
  ...rest
}) {
  const variants = {
    outline: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-hairline)'
    },
    filled: {
      background: 'var(--bg-recessed)',
      color: 'var(--text-body)',
      border: '1px solid transparent'
    },
    accent: {
      background: 'var(--accent-wash)',
      color: 'var(--accent-press)',
      border: '1px solid transparent'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      fontWeight: 'var(--w-medium)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      lineHeight: 1,
      padding: '5px 9px',
      borderRadius: 'var(--r-1)',
      whiteSpace: 'nowrap',
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TextLink — an inline reading link. Cobalt by default with an animated
 * underline that draws in on hover. `arrow` variant is the standing "index"
 * link with a trailing mark that slides on hover.
 */
function TextLink({
  children,
  href = '#',
  variant = 'underline',
  // 'underline' | 'arrow' | 'plain'
  tone = 'accent',
  // 'accent' | 'ink'
  style,
  ...rest
}) {
  const color = tone === 'ink' ? 'var(--text-strong)' : 'var(--text-accent)';
  const base = {
    color,
    fontFamily: variant === 'arrow' ? 'var(--font-mono)' : 'inherit',
    fontSize: variant === 'arrow' ? 'var(--t-meta)' : 'inherit',
    letterSpacing: variant === 'arrow' ? 'var(--track-wide)' : 'inherit',
    textTransform: variant === 'arrow' ? 'uppercase' : 'none',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: variant === 'arrow' ? '8px' : 0,
    position: 'relative',
    cursor: 'pointer',
    ...style
  };
  if (variant === 'underline') {
    base.backgroundImage = 'linear-gradient(currentColor, currentColor)';
    base.backgroundSize = '0% 1px';
    base.backgroundPosition = '0 100%';
    base.backgroundRepeat = 'no-repeat';
    base.paddingBottom = '1px';
    base.transition = 'background-size var(--dur-base) var(--ease-out)';
  }
  const onEnter = e => {
    if (variant === 'underline') e.currentTarget.style.backgroundSize = '100% 1px';
    const arrow = e.currentTarget.querySelector('[data-arrow]');
    if (arrow) arrow.style.transform = 'translateX(4px)';
  };
  const onLeave = e => {
    if (variant === 'underline') e.currentTarget.style.backgroundSize = '0% 1px';
    const arrow = e.currentTarget.querySelector('[data-arrow]');
    if (arrow) arrow.style.transform = 'translateX(0)';
  };
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: base,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave
  }, rest), children, variant === 'arrow' && /*#__PURE__*/React.createElement("span", {
    "data-arrow": true,
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  }, "\u2192"));
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/motion/Reveal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Reveal — the system's scroll-entrance primitive. Content starts hidden
 * (opacity 0, nudged down) and rises into place when it scrolls into view.
 *
 * This build uses IntersectionObserver so it is dependency-free and safe in
 * any consumer. In production the identical effect is driven by GSAP
 * ScrollTrigger — the durations/eases here mirror the GSAP tokens
 * (--dur-reveal, --ease-emph / expo.out), so swapping is a drop-in.
 *
 * `stagger` cascades direct children; `as` sets the wrapper element.
 */
function Reveal({
  children,
  as = 'div',
  y = 24,
  // rise distance in px
  delay = 0,
  // seconds
  stagger,
  // seconds between children (enables per-child cascade)
  once = true,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          if (once) io.unobserve(e.target);
        } else if (!once) setShown(false);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  const Tag = as;
  const t = (i = 0) => `opacity var(--dur-reveal) var(--ease-emph) ${delay + i}s, transform var(--dur-reveal) var(--ease-emph) ${delay + i}s`;
  if (stagger != null) {
    const kids = React.Children.toArray(children);
    return /*#__PURE__*/React.createElement(Tag, _extends({
      ref: ref,
      style: style
    }, rest), kids.map((child, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
        transition: t(i * stagger),
        willChange: 'opacity, transform'
      }
    }, child)));
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    style: {
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      transition: t(0),
      willChange: 'opacity, transform',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Reveal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motion/Reveal.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SiteFooter — the closing colophon. A large serif sign-off / contact line,
 * a row of mono index links, and a baseline of metadata (year, location,
 * "built with"). Sits on a full top rule; optionally inverts to ink ground.
 */
function SiteFooter({
  signoff = 'Let\u2019s build something.',
  email = 'hello@devvachhani.com',
  links = [{
    label: 'GitHub',
    href: '#'
  }, {
    label: 'Scholar',
    href: '#'
  }, {
    label: 'LinkedIn',
    href: '#'
  }],
  meta = '\u00A9 2026 Dev Vachhani \u00B7 London',
  invert = false,
  style,
  ...rest
}) {
  const fg = invert ? 'var(--text-invert)' : 'var(--text-strong)';
  const muted = invert ? 'color-mix(in srgb, var(--text-invert) 60%, transparent)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: invert ? 'var(--bg-invert)' : 'transparent',
      color: fg,
      borderTop: invert ? 'none' : '1px solid var(--border-strong)',
      padding: 'var(--s-9) var(--page-margin) var(--s-6)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--t-xxl)',
      fontWeight: 'var(--w-light)',
      letterSpacing: 'var(--track-tight)',
      lineHeight: 'var(--lh-tight)',
      color: fg
    }
  }, signoff), /*#__PURE__*/React.createElement("a", {
    href: `mailto:${email}`,
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--t-md)',
      fontStyle: 'italic',
      color: 'var(--text-accent)',
      textDecoration: 'none',
      width: 'fit-content',
      borderBottom: '1px solid currentColor',
      paddingBottom: '2px'
    }
  }, email)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      alignItems: 'flex-start'
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    onMouseEnter: e => e.currentTarget.style.color = 'var(--text-accent)',
    onMouseLeave: e => e.currentTarget.style.color = fg,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-meta)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: fg,
      transition: 'color var(--dur-fast) var(--ease-out)'
    }
  }, l.label, " \u2197")))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto',
      marginTop: 'var(--s-8)',
      paddingTop: '18px',
      borderTop: `1px solid ${invert ? 'rgba(255,255,255,0.16)' : 'var(--border-hairline)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      color: muted
    }
  }, /*#__PURE__*/React.createElement("span", null, meta), /*#__PURE__*/React.createElement("span", null, "Set in Newsreader & IBM Plex Mono")));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SiteNav — the fixed top bar. A wordmark set in serif on the left, mono
 * index links on the right. Hairline bottom rule; background is a paper wash
 * with backdrop blur so content scrolls under it cleanly.
 */
function SiteNav({
  brand = 'Dev Vachhani',
  links = [{
    label: 'Projects',
    href: '#projects'
  }, {
    label: 'Writing',
    href: '#writing'
  }, {
    label: 'About',
    href: '#about'
  }],
  cta,
  // { label, href }
  active,
  // href of current section
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px var(--page-margin)',
      background: 'color-mix(in srgb, var(--bg-canvas) 82%, transparent)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-hairline)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '10px',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--t-md)',
      fontWeight: 'var(--w-medium)',
      letterSpacing: 'var(--track-tight)',
      color: 'var(--text-strong)'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '7px',
      height: '7px',
      background: 'var(--accent)',
      display: 'inline-block',
      transform: 'translateY(-2px)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '28px'
    }
  }, links.map(l => {
    const isActive = active === l.href;
    return /*#__PURE__*/React.createElement("a", {
      key: l.href,
      href: l.href,
      onMouseEnter: e => e.currentTarget.style.color = 'var(--text-strong)',
      onMouseLeave: e => e.currentTarget.style.color = isActive ? 'var(--text-strong)' : 'var(--text-muted)',
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--t-meta)',
        letterSpacing: 'var(--track-wide)',
        textTransform: 'uppercase',
        textDecoration: 'none',
        color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast) var(--ease-out)',
        paddingBottom: '2px',
        borderBottom: isActive ? '1px solid var(--accent)' : '1px solid transparent'
      }
    }, l.label);
  }), cta && /*#__PURE__*/React.createElement("a", {
    href: cta.href,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-meta)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: 'var(--text-invert)',
      background: 'var(--ink-0)',
      padding: '9px 15px',
      borderRadius: 'var(--r-1)'
    }
  }, cta.label)));
}
Object.assign(__ds_scope, { SiteNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Article.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Article — the long-read. Reading-progress bar, mono dateline, drop cap,
   pull quote, a bordered figure, and end matter. Measure-constrained prose. */

const DSa = window.DevVachhaniDesignSystem_a1e1ac;
function ArticleScreen() {
  const {
    Tag,
    TextLink,
    ArticleCard
  } = DSa;
  const progress = window.useReadingProgress();
  const body = window.useScrollReveal([]);
  const figRef = window.useParallax(28);
  const M = 'var(--page-margin)';
  const READ = 'var(--measure-read)';
  const P = ({
    children,
    first
  }) => /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--t-md)',
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-body)',
      margin: '0 0 26px'
    }
  }, first && /*#__PURE__*/React.createElement("span", {
    style: {
      float: 'left',
      fontFamily: 'var(--font-serif)',
      fontWeight: 'var(--w-light)',
      fontSize: '78px',
      lineHeight: 0.82,
      paddingRight: 14,
      paddingTop: 8,
      color: 'var(--text-strong)'
    }
  }, children[0]), first ? children.slice(1) : children);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: 'transparent',
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: progress,
    style: {
      height: '100%',
      background: 'var(--accent)',
      transformOrigin: '0 50%',
      transform: 'scaleX(0)'
    }
  })), /*#__PURE__*/React.createElement("article", {
    style: {
      maxWidth: READ,
      margin: '0 auto',
      padding: `clamp(48px,8vh,96px) ${M} 0`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow",
    style: {
      display: 'flex',
      gap: 16,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-accent)'
    }
  }, "Essay"), /*#__PURE__*/React.createElement("span", null, "May 2025"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "8 min read")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--t-xxl)',
      fontWeight: 'var(--w-light)',
      lineHeight: 'var(--lh-snug)',
      letterSpacing: 'var(--track-tight)',
      margin: '0 0 24px'
    }
  }, "On measuring the invisible"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--t-lg)',
      fontStyle: 'italic',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-snug)',
      margin: '0 0 32px'
    }
  }, "Notes on inference when the signal never shows itself directly \u2014 and why good instrumentation is mostly good bookkeeping."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      paddingBottom: 24,
      marginBottom: 40,
      borderBottom: '1px solid var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "accent"
  }, "Physics"), /*#__PURE__*/React.createElement(Tag, null, "Instrumentation"), /*#__PURE__*/React.createElement(Tag, null, "Inference")), /*#__PURE__*/React.createElement("div", {
    ref: body
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement(P, {
    first: true
  }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam maecenas ligula massa varius.")), /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement(P, null, "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi."))), /*#__PURE__*/React.createElement("blockquote", {
    "data-reveal": true,
    style: {
      margin: '16px 0 40px',
      paddingLeft: 24,
      borderLeft: '2px solid var(--accent)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--t-xl)',
      fontWeight: 'var(--w-light)',
      fontStyle: 'italic',
      lineHeight: 'var(--lh-snug)',
      letterSpacing: 'var(--track-tight)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "An instrument is just an argument, made physical \u2014 every reading is a claim you have to defend.")), /*#__PURE__*/React.createElement("div", {
    ref: body
  }, /*#__PURE__*/React.createElement(P, null, "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."))), /*#__PURE__*/React.createElement("figure", {
    style: {
      maxWidth: 'var(--measure-wide)',
      margin: '8px auto 48px',
      padding: `0 ${M}`,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-1)',
      background: 'var(--bg-recessed)',
      height: 'clamp(220px,40vh,420px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: figRef,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, "Figure 1 \u2014 placeholder plate")), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-wide)',
      color: 'var(--text-muted)',
      marginTop: 12
    }
  }, "Fig. 1 \u2014 Coincidence-event rate vs. threshold voltage. Drop a real plate here.")), /*#__PURE__*/React.createElement("article", {
    style: {
      maxWidth: READ,
      margin: '0 auto',
      padding: `0 ${M}`
    }
  }, /*#__PURE__*/React.createElement(P, null, "Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(TextLink, {
    variant: "arrow",
    href: "#writing"
  }, "Back to writing"))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto',
      padding: `clamp(56px,9vh,110px) ${M} 0`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-eyebrow",
    style: {
      paddingBottom: 16,
      borderBottom: '1px solid var(--border-strong)',
      marginBottom: 8
    }
  }, "Keep reading"), window.ARTICLES.slice(1, 4).map((a, i) => /*#__PURE__*/React.createElement(ArticleCard, _extends({
    key: i
  }, a, {
    href: "#article"
  })))));
}
window.ArticleScreen = ArticleScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Article.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Home — hero + selected work + recent writing. Composes the DS primitives
   from the bundle; motion via the GSAP helpers. */

const DSh = window.DevVachhaniDesignSystem_a1e1ac;
function HomeScreen() {
  const {
    SectionHeading,
    ProjectCard,
    ArticleCard,
    Button,
    TextLink
  } = DSh;
  const projGrid = window.useScrollReveal([]);
  const writeList = window.useScrollReveal([]);
  const heroRef = React.useRef(null);
  React.useEffect(() => {
    if (!window.gsap) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = window.gsap.context(() => {
      const tl = window.gsap.timeline({
        defaults: {
          ease: 'expo.out'
        }
      });
      tl.from('[data-hero-line] > span', {
        yPercent: 120,
        duration: 1.1,
        stagger: 0.09
      }).from('[data-hero-meta]', {
        opacity: 0,
        y: 16,
        duration: 0.7
      }, '-=0.5').from('[data-hero-cta]', {
        opacity: 0,
        y: 16,
        duration: 0.6
      }, '-=0.4');
    }, heroRef);
    return () => ctx.revert();
  }, []);
  const M = 'var(--page-margin)';
  const projects = window.PROJECTS.slice(0, 4);
  const articles = window.ARTICLES.slice(0, 3);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    ref: heroRef,
    style: {
      padding: `clamp(72px,14vh,180px) ${M} clamp(48px,9vh,110px)`,
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-hero-meta": true,
    className: "ds-eyebrow",
    style: {
      display: 'flex',
      gap: 18,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-accent)'
    }
  }, "Portfolio \u2014 2026"), /*#__PURE__*/React.createElement("span", null, "STEM \xB7 Physics \xB7 Software")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--t-mega)',
      fontWeight: 'var(--w-light)',
      lineHeight: 'var(--lh-tight)',
      letterSpacing: 'var(--track-mega)',
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-hero-line": true,
    style: {
      display: 'block',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block'
    }
  }, "Measuring the")), /*#__PURE__*/React.createElement("span", {
    "data-hero-line": true,
    style: {
      display: 'block',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block'
    }
  }, "invisible, ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--text-accent)'
    }
  }, "one"))), /*#__PURE__*/React.createElement("span", {
    "data-hero-line": true,
    style: {
      display: 'block',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block'
    }
  }, "experiment at a time."))), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '46ch',
      marginTop: 30,
      fontSize: 'var(--t-md)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-normal)'
    }
  }, "I\u2019m Dev \u2014 a student building instruments, simulations, and small machines to understand how the physical world actually works. This is a catalogue of that work."), /*#__PURE__*/React.createElement("div", {
    "data-hero-cta": true,
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 36,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    href: "#projects",
    iconRight: "\u2192"
  }, "Browse projects"), /*#__PURE__*/React.createElement(TextLink, {
    variant: "arrow",
    href: "#writing"
  }, "Read the writing"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `0 ${M}`,
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "01",
    eyebrow: "Selected work",
    title: "Projects & experiments"
  }), /*#__PURE__*/React.createElement("div", {
    ref: projGrid,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 16,
      marginTop: 32
    }
  }, projects.map(p => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: p.index
  }, /*#__PURE__*/React.createElement(ProjectCard, _extends({}, p, {
    href: "#article"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(TextLink, {
    variant: "arrow",
    href: "#projects"
  }, "All projects \u2014 index of 24"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `clamp(64px,10vh,120px) ${M} 0`,
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "02",
    eyebrow: "Recent writing",
    title: "Notes, essays & field notes"
  }), /*#__PURE__*/React.createElement("div", {
    ref: writeList,
    style: {
      marginTop: 20
    }
  }, articles.map((a, i) => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: i
  }, /*#__PURE__*/React.createElement(ArticleCard, _extends({}, a, {
    href: "#article"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(TextLink, {
    variant: "arrow",
    href: "#writing"
  }, "All writing"))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Projects.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Projects index — filterable archive. Row/grid toggle + discipline filter.
   Composes ProjectCard + SectionHeading + Tag from the bundle. */

const DSp = window.DevVachhaniDesignSystem_a1e1ac;
const {
  useState: useStateP
} = React;
function ProjectsScreen() {
  const {
    SectionHeading,
    ProjectCard,
    Tag
  } = DSp;
  const all = window.PROJECTS;
  const disciplines = ['All', ...Array.from(new Set(all.flatMap(p => p.tags)))].slice(0, 7);
  const [filter, setFilter] = useStateP('All');
  const [layout, setLayout] = useStateP('row');
  const list = filter === 'All' ? all : all.filter(p => p.tags.includes(filter));
  const grid = window.useScrollReveal([filter, layout]);
  const M = 'var(--page-margin)';
  const chip = (label, active, onClick) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--t-micro)',
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      cursor: 'pointer',
      padding: '7px 12px',
      borderRadius: 'var(--r-1)',
      border: '1px solid ' + (active ? 'var(--border-strong)' : 'var(--border-hairline)'),
      background: active ? 'var(--ink-0)' : 'transparent',
      color: active ? 'var(--text-invert)' : 'var(--text-muted)',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, label);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      padding: `clamp(56px,9vh,110px) ${M} 0`,
      maxWidth: 'var(--measure-wide)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "24 entries",
    eyebrow: "The archive",
    title: "Projects & experiments"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      alignItems: 'center',
      margin: '28px 0 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, disciplines.map(d => chip(d, filter === d, () => setFilter(d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, chip('Rows', layout === 'row', () => setLayout('row')), chip('Grid', layout === 'grid', () => setLayout('grid')))), /*#__PURE__*/React.createElement("div", {
    ref: grid,
    style: {
      marginTop: 20,
      paddingBottom: 24,
      display: 'grid',
      gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit,minmax(300px,1fr))' : '1fr',
      gap: layout === 'grid' ? 16 : 12
    }
  }, list.map(p => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: p.index
  }, /*#__PURE__*/React.createElement(ProjectCard, _extends({}, p, {
    layout: layout,
    href: "#article"
  }))))));
}
window.ProjectsScreen = ProjectsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Projects.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Writing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Writing index — a ruled bibliographic list of every article. */

const DSw = window.DevVachhaniDesignSystem_a1e1ac;
function WritingScreen() {
  const {
    SectionHeading,
    ArticleCard
  } = DSw;
  const list = window.ARTICLES;
  const ref = window.useScrollReveal([]);
  const M = 'var(--page-margin)';
  return /*#__PURE__*/React.createElement("main", {
    style: {
      padding: `clamp(56px,9vh,110px) ${M} 0`,
      maxWidth: '860px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Writing \u2014 index",
    title: "Essays, notebooks & field notes"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '52ch',
      marginTop: 20,
      fontSize: 'var(--t-md)',
      color: 'var(--text-secondary)',
      lineHeight: 'var(--lh-normal)'
    }
  }, "Thinking out loud about physics, computation, and the odd machine. Roughly monthly, always in progress."), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      marginTop: 40,
      paddingBottom: 24
    }
  }, list.map((a, i) => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    key: i
  }, /*#__PURE__*/React.createElement(ArticleCard, _extends({}, a, {
    href: "#article"
  }))))));
}
window.WritingScreen = WritingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Writing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/data.jsx
try { (() => {
/* Placeholder content for the portfolio kit. Lorem-ish but realistic in
   shape — swap for real projects/articles in production. */

const PROJECTS = [{
  index: '01',
  year: '2025',
  title: 'Muon flux detector',
  summary: 'A tabletop cosmic-ray telescope built from scintillator paddles and silicon photomultipliers, logging coincidence events to a Raspberry Pi.',
  tags: ['Particle physics', 'Hardware', 'Python']
}, {
  index: '02',
  year: '2025',
  title: 'Protein-fold visualiser',
  summary: 'A WebGL viewer for predicted structures with per-residue confidence colouring and side-by-side alignment.',
  tags: ['Computational bio', 'WebGL', 'TypeScript']
}, {
  index: '03',
  year: '2024',
  title: 'Kalman flight computer',
  summary: 'Sensor-fusion firmware for a model rocket — fusing barometer and IMU into a smoothed altitude estimate at 200 Hz.',
  tags: ['Embedded', 'Control theory', 'C++']
}, {
  index: '04',
  year: '2024',
  title: 'Cellular automata garden',
  summary: 'An interactive study of reaction-diffusion systems rendered on the GPU, exploring Turing patterns in real time.',
  tags: ['Simulation', 'GLSL', 'Maths']
}, {
  index: '05',
  year: '2023',
  title: 'Spectral pitch analyser',
  summary: 'A browser tool that decomposes live audio into its harmonic series and overlays the just-intonation lattice.',
  tags: ['DSP', 'Audio', 'Web Audio']
}, {
  index: '06',
  year: '2023',
  title: 'Orbit sandbox',
  summary: 'An n-body gravity playground with symplectic integration, letting you sketch stable and chaotic systems by hand.',
  tags: ['Physics', 'Canvas', 'Numerics']
}];
const ARTICLES = [{
  category: 'Essay',
  date: 'May 2025',
  readTime: '8 min',
  title: 'On measuring the invisible',
  dek: 'Notes on inference when the signal never shows itself directly — and why good instrumentation is mostly good bookkeeping.'
}, {
  category: 'Notebook',
  date: 'Mar 2025',
  readTime: '5 min',
  title: 'A weekend with Kalman filters',
  dek: 'Smoothing noisy sensor data on a budget microcontroller, and the moment the estimate finally stopped jittering.'
}, {
  category: 'Essay',
  date: 'Jan 2025',
  readTime: '11 min',
  title: 'The shape of a proof',
  dek: 'Why some mathematical arguments feel inevitable and others feel assembled — a wander through elegance and taste.'
}, {
  category: 'Field notes',
  date: 'Nov 2024',
  readTime: '6 min',
  title: 'Building a detector in a bedroom',
  dek: 'What it actually takes to catch a cosmic ray at home, from scavenged parts to the first coincidence event.'
}, {
  category: 'Notebook',
  date: 'Sep 2024',
  readTime: '4 min',
  title: 'Colour, computed',
  dek: 'A short tour of perceptual colour spaces and why the monitor lies to you about grey.'
}];
Object.assign(window, {
  PROJECTS,
  ARTICLES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/gsap-helpers.jsx
try { (() => {
/* GSAP scroll helpers for the DevVachhani portfolio kit.
   Exposes hooks that drive the same fade+rise / parallax / pinned motion the
   Reveal primitive documents. Requires gsap + ScrollTrigger on window. */

const {
  useEffect,
  useRef
} = React;
function ensureST() {
  if (window.gsap && window.ScrollTrigger && !window.__stReg) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.__stReg = true;
  }
}

/* Fade + rise a set of children on scroll-in (staggered). Pass a ref to the
   container; direct children with [data-reveal] animate. */
function useScrollReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    ensureST();
    const root = ref.current;
    if (!root || !window.gsap) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = root.querySelectorAll('[data-reveal]');
    if (reduce) {
      items.forEach(i => i.style.opacity = 1);
      return;
    }
    const ctx = window.gsap.context(() => {
      items.forEach(el => {
        window.gsap.fromTo(el, {
          opacity: 0,
          y: 26
        }, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          }
        });
      });
    }, root);
    return () => ctx.revert();
  }, deps);
  return ref;
}

/* Parallax: element drifts as it scrolls through the viewport. */
function useParallax(strength = 60) {
  const ref = useRef(null);
  useEffect(() => {
    ensureST();
    const el = ref.current;
    if (!el || !window.gsap) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = window.gsap.context(() => {
      window.gsap.fromTo(el, {
        y: -strength
      }, {
        y: strength,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
    return () => ctx.revert();
  }, [strength]);
  return ref;
}

/* Top reading-progress bar bound to whole-page scroll. */
function useReadingProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return ref;
}
Object.assign(window, {
  useScrollReveal,
  useParallax,
  useReadingProgress
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/gsap-helpers.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ArticleCard = __ds_scope.ArticleCard;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Reveal = __ds_scope.Reveal;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteNav = __ds_scope.SiteNav;

})();
