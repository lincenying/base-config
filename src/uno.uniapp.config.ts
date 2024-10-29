import type { Preset, SourceCodeTransformer } from 'unocss'
import type { OpType } from './units'

import process from 'node:process'
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerCompileClass, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetApplet, transformerAttributify } from 'unocss-applet'
import shortcuts from './shortcuts'
import { pxToRemPreset } from './units'

const isApplet = process.env?.UNI_PLATFORM?.startsWith('mp-') ?? false

const presets: Preset[] = []
const transformers: SourceCodeTransformer[] = []

if (isApplet) {
    /**
     * UnoCSS Applet
     * @see https://github.com/unocss-applet/unocss-applet
     */
    presets.push(presetApplet())
    // presets.push(presetRemRpx()) // 如果需要使用 rem 转 rpx 单位，需要启用此插件
    transformers.push(transformerAttributify())
}
else {
    /**
     * 默认预设
     * @see https://unocss.dev/presets/uno
     */
    presets.push(presetUno())
    /**
     * 开启属性模式
     * @see https://unocss.dev/presets/attributify
     * @example <div text="sm white" font="mono light"></div>
     */
    presets.push(presetAttributify())
}

export function uniappConfig(config: OpType = {}) {
    return defineConfig({
        presets: [
            // 由 Iconify 提供支持的纯 CSS 图标解决方案
            presetIcons({
                scale: 1.0,
                warn: true,
            }),
            ...presets,
            ...[pxToRemPreset(config)],
        ],
        /**
         * 自定义快捷语句
         * @see https://github.com/unocss/unocss#shortcuts
         */
        shortcuts,
        transformers: [
            /**
             * 启用 --uno: 功能
             * @see https://unocss.dev/transformers/directives
             * @example .custom-div { --uno: text-center my-0 font-medium; }
             */
            transformerDirectives(),
            /**
             * 启用 () 分组功能
             * @see https://unocss.dev/transformers/variant-group
             * @example <div class="hover:(bg-gray-400 font-medium) font-(light mono)"/>
             */
            transformerVariantGroup(),
            /**
             * 将一组classes编译为一个class
             * @see https://unocss.dev/transformers/compile-class
             * @example <div class=":uno: text-sm font-bold hover:text-red"/>
             */
            transformerCompileClass(),

            ...transformers,
        ],
    })
}
