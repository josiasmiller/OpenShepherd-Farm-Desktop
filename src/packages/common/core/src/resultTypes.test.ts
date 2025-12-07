import {dataOrNull, dataOrThrow, Failure, handleResult, Result, Success} from "./resultTypes";

test('dataOrNull returns success data when result is success', () => {
  let result: Result<string, string> = new Success("42");
  expect(dataOrNull(result)).toEqual("42");
})

test('dataOrNull returns null when result is failure', () => {
  let result: Result<string, string> = new Failure("13");
  expect(dataOrNull(result)).toBeNull();
})

test('dataOrThrow returns data when result is success', () => {
  let result: Result<string, string> = new Success("42");
  expect(dataOrThrow(result)).toEqual("42");
})

test('dataOrThrow throws error when result is failure', () => {
  let result: Result<string, string> = new Failure("13");
  expect(() => dataOrThrow(result)).toThrow(new Error(""));
})

test('dataOrThrow throws error with custom message when result is failure', () => {
  let result: Result<string, string> = new Failure("13");
  expect(() => dataOrThrow(result, (error) => `I am error ${error}`))
    .toThrow(new Error("I am error 13"));
})

test('handleResult maps success value on success', async () => {
  const result: Result<string, string> = new Success("value_success")
  const mappedResult = await handleResult(result, {
    success: (data) => { return `mapped_on_success:${data}` },
    error: (error) => { return `mapped_on_error:${error}` }
  })
  expect(mappedResult).toEqual('mapped_on_success:value_success')
})

test('handleResult maps error value on failure', async () => {
  const result: Result<string, string> = new Failure("value_failure")
  const mappedResult = await handleResult(result, {
    success: (data) => { return `mapped_on_success:${data}` },
    error: (error) => { return `mapped_on_error:${error}` }
  })
  expect(mappedResult).toEqual('mapped_on_error:value_failure')
})

test('handleResult maps success promised value on success', async () => {
  const result: Result<string, string> = new Success("value_success")
  const mappedResult = await handleResult(result, {
    success: (data) => { return Promise.resolve(`mapped_on_success:${data}`) },
    error: (error) => { return Promise.resolve(`mapped_on_error:${error}`) }
  })
  expect(mappedResult).toEqual('mapped_on_success:value_success')
})

test('handleResult maps error promised value on failure', async () => {
  const result: Result<string, string> = new Failure("value_failure")
  const mappedResult = await handleResult(result, {
    success: (data) => { return Promise.resolve(`mapped_on_success:${data}`) },
    error: (error) => { return Promise.resolve(`mapped_on_error:${error}`) }
  })
  expect(mappedResult).toEqual('mapped_on_error:value_failure')
})
