> S2 use pnpm as package manager

```bash
git clone git@github.com:antvis/S2.git

cd S2

pnpm install # or pnpm bootstrap

# build all
pnpm build

# debug s2-core
pnpm core:start

# debug s2-react
pnpm react:playground

# debug s2-vue
pnpm vue:playground

# unit test
pnpm test

# check the code style and the type definition
pnpm lint

# start the website
pnpm site:start
```
