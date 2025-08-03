
## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

Saving this for later:

                        <section class="section with-background bg-variant">
                                <header class="section-header stack gap-2 lg:gap-4">
                                        <h3>Mentions</h3>
                                        <p>
                                                I have been fortunate enough to receive praise for my work in several publications. Take
                                                a look below to learn more.
                                        </p>
                                </header>

                                <div class="gallery">
                                        <Grid variant="small">
                                                {
                                                        ['Medium', 'BuzzFeed', 'The Next Web', 'awwwards.', 'TechCrunch'].map((brand) => (
                                                                <li class="mention-card">
                                                                        <p>{brand}</p>
                                                                </li>
                                                        ))
                                                }
                                        </Grid>
                                </div>
                        </section>