import {wrapInError} from "./errors";

test('wrapInError returns original error when it is an Error', () => {
  const original = new Error()
  expect(wrapInError(original)).toBe(original)
})

test('wrapInError returns original error as Error.message when it is a string', () => {
  const original = 'original error'
  expect(wrapInError(original).message).toBe(original)
})

test('wrapInError returns an error with a default message when original is not an Error or a string', () => {
  const original = {}
  expect(wrapInError(original).message).toBe('Unknown Error')
})

test('wrapInError returns an error with an alternate message when original is not an Error or a string', () => {
  const original = {}
  expect(wrapInError(original, 'Alternate message').message).toBe('Alternate message')
})
