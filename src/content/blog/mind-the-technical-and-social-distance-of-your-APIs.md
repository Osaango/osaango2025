---
title: "Mind the Technical and Social Distance of Your APIs"
publishDate: 2025-08-27 00:00:00
img: ../../assets/blogimg/api-distance.png
img_alt: Four quadrants about reducing technical & social distance in API Development
description: |
  When we talk about APIs, the conversation often drifts into protocols, documentation, or security. But beneath all that lies a deeper question: how far is the code from the need it’s supposed to serve?
author: Marjukka Niinioja, founding partner at Osaango
tags:
  - APIOps
  - Governance
  - Product Management
---

The term “distance” is used in mathematical graph theory, where the distance between two vertices in a graph is the number of edges in a shortest path (also called a graph geodesic) connecting them[1](https://en.wikipedia.org/wiki/Distance_%28graph_theory%29). In sociology, social distance describes the distance between individuals or social groups in society, including dimensions such as social class, race/ethnicity, gender or sexuality. Members of different groups mix less than members of the same group[2](https://en.wikipedia.org/wiki/Social_distance). 

With APIs, this “distance” shows up in two forms, which I will call in this case:

* **Technical Distance** – the number of *layers of consumption* between a business problem and its solution. Every API consuming app, agent, or wrapper stacked on top of an API adds more distance.
* **Social Distance (or human distance)** – the number of *human hand-offs and gaps in understanding* between the person who feels the need and the person who writes the code. Every department, manager, architect, and meeting between the API providers and API consumers (as people) increases this distance.

Both are dangerous. Both multiply when left unchecked. And both are shaping the API economy more than most teams realize.

## The Cost of Technical Distance

Technical distance is about **layers**. Imagine a CFO needs invoicing automation:

* Instead of connecting directly to the API, the request flows through SaaS apps, workflow engines, and now AI agents.
* Each new layer makes the system more abstract, fragile, and harder to debug.
* Eventually, no one remembers what the original API did — or why.

The result: brittle chains of integrations that look like innovation but hide inefficiency.

## The Cost of Social Distance

Social distance is about **people**. A business user describes a need, but by the time it passes through product owners, architects, and developers, it’s unrecognizable.

* Business intent gets lost in translation.
* Developers become “order takers” with no empathy for the end-user.
* Trust erodes between groups: “they don’t get what we’re asking for.”

APIs delivered this way might work technically, but they fail socially — they don’t solve the right problem.

## The Compounding Effect

Here’s the real kicker: **technical and social distance amplify each other**.

* More hand-offs between humans → more layers of technical translation get added.
* More technical layering → business and dev teams become further removed from each other.

The end result? APIs that are efficient-looking on paper but ineffective in practice. The Wizard of Oz effect: smoke, mirrors, and hidden gaps behind the curtain.

## Escaping the Distance Trap

The solution isn’t eliminating distance altogether — some abstraction and specialization are necessary. The goal is to **reduce unnecessary distance** and make the rest visible.

Here’s how:

1. **Make Distance Visible**

   * Map both technical layers and human hand-offs.
   * Ask: how many steps are between the business need and the running code?

2. **Use Dual Journeys**

   * Map the *Customer Journey Canvas* alongside the *Developer/System Journey*.
   * This collapses social distance by giving everyone the same picture of what’s being built and why.

3. **Frame API Value Explicitly**

   * Use the *Value Proposition Canvas* to tie API features to real pains and gains.
   * This ensures APIs don’t become technical artifacts divorced from business value.

4. **Embrace APIOps Cycles**

   * Treat distance reduction as a systematic practice.
   * [APIOps Cycles method](https://www.apiopscycles.com/the-method/) provides the metro map, entry/exit criteria, and checkpoints that keep teams aligned at every stage.

5. **Close the Loop**

   * Monitoring and feedback loops keep APIs grounded in real use.
   * In sociology, this is reciprocity; in APIs, it’s adoption metrics and user feedback.

## From Toxic Zones to Ideal Zones

If we combine the two forms of distance, we get four quadrants:

* **Toxic Zone**: many layers + many hand-offs → brittle, mistrusted APIs.
* **Waste Zone**: collaboration exists but technical layering makes everything inefficient.
* **Rejection Risk**: technically efficient but socially misunderstood, leading to rejection.
* **Ideal Zone**: low distance on both sides → APIs that are aligned, trusted, and adopted.

Visualizing this helps teams see where they are and where they need to go. And the path out of the toxic, waste, or rejection zones is clear: **APIOps Cycles.**

## Final Thought

APIs are more than technical contracts — they’re reflections of organizational philosophy. If your culture tolerates layers of indirection and endless hand-offs, your APIs will too.

But if you design to reduce both technical and social distance, you don’t just build better APIs. You build **trust, alignment, and resilience**. And that’s what will determine which APIs — and which organizations — thrive in the years ahead.