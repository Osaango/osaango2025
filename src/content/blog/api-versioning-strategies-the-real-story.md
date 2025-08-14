---
title: "API versioning strategies - the real story"
publishDate: 2025-08-04 00:00:00
img: ../../assets/blogimg/versioning-the-real-story.png
img_alt: Paper planes in a row, one versioning it self to new directions
description: |
  The real story of API versioning strategies is that choosing one is not a matter of free choice. Your customers, partners, and their development lifecycle are already making these choices for you.
author: Marjukka Niinioja, founding partner at Osaango
tags:
  - APIOps
  - DevOps
  - Product Management
---

If you provide APIs, you've likely heard about API versioning strategies. Your development team might have had many conversations about the best choice, but here's some news: Choosing where to put your API version number is not a strategic decision. It's more of a product management and stakeholder engagement exercise, heavily influenced by factors like the pace of business, change, and tool capabilities.

## The pace of the business and change

Your versioning strategy results from many choices your organization and clients have already made. These range from which customer segments and industries to serve to which products and services to offer.

The relationship between your organization and your API consumers is a significant factor. It affects:

* How often do you change your API?  
* How often are you forced to change it?  
* Can you make any (breaking or not) changes at all?

How your API consumers will respond to your proposed versioning schedule depends on the underlying power structure:

* If your API consumers rely on you, you can dictate when they will change versions.  
* Some API consumers are more powerful and influential, or the relationship is highly regulated.

If you can change the API and want to introduce them as new versions, you'll need to solve the problem of indicating a version change. This is where methods like **APIOps Cycles** can provide a structured approach to understanding the 'why' and 'how' of these changes, moving beyond purely technical considerations.

## Tool capabilities dictate your use of version numbers

API versioning is different from code versioning. It's not okay to increase your API version number every time the code implementing the API or the documentation changes. You are making an API change only when the actual interface or, in some cases, behavior changes. I often confuse people by saying APIs need 2x DevOps. Your API's interface, possibly described by an OpenAPI definition, has one lifecycle. The code implementing the API has its lifecycle.

To some extent, they are not dependent on each other. You can fix a typo in your OpenAPI definition without changing the code or the calculation logic in the code, without changing the interface, for example. Except, of course, if that typo happens to be in the actual interface part of the definition, such as the endpoint or attribute name. This would be the equivalent of changing the total sum of a business contract from 5000€ to 5500€ and calling it a typo fix.

Your code should use semantic versioning, meaning you should constantly update the version number with major, minor, and patch releases (e.g., 1.1.1). Discussions around API versioning often start in new teams or with new APIs, focusing on questions like: 'Should we put the version number in the URI path, query parameters, custom headers, or use content negotiation?' But the reality is, you don't have a free choice about it. And you definitely shouldn't do it just because it's considered 'good coding practice.'

Each time the interface version number changes, your API consumers have to change their code, which they don't like. It costs them time and resources, and their systems might break even if the change doesn't cause problems.

Remember to check what your API consumers' technology and tooling can handle – and even more importantly, what your API management platform supports. Legacy tooling is especially picky and can only handle version numbers in the path. Some API management platforms are built to support API products or plans, where the changes to the API version can be hidden behind the product and subscription layer.

## Integrating the APIOps Cycles method into the versioning conversation

The [APIOps Cycles method](https://www.apiopscycles.com/) provides a valuable framework for managing stakeholders and identifying the need for API changes, including versioning and retirement. It shifts the focus from technical debates to data-supported product-driven decisions.

1. **API Product Strategy Station:** This is where the fundamental decisions about an API's future are made. Using tools like the Customer Journey Canvas, API Value Proposition Canvas, and API Business Model Canvas, you can engage stakeholders to understand whether an API is still necessary, its value is diminishing, or its cost structure is unsustainable. Retirement, for example, is a product decision that ideally belongs here, guided by business needs and user journeys, not just a technical event.  
2. **Measuring & Improving Station:** This station provides the essential evidence to inform the product strategy. Usage metrics (like declining traffic), consumer feedback (surveys, issues), and operational indicators (cost vs. benefit, vulnerabilities) offer quantitative and qualitative rationale for why an API might need changing or retiring. This data is crucial for having objective conversations with stakeholders.  
3. **Release Management Station:** Once the decision to change or retire an API is made based on product strategy and data, the Release Management Station provides the existing processes for execution. This includes version lifecycle policies, backward compatibility plans, sunset communication templates, and planning for redirects or fallbacks. This is where the operational aspects of managing API changes are implemented smoothly for consumers.

By leveraging the APIOps Cycles, you can have **more effective conversations** about API versioning and lifecycle management. Start with the 'why' from the Product Strategy, back it with data from Measuring & Improving, and frame technical decisions as consequences of these strategic insights. The Release Management station then ensures a professional rollout of any changes. This approach elevates API versioning discussions from technical implementation details to strategic product and stakeholder alignment processes.

If you are using version numbers to indicate changes to your API, consider only increasing them if introducing a breaking change—and only if that change breaks any clients from their perspective. I admit it can be challenging to define a "breaking change" universally, as it often depends on the client's specific implementation and reliance on certain aspects of the API. However, focusing on changes that break client functionality from their point of view is a more practical approach to versioning than simply incrementing a number for any internal code or documentation update.