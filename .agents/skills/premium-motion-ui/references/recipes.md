# Page-section recipes

## Hero

```tsx
<Spotlight className="min-h-[90vh] flex items-center">
  <div className="container mx-auto px-6 text-center">
    <TextReveal as="h1" className="text-5xl md:text-7xl font-bold tracking-tight">
      Your headline here
    </TextReveal>
    <FadeIn delay={0.3}>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
        Supporting copy that explains the value in one breath.
      </p>
    </FadeIn>
    <FadeIn delay={0.5}>
      <div className="mt-10 flex gap-4 justify-center">
        <Magnetic><ShimmerButton>Get started</ShimmerButton></Magnetic>
        <Magnetic><Button variant="outline">Learn more</Button></Magnetic>
      </div>
    </FadeIn>
  </div>
</Spotlight>
```

## Feature grid

```tsx
<StaggerContainer className="grid md:grid-cols-3 gap-6">
  {features.map((f) => (
    <StaggerItem key={f.title}>
      <div className="relative rounded-2xl border bg-card p-6 overflow-hidden">
        <BorderBeam />
        <f.icon className="w-8 h-8 text-primary" />
        <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
        <p className="mt-2 text-muted-foreground">{f.desc}</p>
      </div>
    </StaggerItem>
  ))}
</StaggerContainer>
```

## Stats

```tsx
<StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {stats.map((s) => (
    <StaggerItem key={s.label} className="text-center">
      <div className="text-5xl font-bold text-primary">
        <NumberTicker value={s.value} />{s.suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
    </StaggerItem>
  ))}
</StaggerContainer>
```

## Logo strip

```tsx
<Marquee className="py-8 opacity-70">
  {logos.map((l) => <img key={l.name} src={l.src} alt={l.name} className="h-8 mx-8" />)}
</Marquee>
```

## Scroll-in section

```tsx
<Reveal>
  <section className="py-24">...</section>
</Reveal>
```
