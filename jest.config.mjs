/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // All imported modules in your tests should be mocked automatically
  // 这个开启，意味着mock数据将会自动在当前目录的__mocks__目录下寻找相同的文件
  // 但是这个玩意作用域是这个项目，一旦开启所有的test测试文件都会去 __mocks__
  // 找mock文件，在 __mocks__ 里定义所有 test 的 mock 文件 这有点不太现实
  // 所以还是关掉吧
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/6m/6l3wr4cd4732mg1hc_ydzmxw0000gn/T/jest_dx",

  // 在每次测试前自动清除模拟调用、实例、上下文和结果
  clearMocks: true,

  // 指示在执行测试时是否应该收集覆盖率信息
  // 如果为true，命令不加 --coverage 也会生成覆盖报告
  // 为false，急需要手动添加 --coverage 才会生成。
  collectCoverage: false,

  // 一组全局模式，指示应该收集覆盖信息的一组文件
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}', // 表示覆盖率的会收集的文件
    '!src/**/*.d.ts', // !表示覆盖率的不会收集的文件
  ],

  // Jest输出报告的根目录名字
  coverageDirectory: 'coverage',

  // 用于跳过覆盖率收集的regexp模式字符串数组
  coveragePathIgnorePatterns: ['/node_modules/'],

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",
  maxWorkers: 1,

  // 要从所需模块的位置递归搜索的目录名数组
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // 模块使用的文件扩展名数组
  // 如果引入的文件没有后缀，那么会在线面的数组中挨个去匹配，
  // 直到找到对应真实存在的文件。
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json'],

  // 从正则表达式到模块名或模块名数组的映射，允许在单个模块中剔除资源
  // 比如 index.module.less 文件中有 .title{ color: red}
  // 那么引用他的地方会得到 { style_title3847h4h: { color: red } }
  // 但是我们不需要真是的样式，只要知道这个样式存在就好了
  // identity-obj-proxy（需要安装） 能帮我们修改成 { title: 'title' }
  // 这就简单多了。
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    '@/(.*)': '<rootDir>/src/$1', // 这个是匹配 tsconfig 和 webpack 一样的路径缩写
  },

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  // preset: undefined,

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // 每次测试前自动重置模拟状态
  resetMocks: true,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // Jest用来搜索其中文件的目录路径列表
  roots: ['<rootDir>/src'],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // 模块的路径，这些模块运行一些代码，以便在每次测试之前配置或设置测试环境
  // 就是当我们测试之前，需要额外准备什么
  setupFiles: [
    '<rootDir>/src/tests/jest.polyfills.js',
    // 这是一个垫片，它会去补偿 jsdom 不支持的 react 部分，解决兼容的一些问题
    // 使用前必须安装 pnpm i react-app-polyfill -D
    'react-app-polyfill/jsdom',
    // antd-mobile 老是报错，最后在这里找到了答案
    // https://github.com/ant-design/ant-design-mobile/pull/5208/files
    '<rootDir>/src/tests/antd-mobile-error.ts',
  ],

  // 模块的路径列表，这些模块运行一些代码，以便在每次测试之前配置或设置测试框架
  // 这一部分就是我们的自定义执行的脚本文件，目前还没用上
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  // testEnvironment: 'jsdom',
  // https://testing-library.com/docs/react-testing-library/setup/#jest-27
  testEnvironment: 'jest-environment-jsdom',

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // 什么样的文件会被 jest 执行测试
  // window中，testMatch 不支持 <rootDir>/ 这个写法，匹配不出来
  // testMatch: [
  //   '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
  //   '<rootDir>/src/**/?(*.)+(spec|test).[tj]s?(x)',
  // ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // 从正则表达式到路径再到转换器的映射
  transform: {
    /**
     * babel.config.js 是 Babel 的配置文件，它告诉 Babel 如何转换你的代码。
     * 当你使用 babel-jest 时，Jest 会查找一个名为 babel.config.js 的文件来了解如何处理文件。
     * 简单来说，babel-jest 和 babel.config.js 相互配合，使得 Jest 能够正确处理并理解你的 JavaScript 代码。
     * PS: 这一段感觉不写也会默认使用 babel-jest
     */
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    // 当test测试文件中引入css时，会执行 cssTransform.js 的 process，返回的是一个空对象
    // 这样做的目的就是不想让css参与测试，应该是避免错误引入的兜底策略。
    '^.+\\.(css|less|sass|scss)$': '<rootDir>/config/jest/cssTransform.mjs',
    // 把一些文件，比如png等，直接返回一个名字，不需要真是的文件内容
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.mjs',
  },

  // 与所有源文件路径匹配的 regexp 模式字符串数组，匹配的文件将跳过转换
  // 就是不会走 transform 的匹配逻辑
  transformIgnorePatterns: [
    //'[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    // '/node_modules/',
    // '/node_modules/(?!(@bundled-es-modules))',
    //'[/\\\\]node_modules[/\\\\].+[^esm]\\.(js|jsx|mjs|cjs|ts|tsx)$',
    'node_modules/.pnpm/(?!(@bundled-es-modules|axios)).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss|less)$',
    // '\\.pnp\\.[^\\/]+$',
  ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
  // 使用 watch 命令式多添加几个命令，没啥用，先注释了
  // watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

export default config;
