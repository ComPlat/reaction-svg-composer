export default (a: never): never => {
  throw new Error("Didn't expect to get here");
};
