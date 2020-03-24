import { terser } from 'rollup-plugin-terser';
import multi from '@rollup/plugin-multi-entry';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


export default {
  input: './components/**/*.js',
  plugins: [
    multi(),
    resolve({ browser:true, preferBuiltins: true }),
    commonjs(),
    postcss({ inject: false }),
    terser(),
  ],
  output: {
    file: './public/components.js',
  }
}