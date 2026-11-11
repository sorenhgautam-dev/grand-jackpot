import { describe, expect, it } from 'vitest';
import { emphasis, plain } from './emphasis';

describe('emphasis', () => {
  it('sets marked words in italic', () => {
    expect(emphasis('*Food* and drink')).toBe('<em>Food</em> and drink');
  });

  it('escapes the copy before adding markup', () => {
    expect(emphasis('<b>*A & B*</b>')).toBe('&lt;b&gt;<em>A &amp; B</em>&lt;/b&gt;');
  });

  it('leaves unmarked copy alone', () => {
    expect(emphasis('आने से पहले')).toBe('आने से पहले');
  });

  it('strips the marks for plain text', () => {
    expect(plain('*Before* you go')).toBe('Before you go');
  });
});
