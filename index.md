---
layout: default
title: Ticinon Suomi-Koulu
---

# Ticinon Suomi-Koulu

## Viimeaikaiset postaukset

<ul>
  {% for post in site.posts limit:5 %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a> - {{ post.date | date: "%B %d, %Y" }}
  </li>
  {% endfor %}
</ul>

[Katso kaikki postaukset](/blog/)
