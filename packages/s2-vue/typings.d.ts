/// <reference types="../../env.base.d.ts" />
/// <reference types="vite-svg-loader" />

declare module '*.svg' {
    import { FunctionalComponent, SVGAttributes } from 'vue'
    const src:  FunctionalComponent<SVGAttributes, {}>
    export default src
}
