import { terser } from 'rollup-plugin-terser';
import multi from '@rollup/plugin-multi-entry';
import postcss from 'rollup-plugin-postcss'

export default {
  input: './components/**/*.js',
  plugins: [
    multi(),
    postcss({ inject: false }),
    terser(),
  ],
  output: {
    file: './public/components.js'
  }
}