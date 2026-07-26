# 0.1.0 (2026-07-26)


### Bug Fixes

* add cache versioning to detect and purge stale mock data from localStorage ([18479bb](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/18479bba2f6503fc83e80d523b600a9913e1488c)), closes [#37](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/37) [#38](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/38)
* add error logging and custom callback handler to OAuth routes ([39d8478](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/39d84786dca1a0ec49eba55dc27d8e0a9eab8c33))
* add logout endpoint and fix admin setup race condition ([d5e27ea](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/d5e27ea53a881ee6d2ad617482f8071da3cfdfc2)), closes [#55](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/55) [#51](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/51)
* add render.yaml to install devDependencies during build ([4a53f8c](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/4a53f8ce77c48b111fcb0b0845bb0a9f1aceba40))
* adjust dynamic lanyard card canvas texture rotation to render right-side up ([8fc9282](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/8fc92826e324096bebe43194664cc9d33f3e8554))
* adjust dynamic lanyard card canvas texture to use flipY=false with no rotation ([0a12e00](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/0a12e009ac31e6d84ad3dea2d341eaeddf8c858b))
* change Analyze Vault button text to black ([f5994c7](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/f5994c75453ecaa2fcb17a66f9cf3e3a5827c24f))
* change lanyard card material to matte paper and upscale texture to 4K to resolve blurriness ([d7e3358](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/d7e33588145731bd1304b41cd7a39f5553977c2f))
* clean up package.json dependencies ([b21653c](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/b21653cdd5074ffc8efcf88e76ee7d33dd09f2d7)), closes [#69](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/69) [#70](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/70) [#71](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/71) [#72](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/72)
* ensure devDependencies installed before vite build ([8ea0a3e](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/8ea0a3ec6cd29b812c262db771fce04a60f31278))
* implement unified window hashchange listener in App.tsx to enable seamless navigation back from profile/admin views to primary tabs ([259c456](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/259c4565a48a16e437c9d95c8bcdb2855e0124e1))
* make lanyard card text bold and adjust camera zoom to enhance readability ([2089f47](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/2089f4778f1e115b5ffbb10314fd06a2c303ab85))
* make OAuth strategies conditional so server starts without env vars ([33a5dec](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/33a5dec7df8f1b3b76390698039ad35c1cebaeab))
* map all core tabs to window hashes to resolve profile/admin page transition locks ([325eab7](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/325eab7b25ee083c843aff6549616a1ed775f9ef))
* OAuth findOrCreateUser fallback to email match to avoid duplicate key error ([fc9045a](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/fc9045a7647228d950eeb2c5f91db473da2b6a02))
* proxy /api calls to Render backend from Vercel ([dbe0991](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/dbe09916f5530626141cd298276deeaf023eed33)), closes [#9](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/9)
* replace lucide-react brand icons removed in v1 (Chrome→Globe, Github→GitFork) ([4d3b9ab](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/4d3b9aba3f5c060309c97e81ff70ecaa5d5de66f))
* resolve 4 MEDIUM frontend issues ([554855d](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/554855d434b18aa1640f73f689ed9174f6021ec0)), closes [#58](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/58) [#59](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/59) [#60](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/60) [#61](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/61)
* resolve admin panel routes, stale token capture, and auth closure issues ([76c8738](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/76c87389ceb7cf2a4c5531a81a1ca2400c71c27e))
* resolve expired background/pillar image URLs and configure static asset fallbacks ([9056dda](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/9056ddab37eaa6573e612349d83f2ed1a667daa2))
* resolve profile dropdown layout distortion in header ([2c5b178](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/2c5b1780607f7120aee6d8e3405677a5e13dda7d))
* resolve remaining hardcoded expired Google User Content URLs in leaderboard and crate views ([6bb32cf](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/6bb32cf6b4ed909e2a5a69c0983290a2e62435e4))
* resolve upside-down and mirrored dynamic canvas texture rendering on 3D lanyard card ([eaf61bb](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/eaf61bb6a54ee4a56a34e8a04bf58e4aaa49372f))
* restore original local cutouts and paintings under public/assets and update references ([1bfee22](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/1bfee22635d8a2138f07b8053a43e83be9f4f62e))
* switch changelog preset to angular (built-in, no external dep) ([cf10ed5](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/cf10ed5f41922e3273054f853e6880fd286872fc))
* use npm install instead of ci for deployment ([f57a91b](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/f57a91bbda210967454370cb5f63934faab7ffa9))
* wait for auth to finish loading before processing hash routing ([325fb62](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/325fb62d380751914af8fed7d4f47bb45944c33a))


### Features

* add admin console page to control projects, leaderboard, and automaton baselines ([e73953d](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/e73953dd2624e24a3f2256b6ee1ebb418d0dc6bb))
* add GAIS.Content folder ([013ce10](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/013ce10f5174cb22efbb69094036be2d075ef172))
* add Google and GitHub OAuth login for contributors ([0be4507](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/0be4507cec5b2275bf47647e1eb9cf5f15428d11)), closes [#7](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/7)
* add JWT auth system with Express backend, login gate, and profile dropdown ([1fcd1a2](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/1fcd1a2e9ad231b3bfddcd89746770570da0997f))
* add one-time admin setup endpoint + seed script ([d583c86](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/d583c866daa7bd4c4f0aab094e88b5628a0b9832))
* add skeleton loading screens for data-fetching views ([8a485a2](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/8a485a26c213bff77ee4c8277d46ad4cc8c847c9)), closes [#34](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/issues/34)
* admin CMS panel with MongoDB-backed CRUD dashboard ([1bc5f26](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/1bc5f268eed678c28d0a59be2550cf437f4dcc7f))
* complete IEEEsoc'26 fellowship platform — Renaissance editorial design ([7d65164](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/7d65164ce067eba753eafe7093dc82a6d9c0f84e))
* fetch live database rankings from Hugging Face API inside LeaderboardView ([fc3555a](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/fc3555ae78ba07e0dc19e35b6d6758a30b36f21c))
* implement Project Admin Leaderboard tab toggle on Honor Board view ([70b9fbe](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/70b9fbef02ab3b7fd7a946494442726421e8d2d9))
* increase lanyard card canvas resolution to 2K, map dynamic text to front face, and apply premium typography ([77edbb2](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/77edbb21d703c4e567adcab799bb52350794f115))
* integrate 3D interactive physics lanyard card in profile page ([6131557](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/6131557bbc853e677ee14f3affdd51db13ad44e6))
* Next.js cinematic rebuild with Greek aesthetics ([cf719ec](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/cf719ecd920077a5b0f57ee8c6c5bee67a458d15))
* overhaul codebase structure to root-level Vite project ([6b1e67e](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/6b1e67ed2875fbe67d6e7147b7f6ae789f704042))
* relocate contributor search from header to dedicated profile page ([3cc26f6](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/3cc26f64636a9bc3426bbe73736862df4b3100ef))
* render dynamic ID badge on 3D card using canvas texture with official IEEE and GEHU logos ([02de117](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/02de117d0fb69939f65e82b6c5bbb11090936967))
* replace profile dropdown with dedicated profile page and header search popover ([46fff6c](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/46fff6c4f1ccf86c51a2086c9487fb841ccdf3f0))


### Reverts

* restore lanyard card to its original working state ([22b7f54](https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web/commit/22b7f5491810644a6d96d0f68e1a7854dac6c4fa))



