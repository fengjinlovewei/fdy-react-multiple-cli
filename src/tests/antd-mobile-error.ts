/**
 * antd-mobile老是报错，用这个文件处理下
 * // antd-mobile 老是报错，最后在这里找到了答案
    // https://github.com/ant-design/ant-design-mobile/pull/5208/files
 */
const originError = console.error;

// remove px tester warning
function excludeWarning() {
  const errorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((msg, ...rest) => {
      if (
        String(msg).includes(
          'The px tester is not rendering properly. Please make sure you have imported `antd-mobile/es/global`.',
        )
      ) {
        return;
      }
      originError(msg, ...rest);
    });

  return () => {
    errorSpy.mockRestore();
  };
}

excludeWarning();
