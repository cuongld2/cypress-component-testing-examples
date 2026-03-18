/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the development server.
 */
import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

export default function (opts: RenderOptions) {
  render(document, <Root />, opts);
}
