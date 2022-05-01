const modulesFiles = require.context('./methods', false, /\.js$/)
let functions = {}
modulesFiles.keys().forEach(moduleFunctionPath => {
  // console.log(
  //   functions,
  //   moduleFunctionPath,
  //   modulesFiles(moduleFunctionPath).default
  // );
  // debugger;
  // functions[modulesFiles(moduleFunctionPath).default.name] = modulesFiles(
  //   moduleFunctionPath
  // ).default;
  functions = Object.assign(functions, modulesFiles(moduleFunctionPath).default)
})
// console.log(functions);

// export const { query, identify, setEdge } = methods;

export default functions
